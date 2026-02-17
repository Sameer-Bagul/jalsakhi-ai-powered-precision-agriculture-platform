import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomButton } from '../../components/shared/CustomButton';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logger } from '../../utils/Logger';

const { width } = Dimensions.get('window');

export default function SoilMoistureForecastScreen() {
    const [loading, setLoading] = useState(false);
    const [showForecast, setShowForecast] = useState(false);

    // Mock data for the chart
    const forecastData = [55, 52, 48, 45, 42, 40, 38];
    const days = ['Today', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];

    const handleForecast = () => {
        setLoading(true);
        Logger.info('Model2', 'Fetching moisture forecast...');
        setTimeout(() => {
            setLoading(false);
            setShowForecast(true);
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Future Insights', headerShown: true }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={40} color="#1E88E5" />
                    <Text style={styles.title}>Soil Moisture Forecast</Text>
                    <Text style={styles.subtitle}>AI Model 2: Predicts moisture depletion over the next 7 days</Text>
                </View>

                <View style={styles.inputCard}>
                    <View style={styles.currentMoisture}>
                        <Text style={styles.currentLabel}>Current Live Moisture</Text>
                        <View style={styles.waterLevelContainer}>
                            <View style={[styles.waterLevel, { width: '55%' }]} />
                        </View>
                        <Text style={styles.currentValue}>55%</Text>
                    </View>
                    <CustomButton
                        title="Generate 7-Day Forecast"
                        onPress={handleForecast}
                        loading={loading}
                        type="primary"
                    />
                </View>

                {showForecast && (
                    <View style={styles.forecastContainer}>
                        <Text style={styles.sectionTitle}>Predicted Moisture Level (%)</Text>
                        <View style={styles.chart}>
                            {forecastData.map((val, i) => (
                                <View key={i} style={styles.chartCol}>
                                    <Text style={styles.chartVal}>{val}%</Text>
                                    <View style={[styles.bar, { height: val * 1.5, backgroundColor: val < 40 ? '#FF5252' : '#2D6A4F' }]} />
                                    <Text style={styles.chartDay}>{days[i]}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.alertBox}>
                            <MaterialIcons name="warning" size={24} color="#FFD600" />
                            <View style={styles.alertTextContent}>
                                <Text style={styles.alertTitle}>Critical Depletion Notice</Text>
                                <Text style={styles.alertDesc}>Moisture level will drop below 40% threshold by Sunday. Plan irrigation for Saturday morning.</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    scrollContent: { padding: 20 },
    header: { alignItems: 'center', marginBottom: 24, paddingTop: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: Theme.colors.forest, marginTop: 12 },
    subtitle: { fontSize: 13, color: Theme.colors.moss, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
    inputCard: { backgroundColor: Theme.colors.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: Theme.colors.border },
    currentMoisture: { alignItems: 'center', marginBottom: 24 },
    currentLabel: { fontSize: 14, fontWeight: '700', color: Theme.colors.moss, marginBottom: 12 },
    waterLevelContainer: { width: '100%', height: 12, backgroundColor: Theme.colors.dew, borderRadius: 6, overflow: 'hidden', marginBottom: 8 },
    waterLevel: { height: '100%', backgroundColor: '#1E88E5' },
    currentValue: { fontSize: 32, fontWeight: '900', color: '#1E88E5' },
    forecastContainer: { marginTop: 30 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: Theme.colors.forest, marginBottom: 20 },
    chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, paddingBottom: 20 },
    chartCol: { alignItems: 'center' },
    chartVal: { fontSize: 11, color: Theme.colors.moss, marginBottom: 8, fontWeight: 'bold' },
    bar: { width: 30, borderRadius: 6 },
    chartDay: { fontSize: 11, color: Theme.colors.forest, marginTop: 12, fontWeight: '600' },
    alertBox: { flexDirection: 'row', backgroundColor: '#FFF9C4', padding: 16, borderRadius: 16, marginTop: 24, borderWidth: 1, borderColor: '#FFF59D' },
    alertTextContent: { marginLeft: 12, flex: 1 },
    alertTitle: { fontSize: 14, fontWeight: 'bold', color: '#F57F17' },
    alertDesc: { fontSize: 12, color: '#616161', marginTop: 2, lineHeight: 18 },
});
