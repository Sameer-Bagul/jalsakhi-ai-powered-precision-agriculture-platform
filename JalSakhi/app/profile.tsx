import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '../constants/JalSakhiTheme';
import { useAuth } from '../context/AuthContext';
import { Logger } from '../utils/Logger';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { user: authUser, logout: authLogout } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
            { text: t('common.cancel'), style: 'cancel' },
            {
                text: t('profile.logout'),
                style: 'destructive',
                onPress: async () => {
                    await authLogout();
                    router.replace('/');
                }
            }
        ]);
    };

    const currentLanguage = i18n.language === 'mr' ? 'मराठी' : i18n.language === 'hi' ? 'हिन्दी' : 'English';

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('profile.myProfile')}</Text>
                <TouchableOpacity>
                    <Feather name="edit" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../assets/images/logo.png')} // using logo as avatar placeholder
                            style={styles.avatar}
                        />
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{authUser?.role?.toUpperCase() || 'USER'}</Text>
                        </View>
                    </View>

                    <Text style={styles.userName}>{authUser?.name || 'User'}</Text>
                    <Text style={styles.userLocation}>{authUser?.village && authUser?.district ? `${authUser.village}, ${authUser.district}` : (authUser?.village || authUser?.district || '')}</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Feather name="phone" size={16} color={Theme.colors.textMuted} />
                            <Text style={styles.infoText}>+91 {authUser?.mobile || 'N/A'}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoItem}>
                            <MaterialIcons name="fingerprint" size={16} color={Theme.colors.textMuted} />
                            <Text style={styles.infoText}>{t('signup.aadhar')}: {authUser?.aadhar || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('profile.appSettings')}</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
                                <Feather name="bell" size={20} color="#0284c7" />
                            </View>
                            <Text style={styles.settingText}>{t('profile.notifications')}</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#d1d5db', true: Theme.colors.primary }}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBox, { backgroundColor: '#f3e8ff' }]}>
                                <Feather name="moon" size={20} color="#9333ea" />
                            </View>
                            <Text style={styles.settingText}>{t('profile.darkMode')}</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#d1d5db', true: Theme.colors.primary }}
                        />
                    </View>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBox, { backgroundColor: '#ffedd5' }]}>
                                <Feather name="globe" size={20} color="#ea580c" />
                            </View>
                            <Text style={styles.settingText}>{t('profile.language')}</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.valueText}>{currentLanguage}</Text>
                            <Feather name="chevron-right" size={20} color={Theme.colors.textMuted} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('profile.support')}</Text>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBox, { backgroundColor: '#ecfccb' }]}>
                                <Feather name="help-circle" size={20} color="#65a30d" />
                            </View>
                            <Text style={styles.settingText}>{t('profile.helpFaq')}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color={Theme.colors.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
                                <Feather name="alert-circle" size={20} color="#dc2626" />
                            </View>
                            <Text style={styles.settingText}>{t('profile.reportIssue')}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color={Theme.colors.textMuted} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Feather name="log-out" size={20} color="#dc2626" />
                    <Text style={styles.logoutText}>{t('profile.logout')}</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>{t('profile.version')} 1.0.0</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bg,
    },
    header: {
        backgroundColor: Theme.colors.primary,
        padding: 20,
        paddingVertical: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollContent: {
        padding: 20,
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: Theme.colors.leaf,
    },
    roleBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'white',
    },
    roleText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    userLocation: {
        fontSize: 14,
        color: Theme.colors.textMuted,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.bg,
        padding: 12,
        borderRadius: 12,
        width: '100%',
        justifyContent: 'space-around',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        fontSize: 13,
        color: Theme.colors.text,
        fontWeight: '600',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: Theme.colors.border,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.forest,
        marginBottom: 16,
        marginLeft: 8,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingText: {
        fontSize: 15,
        color: Theme.colors.text,
        fontWeight: '500',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    valueText: {
        fontSize: 14,
        color: Theme.colors.textMuted,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fee2e2',
        padding: 16,
        borderRadius: 16,
        gap: 8,
        marginBottom: 24,
    },
    logoutText: {
        color: '#dc2626',
        fontWeight: 'bold',
        fontSize: 16,
    },
    versionText: {
        textAlign: 'center',
        color: Theme.colors.textMuted,
        fontSize: 12,
        marginBottom: 20,
    },
});
