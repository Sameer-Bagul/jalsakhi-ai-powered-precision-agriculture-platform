import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

const api = axios.create({
    baseURL: `${API_URL}/api/auth`,
    withCredentials: true,
});

export default api;
