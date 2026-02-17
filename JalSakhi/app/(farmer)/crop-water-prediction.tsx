import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomInput } from '../../components/shared/CustomInput';
import { CustomButton } from '../../components/shared/CustomButton';
import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logger } from '../../utils/Logger';

const GROWTH_STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Harvest'];

export default function CropWaterPredictionScreen() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | number>(null);
    const [form, setForm] = useState({
        cropType: 'Wheat',
        growthStage: 'Vegetative',
        soilMoisture: '35',
        temp: '28',
        humidity: '65',
    });

    const handlePredict = () => {
        setLoading(true);
        Logger.info('Model1', 'Predicting water requirement...', form);

        // Fake AI latency
        setTimeout(() => {
            setLoading(false);
            setResult(12.5); // Mocked result in mm
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'AI Recommendation', headerShown: true }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerCard}>
                    <MaterialCommunityIcons name="robot" size={40} color={Theme.colors.emerald} />
                    <Text style={styles.headerTitle}>Crop Water Predictor</Text>
                    <Text style={styles.headerDesc}>AI Model 1: Calculates precise irrigation needs for your crops</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Farm Inputs</Text>

                    <CustomInput
                        label="Crop Type"
                        value={form.cropType}
                        onChangeText={(t) => setForm({ ...form, cropType: t })}
                        leftIcon={<MaterialCommunityIcons name="corn" size={20} color={Theme.colors.moss} />}
                    />

                    <Text style={styles.label}>Growth Stage</Text>
                    <View style={styles.chipContainer}>
                        {GROWTH_STAGES.map(stage => (
                            <TouchableOpacity
                                key={stage}
                                style={[styles.chip, form.growthStage === stage && styles.activeChip]}
                                onPress={() => setForm({ ...form, growthStage: stage })}
                            >
                                <Text style={[styles.chipText, form.growthStage === stage && styles.activeChipText]}>{stage}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <CustomInput
                                label="Soil Moisture (%)"
                                keyboardType="numeric"
                                value={form.soilMoisture}
                                onChangeText={(t) => setForm({ ...form, soilMoisture: t })}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <CustomInput
                                label="Temp (°C)"
                                keyboardType="numeric"
                                value={form.temp}
                                onChangeText={(t) => setForm({ ...form, temp: t })}
                            />
                        </View>
                    </View>
                </View>

                <CustomButton
                    title="Calculate Requirement"
                    onPress={handlePredict}
                    loading={loading}
                    icon={<MaterialCommunityIcons name="calculator" size={20} color="white" />}
                    style={styles.predictButton}
                />

                {result !== null && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>Recommended Irrigation</Text>
                        <View style={styles.resultValueRow}>
                            <Text style={styles.resultValue}>{result}</Text>
                            <Text style={styles.resultUnit}>mm / day</Text>
                        </View>
                        <Text style={styles.resultHint}>Equal to approx. 4,500 Liters for your farm size</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    scrollContent: { padding: 20 },
    headerCard: {
        backgroundColor: Theme.colors.card, padding: 24, borderRadius: 24,
        alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: Theme.colors.border,
    },
    headerTitle: { fontSize: 22, fontWeight: '800', color: Theme.colors.forest, marginTop: 12 },
    headerDesc: { fontSize: 13, color: Theme.colors.moss, textAlign: 'center', marginTop: 8, lineHeight: 18 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: Theme.colors.forest, marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: Theme.colors.moss, marginBottom: 8 },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: Theme.colors.card, borderWidth: 1, borderColor: Theme.colors.border },
    activeChip: { backgroundColor: Theme.colors.emerald, borderColor: Theme.colors.emerald },
    chipText: { fontSize: 13, color: Theme.colors.forest },
    activeChipText: { color: 'white', fontWeight: 'bold' },
    row: { flexDirection: 'row' },
    predictButton: { marginBottom: 24 },
    resultCard: {
        backgroundColor: '#E8F5E9', padding: 24, borderRadius: 24,
        alignItems: 'center', borderWidth: 1, borderColor: '#C8E6C9',
    },
    resultLabel: { fontSize: 14, fontWeight: '700', color: Theme.colors.emerald, textTransform: 'uppercase' },
    resultValueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
    resultValue: { fontSize: 48, fontWeight: '900', color: Theme.colors.forest },
    resultUnit: { fontSize: 18, color: Theme.colors.emerald, marginLeft: 8, fontWeight: '600' },
    resultHint: { fontSize: 12, color: Theme.colors.moss, marginTop: 12 },
});
