import { Logger } from '../utils/Logger';
import { DEMO_MODE } from '../constants/demoMode';
import { MockMLService } from './mockServices';

export interface CropPredictionInput {
    crop: string;
    soil: string;
    area: number; // in acres
    stage: string;
}

export interface SoilMoistureInput {
    sensorValue?: number; // 0-100 placeholder
    location?: string;
}

export const _RealMLService = {
    /**
     * Simulates the Random Forest Regressor for Crop Water Requirement
     * Logic based on crop type, soil, and area.
     */
    predictWaterRequirement: async (input: CropPredictionInput): Promise<number> => {
        Logger.info('MLService', `Predicting water for ${input.crop}`);

        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Basic heuristic logic for demo (since we can't run the .pkl file directly)
        let baseWater = 4000; // Liters per acre per irrigation

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
        }

        const soil = input.soil.toLowerCase();
        if (soil.includes('sandy')) {
            baseWater *= 1.25; // Sandy soil drains fast, needs more water
        } else if (soil.includes('clay') || soil.includes('black')) {
            baseWater *= 0.85; // Clay/Black soil holds water
        }

        // Adjust by stage
        const stage = input.stage.toLowerCase();
        if (stage.includes('sowing') || stage.includes('germination')) {
            baseWater *= 0.6;
        } else if (stage.includes('flowering') || stage.includes('fruiting')) {
            baseWater *= 1.2; // Critical stage
        }

        return Math.round(baseWater * input.area);
    },

    /**
     * Simulates the Time-Series Forecaster for Soil Moisture
     */
    forecastSoilMoisture: async (input: SoilMoistureInput): Promise<{ level: number, advice: string, trend: 'UP' | 'DOWN' | 'STABLE' }> => {
        Logger.info('MLService', `Forecasting soil moisture`);

        await new Promise(resolve => setTimeout(resolve, 1200));

        const level = input.sensorValue || Math.floor(Math.random() * 40) + 30; // Random 30-70% if no sensor

        let advice = "Moisture is adequate.";
        let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';

        if (level < 35) {
            advice = "Critical Level! Irrigation recommended immediately to prevent crop stress.";
            trend = 'DOWN';
        } else if (level < 50) {
            advice = "Moisture is slightly low. Plan irrigation within 24 hours.";
            trend = 'DOWN';
        } else if (level > 85) {
            advice = "Moisture is very high. Do NOT irrigate. Risk of waterlogging.";
            trend = 'UP';
        } else {
            advice = "Optimal moisture levels. No action needed.";
            trend = 'STABLE';
        }

        return { level, advice, trend };
    },

    /**
     * Simulates the Village-Level Water Allocation Optimization Model
     */
    optimizeAllocation: async (totalWater: number, demands: { id: string, req: number, priority: string }[]): Promise<any[]> => {
        Logger.info('MLService', `Optimizing allocation for ${totalWater}L`);

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simple logic: Prioritize High priority, then distribute rest
        let remaining = totalWater;
        const result = demands.map(d => {
            let allocated = 0;
            if (d.priority === 'High') {
                allocated = d.req; // Full allocation for high priority
            } else if (d.priority === 'Medium') {
                allocated = Math.floor(d.req * 0.8); // 80% for medium
            } else {
                allocated = Math.floor(d.req * 0.5); // 50% for low
            }

            // Adjust if running out
            if (remaining - allocated < 0) {
                allocated = remaining;
            }
            remaining -= allocated;

            return {
                id: d.id,
                allocated,
                efficiency: '98%',
                status: allocated >= d.req ? 'Full' : 'Partial'
            };
        });

        return result;
    }
}

// Use mock or real implementation based on DEMO_MODE
export const MLService = DEMO_MODE ? MockMLService : _RealMLService;
