## JalSakhi – Smart AI-Powered Farming Assistant

<p align="center">
  <img src="JalSakhi/assets/images/logo.png" alt="JalSakhi logo" width="160" />
</p>

JalSakhi is a **smart AI-powered farming assistant** for farmers and village administrators.  
It combines a production-ready mobile app, multiple ML microservices, and a secure local gateway to deliver crop water recommendations, soil moisture forecasts, village-level water allocation, and an AI chatbot—all to support better farming decisions.

### App at a glance

<p align="center">
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.31.jpeg" alt="JalSakhi app screenshot 1" width="220" />
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.32.jpeg" alt="JalSakhi app screenshot 2" width="220" />
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.32%20(1).jpeg" alt="JalSakhi app screenshot 3" width="220" />
</p>

<p align="center">
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.32%20(2).jpeg" alt="JalSakhi app screenshot 4" width="220" />
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.33.jpeg" alt="JalSakhi app screenshot 5" width="220" />
</p>

## Repository overview

This repository is a multi-component monorepo:

- **`JalSakhi/`** – Expo React Native mobile app (Android, iOS, web) for farmers and admins
- **`ML models/`** – Python FastAPI microservices for crop water, soil moisture, and village allocation
- **`local-model-gateway/`** – Node.js Express gateway and reverse proxy for ML models
- **`Chatbot/`** – Python-based conversational assistant service
- **`Docs/`** – Architecture notes, navigation flows, and development guides
- **`inspo/`, `jalsakhi_process.txt`** – Design notes, experiments, and process documentation

At a high level:

- The **mobile app** is the primary user interface.
- A **backend API** (implemented in a separate project) handles auth, persistence, and core business logic.
- **ML services** expose domain-specific intelligence over HTTP.
- The **local-model-gateway** provides a single, secure entrypoint when running ML services locally or on-premise.

## Architecture at a glance

Conceptual data flow:

```text
Farmers/Admins (mobile app)
          │
          ▼
   Backend API (Node/DB)  ← (out of scope for this repo)
          │
          ├─ Stores users, farms, allocations, history
          ▼
    ML Gateway / Unified API
          │
          ├─ Crop water requirement model
          ├─ Soil moisture model
          ├─ Village water allocation optimizer
          └─ Chatbot / assistant
```

The mobile app can call ML services:

- **Directly**, via a single unified FastAPI server under `ML models/unified_api/`, or
- **Indirectly**, via the **`local-model-gateway`**, which:
  - Proxies to multiple ML services
  - Adds API-key protection, rate limiting, body size limits, and timeouts

## Directory structure

High-level structure (simplified):

```text
.
├─ JalSakhi/                    # Expo React Native mobile app
│  ├─ app/                      # Screens and navigation (Expo Router)
│  │  ├─ (auth)/               # Onboarding and authentication flows
│  │  ├─ farmer/               # Farmer dashboards, crop/soil tools
│  │  └─ admin/                # Admin dashboards and allocation tools
│  ├─ components/              # Shared UI components
│  ├─ services/                # API clients (auth, ML, weather, farms)
│  ├─ constants/               # Theme, colors, and shared constants
│  ├─ context/                 # React context providers
│  ├─ locales/, i18n.ts        # Internationalisation setup
│  ├─ assets/images/           # Logo, backgrounds (logo.png, forest_bg.png, background.jpeg)
│  └─ *.md                     # App-specific guides (debug, build, nav)
│
├─ ML models/
│  ├─ Crop_Water_Model/        # Crop water requirement model and API
│  ├─ soil_moisture_model/     # Soil moisture forecasting model and API
│  ├─ village_water_allocation/# Village-level allocation optimizer API
│  └─ unified_api/             # FastAPI server mounting all three models
│
├─ local-model-gateway/        # Node.js Express gateway and reverse proxy
│  ├─ server.js                # Entrypoint
│  ├─ .env.example             # Gateway configuration and secrets template
│  └─ README.md                # Gateway-specific documentation
│
├─ Chatbot/                    # Chatbot / assistant service
├─ images/                     # App screenshots (used in README)
├─ Docs/                       # Architecture and process documentation
└─ ...
```

