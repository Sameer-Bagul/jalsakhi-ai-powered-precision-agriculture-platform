"""
ML model API clients and LangChain tools for Jalsakhi Chatbot.
Calls Crop Water (8001), Soil Moisture (8002), and Village Water Allocation (8003) APIs.
"""
import json
import os
from typing import Any

import httpx
from langchain_core.tools import StructuredTool
from pydantic import BaseModel, Field

TIMEOUT = 10.0


def _crop_water_url() -> str:
    return os.getenv("CROP_WATER_API_URL", "http://localhost:8001").rstrip("/")


def _soil_moisture_url() -> str:
    return os.getenv("SOIL_MOISTURE_API_URL", "http://localhost:8002").rstrip("/")


def _village_water_url() -> str:
    return os.getenv("VILLAGE_WATER_API_URL", "http://localhost:8003").rstrip("/")


# --- API client functions (return dict or error string) ---


def predict_crop_water(
    crop_type: str,
    soil_type: str,
    region: str,
    temperature: str,
    weather_condition: str,
) -> str:
    """Call Crop Water API; returns JSON-like result or error message."""
    try:
        r = httpx.post(
            f"{_crop_water_url()}/predict",
            json={
                "crop_type": crop_type.strip(),
                "soil_type": soil_type.strip(),
                "region": region.strip(),
                "temperature": temperature.strip(),
                "weather_condition": weather_condition.strip(),
            },
            timeout=TIMEOUT,
        )
        r.raise_for_status()
        data = r.json()
        return json.dumps({
            "water_requirement_mm_per_day": data.get("water_requirement"),
            "water_requirement_litre_per_acre": data.get("water_requirement_litre_per_acre"),
            "unit": data.get("unit", "mm/day"),
        })
    except httpx.HTTPStatusError as e:
        try:
            detail = e.response.json().get("detail", str(e.response.text))
        except Exception:
            detail = e.response.text or str(e)
        return json.dumps({"error": f"Crop Water API error ({e.response.status_code}): {detail}"})
    except (httpx.ConnectError, httpx.TimeoutException) as e:
        return json.dumps({"error": f"Crop Water service unavailable: {e!s}"})
    except Exception as e:
        return json.dumps({"error": f"Crop Water request failed: {e!s}"})


def predict_soil_moisture_sensor(
    avg_pm1: float,
    avg_pm2: float,
    avg_pm3: float,
    avg_am: float,
    avg_lum: float,
    avg_temp: float,
    avg_humd: float,
    avg_pres: float,
    avg_sm_lag1: float | None = None,
    avg_sm_lag2: float | None = None,
) -> str:
    """Call Soil Moisture API (sensor mode); returns predictions for days 3-7 or error."""
    payload: dict[str, Any] = {
        "avg_pm1": avg_pm1,
        "avg_pm2": avg_pm2,
        "avg_pm3": avg_pm3,
        "avg_am": avg_am,
        "avg_lum": avg_lum,
        "avg_temp": avg_temp,
        "avg_humd": avg_humd,
        "avg_pres": avg_pres,
    }
    if avg_sm_lag1 is not None:
        payload["avg_sm_lag1"] = avg_sm_lag1
    if avg_sm_lag2 is not None:
        payload["avg_sm_lag2"] = avg_sm_lag2
    try:
        r = httpx.post(
            f"{_soil_moisture_url()}/predict/sensor",
            json=payload,
            timeout=TIMEOUT,
        )
        r.raise_for_status()
        data = r.json()
        return json.dumps({
            "predictions": data.get("predictions", []),
            "days_ahead": data.get("days_ahead", [3, 4, 5, 6, 7]),
            "unit": "soil moisture %",
        })
    except httpx.HTTPStatusError as e:
        try:
            detail = e.response.json().get("detail", str(e.response.text))
        except Exception:
            detail = e.response.text or str(e)
        return json.dumps({"error": f"Soil Moisture API error ({e.response.status_code}): {detail}"})
    except (httpx.ConnectError, httpx.TimeoutException) as e:
        return json.dumps({"error": f"Soil Moisture service unavailable: {e!s}"})
    except Exception as e:
        return json.dumps({"error": f"Soil Moisture request failed: {e!s}"})


