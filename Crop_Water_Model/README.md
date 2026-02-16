# Crop Water Requirement Model and API

Predicts crop water requirement (mm/day) from crop type, soil type, region, temperature range, and weather condition. Uses a Random Forest model trained on [DATASET - Sheet1.csv](DATASET%20-%20Sheet1.csv) and exposed via FastAPI.

## Setup

```bash
pip install -r requirements.txt
```

## Train the model

Run once (or when you change the dataset) to produce `model.joblib` and `config.json`:

```bash
python train.py
```

Use the **same Python environment** for training and running the API so the saved model loads correctly.

## Run the API

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Or with the same interpreter used for training:

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

- **Docs:** http://localhost:8000/docs  
- **Health:** `GET /health`  
- **Predict:** `POST /predict` (see below)

## Predict endpoint

**POST /predict**

Request body (JSON):

| Field             | Description                    | Example    |
|-------------------|--------------------------------|------------|
| `crop_type`       | Crop name                      | `"MAIZE"`  |
| `soil_type`       | DRY, WET, HUMID                | `"DRY"`    |
| `region`          | DESERT, SEMI ARID, SEMI HUMID, HUMID | `"SEMI ARID"` |
| `temperature`     | Range as string                | `"20-30"`  |
| `weather_condition` | NORMAL, SUNNY, WINDY, RAINY  | `"SUNNY"`  |

Example:

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"crop_type":"MAIZE","soil_type":"DRY","region":"SEMI ARID","temperature":"20-30","weather_condition":"SUNNY"}'
```

Response:

```json
{"water_requirement": 7.9062, "unit": "mm/day"}
```

**GET /config** returns allowed values for each field (for dropdowns in your project).

## Test UI (Gradio)

A simple Gradio UI loads the model and lets you try predictions in the browser:

```bash
pip install gradio
python app_gradio.py
```

Open the URL shown in the terminal (e.g. http://127.0.0.1:7860). Pick crop, soil, region, temperature, weather and click **Predict**.

## Project layout

- `train.py` – Load data, preprocess, train Random Forest, save pipeline and config
- `main.py` – FastAPI app: `/predict`, `/health`, `/config`
- `app_gradio.py` – Gradio UI for testing predictions
- `model.joblib` – Trained pipeline (created by `train.py`)
- `config.json` – Allowed categories (created by `train.py`)
- `DATASET - Sheet1.csv` – Training data
