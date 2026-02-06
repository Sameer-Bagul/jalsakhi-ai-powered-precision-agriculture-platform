# ROLE OF DEV-1 [Sameer Bagul]

Owns:

* React Native Mobile App
* React Web Dashboard
* Node.js Backend (API Gateway + Business Logic)
* Database Design
* Authentication
* Optimization Engine
* Integration with ML Services

Does NOT train ML models.

---

# DEV-1 OBJECTIVE

Build a production-grade application layer that:

* Collects farmer input
* Stores structured data
* Calls ML APIs
* Applies business rules
* Returns actionable plans
* Displays insights

---

# SYSTEMS OWNED BY DEV-1

1. Mobile App (Farmer)
2. Web App (Admin)
3. Node Backend
4. Database Schema
5. Caching Layer
6. Auth System

---

# TECH STACK (FIXED)

Frontend Web → React + Vite
Mobile → React Native
Backend → Node.js + Express
DB → MongoDB
Cache → Redis
Auth → JWT

---

# FEATURE OWNERSHIP

DEV-1 IMPLEMENTS

* User auth
* Farm management
* Crop management
* Weather fetch
* ML API calls
* Irrigation scheduling logic
* Village allocation logic
* Credit engine
* Dashboards
* Logs

---

---

# FUNCTIONAL MODULE BREAKDOWN

---

## MODULE 1 — AUTHENTICATION

* Phone based signup
* JWT token
* Role based access
* Farmer / Admin

---

## MODULE 2 — FARM MANAGEMENT

* Add farm
* Edit farm
* Delete farm
* View farms

---

## MODULE 3 — CROP MANAGEMENT

* Add crop
* Select growth stage
* Change crop

---

## MODULE 4 — WEATHER SERVICE

* Fetch weather from external API
* Cache weather for location
* Normalize weather format

---

## MODULE 5 — IRRIGATION PREDICTION PIPELINE

Flow:

Farm → Crop → Weather → ML API → Water Amount → Scheduler → Response

---

## MODULE 6 — SCHEDULER ENGINE (RULE BASED)

Rules:

* If rain probability high → skip
* Morning slot preferred
* Heatwave → increase amount

Outputs:

* Best time
* Adjustment factor

---

## MODULE 7 — VILLAGE WATER ALLOCATION ENGINE

Inputs:

* Village capacity
* All farm demands

Logic:

* Sum demands
* If within capacity → approve
* Else → scale proportionally

---

## MODULE 8 — WATER CREDIT ENGINE

Rules:

* Used less than predicted → earn
* Used more → lose

---

## MODULE 9 — LOGGING ENGINE

* Store predictions
* Store irrigation usage
* Store anomalies

---

## MODULE 10 — DASHBOARDS

Farmer:

* Today plan
* Weekly plan
* Credits
* History

Admin:

* Village water
* Usage
* Savings
* Top savers

---

---

# REQUEST FLOW (IMPORTANT)

Mobile/Web
→ Node API
→ Weather Service
→ ML API
→ Scheduler
→ Allocation Engine
→ Credit Engine
→ DB
→ Response

---

---

# DATABASE COLLECTIONS

* users
* farms
* crops
* villages
* irrigation_logs
* predictions
* water_sources
* credits

---

---

# BACKEND FOLDER STRUCTURE

```
backend/
│
├── src/
│   ├── app.js                      # Express app bootstrap
│   ├── server.js                   # Server start
│
│   ├── config/
│   │   ├── env.js                  # Environment variables
│   │   ├── db.js                   # Mongo connection
│   │   ├── redis.js                # Redis connection
│
│   ├── routes/
│   │   ├── auth.routes.js          # Auth endpoints
│   │   ├── farm.routes.js          # Farm CRUD
│   │   ├── crop.routes.js          # Crop CRUD
│   │   ├── irrigation.routes.js    # Prediction endpoints
│   │   ├── village.routes.js       # Admin stats
│   │   ├── credits.routes.js       # Credit APIs
│
│   ├── controllers/
│   │   ├── auth.controller.js      # Auth logic
│   │   ├── farm.controller.js      # Farm logic
│   │   ├── crop.controller.js      # Crop logic
│   │   ├── irrigation.controller.js# Prediction pipeline
│   │   ├── village.controller.js   # Admin dashboards
│   │   ├── credit.controller.js    # Credit calculations
│
│   ├── services/
│   │   ├── weather.service.js      # External weather API
│   │   ├── ml.service.js           # Call FastAPI models
│   │   ├── scheduler.service.js    # Timing rules
│   │   ├── allocation.service.js   # Village quota logic
│   │   ├── credit.service.js       # Credit logic
│   │   ├── cache.service.js        # Redis wrapper
│
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Farm.js                 # Farm schema
│   │   ├── Crop.js                 # Crop schema
│   │   ├── Prediction.js           # Prediction schema
│   │   ├── IrrigationLog.js        # Usage logs
│   │   ├── Village.js              # Village schema
│   │   ├── CreditWallet.js         # Wallet
│
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT verify
│   │   ├── role.middleware.js      # Role check
│   │   ├── error.middleware.js     # Error handler
│
│   ├── utils/
│   │   ├── logger.js               # Logging helper
│   │   ├── response.js             # Unified response
│   │   ├── constants.js            # Enums
│
│   └── jobs/
│       ├── nightlyAggregation.js   # Daily stats job
│
└── package.json                    # Dependencies
```

