/**
 * DUMMY DATA STORE
 * All hardcoded realistic data used when DEMO_MODE = true.
 * Fully simulates Farm management, Auth, Weather, ML and Admin data.
 */

import { UserProfile } from './auth';
import { Farm, IrrigationLog } from './farms';
import { WeatherData } from './weather';

// ─── Demo Users ────────────────────────────────────────────────────────────────
export const DEMO_USERS: (UserProfile & { password: string })[] = [
    {
        id: 'demo-farmer-001',
        email: 'farmer@jalsakhi.com',
        password: 'demo123',
        name: 'Arya Patil',
        role: 'farmer',
        mobile: '9876543210',
        aadhar: '1234 5678 9012',
        gender: 'Female',
        state: 'Maharashtra',
        district: 'Nashik',
        taluka: 'Dindori',
        village: 'Vani',
        farmSize: '6.5',
        isAccountVerified: true,
    },
    {
        id: 'demo-admin-001',
        email: 'admin@jalsakhi.com',
        password: 'demo123',
        name: 'Suresh Kulkarni',
        role: 'admin',
        mobile: '9123456789',
        gender: 'Male',
        state: 'Maharashtra',
        district: 'Nashik',
        taluka: 'Dindori',
        village: 'Vani',
        isAccountVerified: true,
    },
];

// ─── Demo Farms ────────────────────────────────────────────────────────────────
export let DEMO_FARMS: Farm[] = [
    {
        id: 'farm-001',
        name: 'Patil Wheat Field',
        crop: 'Wheat',
        size: '3',
        status: 'Active',
    },
    {
        id: 'farm-002',
        name: 'Cotton Block A',
        crop: 'Cotton',
        size: '2',
        status: 'Active',
    },
    {
        id: 'farm-003',
        name: 'Paddy Plot - Vani',
        crop: 'Paddy',
        size: '1.5',
        status: 'Needs Irrigation',
    },
];

// ─── Demo Irrigation Logs ──────────────────────────────────────────────────────
export const DEMO_IRRIGATION: IrrigationLog[] = [
    { id: 'log-001', farmId: 'farm-001', date: '2026-02-19', amount: 4500, duration: '2 hrs', notes: 'Morning session' },
    { id: 'log-002', farmId: 'farm-001', date: '2026-02-17', amount: 4200, duration: '1.5 hrs', notes: 'Evening drip' },
    { id: 'log-003', farmId: 'farm-002', date: '2026-02-18', amount: 5200, duration: '2.5 hrs', notes: 'Full coverage' },
    { id: 'log-004', farmId: 'farm-002', date: '2026-02-15', amount: 4800, duration: '2 hrs', notes: '' },
    { id: 'log-005', farmId: 'farm-003', date: '2026-02-20', amount: 3600, duration: '1 hr', notes: 'Critical - soil very dry' },
    { id: 'log-006', farmId: 'farm-003', date: '2026-02-16', amount: 3400, duration: '1 hr', notes: '' },
];

// ─── Demo Weather ──────────────────────────────────────────────────────────────
export const DEMO_WEATHER: WeatherData = {
    temp: 34,
    condition: 'Clear',
    city: 'Nashik',
    icon: '01d',
};

// ─── Demo Soil Moisture (returned by ML forecast) ──────────────────────────────
export const DEMO_SOIL_MOISTURE = {
    level: 62,
    advice: 'Optimal moisture levels. No action needed.',
    trend: 'STABLE' as 'STABLE',
};

// ─── Admin: Farmer Allocation Rows ─────────────────────────────────────────────
export const DEMO_ALLOCATIONS = [
    { id: 'alloc-001', farmerName: 'Arya Patil', village: 'Vani', required: 12000, allocated: 12000, priority: 'High', status: 'Full', efficiency: '98%' },
    { id: 'alloc-002', farmerName: 'Ravi Shinde', village: 'Dindori', required: 8000, allocated: 6400, priority: 'Medium', status: 'Partial', efficiency: '80%' },
    { id: 'alloc-003', farmerName: 'Meera Jadhav', village: 'Ojhar', required: 9500, allocated: 9500, priority: 'High', status: 'Full', efficiency: '97%' },
    { id: 'alloc-004', farmerName: 'Deepak More', village: 'Pimpalgaon', required: 7000, allocated: 3500, priority: 'Low', status: 'Partial', efficiency: '64%' },
    { id: 'alloc-005', farmerName: 'Sunita Kamble', village: 'Vani', required: 11000, allocated: 8800, priority: 'Medium', status: 'Partial', efficiency: '80%' },
];

