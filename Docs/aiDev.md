# ROLE OF DEV-2 [Aayush and Team]

Owns:

* Dataset sourcing
* Data preprocessing
* Feature engineering
* ML model training
* Model evaluation
* Model versioning
* FastAPI inference services
* Model packaging

Does NOT build frontend or Node backend.

---

# DEV-2 OBJECTIVE

Deliver production-ready ML services that:

* Accurately predict crop water requirement
* Detect irrigation anomalies
* Expose stable APIs
* Are easy to retrain and version

---

# ML SERVICES OWNED

1. Crop Water Requirement Prediction
2. Anomaly / Wastage Detection

(Everything else is rule-based or optimization at backend)

---

# TECH STACK (FIXED)

Language → Python
ML → Scikit-learn
DL (optional) → PyTorch
API → FastAPI
Data → Pandas, NumPy
Visualization → Matplotlib
Model Storage → Joblib
Experiment Tracking → MLflow (optional)

---

# CORE DATASETS

* Crop water requirement tables
* Weather historical data
* Crop yield data
* Soil type data
* Irrigation usage samples

---

---

# FUNCTIONAL MODULE BREAKDOWN

---

## MODULE 1 — DATA INGESTION

* Download datasets
* Store raw CSVs
* Maintain metadata

---

## MODULE 2 — DATA CLEANING

* Remove nulls
* Normalize units
* Encode categories

---

## MODULE 3 — FEATURE ENGINEERING

* Combine crop + soil + weather
* Create growth stage encoding
* Create seasonal indicators

---

## MODULE 4 — MODEL TRAINING

* Train regression model
* Hyperparameter tuning
* Cross validation

---

## MODULE 5 — MODEL EVALUATION

* MAE
* RMSE
* R²

---

## MODULE 6 — MODEL EXPORT

* Save model
* Save encoders
* Save metadata

---

## MODULE 7 — FASTAPI SERVICE

* Load model at startup
* Validate inputs
* Predict

---

## MODULE 8 — ANOMALY MODEL

* Train unsupervised model
* Score anomalies

---

## MODULE 9 — VERSIONING

* Model versions
* Dataset versions

---

## MODULE 10 — RETRAIN PIPELINE

* Scripted retraining

---

---

# DATA PIPELINE FLOW

Raw Data
→ Cleaned Data
→ Feature Table
→ Train / Validate
→ Export Model
→ FastAPI Load

---

---

# INPUT FEATURE SET (MAIN MODEL)

* temperature
* humidity
* rainfall
* wind_speed
* crop_type
* growth_stage
* soil_type
* irrigation_method
* area_acres
* day_of_year

Target:

water_liters_per_acre

---

---

# ANOMALY MODEL FEATURES

* daily_water_used
* predicted_water
* crop_type
* rainfall
* temperature

---

---

# FASTAPI SERVICE RESPONSIBILITIES

* Health check
* Predict endpoint
* Batch predict (optional)
* Return JSON only

---

---

# FASTAPI PROJECT FOLDER STRUCTURE

```
ml-services/
│
├── water-prediction/
│   ├── app/
│   │   ├── main.py                 # FastAPI entry
│   │   ├── routers/
│   │   │   └── predict.py          # Prediction route
│   │   ├── schemas/
│   │   │   └── input.py            # Input schema
│   │   ├── services/
│   │   │   └── inference.py        # Load model & predict
│   │   ├── config/
│   │   │   └── settings.py         # Paths & env
│   │   └── utils/
│   │       └── encoders.py         # Encoding helpers
│   │
│   ├── model/
│   │   ├── water_model.pkl         # Trained model
│   │   ├── encoders.pkl            # Encoders
│   │   └── metadata.json           # Feature info
│   │
│   ├── training/
│   │   ├── data/
│   │   │   ├── raw/                # Raw datasets
│   │   │   ├── cleaned/            # Cleaned data
│   │   │   └── processed/          # Feature tables
│   │   ├── preprocess.py           # Cleaning logic
│   │   ├── feature_engineering.py  # Feature creation
│   │   ├── train.py                # Training script
│   │   ├── evaluate.py             # Metrics
│   │   └── export.py               # Save model
│   │
│   └── Dockerfile                  # Container config
│
├── anomaly-detection/
│   ├── app/
│   │   ├── main.py                 # FastAPI entry
│   │   ├── routers/
│   │   │   └── score.py            # Scoring route
│   │   └── services/
│   │       └── inference.py        # Load model
│   │
│   ├── model/
│   │   └── anomaly_model.pkl       # Trained model
│   │
│   ├── training/
│   │   ├── train.py                # Training script
│   │   └── export.py               # Save model
│   │
│   └── Dockerfile
│
└── shared/
    ├── schemas/                    # Shared input schema
    └── constants.py                # Encoded values
```

---

---

# INPUT CONTRACT FROM NODE

Water Prediction:

* temperature (float)
* humidity (float)
* rainfall (float)
* wind_speed (float)
* crop_type (int)
* soil_type (int)
* growth_stage (int)
* irrigation_method (int)
* area_acres (float)
* day_of_year (int)

Response:

* water_liters_per_acre (float)

---

Anomaly Detection:

* daily_water_used
* predicted_water
* crop_type
* rainfall
* temperature

Response:

* anomaly_score
* is_anomaly

---

---

# MODEL VERSIONING FORMAT

water_model_v1.0.0.pkl
anomaly_model_v1.0.0.pkl

metadata.json:

* version
* trained_on
* dataset_hash
* metrics

---

---

# QUALITY TARGETS

Water Model:

MAE < threshold
R² > 0.75

Anomaly:

False positive < 10%

---

---

# RETRAINING STRATEGY

* Monthly retrain
* Append new irrigation logs
* Re-export model

---

---

# DEV-2 DAILY EXECUTION PLAN

---

DAY 1
Collect datasets
Clean data
Build feature table

DAY 2
Train baseline model
Evaluate

DAY 3
Tune model
Export

DAY 4
Build FastAPI service

DAY 5
Anomaly model

---

---

# NON-NEGOTIABLE PRACTICES

* Save encoders
* Validate inputs
* Log predictions
* Never retrain inside API

---

---

# SUCCESS CRITERIA

* API responds
* Stable predictions
* Node can consume
* Model reproducible

