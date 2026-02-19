import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomButton } from '../../components/shared/CustomButton';
import { CustomInput } from '../../components/shared/CustomInput';
import { MLService } from '../../services/ml';

export default function SoilMoistureForecast() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ level: number, advice: string, trend: string } | null>(null);

    const [sensorValue, setSensorValue] = useState('');

    const handleForecast = async () => {
        setLoading(true);
        setResult(null);

        try {
            const val = sensorValue ? parseInt(sensorValue) : undefined;
            const forecast = await MLService.forecastSoilMoisture({ sensorValue: val });
            setResult(forecast);
        } catch (error) {
            Alert.alert('Error', 'Failed to forecast soil moisture.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Soil Moisture Forecast</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={[styles.infoCard, { backgroundColor: '#f3e8ff', borderColor: '#e9d5ff' }]}>
                    <Text style={[styles.infoText, { color: '#7e22ce' }]}>
                        Our <Text style={{ fontWeight: 'bold' }}>Time-Series Model</Text> analyzes historical data and current sensor readings to forecast soil moisture trends.
                    </Text>
                </View>

                {/* Input */}
                <View style={styles.formContainer}>
                    <CustomInput
                        label="Current Sensor Reading (Optional)"
                        placeholder="Leave empty to auto-detect"
                        value={sensorValue}
                        onChangeText={setSensorValue}
                        keyboardType="numeric"
                        leftIcon={<MaterialCommunityIcons name="leak" size={20} color={Theme.colors.textMuted} />}
                    />

                    <CustomButton
                        title="Analyze & Forecast"
                        onPress={handleForecast}
                        loading={loading}
                        style={{ marginTop: 8 }}
                    />
                </View>

                {/* Result */}
                {result && (
                    <View style={styles.resultContainer}>

                        {/* Gauge / Value */}
                        <View style={styles.gaugeCard}>
                            <Text style={styles.gaugeLabel}>Moisture Level</Text>
                            <View style={[styles.gaugeCircle, { borderColor: result.level < 40 ? Theme.colors.error : Theme.colors.success }]}>
                                <Text style={[styles.gaugeValue, { color: result.level < 40 ? Theme.colors.error : Theme.colors.success }]}>
                                    {result.level}%
                                </Text>
                            </View>
                            <View style={styles.trendBadge}>
                                <Feather
                                    name={result.trend === 'UP' ? 'trending-up' : result.trend === 'DOWN' ? 'trending-down' : 'minus'}
                                    size={16}
                                    color="white"
                                />
                                <Text style={styles.trendText}>{result.trend} TREND</Text>
                            </View>
                        </View>

                        {/* Advice */}
                        <View style={styles.adviceCard}>
                            <View style={styles.adviceHeader}>
                                <Feather name="info" size={20} color={Theme.colors.primary} />
                                <Text style={styles.adviceTitle}>Irrigation Advice</Text>
                            </View>
                            <Text style={styles.adviceText}>{result.advice}</Text>
                        </View>

                    </View>
                )}

            </ScrollView>
        </View>
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
        paddingTop: 40,
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
    infoCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
    },
    infoText: {
        lineHeight: 20,
        fontSize: 14,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 2,
    },
    resultContainer: {
        gap: 16,
    },
    gaugeCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 2,
    },
    gaugeLabel: {
        fontSize: 16,
        color: Theme.colors.textMuted,
        fontWeight: '600',
        marginBottom: 16,
    },
    gaugeCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    gaugeValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.textMuted,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    trendText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    adviceCard: {
        backgroundColor: '#f0fdf4',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    adviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    adviceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
    adviceText: {
        fontSize: 15,
        color: Theme.colors.forest,
        lineHeight: 22,
    },
});
