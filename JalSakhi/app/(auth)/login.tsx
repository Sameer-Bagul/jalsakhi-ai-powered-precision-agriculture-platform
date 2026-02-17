import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomInput } from '../../components/shared/CustomInput';
import { CustomButton } from '../../components/shared/CustomButton';
import { Logger } from '../../utils/Logger';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!email.includes('@')) return;

        setLoading(true);
        const result = await login(email);
        setLoading(false);

        if (result.success) {
            router.push('/(auth)/otp');
        } else {
            Alert.alert('Login Failed', result.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color={Theme.colors.forest} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome back</Text>
                        <Text style={styles.subtitle}>Sign in to your JalSakhi account</Text>
                    </View>

                    <View style={styles.roleSwitcher}>
                        <TouchableOpacity
                            style={[styles.roleTab, role === 'farmer' && styles.activeTab]}
                            onPress={() => setRole('farmer')}
                        >
                            <Text style={[styles.tabText, role === 'farmer' && styles.activeTabText]}>Farmer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleTab, role === 'admin' && styles.activeTab]}
                            onPress={() => setRole('admin')}
                        >
                            <Text style={[styles.tabText, role === 'admin' && styles.activeTabText]}>Admin</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            label="Email Address"
                            placeholder="your@email.com"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            leftIcon={<Feather name="mail" size={20} color={Theme.colors.moss} />}
                        />

                        <Text style={styles.infoText}>
                            We will send you an OTP (One Time Password) for verification.
                        </Text>

                        <CustomButton
                            title="Send OTP"
                            onPress={handleSendOTP}
                            loading={loading}
                            disabled={!email.includes('@')}
                            size="lg"
                            style={styles.button}
                            icon={<Feather name="shield" size={18} color="white" />}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Theme.colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Theme.colors.forest,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.moss,
        marginTop: 8,
    },
    roleSwitcher: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.dew,
        padding: 4,
        borderRadius: 12,
        marginBottom: 32,
    },
    roleTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.moss,
    },
    activeTabText: {
        color: Theme.colors.emerald,
    },
    form: {
        flex: 1,
    },
    prefix: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.colors.forest,
        marginRight: 4,
    },
    infoText: {
        fontSize: 13,
        color: Theme.colors.moss,
        textAlign: 'center',
        marginVertical: 24,
        paddingHorizontal: 20,
        lineHeight: 20,
    },
    button: {
        marginTop: 8,
    },
});
