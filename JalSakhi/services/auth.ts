import { Logger } from '../utils/Logger';

export type UserRole = 'FARMER' | 'ADMIN';

export interface UserProfile {
    id: string;
    phone: string;
    role: UserRole;
    name?: string;
    aadharNumber?: string;
    state?: string;
    district?: string;
    village?: string;
    farmSize?: string;
    gender?: string;
}

export const AuthService = {
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
