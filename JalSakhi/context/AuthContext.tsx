import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, UserProfile, RegisterData, LoginData } from '../services/auth';
import { MockAuthService } from '../services/mockServices';
import { DEMO_MODE } from '../constants/demoMode';
import { TOKEN_KEY } from '../utils/api';
import { Logger } from '../utils/Logger';

// Use mock or real auth service based on DEMO_MODE flag
const ActiveAuthService = DEMO_MODE ? MockAuthService : AuthService;

interface AuthContextType {
    user: UserProfile | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
    login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
    verifyAccount: (otp: string) => Promise<{ success: boolean; message: string }>;
    sendVerifyOtp: () => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount, check for existing token and load user data
    useEffect(() => {
        const init = async () => {
            try {
                const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
                const authCheck = await ActiveAuthService.isAuthenticated();
                if (savedToken || authCheck.success) {
                    setToken(savedToken || 'demo-token');
                    if (authCheck.success) {
                        const userData = await ActiveAuthService.getUserData();
                        if (userData.success && userData.userData) {
                            setUser(userData.userData);
                        }
                    } else {
                        await AsyncStorage.removeItem(TOKEN_KEY);
                        setToken(null);
                    }
                }
            } catch (error) {
                Logger.error('AuthContext', 'Init error', error);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const register = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            const result = await ActiveAuthService.register(data);
            if (result.success && result.token) {
                setToken(result.token);
                const userData = await ActiveAuthService.getUserData();
                if (userData.success && userData.userData) {
                    setUser(userData.userData);
                }
            }
            return result;
        } catch (error: any) {
            Logger.error('AuthContext', 'Register error', error);
            return { success: false, message: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginData) => {
        setIsLoading(true);
        try {
            const result = await ActiveAuthService.login(data);
            if (result.success && result.token) {
                setToken(result.token);
                const userData = await ActiveAuthService.getUserData();
                if (userData.success && userData.userData) {
                    setUser(userData.userData);
                }
            }
            return result;
        } catch (error: any) {
            Logger.error('AuthContext', 'Login error', error);
            return { success: false, message: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const verifyAccount = async (otp: string) => {
        setIsLoading(true);
        try {
            const result = await ActiveAuthService.verifyAccount(otp);
            if (result.success) {
                await refreshUser();
            }
            return result;
        } catch (error: any) {
            Logger.error('AuthContext', 'Verify account error', error);
            return { success: false, message: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const sendVerifyOtp = async () => {
        try {
            return await ActiveAuthService.sendVerifyOtp();
        } catch (error: any) {
            Logger.error('AuthContext', 'Send OTP error', error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        await ActiveAuthService.logout();
        setUser(null);
        setToken(null);
    };

    const refreshUser = async () => {
        try {
            const userData = await ActiveAuthService.getUserData();
            if (userData.success && userData.userData) {
                setUser(userData.userData);
            }
        } catch (error) {
            Logger.error('AuthContext', 'Refresh user error', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token && !!user,
                register,
                login,
                verifyAccount,
                sendVerifyOtp,
                logout,
                refreshUser,
            }}
        >
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
