import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Android emulator, use 10.0.2.2 to reach host machine's localhost.
// For iOS simulator, localhost works directly.
// For physical devices, use your machine's LAN IP (e.g., 192.168.x.x).
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('JALSAKHI_TOKEN');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            // Silently fail — token may not be set yet
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('JALSAKHI_TOKEN');
            await AsyncStorage.removeItem('JALSAKHI_USER_ID');
        }
        return Promise.reject(error);
    }
);

export const TOKEN_KEY = 'JALSAKHI_TOKEN';
export const USER_ID_KEY = 'JALSAKHI_USER_ID';

export default api;