def predict_soil_moisture_location(
    state: str,
    district: str,
    sm_history: str,
    month: int = 1,
) -> str:
    """Call Soil Moisture API (location mode). sm_history must be 7 numbers (JSON array or comma-separated)."""
    try:
        if isinstance(sm_history, str) and sm_history.strip().startswith("["):
            hist = json.loads(sm_history)
        else:
            hist = [float(x.strip()) for x in sm_history.replace(",", " ").split() if x.strip()]
        if len(hist) != 7:
            return json.dumps({"error": "sm_history must have exactly 7 values (most recent last)."})
    except (json.JSONDecodeError, ValueError) as e:
        return json.dumps({"error": f"Invalid sm_history: {e!s}"})
    try:
        r = httpx.post(
            f"{_soil_moisture_url()}/predict/location",
            json={
                "state": state.strip(),
                "district": district.strip(),
                "sm_history": hist,
                "month": max(1, min(12, month)),
            },
            timeout=TIMEOUT,
        )
        r.raise_for_status()
        data = r.json()
        return json.dumps({
            "predictions": data.get("predictions", []),
            "days_ahead": data.get("days_ahead", [3, 4, 5, 6, 7]),
            "unit": "soil moisture %",
        })
    except httpx.HTTPStatusError as e:
        try:
            detail = e.response.json().get("detail", str(e.response.text))
        except Exception:
            detail = e.response.text or str(e)
        return json.dumps({"error": f"Soil Moisture API error ({e.response.status_code}): {detail}"})
    except (httpx.ConnectError, httpx.TimeoutException) as e:
        return json.dumps({"error": f"Soil Moisture service unavailable: {e!s}"})
    except Exception as e:
        return json.dumps({"error": f"Soil Moisture request failed: {e!s}"})


def optimize_village_water(total_available_water_liters: float, farms_json: str) -> str:
    """Call Village Water Allocation API. farms_json: JSON array of farm objects. Each farm: farm_id, area_ha or area_acre, crop_type, soil_type, region, temperature, weather_condition, priority_score (1-3). Optional: crop_water_requirement_mm_per_day, predicted_soil_moisture_pct."""
    try:
        farms = json.loads(farms_json)
    except json.JSONDecodeError as e:
        return json.dumps({"error": f"Invalid farms_json: {e!s}"})
    if not isinstance(farms, list) or len(farms) == 0:
        return json.dumps({"error": "farms_json must be a non-empty JSON array of farm objects."})
    try:
        r = httpx.post(
            f"{_village_water_url()}/optimize",
            json={
                "total_available_water_liters": total_available_water_liters,
                "farms": farms,
            },
            timeout=TIMEOUT,
        )
        r.raise_for_status()
        data = r.json()
        return json.dumps({
            "allocations": data.get("allocations", []),
            "per_farm_report": data.get("per_farm_report", []),
            "village_efficiency_score": data.get("village_efficiency_score"),
            "total_demand_liters": data.get("total_demand_liters"),
            "total_allocated_liters": data.get("total_allocated_liters"),
        })
    except httpx.HTTPStatusError as e:
        try:
            detail = e.response.json().get("detail", str(e.response.text))
        except Exception:
            detail = e.response.text or str(e)
        return json.dumps({"error": f"Village Water Allocation API error ({e.response.status_code}): {detail}"})
    except (httpx.ConnectError, httpx.TimeoutException) as e:
        return json.dumps({"error": f"Village Water Allocation service unavailable: {e!s}"})
    except Exception as e:
        return json.dumps({"error": f"Village Water Allocation request failed: {e!s}"})


# --- Pydantic schemas for LangChain tool binding ---


class PredictCropWaterInput(BaseModel):
    crop_type: str = Field(description="Crop type: one of BANANA, BEAN, CABBAGE, CITRUS, COTTON, MAIZE, MELON, MUSTARD, ONION, POTATO, RICE, SOYABEAN, SUGARCANE, TOMATO, WHEAT")
    soil_type: str = Field(description="Soil type: DRY, WET, or HUMID")
    region: str = Field(description="India agro-climatic zone e.g. Western Himalayan Region, Trans-Gangetic Plain Region, Western Dry Region (use exact name from list of 15 regions)")
    temperature: str = Field(description="Temperature range: 10-20, 20-30, 30-40, or 40-50")
    weather_condition: str = Field(description="Weather: NORMAL, SUNNY, WINDY, or RAINY")