For details on the mobile app specifically, see `JalSakhi/README.md`.

## Prerequisites

To work on the full stack, you will typically need:

- **Node.js** 18+ and **npm**
- **Python** 3.10+ and **pip**
- **Expo CLI** (optional, but recommended for local development)
- **ngrok** (optional, for exposing local services to devices)

Backend (auth, persistence, OTP, etc.) is assumed to be a separate Node.js service with a database such as MongoDB, as described in `JalSakhi/BACKEND_INTEGRATION.md`.

## 1. Mobile app (`JalSakhi/`)

The mobile client is built with Expo SDK 54, React Native, TypeScript, Expo Router, and React Context.

### Install and run (development)

```bash
cd JalSakhi
npm install
npm start
```

Then:

- Open the project in Expo Go on your device, or
- Use the shortcuts in the terminal (`a` for Android emulator, `i` for iOS, `w` for web).

### Common scripts

```bash
# Development
npm start              # Expo dev server
npm run dev           # Same as start
npm run dev:build     # Dev client build
npm run android       # Run on Android (Expo Go)
npm run android:dev   # Run on Android (dev build)
npm run ios           # Run on iOS (Expo Go)
npm run web           # Run in a browser

# Builds (EAS)
npm run build:dev      # Development APK
npm run build:preview  # Preview APK
npm run build:prod     # Production APK

# Utilities
npm run lint           # ESLint
npm run reset-project  # Reset Expo project
```

More details and troubleshooting:

- `JalSakhi/README.md` – app-level overview and scripts
- `JalSakhi/DEBUG_GUIDE.md` – debugging and dev builds
- `JalSakhi/BUILD_DEBUG.md` – detailed build instructions
- `JalSakhi/NAVIGATION_MAP.md` – navigation and screen flows
- `JalSakhi/IMPLEMENTATION_SUMMARY.md` – overview of key features

## 2. ML microservices (`ML models/`)

The `ML models/` folder contains three domain-specific models and a unified FastAPI server.

### 2.1 Unified ML API

The unified API mounts all three ML services into a single FastAPI app, ideal when you want a single URL (and a single ngrok tunnel).

```bash
cd "ML models"
pip install -r unified_api/requirements.txt
uvicorn unified_api.main:app --host 0.0.0.0 --port 8000
```

You can then browse `http://localhost:8000/docs` to explore endpoints.  
Environment variables such as `PORT` may be supported by the unified API configuration.

### 2.2 Crop Water Model

```bash
cd "ML models/Crop_Water_Model"
pip install -r requirements.txt

# One-time dataset expansion and training
python expand_dataset_agro_zones.py
python train.py

# Run the API
uvicorn main:app --host 0.0.0.0 --port 8001
```

This service predicts crop water requirements (e.g., in mm/day and L/acre/day) across Indian agro-climatic zones.

### 2.3 Soil Moisture Model

```bash
cd "ML models/soil_moisture_model"
pip install -r requirements.txt

python train.py
uvicorn api:app --host 0.0.0.0 --port 8002
```

This service provides soil moisture forecasts, optionally with a small UI for interactive exploration.

### 2.4 Village Water Allocation Optimizer

```bash
cd "ML models/village_water_allocation"
pip install -r requirements.txt
uvicorn api:app --host 0.0.0.0 --port 8003
```

This service combines crop water demand and soil moisture information to allocate limited reservoir water fairly and efficiently across villages and crops.

## 3. Local model gateway (`local-model-gateway/`)

The local model gateway is a hardened Node.js/Express server that:

- Provides a single entrypoint for the various ML services
- Proxies paths such as `/crop-water/*`, `/soil-moisture/*`, `/village-water/*`, `/chatbot/*`
- Enforces an internal API key, rate limits, body size limits, and timeouts

### Setup and run

```bash
cd local-model-gateway
npm install
cp .env.example .env    # then edit .env
npm start               # or: node server.js
```

Key environment variables (see `.env.example` for the full list):

