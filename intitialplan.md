# PROJECT TITLE : AgriFlow / Hydrix

Village Water Intelligence Platform (VWIP)
Self-learning village-level irrigation planning and water optimization system

---

# 1. PROBLEM STATEMENT

Farmers over-irrigate or irrigate blindly due to lack of:

* Crop-specific water requirement knowledge
* Weather-aligned scheduling
* Visibility of village-level water availability
* Feedback loops on wastage

This leads to:

* Groundwater depletion
* Reduced crop yield
* Energy waste
* Unequal water distribution

---

# 2. CORE OBJECTIVE

Build a platform that:

* Predicts crop water requirements
* Schedules irrigation using weather forecasts
* Allocates village water fairly
* Detects wastage and anomalies
* Learns continuously from usage
* Simulates village water future
* Recommends crop patterns
* Incentivizes water saving

---

# 3. ONE-LINE USP

Self-learning village water intelligence system that creates a digital twin of village water usage, predicts irrigation needs, optimizes crop planning, and rewards water-efficient behavior.

---

# 4. PRIMARY USERS

* Farmers
* Village Water Admin
* Agriculture Officers

---

# 5. SYSTEM CAPABILITIES

## Farmer

* Register land, crop, soil
* Receive daily water amount
* Receive best irrigation time
* View weekly schedule
* Upload crop image (optional)
* View water credits
* Receive alerts

## Admin

* View village water availability
* View total allocation
* View wastage reports
* Approve special requests
* Run simulations
* View crop pattern suggestions

---

# 6. HIGH LEVEL ARCHITECTURE

Mobile App (React Native)
Web App (React)
↓
Node.js Backend (API Gateway + Business Logic)
↓
Python ML Inference Services
↓
Database + Cache

ML models are independent microservices.

---

# 7. AI MODELS

1. Crop Water Requirement Prediction
2. Weather Aware Scheduling Model
3. Anomaly / Wastage Detection
4. Crop Pattern Optimization
5. Crop Stress Detection (Vision)
6. Water Crisis Forecasting
7. Simulation Engine (Digital Twin)

---

# 8. DATA SOURCES

* Weather API
* Government Crop Water Requirement Tables
* Kaggle Agriculture Datasets
* FAO Crop Coefficients
* Farmer Input Data
* Historical Predictions

---

# 9. FEATURE ENGINEERING

Weather

* Temperature
* Humidity
* Rainfall
* Wind Speed

Crop

* Crop Type
* Growth Stage
* Crop Coefficient (Kc)

Soil

* Soil Type
* Water Holding Capacity

Farm

* Area
* Irrigation Method

Temporal

* Day of Year
* Season

Village

* Water Availability
* Groundwater Level

---

# 10. MODEL OUTPUTS

* Liters per acre per day
* Irrigation timing window
* Water stress probability
* Expected yield impact
* Risk score

---

# 11. DIGITAL WATER TWIN

Virtual model representing:

* Water inflow
* Water storage
* Field consumption
* Evaporation loss
* Leakage loss

Supports:

* What-if simulations
* Policy testing
* Future forecasting

---

# 12. WATER CREDIT SYSTEM

* Credits awarded for saving water
* Credits reduce future quota cuts
* Credits increase priority access

---

# 13. DATA FLOW

Farmer Input
→ Node Backend
→ ML Service
→ Prediction
→ Optimization Engine
→ Quota Adjustment
→ Response to Farmer

All predictions stored for learning.

---

# 14. MODEL LIFECYCLE

Collect Data
→ Preprocess
→ Train
→ Validate
→ Register
→ Deploy
→ Monitor
→ Retrain

---

# 15. DEPLOYMENT STRATEGY

* ML: Python FastAPI Microservices
* Backend: Node.js Express
* Frontend: React + React Native
* Database: MongoDB / PostgreSQL
* Cache: Redis
* Containerization: Docker
* Orchestration (optional): Kubernetes

---

# 16. SECURITY

* JWT Authentication
* Role-based Access
* HTTPS
* Input Validation
* Rate Limiting

---

# 17. SCALABILITY STRATEGY

* Stateless services
* Horizontal scaling
* Model versioning
* Caching layer
* Async job queues

---

# 18. FAILURE HANDLING

* Fallback rule-based irrigation
* Retry logic
* Circuit breaker
* Health checks

---

# 19. MVP SCOPE

* Water Prediction
* Weather Scheduling
* Village Allocation
* Dashboard
* Credits (basic)

---

