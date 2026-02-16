"""
Basic Gradio UI to test the crop water requirement model.
Run: python app_gradio.py
"""
import json
from pathlib import Path

import gradio as gr
import joblib
import pandas as pd

MODEL_PATH = Path(__file__).resolve().parent / "model.joblib"
CONFIG_PATH = Path(__file__).resolve().parent / "config.json"


def load_artifacts():
    with open(CONFIG_PATH) as f:
        config = json.load(f)
    model = joblib.load(MODEL_PATH)
    return config, model


def parse_temp(s: str) -> float:
    low, high = s.strip().split("-")
    return (int(low) + int(high)) / 2.0


def predict(crop_type, soil_type, region, temperature, weather_condition):
    row = pd.DataFrame(
        [{
            "CROP TYPE": crop_type,
            "SOIL TYPE": soil_type,
            "REGION": region,
            "WEATHER CONDITION": weather_condition,
            "temp_mid": parse_temp(temperature),
        }],
        columns=["CROP TYPE", "SOIL TYPE", "REGION", "WEATHER CONDITION", "temp_mid"],
    )
    pred = model_pipeline.predict(row)[0]
    return round(float(pred), 4)


if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found. Run: python train.py")
config, model_pipeline = load_artifacts()

with gr.Blocks(title="Crop Water Requirement") as app:
    gr.Markdown("## Crop Water Requirement (test)")
    with gr.Row():
        crop = gr.Dropdown(
            choices=config["crop_type"],
            value=config["crop_type"][0],
            label="Crop type",
        )
        soil = gr.Dropdown(
            choices=config["soil_type"],
            value=config["soil_type"][0],
            label="Soil type",
        )
    with gr.Row():
        region = gr.Dropdown(
            choices=config["region"],
            value=config["region"][0],
            label="Region",
        )
        temp = gr.Dropdown(
            choices=config["temperature"],
            value=config["temperature"][0],
            label="Temperature range",
        )
    weather = gr.Dropdown(
        choices=config["weather_condition"],
        value=config["weather_condition"][0],
        label="Weather condition",
    )
    btn = gr.Button("Predict")
    out = gr.Number(label="Water requirement (mm/day)", interactive=False)

    btn.click(
        fn=predict,
        inputs=[crop, soil, region, temp, weather],
        outputs=out,
    )

app.launch()
