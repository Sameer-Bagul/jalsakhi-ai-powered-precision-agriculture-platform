import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomInput } from '../../components/shared/CustomInput';
import { CustomButton } from '../../components/shared/CustomButton';
import { Logger } from '../../utils/Logger';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminSignupScreen() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        state: '',
        district: '',
        taluka: '',
        village: '',
    });

    const handleSignup = () => {
        Logger.info('AdminSignup', 'Sign up pressed', form);
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
                        <Text style={styles.title}>Admin Registration</Text>
                        <Text style={styles.subtitle}>Create your village admin account</Text>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            label="Full Name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChangeText={(text) => setForm({ ...form, name: text })}
                            leftIcon={<Feather name="user" size={20} color={Theme.colors.moss} />}
                        />

                        <CustomInput
                            label="Email Address"
                            placeholder="admin@village.com"
                            keyboardType="email-address"
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
                            leftIcon={<Feather name="mail" size={20} color={Theme.colors.moss} />}
                        />

                        <CustomInput
                            label="Mobile Number"
                            placeholder="10-digit number"
                            keyboardType="phone-pad"
                            value={form.mobile}
                            onChangeText={(text) => setForm({ ...form, mobile: text })}
                            leftIcon={<Feather name="phone" size={20} color={Theme.colors.moss} />}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <CustomInput
                                    label="State"
                                    placeholder="Maharashtra"
                                    value={form.state}
                                    onChangeText={(text) => setForm({ ...form, state: text })}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <CustomInput
                                    label="District / Jilha"
                                    placeholder="e.g. Pune"
                                    value={form.district}
                                    onChangeText={(text) => setForm({ ...form, district: text })}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <CustomInput
                                    label="Taluka"
                                    placeholder="Shirur"
                                    value={form.taluka}
                                    onChangeText={(text) => setForm({ ...form, taluka: text })}
                                />
                            </View>
                        </View>

                        <CustomInput
                            label="Village Name"
                            placeholder="Enter your village"
                            value={form.village}
                            onChangeText={(text) => setForm({ ...form, village: text })}
                            leftIcon={<MaterialIcons name="location-on" size={20} color={Theme.colors.moss} />}
                        />

                        <CustomButton
                            title="Create Account"
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
    row: {
        flexDirection: 'row',
    },
    submitButton: {
        marginTop: 24,
    },
});
