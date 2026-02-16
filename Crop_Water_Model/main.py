"""
FastAPI service for crop water requirement prediction.
"""
from contextlib import asynccontextmanager
from pathlib import Path

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

MODEL_PATH = Path(__file__).resolve().parent / "model.joblib"
CONFIG_PATH = Path(__file__).resolve().parent / "config.json"

model_pipeline = None
config = None


def parse_temperature_midpoint(temp_str: str) -> float:
    low, high = temp_str.strip().split("-")
    return (int(low) + int(high)) / 2.0


def load_artifacts():
    global model_pipeline, config
    import json
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. Run train.py first."
        )
    model_pipeline = joblib.load(MODEL_PATH)
    with open(CONFIG_PATH) as f:
        config = json.load(f)


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_artifacts()
    yield
    # shutdown if needed


app = FastAPI(
    title="Crop Water Requirement API",
    description="Predict crop water requirement from crop, soil, region, temperature, and weather.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    crop_type: str = Field(..., description="Crop type e.g. MAIZE, RICE")
    soil_type: str = Field(..., description="SOIL TYPE: DRY, WET, HUMID")
    region: str = Field(..., description="REGION: DESERT, SEMI ARID, SEMI HUMID, HUMID")
    temperature: str = Field(..., description="Temperature range e.g. 20-30")
    weather_condition: str = Field(..., description="NORMAL, SUNNY, WINDY, RAINY")


class PredictResponse(BaseModel):
    water_requirement: float
    unit: str = "mm/day"


def validate_request(req: PredictRequest) -> None:
    if config is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    if req.crop_type.upper() not in [c.upper() for c in config["crop_type"]]:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid crop_type. Allowed: {config['crop_type']}",
        )
    if req.soil_type.upper() not in [s.upper() for s in config["soil_type"]]:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid soil_type. Allowed: {config['soil_type']}",
        )
    if req.region.upper() not in [r.upper() for r in config["region"]]:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid region. Allowed: {config['region']}",
        )
    if req.weather_condition.upper() not in [w.upper() for w in config["weather_condition"]]:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid weather_condition. Allowed: {config['weather_condition']}",
        )
    if req.temperature not in config["temperature"]:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid temperature. Allowed: {config['temperature']}",
        )


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    validate_request(req)
    import pandas as pd
    temp_mid = parse_temperature_midpoint(req.temperature)
    columns = ["CROP TYPE", "SOIL TYPE", "REGION", "WEATHER CONDITION", "temp_mid"]
    row = pd.DataFrame(
        [{
            "CROP TYPE": req.crop_type.strip(),
            "SOIL TYPE": req.soil_type.strip(),
            "REGION": req.region.strip(),
            "WEATHER CONDITION": req.weather_condition.strip(),
            "temp_mid": temp_mid,
        }],
        columns=columns,
    )
    pred = model_pipeline.predict(row)[0]
    return PredictResponse(water_requirement=round(float(pred), 4))


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model_pipeline is not None,
    }


@app.get("/config")
def get_config():
    if config is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return config
