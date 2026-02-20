import { Logger } from '../utils/Logger';
import api from '../utils/api';

export type UserRole = 'FARMER' | 'ADMIN';

export interface UserProfile {
    id: string;
    email: string;
    phone: string;
    role: UserRole;
    name?: string;
    village?: string;
    farmDetails?: {
        area: number;
        location: string;
    };
}

export interface SignupData {
    name: string;
    email: string;
    phone: string;
    role: 'FARMER' | 'ADMIN';
    village?: string;
    farmDetails?: {
        area: number;
        location: string;
    };
}

export interface OTPVerificationData {
    email: string;
    otp: string;
}

export interface LoginData {
    email: string;
    password?: string;
}

export const AuthService = {
    // Send OTP to email for signup
    sendSignupOTP: async (data: SignupData): Promise<any> => {
        Logger.info('AuthService', `Sending OTP to ${data.email}`);
        try {
            const response = await api.post('/auth/signup/send-otp', data);
            return response.data;
        } catch (error: any) {
            Logger.error('AuthService', 'Send OTP error', error);
            throw new Error(error.response?.data?.message || 'Failed to send OTP');
        }
    },

    // Verify OTP and complete signup
    verifySignupOTP: async (data: OTPVerificationData): Promise<any> => {
        Logger.info('AuthService', `Verifying OTP for ${data.email}`);
        try {
            const response = await api.post('/auth/signup/verify-otp', data);
            return response.data;
        } catch (error: any) {
            Logger.error('AuthService', 'Verify OTP error', error);
            throw new Error(error.response?.data?.message || 'Failed to verify OTP');
        }
    },

    // Resend OTP
    resendOTP: async (email: string): Promise<any> => {
        Logger.info('AuthService', `Resending OTP to ${email}`);
        try {
            const response = await api.post('/auth/resend-otp', { email });
            return response.data;
        } catch (error: any) {
            Logger.error('AuthService', 'Resend OTP error', error);
            throw new Error(error.response?.data?.message || 'Failed to resend OTP');
        }
    },

    // Login with email
    login: async (data: LoginData): Promise<any> => {
        Logger.info('AuthService', `Login for ${data.email}`);
        try {
            const response = await api.post('/auth/login', data);
            return response.data;
        } catch (error: any) {
            Logger.error('AuthService', 'Login error', error);
            throw new Error(error.response?.data?.message || 'Failed to login');
        }
    },

    sendOtp: async (phone: string): Promise<boolean> => {
        Logger.info('AuthService', `Sending OTP to ${phone}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1500);
        });
    },

    verifyOtp: async (phone: string, otp: string, role?: UserRole, aadhar?: string): Promise<{ success: boolean; token?: string; user?: UserProfile }> => {
        Logger.info('AuthService', `Verifying OTP ${otp} for ${phone} (Role: ${role}, Aadhar: ${aadhar})`);
        return new Promise((resolve) => {
            setTimeout(() => {
                if (otp === '123456') {
                    resolve({
                        success: true,
                        token: 'mock-jwt-token',
                        user: {
                            id: 'user-123',
                            phone,
                            role: role || 'FARMER',
                            name: 'Rajesh Kumar',
                            aadharNumber: aadhar || '1234 5678 9012',
                            state: 'Maharashtra',
                            district: 'Pune',
                            village: 'Indapur',
                            farmSize: '5',
                            gender: 'Male'
                        }
                    });
                } else {
                    resolve({ success: false });
                }
            }, 1000);
        });
    }
};
