import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomInput } from '../../components/shared/CustomInput';
import { CustomButton } from '../../components/shared/CustomButton';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../../services/auth';

export default function FarmerSignup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');

    const [fullName, setFullName] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [village, setVillage] = useState('');
    const [landSize, setLandSize] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [mobile, setMobile] = useState('');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleRegister = async () => {
        if (!fullName || !mobile) {
            Alert.alert('Missing Fields', 'Please fill at least Name and Mobile for testing.');
            return;
        }

        if (mobile.length !== 10) {
            Alert.alert('Invalid Mobile', 'Mobile number must be 10 digits.');
            return;
        }

        setLoading(true);
        try {
            await AuthService.sendOtp(mobile);
            setStep('OTP');
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length < 6) {
            Alert.alert('Invalid OTP', 'Please enter 6 digit OTP.');
            return;
        }

        setLoading(true);
        try {
            const result = await AuthService.verifyOtp(mobile, otpString, 'FARMER', aadhar);
            if (result.success) {
                Alert.alert('Success', 'Registration Successful!');
                router.replace('/farmer/dashboard');
            } else {
                Alert.alert('Error', 'Invalid OTP. Try 123456');
            }
        } catch (error) {
            Alert.alert('Error', 'Registration failed.');
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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Feather name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Farmer Registration</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {step === 'FORM' ? (
                        <View style={styles.formCard}>
                            <Text style={styles.sectionTitle}>Personal Details</Text>

                            <CustomInput label="Full Name" placeholder="Rajesh Kumar" value={fullName} onChangeText={setFullName} />

                            <CustomInput
                                label="Aadhar Number"
                                placeholder="1234 5678 9012"
                                keyboardType="number-pad"
                                maxLength={12}
                                value={aadhar}
                                onChangeText={setAadhar}
                                leftIcon={<MaterialIcons name="fingerprint" size={20} color={Theme.colors.textMuted} />}
                            />

                            <Text style={styles.label}>Gender</Text>
                            <View style={styles.genderRow}>
                                {['Male', 'Female', 'Other'].map((g) => (
                                    <TouchableOpacity
                                        key={g}
                                        style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                                        onPress={() => setGender(g as any)}
                                    >
                                        <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.sectionTitle}>Land & Location</Text>

                            <View style={styles.row}>
                                <View style={styles.halfInput}>
                                    <CustomInput label="State" placeholder="Maharashtra" value={state} onChangeText={setState} />
                                </View>
                                <View style={styles.halfInput}>
                                    <CustomInput label="District" placeholder="Pune" value={district} onChangeText={setDistrict} />
                                </View>
                            </View>

                            <CustomInput label="Village" placeholder="Indapur" value={village} onChangeText={setVillage} />

                            <CustomInput
                                label="Land Area (Acres)"
                                placeholder="5.2"
                                keyboardType="numeric"
                                value={landSize}
                                onChangeText={setLandSize}
                                leftIcon={<MaterialIcons name="landscape" size={20} color={Theme.colors.textMuted} />}
                            />

                            <Text style={styles.sectionTitle}>Contact</Text>

                            <CustomInput
                                label="Mobile Number"
                                placeholder="9876543210"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={mobile}
                                onChangeText={setMobile}
                                leftIcon={<Text style={styles.prefix}>+91</Text>}
                            />

                            <CustomButton
                                title="Verify & Register"
                                onPress={handleRegister}
                                loading={loading}
                                style={styles.submitBtn}
                            />
                        </View>
                    ) : (
                        <View style={styles.otpContainer}>
                            <Text style={styles.otpTitle}>Verify Mobile</Text>
                            <Text style={styles.otpSub}>Enter OTP sent to +91 {mobile}</Text>

                            <View style={styles.otpRow}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(text) => handleOtpChange(text, index)}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </View>

                            <CustomButton
                                title="Confirm Registration"
                                onPress={handleVerifyOtp}
                                loading={loading}
                            />

                            <TouchableOpacity onPress={() => setStep('FORM')} style={styles.changeMobile}>
                                <Text style={styles.linkText}>Edit Details</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingTop: 48,
        backgroundColor: Theme.colors.primary,
    },
    backBtn: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollContent: {
        padding: 24,
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 16,
        marginTop: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Theme.colors.text,
        marginBottom: 8,
    },
    genderRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    genderBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        alignItems: 'center',
    },
    genderBtnActive: {
        backgroundColor: Theme.colors.primary,
        borderColor: Theme.colors.primary,
    },
    genderText: {
        fontSize: 14,
        color: Theme.colors.textMuted,
        fontWeight: '500',
    },
    genderTextActive: {
        color: 'white',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfInput: {
        flex: 1,
    },
    prefix: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginRight: 8,
    },
    submitBtn: {
        marginTop: 24,
    },
    otpContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        elevation: 2,
    },
    otpTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 8,
    },
    otpSub: {
        fontSize: 14,
        color: Theme.colors.textMuted,
        marginBottom: 24,
    },
    otpRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    otpBox: {
        width: 48,
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    otpBoxFilled: {
        borderColor: Theme.colors.primary,
        backgroundColor: '#ecfdf5',
    },
    changeMobile: {
        marginTop: 16,
        padding: 8,
    },
    linkText: {
        color: Theme.colors.primary,
        fontWeight: '600',
    },
});
