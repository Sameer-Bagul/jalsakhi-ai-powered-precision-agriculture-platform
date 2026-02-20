import React from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomButton } from '../../components/shared/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function OTPScreen() {
    const router = useRouter();
    const { verifyAccount, sendVerifyOtp } = useAuth();
    const [otp, setOtp] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleVerify = async () => {
        if (otp.length < 6) {
            Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP.');
            return;
        }
        setLoading(true);
        try {
            const result = await verifyAccount(otp);
            if (result.success) {
                Alert.alert('Verified', 'Your account has been verified!');
                router.replace('/farmer/dashboard');
            } else {
                Alert.alert('Error', result.message || 'Invalid OTP.');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const result = await sendVerifyOtp();
            if (result.success) {
                Alert.alert('Sent', 'A new OTP has been sent to your email.');
            } else {
                Alert.alert('Error', result.message || 'Failed to resend OTP.');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to resend OTP.');
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/images/background.jpeg')}
            style={styles.bg}
            imageStyle={{ opacity: 0.12 }}
        >
            <SafeAreaView style={styles.safe}>
                {/* Back */}
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={22} color={Theme.colors.text} />
                </TouchableOpacity>

                {/* Heading */}
                <Text style={styles.heading}>Verify</Text>
                <Text style={styles.heading2}>Your Email ✉️</Text>
                <Text style={styles.sub}>Enter the 6-digit code sent to your email</Text>

                {/* OTP Input */}
                <View style={styles.otpWrap}>
                    <TextInput
                        style={styles.otpInput}
                        placeholder="000000"
                        placeholderTextColor="rgba(0,0,0,0.15)"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otp}
                        onChangeText={setOtp}
                        autoFocus
                    />
                </View>

                {/* Resend */}
                <Text style={styles.resendText}>
                    Didn't receive code?{' '}
                    <Text style={styles.resendLink} onPress={handleResend}>Resend OTP</Text>
                </Text>

                {/* Verify */}
                <View style={styles.bottom}>
                    <CustomButton
                        title="Verify Account"
                        onPress={handleVerify}
                        loading={loading}
                        disabled={otp.length < 6}
                        size="lg"
                    />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, backgroundColor: '#fff', overflow: 'hidden' as const },
    safe: { flex: 1, paddingHorizontal: 28, paddingTop: 20 },
    backBtn: {
        width: 42, height: 42, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.75)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 36,
        ...Theme.shadows.soft,
    },
    heading: {
        fontSize: 38, fontWeight: '900', color: Theme.colors.text,
        letterSpacing: -1, lineHeight: 44,
    },
    heading2: {
        fontSize: 38, fontWeight: '900', color: Theme.colors.primary,
        letterSpacing: -1, lineHeight: 44, marginBottom: 8,
    },
    sub: {
        fontSize: 16, color: Theme.colors.textMuted,
        lineHeight: 22, marginBottom: 40,
    },
    otpWrap: {
        alignItems: 'center', marginBottom: 24,
    },
    otpInput: {
        fontSize: 36, fontWeight: '800',
        color: Theme.colors.text, textAlign: 'center',
        letterSpacing: 16, width: '80%',
        paddingVertical: 16,
        borderBottomWidth: 3, borderBottomColor: 'rgba(5,150,105,0.15)',
    },
    resendText: {
        textAlign: 'center', color: Theme.colors.textMuted, fontSize: 14,
    },
    resendLink: {
        color: Theme.colors.primary, fontWeight: '800',
    },
    bottom: {
        flex: 1, justifyContent: 'flex-end', paddingBottom: 24,
    },
});
