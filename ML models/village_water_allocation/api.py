"""
Village-Level Water Allocation Optimization API.
Distributes limited reservoir water across farms using crop water requirement (Model 1),
optional soil moisture (Model 2), and priority-weighted proportional allocation.
"""
import json
import logging
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

CONFIG_PATH = Path(__file__).resolve().parent / "config.json"
# 1 mm over 1 ha = 10,000 L
LITERS_PER_MM_HA = 10_000
HECTARES_PER_ACRE = 0.4047

config: dict[str, str] = {}


def load_config() -> None:
    global config
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH) as f:
            config = json.load(f)
    else:
        config = {
            "crop_water_api_url": "http://localhost:8001",
            "soil_moisture_api_url": "http://localhost:8002",
        }


def priority_weight(score: float) -> float:
    """Map priority_score to weight: 1 -> 1, 2 -> 1.2, 3 -> 1.5."""
    if score <= 1:
        return 1.0
    if score <= 2:
        return 1.2
    return 1.5


async def fetch_crop_water_mm_per_day(
    base_url: str,
    crop_type: str,
    soil_type: str,
    region: str,
    temperature: str,
    weather_condition: str,
) -> float:
    """Call Crop Water API (Model 1) to get water requirement in mm/day."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.post(
            f"{base_url.rstrip('/')}/predict",
            json={
                "crop_type": crop_type,
                "soil_type": soil_type,
                "region": region,
                "temperature": temperature,
                "weather_condition": weather_condition,
            },
        )
        r.raise_for_status()
        data = r.json()
        return float(data["water_requirement"])


class FarmInput(BaseModel):
    farm_id: str = Field(..., description="Unique farm identifier")
    area_ha: float | None = Field(None, description="Area in hectares")
    area_acre: float | None = Field(None, description="Area in acres (used if area_ha not set)")
    crop_type: str = Field(..., description="Crop type e.g. MAIZE, RICE")
    soil_type: str = Field(..., description="DRY, WET, HUMID")
    region: str = Field(..., description="DESERT, SEMI ARID, SEMI HUMID, HUMID")
    temperature: str = Field(..., description="e.g. 20-30")
    weather_condition: str = Field(..., description="NORMAL, SUNNY, WINDY, RAINY")
    priority_score: float = Field(1.0, ge=1, le=3, description="1=low, 2=medium, 3=high")
    crop_water_requirement_mm_per_day: float | None = Field(
        None, description="If set, skip calling Crop Water API"
    )
    predicted_soil_moisture_pct: float | None = Field(
        None, description="Soil moisture % from Model 2 or default 30"
    )


class OptimizeRequest(BaseModel):
    total_available_water_liters: float = Field(..., gt=0)
    farms: list[FarmInput] = Field(..., min_length=1)


class AllocationItem(BaseModel):
    farm_id: str
    allocated_liters: float
    share_percent: float


class PerFarmReportItem(BaseModel):
    farm_id: str
    allocated_liters: float
    demand_liters: float
    deficit_liters: float
    excess_liters: float
    status: str


class OptimizeResponse(BaseModel):
    allocations: list[AllocationItem]
    per_farm_report: list[PerFarmReportItem]
    village_efficiency_score: float
    total_demand_liters: float
    total_allocated_liters: float


def _area_ha(farm: FarmInput) -> float:
    if farm.area_ha is not None and farm.area_ha > 0:
        return farm.area_ha
    if farm.area_acre is not None and farm.area_acre > 0:
        return farm.area_acre * HECTARES_PER_ACRE
    raise ValueError(f"Farm {farm.farm_id}: provide area_ha or area_acre")


def _demand_liters(area_ha: float, mm_per_day: float, soil_moisture_pct: float | None) -> float:
    """Demand in L/day. 1 mm over 1 ha = 10,000 L."""
    demand = area_ha * LITERS_PER_MM_HA * mm_per_day
    if soil_moisture_pct is not None:
        # Wetter soil -> lower effective demand (scale by 1 - moisture/100, min 0.1)
        factor = max(0.1, 1.0 - soil_moisture_pct / 100.0)
        demand *= factor
    return demand


app = FastAPI(
    title="Village Water Allocation API",
    description="Optimize distribution of limited village reservoir water across farms.",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    load_config()


@app.get("/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "service": "village_water_allocation"}


@app.post("/optimize", response_model=OptimizeResponse)
async def optimize(req: OptimizeRequest) -> OptimizeResponse:
    """Compute fair water allocation per farm and village efficiency score."""
    crop_water_url = config.get("crop_water_api_url", "http://localhost:8001")
    total_available = req.total_available_water_liters
    farms = req.farms

    demands: list[tuple[str, float, float]] = []  # (farm_id, demand_liters, priority_weight)

    for farm in farms:
        area_ha = _area_ha(farm)
        mm_per_day = farm.crop_water_requirement_mm_per_day
        if mm_per_day is None:
            try:
                mm_per_day = await fetch_crop_water_mm_per_day(
                    crop_water_url,
                    farm.crop_type,
                    farm.soil_type,
                    farm.region,
                    farm.temperature,
                    farm.weather_condition,
                )
            except Exception as e:
                logger.exception("Crop Water API call failed for farm %s", farm.farm_id)
                raise HTTPException(
                    status_code=502,
                    detail=f"Crop Water API failed for farm {farm.farm_id}: {e!s}",
                ) from e
        moisture = farm.predicted_soil_moisture_pct if farm.predicted_soil_moisture_pct is not None else 30.0
        demand_liters = _demand_liters(area_ha, mm_per_day, moisture)
        weight = priority_weight(farm.priority_score)
        demands.append((farm.farm_id, demand_liters, weight))

    total_demand = sum(d for _, d, _ in demands)
    needs = [(fid, d * w, d) for fid, d, w in demands]
    sum_needs = sum(n[1] for n in needs)
    if sum_needs <= 0:
        raise HTTPException(status_code=422, detail="Total need is zero")

    to_allocate = min(total_available, total_demand)
    allocations_raw: list[tuple[str, float, float]] = []  # (farm_id, alloc, demand)
    for farm_id, need, demand in needs:
        alloc = (need / sum_needs) * to_allocate
        alloc = min(alloc, demand)
        allocations_raw.append((farm_id, alloc, demand))

    total_allocated = sum(a[1] for a in allocations_raw)
    # Efficiency: fraction of available water that was allocated (usage of reservoir)
    village_efficiency_score = (total_allocated / total_available * 100) if total_available > 0 else 0.0

    allocations_out = [
        AllocationItem(
            farm_id=farm_id,
            allocated_liters=round(alloc, 2),
            share_percent=round((alloc / total_allocated * 100) if total_allocated > 0 else 0, 2),
        )
        for farm_id, alloc, _ in allocations_raw
    ]
    per_farm_report = [
        PerFarmReportItem(
            farm_id=farm_id,
            allocated_liters=round(alloc, 2),
            demand_liters=round(demand, 2),
            deficit_liters=round(max(0, demand - alloc), 2),
            excess_liters=round(max(0, alloc - demand), 2),
            status="deficit" if alloc < demand else "met",
        )
        for farm_id, alloc, demand in allocations_raw
    ]

    return OptimizeResponse(
        allocations=allocations_out,
        per_farm_report=per_farm_report,
        village_efficiency_score=round(village_efficiency_score, 2),
        total_demand_liters=round(total_demand, 2),
        total_allocated_liters=round(total_allocated, 2),
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
