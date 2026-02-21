/**
 * MOCK SERVICES
 * Drop-in replacements for real services when DEMO_MODE = true.
 * Every function mirrors the exact same signature as its real counterpart.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    DEMO_USERS, DEMO_FARMS, DEMO_IRRIGATION,
    DEMO_WEATHER, DEMO_SOIL_MOISTURE,
} from './dummyData';
import { RegisterData, LoginData, UserProfile } from './auth';
import { Farm, IrrigationLog } from './farms';
import { CropPredictionInput, SoilMoistureInput } from './ml';

const DEMO_TOKEN = 'demo-token-jalsakhi-2026';
const DEMO_USER_ID_KEY = '__demo_user_id__';

// ─── In-memory farm store (so add/edit/delete works live in the session) ────────
let _farms = [...DEMO_FARMS];
let _irr = [...DEMO_IRRIGATION];
let _nextFarmId = 10;
let _nextIrrId = 20;

// ─── Mock Auth Service ──────────────────────────────────────────────────────────
export const MockAuthService = {
    register: async (data: RegisterData): Promise<{ success: boolean; message: string; token?: string; userId?: string }> => {
        await delay(800);
        // In demo mode any registration "succeeds" and creates a farmer session
        const demoUser = DEMO_USERS.find(u => u.role === data.role) || DEMO_USERS[0];
        await AsyncStorage.setItem(DEMO_USER_ID_KEY, demoUser.id);
        return { success: true, message: 'Registered successfully (Demo)', token: DEMO_TOKEN, userId: demoUser.id };
    },

    login: async (data: LoginData): Promise<{ success: boolean; message: string; token?: string; userId?: string }> => {
        await delay(600);
        const user = DEMO_USERS.find(u =>
            u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
        );
        if (user) {
            await AsyncStorage.setItem(DEMO_USER_ID_KEY, user.id);
            return { success: true, message: 'Login successful', token: DEMO_TOKEN, userId: user.id };
        }
        return { success: false, message: 'Invalid credentials. Use farmer@jalsakhi.com or admin@jalsakhi.com with password: demo123' };
    },

    sendVerifyOtp: async (): Promise<{ success: boolean; message: string }> => {
        await delay(400);
        return { success: true, message: 'OTP sent (Demo: use any 6-digit code)' };
    },

    verifyAccount: async (_otp: string): Promise<{ success: boolean; message: string }> => {
        await delay(500);
        return { success: true, message: 'Account verified (Demo)' };
    },

    // Used by admin-signup: accepts any 6-digit OTP in demo
    verifyOtp: async (_mobile: string, _otp: string, _role: string, _aadhar: string): Promise<{ success: boolean; message: string }> => {
        await delay(500);
        return { success: true, message: 'OTP verified (Demo)' };
    },

    sendResetOtp: async (_email: string): Promise<{ success: boolean; message: string }> => {
        await delay(500);
        return { success: true, message: 'Reset OTP sent (Demo)' };
    },

    resetPassword: async (_email: string, _otp: string, _newPassword: string): Promise<{ success: boolean; message: string }> => {
        await delay(500);
        return { success: true, message: 'Password reset successful (Demo)' };
    },

    isAuthenticated: async (): Promise<{ success: boolean }> => {
        const saved = await AsyncStorage.getItem(DEMO_USER_ID_KEY);
        return { success: !!saved };
    },

    getUserData: async (): Promise<{ success: boolean; userData?: UserProfile }> => {
        const userId = await AsyncStorage.getItem(DEMO_USER_ID_KEY);
        const user = DEMO_USERS.find(u => u.id === userId) || DEMO_USERS[0];
        const { password: _pw, ...userData } = user;
        return { success: true, userData: userData as UserProfile };
    },

    logout: async (): Promise<void> => {
        await AsyncStorage.removeItem(DEMO_USER_ID_KEY);
    },
};

// ─── Mock Farms Service ─────────────────────────────────────────────────────────
export const MockFarmsService = {
    list: async (): Promise<Farm[]> => {
        await delay(300);
        return [..._farms];
    },

    get: async (id: string): Promise<Farm | undefined> => {
        await delay(200);
        return _farms.find(f => f.id === id);
    },

    create: async (farm: Omit<Farm, 'id'>): Promise<Farm | null> => {
        await delay(400);
        const newFarm: Farm = { ...farm, id: `farm-${_nextFarmId++}` };
        _farms.push(newFarm);
        return newFarm;
    },

    update: async (id: string, patch: Partial<Farm>): Promise<void> => {
        await delay(300);
        const idx = _farms.findIndex(f => f.id === id);
        if (idx !== -1) {
            _farms[idx] = { ..._farms[idx], ...patch };
        }
    },

    remove: async (id: string): Promise<void> => {
        await delay(300);
        _farms = _farms.filter(f => f.id !== id);
    },

    listIrrigation: async (farmId: string): Promise<IrrigationLog[]> => {
        await delay(300);
        return _irr.filter(l => l.farmId === farmId);
    },

    addIrrigation: async (log: IrrigationLog): Promise<void> => {
        await delay(400);
        _irr.push({ ...log, id: `log-${_nextIrrId++}` });
    },
};

// ─── Mock Weather Service ───────────────────────────────────────────────────────
export const MockWeatherService = {
    getLocation: async (): Promise<{ lat: number; lon: number } | null> => {
        return { lat: 20.01, lon: 73.76 }; // Nashik coordinates
    },

    getCurrentWeather: async (_lat: number, _lon: number) => {
        await delay(400);
        return { ...DEMO_WEATHER };
    },
};

// ─── Mock ML Service ────────────────────────────────────────────────────────────
export const MockMLService = {
    /**
     * Runs the SAME heuristic logic as the real MLService — no network needed.
     * This IS your ML model simulation (Random Forest Regressor logic).
     */
    predictWaterRequirement: async (input: CropPredictionInput): Promise<number> => {
        // Simulated processing delay (makes it feel like ML is running)
        await delay(1500);

        let baseWater = 4000; // Litres per acre per irrigation

        const crop = input.crop.toLowerCase();
        if (crop.includes('rice') || crop.includes('paddy')) {
            baseWater = 8000;
        } else if (crop.includes('sugarcane')) {
            baseWater = 7000;
        } else if (crop.includes('wheat')) {
            baseWater = 4500;
        } else if (crop.includes('cotton')) {
            baseWater = 5000;
        } else if (crop.includes('maize') || crop.includes('corn')) {
            baseWater = 3500;
        } else if (crop.includes('soybean')) {
            baseWater = 3800;
        } else if (crop.includes('groundnut') || crop.includes('peanut')) {
            baseWater = 3200;
        }

        const soil = input.soil.toLowerCase();
        if (soil.includes('sandy')) {
            baseWater *= 1.25;
        } else if (soil.includes('clay') || soil.includes('black')) {
            baseWater *= 0.85;
        } else if (soil.includes('loam')) {
            baseWater *= 1.0;
        } else if (soil.includes('alluvial')) {
            baseWater *= 0.9;
        }

        const stage = input.stage.toLowerCase();
        if (stage.includes('sowing') || stage.includes('germination')) {
            baseWater *= 0.6;
        } else if (stage.includes('vegetative')) {
            baseWater *= 0.85;
        } else if (stage.includes('flowering') || stage.includes('fruiting')) {
            baseWater *= 1.2; // Critical water demand stage
        } else if (stage.includes('harvest') || stage.includes('ripening')) {
            baseWater *= 0.5;
        }

        return Math.round(baseWater * input.area);
    },

    /**
     * Soil Moisture Forecaster (Time-Series simulation).
     */
    forecastSoilMoisture: async (input: SoilMoistureInput): Promise<{ level: number; advice: string; trend: 'UP' | 'DOWN' | 'STABLE' }> => {
        await delay(1200);

        // Use sensor value if provided, otherwise return the demo constant
        const level = input.sensorValue ?? DEMO_SOIL_MOISTURE.level;
        let advice = 'Moisture is adequate.';
        let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';

        if (level < 35) {
            advice = 'Critical Level! Irrigation recommended immediately to prevent crop stress.';
            trend = 'DOWN';
        } else if (level < 50) {
            advice = 'Moisture is slightly low. Plan irrigation within 24 hours.';
            trend = 'DOWN';
        } else if (level > 85) {
            advice = 'Moisture is very high. Do NOT irrigate. Risk of waterlogging.';
            trend = 'UP';
        } else {
            advice = 'Optimal moisture levels. No action needed.';
            trend = 'STABLE';
        }

        return { level, advice, trend };
    },

    /**
     * Village-Level Water Allocation Optimizer.
     * (Already pure JS logic — no API needed in real app either)
     */
    optimizeAllocation: async (
        totalWater: number,
        demands: { id: string; req: number; priority: string }[]
    ): Promise<any[]> => {
        await delay(2000);

        let remaining = totalWater;
        return demands.map(d => {
            let allocated = 0;
            if (d.priority === 'High') {
                allocated = d.req;
            } else if (d.priority === 'Medium') {
                allocated = Math.floor(d.req * 0.8);
            } else {
                allocated = Math.floor(d.req * 0.5);
            }
            if (remaining - allocated < 0) {
                allocated = remaining;
            }
            remaining -= allocated;
            return {
                id: d.id,
                allocated,
                efficiency: allocated >= d.req ? '98%' : `${Math.round((allocated / d.req) * 100)}%`,
                status: allocated >= d.req ? 'Full' : 'Partial',
            };
        });
    },
};

// ─── Helpers ────────────────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
