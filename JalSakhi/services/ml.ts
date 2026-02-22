import api from '../utils/api';
import { Logger } from '../utils/Logger';

export interface CropPredictionInput {
    crop_type: string;
    soil_type: string;
    area_acre: number;
    temperature?: string;
    weather_condition?: string;
    region?: string;
}

export interface SoilMoistureInput {
    sensorValue?: number;
    location?: string;
    sm_history?: number[];
}

export const MLService = {
    /**
     * Calls the Random Forest Regressor via Azure Proxy
     */
    predictWaterRequirement: async (input: CropPredictionInput): Promise<number> => {
        Logger.info('MLService', `Predicting water for ${input.crop_type}`);

        try {
            const response = await api.post('/api/ai/crop-water', input);
            // Extract the result from the nested data.data structure returned by our proxy
            return response.data?.data?.prediction_mm_day || 0;
        } catch (error: any) {
            Logger.error('MLService', 'Crop water prediction failed', error);
            throw error;
        }
    },

    /**
     * Calls the Time-Series Forecaster via Azure Proxy
     */
    forecastSoilMoisture: async (input: SoilMoistureInput): Promise<{ level: number, advice: string, trend: 'UP' | 'DOWN' | 'STABLE' }> => {
        Logger.info('MLService', `Forecasting soil moisture`);

        try {
            // Map single sensorValue to expected object if needed
            const payload = input.sensorValue !== undefined ? {
                avg_pm1: 10, avg_pm2: 20, avg_pm3: 15,
                avg_am: input.sensorValue / 100, // Normalized
                avg_lum: 200, avg_temp: 28, avg_humd: 65, avg_pres: 101325
            } : input;

            const response = await api.post('/api/ai/soil-moisture', payload);
            const data = response.data?.data;

            // Map backend response to frontend format
            // Assuming backend returns { forecast: number[], advice: string, trend: string }
            return {
                level: data?.forecast?.[0] || data?.current_level || 0,
                advice: data?.advice || 'Monitor soil levels regularly.',
                trend: (data?.trend?.toUpperCase() as any) || 'STABLE'
            };
        } catch (error: any) {
            Logger.error('MLService', 'Soil moisture forecast failed', error);
            throw error;
        }
    },

    /**
     * Calls the Water Allocation Optimizer via Azure Proxy
     */
    optimizeAllocation: async (totalWater: number, farms: any[]): Promise<any[]> => {
        Logger.info('MLService', `Optimizing allocation for ${totalWater}L`);

        try {
            const response = await api.post('/api/ai/village-water', {
                total_available_water_liters: totalWater,
                farms: farms
            });
            return response.data?.data?.allocations || [];
        } catch (error: any) {
            Logger.error('MLService', 'Water allocation optimization failed', error);
            throw error;
        }
    }
}
