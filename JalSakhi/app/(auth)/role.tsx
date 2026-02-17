import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Logger } from '../../utils/Logger';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    const handleRoleSelect = (role: 'farmer' | 'admin') => {
        Logger.info('WelcomeScreen', `Selected role: ${role}`);
        if (role === 'farmer') {
            router.push('/(auth)/farmer-signup');
        } else {
            router.push('/(auth)/admin-signup');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Theme.colors.forest, Theme.colors.emerald]}
                style={styles.background}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoBadge}>
                        <MaterialCommunityIcons name="water-check" size={40} color={Theme.colors.emerald} />
                    </View>
                    <Text style={styles.title}>Welcome to JalSakhi</Text>
                    <Text style={styles.subtitle}>Empowering communities through smart water management</Text>
                </View>

                <TouchableOpacity
                    style={styles.loginFooter}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Sign In</Text></Text>
                </TouchableOpacity>

                <View style={styles.selectionContainer}>
                    <Text style={styles.sectionLabel}>Identify yourself to continue</Text>

                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.8}
                        onPress={() => handleRoleSelect('farmer')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                            <MaterialCommunityIcons name="shovel" size={32} color={Theme.colors.emerald} />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.roleTitle}>I am a Farmer</Text>
                            <Text style={styles.roleDesc}>Monitor irrigation and farm health</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={Theme.colors.moss} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.8}
                        onPress={() => handleRoleSelect('admin')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <MaterialIcons name="admin-panel-settings" size={32} color="#1E88E5" />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.roleTitle}>Village Admin</Text>
                            <Text style={styles.roleDesc}>Manage village-wide water distribution</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={Theme.colors.moss} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Version 1.0.0 • Made with ❤️ for Farmers</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Dimensions.get('window').height * 0.45,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 80,
    },
    footer: {
        marginTop: 'auto',
        alignItems: 'center',
        paddingBottom: 20,
    },
    loginFooter: {
        marginTop: 24,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 15,
        color: Theme.colors.moss,
    },
    loginLink: {
        color: Theme.colors.emerald,
        fontWeight: 'bold',
    },
    version: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 60,
    },
    logoBadge: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#D8F3DC',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 22,
    },
    selectionContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.moss,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FBF9',
        padding: 18,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F4F0',
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardText: {
        flex: 1,
        marginLeft: 16,
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.forest,
    },
    roleDesc: {
        fontSize: 13,
        color: Theme.colors.moss,
        marginTop: 2,
    },
    footerText: {
        fontSize: 12,
        color: Theme.colors.moss,
    },
});
