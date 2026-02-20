import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomButton } from '../../components/shared/CustomButton';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../../services/auth';

export default function LoginScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const role = (params.role as 'FARMER' | 'ADMIN') || 'FARMER';

    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpStep, setOtpStep] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleSendOTP = async () => {
        if (phone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
            return;
        }

        setLoading(true);
        try {
            await AuthService.sendOtp(phone);
            setOtpStep(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length < 6) {
            Alert.alert('Invalid OTP', 'Enter 6 digit OTP');
            return;
        }

        setLoading(true);
        try {
            const result = await AuthService.verifyOtp(phone, otpString, role);
            if (result.success) {
                if (role === 'FARMER') {
                    router.replace('/farmer/dashboard');
                } else {
                    router.replace('/admin/dashboard');
                }
            } else {
                Alert.alert('Error', 'Invalid OTP. Try 123456');
            }
        } catch (error) {
            Alert.alert('Error', 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
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
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>
                            Login to your <Text style={{ fontWeight: 'bold', color: Theme.colors.primary }}>
                                {role === 'FARMER' ? 'Farmer' : 'Admin'}
                            </Text> account
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {!otpStep ? (
                            <>
                                <Text style={styles.label}>Mobile Number</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.prefix}>+91</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter mobile number"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        value={phone}
                                        onChangeText={setPhone}
                                    />
                                </View>
                                <CustomButton
                                    title="Get OTP"
                                    onPress={handleSendOTP}
                                    loading={loading}
                                    style={styles.button}
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.label}>Enter OTP Sent to {phone}</Text>
                                <View style={styles.otpRow}>
                                    {otp.map((digit, index) => (
                                        <TextInput
                                            key={index}
                                            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            value={digit}
                                            onChangeText={(text) => handleOtpChange(text, index)}
                                        />
                                    ))}
                                </View>
                                <CustomButton
                                    title="Verify & Login"
                                    onPress={handleVerifyOTP}
                                    loading={loading}
                                    style={styles.button}
                                />
                                <TouchableOpacity onPress={() => setOtpStep(false)} style={styles.linkBtn}>
                                    <Text style={styles.linkText}>Change Mobile Number</Text>
                                </TouchableOpacity>
                            </>
                        )}
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
        backgroundColor: 'white',
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
        fontSize: 28,
        fontWeight: 'bold',
        color: Theme.colors.forest,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.moss,
    },
    form: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 24,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 24,
    },
    prefix: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.primary,
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        marginTop: 8,
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    otpBox: {
        width: 44,
        height: 52,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Theme.colors.border,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '800',
        color: Theme.colors.primary,
    },
    otpBoxFilled: {
        borderColor: Theme.colors.primary,
        backgroundColor: Theme.colors.primaryPale,
    },
    linkBtn: {
        marginTop: 16,
        alignItems: 'center',
    },
    linkText: {
        color: Theme.colors.primary,
        fontWeight: '600',
    },
});
