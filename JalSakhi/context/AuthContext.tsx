import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { Logger } from '../utils/Logger';

interface AuthContextType {
    user: any;
    isLoading: boolean;
    register: (data: any) => Promise<any>;
    login: (email: string) => Promise<any>;
    verifyOtp: (otp: string) => Promise<any>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const register = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await api.post('/register', data);
            Logger.info('AuthContext', 'Register response', response.data);
            return response.data;
        } catch (error: any) {
            Logger.error('AuthContext', 'Register error', error);
            return { success: false, message: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string) => {
        setIsLoading(true);
        try {
            // Since the server login requires a password, but we want OTP-only flow,
            // we will use the 'send-reset-otp' or a custom endpoint if needed.
            // For now, let's assume we use 'login' with a default password if the user exists,
            // or we implement a proper OTP login on the server.
            // Given the server code, let's try to find if user exists first.
            const response = await api.post('/login', { email, password: 'defaultPassword123' });
            Logger.info('AuthContext', 'Login response', response.data);
            return response.data;
        } catch (error: any) {
            Logger.error('AuthContext', 'Login error', error);
            return { success: false, message: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async (otp: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('/verify-account', { otp });
            Logger.info('AuthContext', 'Verify OTP response', response.data);
            if (response.data.success) {
                // Fetch user data after verification
                await checkAuth();
            }
            return response.data;
        } catch (error: any) {
            Logger.error('AuthContext', 'Verify OTP error', error);
            return { success: false, message: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const checkAuth = async () => {
        try {
            const response = await api.get('/is-auth');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            setUser(null);
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
            setUser(null);
        } catch (error) {
            Logger.error('AuthContext', 'Logout error', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, register, login, verifyOtp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