# 20. FUTURE SCOPE

* IoT Sensors
* Satellite Data
* Blockchain Credits
* Government Integration

---

---

# 21. MONOREPO FOLDER STRUCTURE

```
village-water-intelligence/
│
├── apps/
│   ├── mobile/                         # React Native farmer application
│   │   ├── src/
│   │   │   ├── components/             # Reusable UI components
│   │   │   ├── screens/                # App screens
│   │   │   ├── navigation/             # Navigation setup
│   │   │   ├── services/               # API clients
│   │   │   ├── store/                  # State management
│   │   │   ├── hooks/                  # Custom hooks
│   │   │   ├── utils/                  # Helpers
│   │   │   └── assets/                 # Images icons
│   │   └── app.config.js               # App configuration
│   │
│   ├── web/                            # React admin & analytics portal
│   │   ├── src/
│   │   │   ├── components/             # UI blocks
│   │   │   ├── pages/                  # Routes
│   │   │   ├── services/               # API wrappers
│   │   │   ├── charts/                 # Graph components
│   │   │   ├── store/                  # State management
│   │   │   └── utils/                  # Helpers
│   │   └── vite.config.js              # Build config
│
├── services/
│   ├── api-gateway/                    # Node backend
│   │   ├── src/
│   │   │   ├── controllers/            # Request handlers
│   │   │   ├── routes/                 # Route definitions
│   │   │   ├── services/               # Business logic
│   │   │   ├── models/                 # DB models
│   │   │   ├── middlewares/            # Auth validation
│   │   │   ├── utils/                  # Helpers
│   │   │   ├── jobs/                   # Background workers
│   │   │   └── config/                 # Env configuration
│   │   └── server.js                   # Server bootstrap
│   │
│   ├── ml-water-prediction/            # Crop water ML service
│   │   ├── app/                        # FastAPI app
│   │   │   ├── routers/                # API endpoints
│   │   │   ├── schemas/                # Input validation
│   │   │   ├── services/               # Inference logic
│   │   │   └── main.py                 # App entry
│   │   ├── model/                      # Trained model
│   │   └── Dockerfile                  # Container config
│   │
│   ├── ml-anomaly-detection/           # Wastage detection
│   │   ├── app/                        # FastAPI app
│   │   └── model/                      # Trained model
│   │
│   ├── ml-crop-optimizer/              # Crop pattern recommender
│   │   ├── app/
│   │   └── model/
│   │
│   ├── ml-vision-stress/               # Crop image analysis
│   │   ├── app/
│   │   └── model/
│   │
│   └── ml-simulation-engine/           # Digital twin simulator
│       ├── app/
│       └── rules/
│
├── training/
│   ├── datasets/                       # Raw datasets
│   ├── preprocessing/                 # Cleaning scripts
│   ├── feature_engineering/            # Feature creation
│   ├── experiments/                    # Model experiments
│   ├── evaluation/                     # Metrics scripts
│   └── export/                         # Saved models
│
├── shared/
│   ├── schemas/                        # Shared JSON schemas
│   ├── constants/                      # Enums
│   └── utils/                          # Shared helpers
│
├── infra/
│   ├── docker-compose.yml              # Local stack
│   ├── nginx/                          # Reverse proxy
│   └── k8s/                            # Kubernetes manifests
│
├── docs/
│   ├── architecture.md                 # System design
│   ├── api-spec.md                     # Endpoint specs
│   ├── ml-models.md                    # Model descriptions
│   └── data-dictionary.md              # Field definitions
│
└── README.md                            # Project overview
```

---

# 22. API COMMUNICATION FLOW

Frontend → Node
Node → ML Service
ML → Node
Node → Optimization Engine
Node → Frontend

No direct frontend to ML communication.

---

# 23. DATABASE ENTITIES

* User
* Farm
* Crop
* Soil
* IrrigationRecord
* PredictionLog
* VillageWaterSource
* WaterQuota
* CreditWallet
* SimulationRun

---

# 24. LOGGING STRATEGY

* Request logs
* Prediction logs
* Error logs
* Model version logs

---

# 25. MODEL VERSIONING

Each model:

* Version ID
* Training dataset hash
* Metrics
* Timestamp

---

# 26. GOVERNANCE

* Explainable predictions
* Transparent water allocation
* Audit logs

---

# 27. DEMO FLOW (HACKATHON)

1. Register farmer
2. Enter crop & land
3. Fetch weather
4. Predict water
5. Show schedule
6. Show village dashboard
7. Run simulation
8. Show credits