---

---

# MOBILE APP FOLDER STRUCTURE (REACT NATIVE)

```
mobile/
│
├── src/
│   ├── App.js                       # Root
│
│   ├── navigation/
│   │   └── AppNavigator.js          # Stack navigation
│
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js       # Login
│   │   │   └── RegisterScreen.js    # Signup
│   │   │
│   │   ├── home/
│   │   │   └── HomeScreen.js        # Today plan
│   │   │
│   │   ├── farm/
│   │   │   └── FarmForm.js          # Add farm
│   │   │
│   │   ├── crop/
│   │   │   └── CropForm.js          # Add crop
│   │   │
│   │   ├── irrigation/
│   │   │   └── ScheduleScreen.js    # Water plan
│   │   │
│   │   ├── credits/
│   │   │   └── CreditScreen.js      # Wallet
│   │   │
│   │   └── profile/
│   │       └── ProfileScreen.js     # User info
│
│   ├── components/
│   │   ├── Input.js                 # Input UI
│   │   ├── Button.js                # Button UI
│   │   ├── Card.js                  # Card UI
│
│   ├── services/
│   │   ├── api.js                   # Axios base
│   │   ├── auth.api.js              # Auth calls
│   │   ├── farm.api.js              # Farm calls
│   │   ├── irrigation.api.js        # Prediction calls
│
│   ├── store/
│   │   ├── auth.store.js            # Auth state
│   │   ├── farm.store.js            # Farm state
│   │   ├── irrigation.store.js      # Plan state
│
│   └── utils/
│       └── storage.js               # Local storage
│
└── package.json
```

---

---

# WEB DASHBOARD FOLDER STRUCTURE

```
web/
│
├── src/
│   ├── main.jsx                     # Entry
│
│   ├── pages/
│   │   ├── Login.jsx                # Admin login
│   │   ├── Dashboard.jsx            # Main stats
│   │   ├── Farmers.jsx              # Farmer list
│   │   ├── Water.jsx                # Water usage
│   │   └── Credits.jsx              # Credits view
│
│   ├── components/
│   │   ├── Sidebar.jsx              # Navigation
│   │   ├── StatCard.jsx             # Metric card
│   │   ├── Chart.jsx                # Graph wrapper
│
│   ├── services/
│   │   └── api.js                   # Backend API
│
│   └── store/
│       └── admin.store.js           # Admin state
│
└── package.json
```

---

---

# DEV-1 DEVELOPMENT PHASE PLAN

---

## PHASE 1 (Day 1)

* Setup backend
* Auth
* DB schemas
* Farm + Crop CRUD

---

## PHASE 2 (Day 2)

* Weather service
* ML service integration
* Prediction pipeline

---

## PHASE 3 (Day 3)

* Scheduler engine
* Allocation engine
* Credit engine

---

## PHASE 4 (Day 4)

* Mobile UI
* Dashboard UI

---

## PHASE 5 (Day 5)

* End-to-end testing
* Caching
* Polishing

---

---

# CONTRACT WITH DEV-2

Node expects:

Endpoint: /predict
Request:

temperature
humidity
rainfall
crop_type
soil_type
growth_stage
area_acres

Response:

water_liters_per_acre

---

---

# NON-NEGOTIABLE PRACTICES

* Centralized error handling
* Input validation
* No frontend → ML direct calls
* Log every prediction

---

---

# SUCCESS CRITERIA FOR DEV-1

* Farmer gets water plan
* Admin sees village stats
* ML integration works
* Credits change

If these work → product demo ready.