// ─── Admin: Reservoir Status ────────────────────────────────────────────────────
export const DEMO_RESERVOIR = {
    name: 'Gangapur Dam',
    capacityPercent: 85,
    currentVolume: 2400000, // litres
    totalCapacity: 2800000,
    lastUpdated: '2026-02-21 06:00',
    status: 'Healthy',
};

// ─── Admin: Anomalies ──────────────────────────────────────────────────────────
export const DEMO_ANOMALIES = [
    { id: 'anom-001', farmerId: 'Deepak More', description: 'Water usage 40% above baseline for 3 days', severity: 'High', date: '2026-02-20' },
    { id: 'anom-002', farmerId: 'Ravi Shinde', description: 'Irrigation logged at 2 AM — unusual timing', severity: 'Medium', date: '2026-02-19' },
    { id: 'anom-003', farmerId: 'Sunita Kamble', description: 'Soil moisture sensor reading 0 — possible fault', severity: 'Low', date: '2026-02-18' },
];

// ─── Notifications ─────────────────────────────────────────────────────────────
export const DEMO_NOTIFICATIONS = [
    { id: 'notif-001', title: 'Irrigation Alert 🚿', body: 'Your Paddy plot moisture is critically low. Consider irrigating today.', time: '2 hrs ago', read: false },
    { id: 'notif-002', title: 'Water Allocation Due 📋', body: 'Admin has released your water allocation for this week.', time: '1 day ago', read: true },
    { id: 'notif-003', title: 'Weather Update ⛅', body: 'Clear weather expected for next 3 days. Good time for irrigation.', time: '2 days ago', read: true },
];

// ─── Admin: Farmers List (for admin screens) ───────────────────────────────────
export const DEMO_FARMERS_LIST = [
    { id: 'farmer-001', name: 'Arya Patil', village: 'Vani', farms: 3, totalArea: '6.5 acres', status: 'Verified' },
    { id: 'farmer-002', name: 'Ravi Shinde', village: 'Dindori', farms: 2, totalArea: '4.2 acres', status: 'Verified' },
    { id: 'farmer-003', name: 'Meera Jadhav', village: 'Ojhar', farms: 1, totalArea: '3.8 acres', status: 'Verified' },
    { id: 'farmer-004', name: 'Deepak More', village: 'Pimpalgaon', farms: 2, totalArea: '5.1 acres', status: 'Pending' },
    { id: 'farmer-005', name: 'Sunita Kamble', village: 'Vani', farms: 1, totalArea: '2.9 acres', status: 'Verified' },
];

// ─── Admin: Usage Analytics ─────────────────────────────────────────────────────
export const DEMO_ANALYTICS = {
    totalWaterUsed: 48500,   // litres this week
    totalFarmers: 5,
    activeIrrigations: 2,
    savedWater: 7200,        // litres saved vs last week
    weeklyData: [6200, 7800, 5400, 9100, 7500, 6800, 5700],
    weeklyLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

// ─── Admin: Water Sources ──────────────────────────────────────────────────────
export const DEMO_WATER_SOURCES = [
    { id: 'src-001', name: 'Gangapur Dam', type: 'Reservoir', capacityPercent: 85, volume: '2.4 ML', status: 'Active' },
    { id: 'src-002', name: 'Borewell B-12', type: 'Borewell', capacityPercent: 70, volume: '0.8 ML', status: 'Active' },
    { id: 'src-003', name: 'Rainfall Harvest', type: 'Rainwater', capacityPercent: 45, volume: '0.3 ML', status: 'Limited' },
];

// ─── Admin: Approval Requests ─────────────────────────────────────────────────
export const DEMO_APPROVALS = [
    { id: 'appr-001', farmerName: 'Deepak More', request: 'Extra water allocation for summer crop', amount: 5000, date: '2026-02-20', status: 'Pending' },
    { id: 'appr-002', farmerName: 'Sunita Kamble', request: 'Emergency irrigation due to drought stress', amount: 3000, date: '2026-02-19', status: 'Pending' },
];
