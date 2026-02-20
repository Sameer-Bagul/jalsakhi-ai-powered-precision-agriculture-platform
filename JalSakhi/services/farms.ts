import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logger } from '../utils/Logger';

export interface Farm {
  id: string;
  name: string;
  crop: string;
  size: string;
  status?: string;
  image?: string;
}

export interface IrrigationLog {
  id: string;
  farmId: string;
  date: string; // ISO
  amount: number; // liters
  duration?: string;
  notes?: string;
}

const FARMS_KEY = 'JALSAKHI_FARMS_V1';
const IRRIGATION_KEY = 'JALSAKHI_IRRIGATION_V1';

export const FarmsService = {
  async list(): Promise<Farm[]> {
    try {
      const raw = await AsyncStorage.getItem(FARMS_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Farm[];
    } catch (e) {
      Logger.error('FarmsService', 'list', e);
      return [];
    }
  },

  async get(id: string): Promise<Farm | undefined> {
    const all = await FarmsService.list();
    return all.find((f) => f.id === id);
  },

  async create(farm: Farm): Promise<void> {
    const all = await FarmsService.list();
    all.unshift(farm);
    await AsyncStorage.setItem(FARMS_KEY, JSON.stringify(all));
  },

  async update(id: string, patch: Partial<Farm>): Promise<void> {
    const all = await FarmsService.list();
    const idx = all.findIndex((f) => f.id === id);
    if (idx === -1) return;
    all[idx] = { ...all[idx], ...patch };
    await AsyncStorage.setItem(FARMS_KEY, JSON.stringify(all));
  },

  async remove(id: string): Promise<void> {
    const all = await FarmsService.list();
    const filtered = all.filter((f) => f.id !== id);
    await AsyncStorage.setItem(FARMS_KEY, JSON.stringify(filtered));
  },

  // Irrigation logs
  async listIrrigation(farmId?: string): Promise<IrrigationLog[]> {
    try {
      const raw = await AsyncStorage.getItem(IRRIGATION_KEY);
      if (!raw) return [];
      const logs = JSON.parse(raw) as IrrigationLog[];
      return farmId ? logs.filter((l) => l.farmId === farmId) : logs;
    } catch (e) {
      Logger.error('FarmsService', 'listIrrigation', e);
      return [];
    }
  },

  async addIrrigation(log: IrrigationLog): Promise<void> {
    const all = await FarmsService.listIrrigation();
    all.unshift(log);
    await AsyncStorage.setItem(IRRIGATION_KEY, JSON.stringify(all));
  }
};