class PredictSoilMoistureSensorInput(BaseModel):
    avg_pm1: float = Field(description="Average PM1 sensor value")
    avg_pm2: float = Field(description="Average PM2 sensor value")
    avg_pm3: float = Field(description="Average PM3 sensor value")
    avg_am: float = Field(description="Average AM sensor value")
    avg_lum: float = Field(description="Average luminosity")
    avg_temp: float = Field(description="Average temperature in Celsius")
    avg_humd: float = Field(description="Average humidity percentage")
    avg_pres: float = Field(description="Average pressure in Pa")
    avg_sm_lag1: float | None = Field(default=None, description="Soil moisture 1 day ago (optional)")
    avg_sm_lag2: float | None = Field(default=None, description="Soil moisture 2 days ago (optional)")


class PredictSoilMoistureLocationInput(BaseModel):
    state: str = Field(description="State name e.g. Rajasthan, Maharashtra")
    district: str = Field(description="District name e.g. Udaipur")
    sm_history: str = Field(description="Last 7 observed soil moisture values, most recent last. Provide as JSON array [v1,v2,...,v7] or 7 comma-separated numbers")
    month: int = Field(default=1, ge=1, le=12, description="Month 1-12 (optional)")


class OptimizeVillageWaterInput(BaseModel):
    total_available_water_liters: float = Field(gt=0, description="Total water available in liters in the village reservoir")
    farms_json: str = Field(description="JSON array of farm objects. Each object: farm_id (string), area_ha or area_acre (number), crop_type, soil_type, region, temperature, weather_condition (same as crop water), priority_score (1=low, 2=medium, 3=high). Example: [{\"farm_id\":\"F1\",\"area_ha\":2,\"crop_type\":\"MAIZE\",\"soil_type\":\"DRY\",\"region\":\"Trans-Gangetic Plain Region\",\"temperature\":\"20-30\",\"weather_condition\":\"SUNNY\",\"priority_score\":2}]")


# --- LangChain tools ---


def get_jalsakhi_tools() -> list[StructuredTool]:
    """Return list of LangChain tools for the Jalsakhi agent."""
    return [
        StructuredTool.from_function(
            name="predict_crop_water",
            description="Use when the user asks how much water a crop needs, or crop water requirement. Predicts water requirement in mm/day and L/acre/day from crop type, soil type, India agro-climatic region, temperature range, and weather. Use exact crop/soil/region/weather values from the allowed lists.",
            func=predict_crop_water,
            args_schema=PredictCropWaterInput,
        ),
        StructuredTool.from_function(
            name="predict_soil_moisture_sensor",
            description="Use when the user has sensor readings (PM1, PM2, PM3, AM, luminosity, temperature, humidity, pressure) and wants soil moisture forecast for the next 3-7 days. Optional: previous soil moisture lags (avg_sm_lag1, avg_sm_lag2).",
            func=predict_soil_moisture_sensor,
            args_schema=PredictSoilMoistureSensorInput,
        ),
        StructuredTool.from_function(
            name="predict_soil_moisture_location",
            description="Use when the user gives state and district and the last 7 days of observed soil moisture values, and wants soil moisture forecast for days 3-7. sm_history must be exactly 7 numbers (most recent last).",
            func=predict_soil_moisture_location,
            args_schema=PredictSoilMoistureLocationInput,
        ),
        StructuredTool.from_function(
            name="optimize_village_water",
            description="Use when the user wants to distribute or allocate a fixed amount of village reservoir water across multiple farms. Input: total_available_water_liters and a JSON array of farms (each with farm_id, area_ha or area_acre, crop_type, soil_type, region, temperature, weather_condition, priority_score 1-3). Returns per-farm allocation, deficit/met status, and village efficiency score.",
            func=optimize_village_water,
            args_schema=OptimizeVillageWaterInput,
        ),
    ]