- `INTERNAL_API_KEY` – required API key for internal ML endpoints
- `PORT` – gateway port (default: `5000`)
- `CROP_WATER_API_URL`, `SOIL_MOISTURE_API_URL`,
  `VILLAGE_WATER_API_URL`, `CHATBOT_API_URL` – URLs to the ML services
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`, `BODY_LIMIT`, `REQUEST_TIMEOUT_MS` – protection settings

For remote device testing, you can expose the gateway via ngrok:

```bash
ngrok http 5000
```

See `local-model-gateway/README.md` and `local-model-gateway/TEST-FROM-OTHER-PC.md` for detailed curl examples.

## 4. Chatbot service (`Chatbot/`)

The `Chatbot/` folder contains a Python-based conversational assistant.  
Typical usage involves starting a FastAPI or similar app (for example, using `uvicorn api:app`), and then pointing the mobile app or gateway to its HTTP endpoints.

Inspect `Chatbot/api.py`, `Chatbot/app.py`, and related files for the exact API surface and run commands.

## Configuration and environment

### Mobile app

- The mobile app reads its API base URL from `EXPO_PUBLIC_API_URL`:

  - Example `.env` for local development:

    ```env
    EXPO_PUBLIC_API_URL=http://localhost:3000
    ```

  - Example for pointing to a remote backend:

    ```env
    EXPO_PUBLIC_API_URL=https://your-backend.example.com
    ```

- The app expects a backend with REST endpoints under `/api/...`, plus:
  - Auth endpoints for login, signup, OTP, and profile management
  - Farmer/admin APIs (farms, reservoirs, allocations, analytics)
  - A database such as MongoDB for persistence

See `JalSakhi/BACKEND_INTEGRATION.md` for the full contract expected by the mobile app.

### ML services and gateway

- ML services are generally configured via:
  - `requirements.txt` files for dependencies
  - Simple configuration files (for example, `village_water_allocation/config.json`)
  - Environment variables such as `PORT` when starting the unified API
- The gateway `.env` controls how each ML service is reached and how incoming requests are protected.

## Running the full stack locally

One typical local-development workflow:

1. **Start ML services**
   - Either run all three services separately (ports 8001, 8002, 8003), or run the unified API on a single port.
2. **Start the local-model-gateway**
   - Configure it to point to your ML services and start on port 5000.
3. **Expose the gateway (optional)**
   - Use `ngrok http 5000` so that physical devices can reach your local gateway.
4. **Start the backend API (external project)**
   - Ensure its `/api/...` contract matches `BACKEND_INTEGRATION.md`.
5. **Start the mobile app**
   - In `JalSakhi/`, set `EXPO_PUBLIC_API_URL` to your backend URL (local IP, ngrok URL, or cloud URL) and run `npm start`.

## Testing and quality

- There is currently **no automated test suite** (no Jest/Vitest or Python test runner configured).
- Recommended checks:
  - `cd JalSakhi && npm run lint` – TypeScript/JS linting for the mobile app
  - Hitting FastAPI `/docs` and `/health` endpoints for each ML service
  - Manual testing of mobile flows using Expo Go or dev builds

If you plan to extend the project, adding unit tests and integration tests for both the mobile app and the ML services is strongly recommended.

## Deployment

- **Mobile app**
  - Uses EAS build profiles defined in `JalSakhi/eas.json`.
  - See:
    - `JalSakhi/BUILD_DEBUG.md` – building debug, preview, and production APKs
    - `JalSakhi/DEPLOYMENT_GUIDE.md` or related docs for connecting built apps to servers
- **Gateway and ML services**
  - Designed primarily for manual deployment via:
    - `uvicorn` (for FastAPI services)
    - `node server.js` (for the gateway)
  - CI/CD and containerization are not yet configured in this repository.

## Contributing

- Explore the existing documentation under `JalSakhi/` and `Docs/` to understand flows and architecture.
- When adding new features:
  - Keep API contracts consistent with `BACKEND_INTEGRATION.md`.
  - Prefer extending the unified ML API or gateway rather than adding ad-hoc endpoints.
  - Maintain the existing theming and UX patterns in the mobile app.

## License and attribution

This project was created for the Techathon 2026 competition.  
Please check competition or organization guidelines before reusing or open-sourcing parts of the codebase.

