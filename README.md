# 🌾 JalSakhi – AI-Powered Precision Agriculture Platform

<p align="center">
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.31.jpeg" alt="JalSakhi logo" width="200" />
</p>

<p align="center">
  <strong>Smart Water Management for Sustainable Farming</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat&logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-54-000020?style=flat&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-Latest-009688?style=flat&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
</p>

---

## 📖 Overview

**JalSakhi** is a comprehensive AI-powered precision agriculture platform designed to optimize water management for Indian farmers and village administrators. It combines a production-ready mobile app, multiple ML microservices, and a secure gateway to deliver:

- 💧 **Crop Water Requirement Predictions** - AI-driven recommendations based on crop, soil, and climate
- 🌱 **Soil Moisture Forecasting** - 7-day predictions using sensor and location data
- ⚖️ **Village Water Allocation** - Fair distribution optimization for reservoir management
- 🤖 **Multilingual AI ml-services/chatbot** - Context-aware assistant in English, Hindi, and Marathi
- 📊 **Analytics & Insights** - Data-driven decision support for sustainable farming


## 📱 Screenshots

<p align="center">
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.31.jpeg" alt="Dashboard" width="220" />
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.32.jpeg" alt="Crop Analysis" width="220" />
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.32%20(1).jpeg" alt="Predictions" width="220" />
</p>

<p align="center">
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.32%20(2).jpeg" alt="Analytics" width="220" />
  <img src="images/WhatsApp%20Image%202026-02-22%20at%2012.13.33.jpeg" alt="Admin Dashboard" width="220" />
</p>

---

## 🎯 Key Features

### For Farmers 👨‍🌾
- ✅ Personalized crop water requirement predictions
- ✅ 7-day soil moisture forecasting
- ✅ Farm and crop management
- ✅ Irrigation history tracking
- ✅ Real-time weather updates
- ✅ Multilingual AI assistant
- ✅ Data-driven recommendations

### For Administrators 👔
- ✅ Village water allocation optimization
- ✅ Reservoir monitoring and management
- ✅ Farmer registration and approval
- ✅ Usage analytics and reports
- ✅ Anomaly detection
- ✅ Decision support tools

---

## 🏗️ Architecture

JalSakhi is built as a modern microservices architecture:

```
┌─────────────────┐
│  Mobile App     │  React Native + Expo (TypeScript)
│  (Expo SDK 54)  │  Farmer & Admin dashboards
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │  Node.js + Express + MongoDB
│  (Node.js 18+)  │  Auth, Farms, Users, Logs
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ML Gateway     │  Node.js + Express
│  (Security)     │  API keys, Rate limiting
└────────┬────────┘
         │
    ┌────┴────┬──────────┬───────────┐
    ▼         ▼          ▼           ▼
┌────────┬────────┬──────────┬─────────┐
│ Crop   │ Soil   │ Village  │ AI Chat │
│ Water  │Moisture│Allocation│  (Groq) │
│FastAPI │FastAPI │ FastAPI  │ FastAPI │
└────────┴────────┴──────────┴─────────┘
```

**📚 Detailed Architecture:** See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+ and **pip**
- **MongoDB Atlas** account (or local MongoDB)
- **Expo CLI** (optional, recommended)

### Automated Setup

Run the setup script to install all dependencies:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/jalsakhi-ai-powered-precision-agriculture-platform.git
cd jalsakhi-ai-powered-precision-agriculture-platform

# Run setup script
chmod +x setup.sh
./setup.sh
```

### Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

#### 1. Backend Server

```bash
cd server
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

# Start server
npm start
```

#### 2. Mobile App

```bash
cd app
npm install

# Configure API URL
cp .env.example .env
# Edit .env with your backend URL

# Start app
npm start
```

#### 3. ML Services (Unified API)

```bash
cd ml-services/models
pip install -r unified_api/requirements.txt

# Train models (first time only)
cd Crop_Water_Model && python train.py && cd ..
cd soil_moisture_model && python train.py && cd ..

# Start unified ML API
uvicorn unified_api.main:app --host 0.0.0.0 --port 8000
```

#### 4. ML Gateway (Optional)

```bash
cd gateway
npm install

# Configure gateway
cp .env.example .env
# Edit .env with API keys and ML service URLs

# Start gateway
npm start
```

</details>

---

## 📂 Repository Structure

```
.
├── app/      # 📱 Mobile app (React Native + Expo)
│   ├── app/                # Screens and routes (Expo Router)
│   ├── components/         # Reusable UI components
│   ├── services/           # API clients
│   └── constants/          # Theme and configuration
│
├── server/                 # 🖥️ Backend API (Node.js + Express)
│   ├── controllers/        # Request handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   └── middleware/         # Auth, validation
│
├── ml-services/models/              # 🧠 ML Services (Python + FastAPI)
│   ├── Crop_Water_Model/   # Crop water prediction
│   ├── soil_moisture_model/# Soil moisture forecasting
│   ├── village_water_allocation/ # Allocation optimizer
│   └── unified_api/        # Single API for all models
│
├── gateway/                # 🛡️ ML Gateway (Node.js + Express)
│   └── server.js           # Proxy with security
│
├── chatbot/                # 💬 AI ml-services/chatbot (Python + Groq)
│   └── api.py              # ml-services/chatbot endpoints
│
├── docs/                   # 📚 Documentation
│   └── ARCHITECTURE.md     # System architecture
│
├── images/                 # 🖼️ Screenshots
├── setup.sh                # ⚙️ Automated setup script
├── CONTRIBUTING.md         # 🤝 Contribution guidelines
├── CODE_OF_CONDUCT.md      # 📜 Code of conduct
└── LICENSE                 # ⚖️ MIT License
```

---

