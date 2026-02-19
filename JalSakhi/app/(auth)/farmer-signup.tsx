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

    // Form State
    const [fullName, setFullName] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [village, setVillage] = useState('');
    const [landSize, setLandSize] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [mobile, setMobile] = useState('');

    // OTP State
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleRegister = async () => {
        console.log('Registering farmer...', { fullName, state, district, village, landSize, aadhar, mobile });

        // Validation - simplified for testing
        if (!fullName || !mobile) {
            Alert.alert('Missing Fields', 'Please fill at least Name and Mobile for testing.');
            return;
        }

        /* 
        // Strict validation temporarily commented out for easier testing
        if (!state || !district || !village || !landSize) {
            Alert.alert('Missing Fields', 'Please fill all the details.');
            return;
        }
        if (aadhar.length !== 12) {
            Alert.alert('Invalid Aadhar', 'Aadhar number must be 12 digits.');
            return;
        }
        */
        if (mobile.length !== 10) {
            Alert.alert('Invalid Mobile', 'Mobile number must be 10 digits.');
            return;
        }

        setLoading(true);
        try {
            console.log('Sending OTP...');
            await AuthService.sendOtp(mobile);
            console.log('OTP Sent, switching to OTP step');
            setStep('OTP');
        } catch (error) {
            console.error('OTP Error:', error);
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
            // Passing 'FARMER' role and Aadhar for registration mock
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

                {/* Header */}
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
                                icon={<MaterialIcons name="fingerprint" size={20} color={Theme.colors.textMuted} />}
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
                                icon={<MaterialIcons name="landscape" size={20} color={Theme.colors.textMuted} />}
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
        backgroundColor: Theme.colors.primary,
        padding: 20,
        paddingVertical: 24,
        flexDirection: 'row',
        alignItems: 'center',
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
        padding: 20,
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.forest,
        marginTop: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
        paddingBottom: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.textMuted,
        marginBottom: 8,
        marginTop: 4,
    },
    genderRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
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
        backgroundColor: Theme.colors.primaryPale,
        borderColor: Theme.colors.primary,
    },
    genderText: {
        color: Theme.colors.textMuted,
        fontWeight: '600',
    },
    genderTextActive: {
        color: Theme.colors.primary,
        fontWeight: 'bold',
    },
    prefix: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.primary,
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
        marginTop: 40,
    },
    otpTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Theme.colors.forest,
        marginBottom: 8,
    },
    otpSub: {
        color: Theme.colors.textMuted,
        marginBottom: 32,
    },
    otpRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 32,
    },
    otpBox: {
        width: 45,
        height: 50,
        borderWidth: 2,
        borderColor: Theme.colors.border,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
    otpBoxFilled: {
        borderColor: Theme.colors.primary,
        backgroundColor: Theme.colors.primaryPale,
    },
    changeMobile: {
        marginTop: 20,
    },
    linkText: {
        color: Theme.colors.primary,
        fontWeight: '600',
    },
});
