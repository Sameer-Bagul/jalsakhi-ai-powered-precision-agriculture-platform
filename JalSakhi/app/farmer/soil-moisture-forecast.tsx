import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StatusBar, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MLService } from '../../services/ml';

const screenWidth = Dimensions.get('window').width;

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

    const GlassCard = ({ title, icon, children, style, intensity = 30 }: any) => (
        <View style={[styles.glassCard, style]}>
            <BlurView intensity={intensity} tint="light" style={styles.cardBlur}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardIconBox}>
                        <MaterialCommunityIcons name={icon} size={20} color={Theme.colors.primary} />
                    </View>
                    <Text style={styles.cardTitle}>{title}</Text>
                </View>
                {children}
            </BlurView>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Decorative Patterns */}
            <View style={styles.decorativeLayer} pointerEvents="none">
                <View style={[styles.designLine, { top: '15%', left: -50, transform: [{ rotate: '45deg' }] }]} />
                <View style={[styles.designLine, { bottom: '10%', right: -80, width: 300, transform: [{ rotate: '-30deg' }] }]} />
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <BlurView intensity={60} tint="light" style={styles.backBlur}>
                            <Feather name="chevron-left" size={24} color={Theme.colors.text} />
                        </BlurView>
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Moisture Forecast</Text>
                        <Text style={styles.subtitle}>AI Soil Retension Analysis</Text>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.bentoGrid}>

                        {/* Info Section */}
                        <GlassCard title="Insights" icon="chart-timeline-variant" style={styles.fullWidth}>
                            <Text style={styles.infoText}>
                                Our <Text style={{ fontWeight: '900', color: Theme.colors.primary }}>Time-Series Engine</Text> syncs with sensor data to predict moisture changes over the next 7 days.
                            </Text>
                        </GlassCard>

                        {/* Input Section */}
                        <GlassCard title="Sensor Input" icon="sensor" style={styles.fullWidth}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.miniLabel}>Current Reading (Optional)</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Leave empty for auto-detect"
                                        placeholderTextColor="#94a3b8"
                                        value={sensorValue}
                                        onChangeText={setSensorValue}
                                        keyboardType="numeric"
                                    />
                                    <MaterialCommunityIcons name="leak" size={20} color={Theme.colors.primary} style={styles.inputIcon} />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.forecastBtn, loading && styles.btnDisabled]}
                                onPress={handleForecast}
                                disabled={loading}
                            >
                                <LinearGradient colors={['#10b981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
                                    <MaterialCommunityIcons name="lightning-bolt" size={20} color="white" />
                                    <Text style={styles.btnText}>{loading ? 'Forecasting...' : 'Run Analysis'}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </GlassCard>

                        {/* Results Section */}
                        {result && (
                            <>
                                <View style={styles.row}>
                                    <GlassCard title="Soil Level" icon="percent" style={styles.halfWidth} intensity={50}>
                                        <View style={styles.levelContainer}>
                                            <Text style={[styles.levelValue, { color: result.level < 40 ? Theme.colors.error : Theme.colors.success }]}>
                                                {result.level}%
                                            </Text>
                                            <View style={[styles.trendBadge, { backgroundColor: result.trend === 'UP' ? '#dcfce7' : '#fee2e2' }]}>
                                                <Feather
                                                    name={result.trend === 'UP' ? 'trending-up' : 'trending-down'}
                                                    size={14}
                                                    color={result.trend === 'UP' ? '#166534' : '#991b1b'}
                                                />
                                                <Text style={[styles.trendText, { color: result.trend === 'UP' ? '#166534' : '#991b1b' }]}>{result.trend}</Text>
                                            </View>
                                        </View>
                                    </GlassCard>

                                    <GlassCard title="Condition" icon="leaf-circle" style={styles.halfWidth}>
                                        <View style={styles.conditionBox}>
                                            <Text style={styles.conditionStatus}>
                                                {result.level > 60 ? 'Optimal' : result.level > 30 ? 'Adequate' : 'Critical'}
                                            </Text>
                                            <Ionicons
                                                name={result.level > 30 ? "checkmark-circle" : "alert-circle"}
                                                size={32}
                                                color={result.level > 30 ? Theme.colors.success : Theme.colors.error}
                                            />
                                        </View>
                                    </GlassCard>
                                </View>

                                <GlassCard title="Smart Advice" icon="lightbulb-on-outline" style={styles.fullWidth}>
                                    <View style={styles.adviceContent}>
                                        <Text style={styles.adviceText}>{result.advice}</Text>
                                    </View>
                                </GlassCard>
                            </>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    decorativeLayer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    designLine: {
        position: 'absolute',
        width: 300,
        height: 1,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        gap: 16,
    },
    backBlur: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: Theme.colors.text,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: Theme.colors.textMuted,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    bentoGrid: {
        gap: 16,
    },
    fullWidth: {
        width: '100%',
    },
    halfWidth: {
        flex: 1,
    },
    glassCard: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
    },
    cardBlur: {
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    cardIconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.text,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoText: {
        fontSize: 15,
        color: Theme.colors.textSecondary,
        lineHeight: 22,
    },
    inputContainer: {
        marginBottom: 16,
    },
    miniLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Theme.colors.textMuted,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingRight: 16,
    },
    input: {
        flex: 1,
        height: 48,
        paddingHorizontal: 16,
        fontSize: 15,
        color: Theme.colors.text,
    },
    inputIcon: {
        marginLeft: 8,
    },
    backBtn: {
        borderRadius: 14,
    },
    forecastBtn: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradientBtn: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '800',
    },
    btnDisabled: {
        opacity: 0.7,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    levelContainer: {
        alignItems: 'center',
        gap: 8,
    },
    levelValue: {
        fontSize: 32,
        fontWeight: '900',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    trendText: {
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    conditionBox: {
        alignItems: 'center',
        gap: 6,
    },
    conditionStatus: {
        fontSize: 18,
        fontWeight: '900',
        color: Theme.colors.text,
    },
    adviceContent: {
        padding: 4,
    },
    adviceText: {
        fontSize: 15,
        color: Theme.colors.forest,
        lineHeight: 24,
        fontWeight: '500',
    },
});