---

# 28. SUCCESS METRICS

* Water saved %
* Yield improvement %
* Adoption rate
* Prediction accuracy

---

# 29. PITCH CLOSING LINE

We are not building an irrigation app.
We are building intelligence for every drop of water in a village.

---
# 30. ARTIFACTS FOR IMPLEMENTATION

Below are **four concrete artifacts** you can directly use for planning, documentation, and AI-tool prompting:

1. Architecture Diagram
2. Data Dictionary Tables
3. API Contract Tables
4. ML Feature Tables

No fluff, no code, purely structural and implementation-ready.

---

# 1) SYSTEM ARCHITECTURE DIAGRAM

```
 ┌──────────────────────────┐
 │   Farmer Mobile App      │
 │   (React Native)         │
 └─────────────┬────────────┘
               │
 ┌─────────────▼────────────┐
 │   Web Admin Dashboard    │
 │   (React)                │
 └─────────────┬────────────┘
               │ HTTPS
               ▼
 ┌──────────────────────────┐
 │     Node.js API Gateway  │
 │  - Auth                  │
 │  - Validation            │
 │  - Business Logic        │
 │  - Optimization Engine   │
 └───────┬─────────┬────────┘
         │         │
         │         │
         ▼         ▼
 ┌──────────────┐  ┌─────────────────────┐
 │ ML Water     │  │ ML Anomaly Detection│
 │ Prediction   │  │ Service (Python)    │
 │ Service      │  └─────────────────────┘
 │ (Python)     │
 └───────┬──────┘
         │
         ▼
 ┌───────────────────────┐
 │ Simulation Engine     │
 │ (Digital Water Twin)  │
 └───────────────────────┘
         │
         ▼
 ┌──────────────────────────┐
 │ Optimization Engine      │
 │ (Quota + Crop Planning)  │
 └──────────────────────────┘
         │
         ▼
 ┌──────────────────────────┐
 │ Database (MongoDB/SQL)   │
 │ - Users                  │
 │ - Farms                  │
 │ - Crops                  │
 │ - Irrigation Logs        │
 │ - Predictions            │
 │ - Credits                │
 └──────────────────────────┘
         │
         ▼
 ┌──────────────────────────┐
 │ Cache (Redis)            │
 │ - Recent Predictions     │
 │ - Weather Data           │
 └──────────────────────────┘

 External Services
 ─────────────────
 Weather API
 Satellite API (future)
 SMS / Push Notification Service
```

---

# 2) DATA DICTIONARY TABLES

---

## User Table

| Field Name | Type      | Description       |
| ---------- | --------- | ----------------- |
| user_id    | UUID      | Unique user       |
| name       | String    | Farmer name       |
| phone      | String    | Login phone       |
| role       | Enum      | farmer / admin    |
| village_id | UUID      | Village mapping   |
| created_at | Timestamp | Registration time |

---

## Farm Table

| Field Name        | Type  | Description              |
| ----------------- | ----- | ------------------------ |
| farm_id           | UUID  | Unique farm              |
| user_id           | UUID  | Owner                    |
| area_acres        | Float | Farm size                |
| soil_type         | Enum  | sandy / clay / loam      |
| irrigation_method | Enum  | drip / flood / sprinkler |
| latitude          | Float | Location                 |
| longitude         | Float | Location                 |

---

## Crop Table

| Field Name   | Type   | Description          |
| ------------ | ------ | -------------------- |
| crop_id      | UUID   | Unique crop          |
| farm_id      | UUID   | Farm                 |
| crop_type    | String | Wheat, Rice etc      |
| growth_stage | Enum   | initial / mid / late |
| sowing_date  | Date   | Planting date        |

---

## Irrigation Record Table

| Field Name        | Type  | Description         |
| ----------------- | ----- | ------------------- |
| record_id         | UUID  | Unique record       |
| farm_id           | UUID  | Farm                |
| date              | Date  | Irrigation date     |
| water_used_liters | Float | Actual water        |
| source            | Enum  | well / canal / rain |

---

## Prediction Log Table

| Field Name             | Type      | Description    |
| ---------------------- | --------- | -------------- |
| prediction_id          | UUID      | Unique         |
| farm_id                | UUID      | Farm           |
| model_version          | String    | ML version     |
| predicted_water_liters | Float     | Output         |
| weather_snapshot       | JSON      | Weather values |
| timestamp              | Timestamp | Time           |

---

## Water Credit Wallet

