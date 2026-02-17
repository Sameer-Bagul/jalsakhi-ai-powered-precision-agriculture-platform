import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomInput } from '../../components/shared/CustomInput';
import { CustomButton } from '../../components/shared/CustomButton';
import { Logger } from '../../utils/Logger';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FarmerSignupScreen() {
    const router = useRouter();
    const [form, setForm] = useState({
        mobile: '',
        state: '',
        district: '',
        village: '',
        farmSize: '',
    });

    const handleSignup = () => {
        Logger.info('FarmerSignup', 'Sign up pressed', form);
        // Simulate signup success
        router.replace('/(auth)/language');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Farmer Registration</Text>
                        <Text style={styles.subtitle}>Join JalSakhi to manage your irrigation</Text>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            label="Mobile Number"
                            placeholder="+91 XXXXX XXXXX"
                            keyboardType="phone-pad"
                            value={form.mobile}
                            onChangeText={(text) => setForm({ ...form, mobile: text })}
                            leftIcon={<Feather name="phone" size={20} color={Theme.colors.moss} />}
                        />

                        <CustomInput
                            label="State"
                            placeholder="e.g. Maharashtra"
                            value={form.state}
                            onChangeText={(text) => setForm({ ...form, state: text })}
                            leftIcon={<MaterialIcons name="map" size={20} color={Theme.colors.moss} />}
                        />

                        <CustomInput
                            label="District / Jilha"
                            placeholder="e.g. Pune"
                            value={form.district}
                            onChangeText={(text) => setForm({ ...form, district: text })}
                            leftIcon={<MaterialIcons name="location-city" size={20} color={Theme.colors.moss} />}
                        />

                        <CustomInput
                            label="Village"
                            placeholder="Enter your village"
                            value={form.village}
                            onChangeText={(text) => setForm({ ...form, village: text })}
                            leftIcon={<MaterialIcons name="location-on" size={20} color={Theme.colors.moss} />}
                        />

                        <CustomInput
                            label="Total Farm Size (Acres)"
                            placeholder="e.g. 5"
                            keyboardType="numeric"
                            value={form.farmSize}
                            onChangeText={(text) => setForm({ ...form, farmSize: text })}
                            leftIcon={<MaterialCommunityIcons name="texture-box" size={20} color={Theme.colors.moss} />}
                        />

                        <CustomButton
                            title="Register"
                            onPress={handleSignup}
                            style={styles.submitButton}
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
        padding: 24,
    },
    header: {
        marginTop: 20,
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
    form: {
        gap: 4,
    },
    submitButton: {
        marginTop: 24,
    },
});

import { MaterialCommunityIcons } from '@expo/vector-icons';
