import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, StatusBar, TextInput, Animated, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../constants/JalSakhiTheme';
import { LanguageSelector } from '../components/LanguageSelector';
import { AuthService } from '../services/auth';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Logger } from '../utils/Logger';

export default function Index() {
    const router = useRouter();

    // State
    const [splashLoading, setSplashLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<'FARMER' | 'ADMIN'>('FARMER');

    // Animation
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    // Splash Effect
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            })
        ]).start();

        const timer = setTimeout(() => {
            setSplashLoading(false);
        }, 3000); // Reduced splash time for better UX

        return () => clearTimeout(timer);
    }, []);

    const handleNewUser = () => {
        if (selectedRole === 'FARMER') {
            router.push('/(auth)/farmer-signup');
        } else {
            router.push('/(auth)/admin-signup');
        }
    };

    const handleOldUser = () => {
        // Pass the selected role to the login screen params if possible, 
        // or just navigate and let user select there/auto-select.
        router.push({ pathname: '/(auth)/login', params: { role: selectedRole } });
    };

    // Render Splash Screen
    if (splashLoading) {
        return (
            <View style={styles.splashContainer}>
                <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary} />
                <LinearGradient
                    colors={['#052e16', '#14532d', '#166534', '#15803d']}
                    style={styles.splashGradient}
                >
                    <View style={styles.splashBlobTop} />
                    <View style={styles.splashBlobBottom} />

                    <Animated.View style={[styles.splashContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.splashLogoContainer}>
                            <Image
                                source={require('../assets/images/logo.png')}
                                style={styles.splashLogo}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.splashTitle}>Jalसखी</Text>

                        <View style={styles.splashLoader}>
                            <View style={styles.splashLoaderFill} />
                        </View>

                        <Text style={styles.splashVersion}>v1.0.0</Text>
                    </Animated.View>
                </LinearGradient>
            </View>
        );
    }

    // Render Landing Screen
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={styles.headerLogoLarge}
                        />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Welcome to Jalसखी</Text>
                        </View>
                    </View>
                    <Text style={styles.headerSubtitle}>Choose your role to continue</Text>
                </View>

                {/* Role Cards */}
                <View style={styles.cardsContainer}>
                    <TouchableOpacity
                        style={[styles.roleCard, selectedRole === 'FARMER' && styles.roleCardActive]}
                        onPress={() => setSelectedRole('FARMER')}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.roleIconContainer, selectedRole === 'FARMER' && styles.roleIconActive]}>
                            <MaterialIcons name="agriculture" size={48} color={selectedRole === 'FARMER' ? 'white' : Theme.colors.primary} />
                        </View>
                        <Text style={[styles.roleTitle, selectedRole === 'FARMER' && styles.roleTitleActive]}>Farmer</Text>
                        <Text style={[styles.roleDesc, selectedRole === 'FARMER' && styles.roleDescActive]}>
                            Manage crops & water
                        </Text>
                        {selectedRole === 'FARMER' && (
                            <View style={styles.checkIcon}>
                                <Feather name="check-circle" size={24} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.roleCard, selectedRole === 'ADMIN' && styles.roleCardActive]}
                        onPress={() => setSelectedRole('ADMIN')}
                        activeOpacity={0.9}
                    >
                        <View style={[styles.roleIconContainer, selectedRole === 'ADMIN' && styles.roleIconActive]}>
                            <MaterialIcons name="admin-panel-settings" size={48} color={selectedRole === 'ADMIN' ? 'white' : Theme.colors.primary} />
                        </View>
                        <Text style={[styles.roleTitle, selectedRole === 'ADMIN' && styles.roleTitleActive]}>Admin</Text>
                        <Text style={[styles.roleDesc, selectedRole === 'ADMIN' && styles.roleDescActive]}>
                            Village administration
                        </Text>
                        {selectedRole === 'ADMIN' && (
                            <View style={styles.checkIcon}>
                                <Feather name="check-circle" size={24} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={handleNewUser}>
                        <Text style={styles.btnText}>New User Sign Up</Text>
                        <Feather name="arrow-right" size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnSecondary} onPress={handleOldUser}>
                        <Text style={styles.btnTextSecondary}>Old User Login</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Empowering Villages, saving Water</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bg,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    // Splash Styles
    splashContainer: {
        flex: 1,
    },
    splashGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    splashContent: {
        alignItems: 'center',
        padding: 20,
    },
    splashLogoContainer: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        borderRadius: 100,
        backgroundColor: '#FFFFFF',
        elevation: 10,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    splashLogo: {
        width: 140,
        height: 140,
    },
    splashTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    splashLoader: {
        width: 120,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        marginTop: 40,
        overflow: 'hidden',
    },
    splashLoaderFill: {
        width: '40%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    splashVersion: {
        position: 'absolute',
        bottom: -100,
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    splashBlobTop: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255,255,255,0.1)',
        top: -60,
        right: -80,
    },
    splashBlobBottom: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        bottom: 40,
        left: -50,
    },

    // Landing Page Styles
    header: {
        marginTop: 40,
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 8,
    },
    headerLogoLarge: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Theme.colors.forest,
        textAlign: 'left',
    },
    headerTitleHighlight: {
        fontSize: 32,
        fontWeight: '900',
        color: Theme.colors.primary,
        textAlign: 'left',
        marginTop: -4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: Theme.colors.moss,
        textAlign: 'left',
        paddingLeft: 8,
    },
    cardsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 16,
        marginBottom: 40,
    },
    roleCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        position: 'relative',
        height: 200,
        justifyContent: 'center',
    },
    roleCardActive: {
        borderColor: Theme.colors.primary,
        backgroundColor: '#f0fdf4',
    },
    roleIconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    roleIconActive: {
        backgroundColor: Theme.colors.primary,
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    roleTitleActive: {
        color: Theme.colors.primary,
    },
    roleDesc: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        textAlign: 'center',
    },
    roleDescActive: {
        color: Theme.colors.moss,
    },
    checkIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: Theme.colors.primary,
        borderRadius: 12,
    },
    actionsContainer: {
        paddingHorizontal: 24,
        gap: 16,
    },
    btnPrimary: {
        backgroundColor: Theme.colors.primary,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    btnSecondary: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Theme.colors.primary,
        backgroundColor: 'white',
    },
    btnTextSecondary: {
        color: Theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: Theme.colors.textMuted,
        fontStyle: 'italic',
    },
});
