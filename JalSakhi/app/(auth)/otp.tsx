import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomButton } from '../../components/shared/CustomButton';
import { Logger } from '../../utils/Logger';

export default function OTPScreen() {
    const router = useRouter();
    const [otp, setOtp] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleVerify = () => {
        if (otp.length < 6) return;

        setLoading(true);
        Logger.info('OTPScreen', 'Verifying OTP...');

        // Simulate verification
        setTimeout(() => {
            setLoading(false);
            // In a real app, we check the previously selected role
            router.replace('/(farmer)');
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Verify OTP</Text>
                <Text style={styles.subtitle}>Enter the 6-digit code sent to your phone</Text>
            </View>

            <View style={styles.otpContainer}>
                <TextInput
                    style={[styles.otpInput, { letterSpacing: 10 }]}
                    placeholder="000 000"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                    autoFocus
                />
            </View>

            <Text style={styles.resendText}>
                Didn't receive code? <Text style={styles.resendLink}>Resend in 00:30</Text>
            </Text>

            <View style={styles.footer}>
                <CustomButton
                    title="Verify"
                    onPress={handleVerify}
                    loading={loading}
                    disabled={otp.length < 6}
                    size="lg"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        padding: Theme.spacing.lg,
    },
    header: {
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Theme.colors.forest,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.moss,
        marginTop: 8,
    },
    otpContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    otpInput: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Theme.colors.forest,
        textAlign: 'center',
        width: '80%',
        padding: 10,
        backgroundColor: Theme.colors.dew,
        borderRadius: Theme.roundness.md,
    },
    resendText: {
        textAlign: 'center',
        color: Theme.colors.moss,
        fontSize: 14,
    },
    resendLink: {
        color: Theme.colors.emerald,
        fontWeight: '600',
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
});
