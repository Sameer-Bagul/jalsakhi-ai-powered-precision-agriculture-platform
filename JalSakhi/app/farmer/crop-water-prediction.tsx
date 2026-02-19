import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomButton } from '../../components/shared/CustomButton';
import { CustomInput } from '../../components/shared/CustomInput';
import { MLService, CropPredictionInput } from '../../services/ml';

export default function CropWaterPrediction() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<number | null>(null);

    // Form inputs
    const [crop, setCrop] = useState('');
    const [soil, setSoil] = useState('');
    const [area, setArea] = useState('');
    const [stage, setStage] = useState('');

    const handlePredict = async () => {
        if (!crop || !soil || !area || !stage) {
            Alert.alert('Missing Data', 'Please fill all fields to get an accurate prediction.');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const input: CropPredictionInput = {
                crop,
                soil,
                area: parseFloat(area),
                stage
            };

            const waterNeeded = await MLService.predictWaterRequirement(input);
            setResult(waterNeeded);
        } catch (error) {
            Alert.alert('Error', 'Failed to predict water requirement.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Crop Water Predictor</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>
                        This tool uses our <Text style={{ fontWeight: 'bold' }}>Random Forest ML Model</Text> to predict the exact water quantity needed for your specific crop conditions.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <CustomInput
                        label="Crop Type"
                        placeholder="e.g. Wheat, Rice, Cotton"
                        value={crop}
                        onChangeText={setCrop}
                        leftIcon={<MaterialCommunityIcons name="corn" size={20} color={Theme.colors.textMuted} />}
                    />

                    <CustomInput
                        label="Soil Type"
                        placeholder="e.g. Clay, Sandy, Black"
                        value={soil}
                        onChangeText={setSoil}
                        leftIcon={<MaterialCommunityIcons name="image-filter-hdr" size={20} color={Theme.colors.textMuted} />}
                    />

                    <CustomInput
                        label="Growth Stage"
                        placeholder="e.g. Sowing, Flowering"
                        value={stage}
                        onChangeText={setStage}
                        leftIcon={<MaterialCommunityIcons name="sprout" size={20} color={Theme.colors.textMuted} />}
                    />

                    <CustomInput
                        label="Land Area (Acres)"
                        placeholder="e.g. 2.5"
                        value={area}
                        onChangeText={setArea}
                        keyboardType="numeric"
                        leftIcon={<MaterialCommunityIcons name="ruler-square" size={20} color={Theme.colors.textMuted} />}
                    />

                    <CustomButton
                        title="Predict Water Requirement"
                        onPress={handlePredict}
                        loading={loading}
                        style={{ marginTop: 16 }}
                    />
                </View>

                {/* Result */}
                {result !== null && (
                    <View style={styles.resultCard}>
                        <View style={styles.resultHeader}>
                            <MaterialCommunityIcons name="water" size={32} color="white" />
                            <Text style={styles.resultTitle}>Prediction Result</Text>
                        </View>

                        <Text style={styles.resultValue}>{result.toLocaleString()} Liters</Text>
                        <Text style={styles.resultSub}>Recommended for next irrigation</Text>

                        <View style={styles.divider} />

                        <Text style={styles.resultAdvice}>
                            💡 Tip: Irrigate during early morning or evening to reduce evaporation loss.
                        </Text>
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
        backgroundColor: '#e0f2fe',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    infoText: {
        color: '#0369a1',
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
    resultCard: {
        backgroundColor: Theme.colors.primary,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 4,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    resultTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultValue: {
        fontSize: 40,
        fontWeight: '900',
        color: 'white',
        marginBottom: 4,
    },
    resultSub: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 16,
    },
    resultAdvice: {
        color: 'white',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
    },
});