| Field Name   | Type      | Description |
| ------------ | --------- | ----------- |
| wallet_id    | UUID      | Wallet      |
| user_id      | UUID      | Owner       |
| credits      | Float     | Balance     |
| last_updated | Timestamp | Time        |

---

## Village Water Source

| Field Name      | Type  | Description    |
| --------------- | ----- | -------------- |
| source_id       | UUID  | Source         |
| village_id      | UUID  | Village        |
| type            | Enum  | borewell/canal |
| capacity_liters | Float | Max storage    |

---

# 3) API CONTRACT TABLES

---

## Authentication

### POST /auth/register

Request

| Field | Type   |
| ----- | ------ |
| name  | String |
| phone | String |
| role  | String |

Response

| Field   | Type   |
| ------- | ------ |
| token   | String |
| user_id | UUID   |

---

## Add Farm

### POST /farms

Request

| Field             | Type   |
| ----------------- | ------ |
| area_acres        | Float  |
| soil_type         | String |
| irrigation_method | String |

Response

| Field   | Type |
| ------- | ---- |
| farm_id | UUID |

---

## Add Crop

### POST /crops

Request

| Field        | Type   |
| ------------ | ------ |
| farm_id      | UUID   |
| crop_type    | String |
| growth_stage | String |

Response

| Field   | Type |
| ------- | ---- |
| crop_id | UUID |

---

## Get Water Prediction

### POST /irrigation/predict

Request

| Field   | Type |
| ------- | ---- |
| farm_id | UUID |
| crop_id | UUID |

Response

| Field        | Type   |
| ------------ | ------ |
| water_liters | Float  |
| best_time    | String |
| confidence   | Float  |

---

## Save Irrigation Usage

### POST /irrigation/log

Request

| Field             | Type  |
| ----------------- | ----- |
| farm_id           | UUID  |
| water_used_liters | Float |

Response

| Field  | Type   |
| ------ | ------ |
| status | String |

---

## Get Village Dashboard

### GET /village/{id}/stats

Response

| Field                  | Type  |
| ---------------------- | ----- |
| total_available_liters | Float |
| allocated_liters       | Float |
| saved_liters           | Float |

---

## Get Credit Balance

### GET /credits

Response

| Field   | Type  |
| ------- | ----- |
| credits | Float |

---

# 4) ML FEATURE TABLES

---

## A) Water Requirement Prediction Model

### Input Features

| Feature                   | Type  |
| ------------------------- | ----- |
| temperature               | Float |
| humidity                  | Float |
| rainfall                  | Float |
| wind_speed                | Float |
| crop_type_encoded         | Int   |
| growth_stage_encoded      | Int   |
| soil_type_encoded         | Int   |
| area_acres                | Float |
| irrigation_method_encoded | Int   |
| day_of_year               | Int   |

### Target

| Target                | Type  |
| --------------------- | ----- |
| water_liters_per_acre | Float |

---

## B) Anomaly Detection Model

### Input Features

| Feature           | Type  |
| ----------------- | ----- |
| daily_water_used  | Float |
| historical_avg    | Float |
| crop_type_encoded | Int   |
| temperature       | Float |
| rainfall          | Float |

### Output

| Output        | Type    |
| ------------- | ------- |
| anomaly_score | Float   |
| is_anomaly    | Boolean |

---

# 5) INTERNAL BUSINESS RULE TABLES

---

## Scheduling Rules

| Condition         | Action            |
| ----------------- | ----------------- |
| rainfall > 60%    | Skip irrigation   |
| temperature > 35C | Increase by 15%   |
| morning hours     | Prefer irrigation |

---

## Credit Rules

| Condition       | Credits |
| --------------- | ------- |
| Use < predicted | +5      |
| Use > predicted | -5      |
| Follow schedule | +3      |

---

# 6) MODEL COMMUNICATION CONTRACT

---

## Node → ML Water Service

Request

| Field        | Type  |
| ------------ | ----- |
| temperature  | Float |
| humidity     | Float |
| rainfall     | Float |
| crop_type    | Int   |
| soil_type    | Int   |
| growth_stage | Int   |
| area_acres   | Float |

Response

| Field                 | Type  |
| --------------------- | ----- |
| water_liters_per_acre | Float |

---

# 7) VERSIONING STRATEGY

| Item            | Format     |
| --------------- | ---------- |
| Model Version   | v1.0.0     |
| API Version     | /v1/       |
| Dataset Version | ds_2026_01 |

---
