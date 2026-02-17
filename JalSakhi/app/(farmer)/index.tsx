import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { BentoTile } from '../../components/bento/BentoTile';
import { Logger } from '../../utils/Logger';

import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';

export default function FarmerDashboard() {
    const router = useRouter();

    const handleTilePress = (screen: string) => {
        Logger.info('FarmerDashboard', `Navigating to: ${screen}`);
        if (screen === 'my-farms') router.push('/(farmer)/my-farms');
        if (screen === 'irrigation-details') router.push('/(farmer)/irrigation-details');
        if (screen === 'crop-prediction') router.push('/(farmer)/crop-water-prediction');
        if (screen === 'moisture-forecast') router.push('/(farmer)/soil-moisture-forecast');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Good Morning,</Text>
                        <View style={styles.userRow}>
                            <Text style={styles.userName}>Ramesh Kumar</Text>
                            <MaterialCommunityIcons name="hand-wave" size={20} color="#FFB703" style={{ marginLeft: 8 }} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(auth)/role')}>
                        <Feather name="user" size={24} color={Theme.colors.emerald} />
                    </TouchableOpacity>
                </View>

                <View style={styles.grid}>
                    <BentoTile
                        title="Irrigation Today"
                        subtitle="Next scheduled: 6:00 AM"
                        size="large"
                        icon={<MaterialCommunityIcons name="water-pump" size={24} color={Theme.colors.emerald} />}
                        onPress={() => handleTilePress('irrigation-details')}
                    >
                        <View style={styles.irrigationFocus}>
                            <Text style={styles.focusValue}>1,200 L</Text>
                            <Text style={styles.focusLabel}>Daily Quota Remaining</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '60%' }]} />
                            </View>
                        </View>
                    </BentoTile>

                    <View style={styles.row}>
                        <BentoTile
                            title="Crop Needs"
                            subtitle="AI Prediction"
                            size="small"
                            icon={<MaterialCommunityIcons name="robot" size={22} color={Theme.colors.emerald} />}
                            onPress={() => handleTilePress('crop-prediction')}
                        >
                            <Text style={styles.statValue}>12.5</Text>
                            <Text style={styles.statLabel}>mm req.</Text>
                        </BentoTile>

                        <BentoTile
                            title="Future Soil"
                            subtitle="7-Day Forecast"
                            size="small"
                            icon={<MaterialCommunityIcons name="chart-bell-curve" size={22} color="#1E88E5" />}
                            onPress={() => handleTilePress('moisture-forecast')}
                        >
                            <Text style={styles.statValue}>38%</Text>
                            <Text style={styles.statLabel}>Min Level</Text>
                        </BentoTile>
                    </View>

                    <View style={styles.row}>
                        <BentoTile
                            title="My Farms"
                            subtitle="3 Active Farms"
                            size="small"
                            icon={<MaterialCommunityIcons name="sprout" size={22} color={Theme.colors.emerald} />}
                            onPress={() => handleTilePress('my-farms')}
                        >
                            <Text style={styles.statValue}>7.5</Text>
                            <Text style={styles.statLabel}>Acres</Text>
                        </BentoTile>

                        <BentoTile
                            title="Weather"
                            subtitle="Sunny"
                            size="small"
                            icon={<Feather name="sun" size={22} color="#FFB703" />}
                            onPress={() => handleTilePress('weather')}
                        >
                            <Text style={styles.statValue}>32°C</Text>
                            <Text style={styles.statLabel}>High: 35°C</Text>
                        </BentoTile>
                    </View>

                    <BentoTile
                        title="Water Usage"
                        subtitle="Last 7 days"
                        size="wide"
                        icon={<MaterialIcons name="bar-chart" size={24} color={Theme.colors.emerald} />}
                        onPress={() => handleTilePress('usage-history')}
                    >
                        <View style={styles.usageContainer}>
                            {[40, 60, 50, 80, 70, 65, 90].map((h, i) => (
                                <View key={i} style={styles.chartBar}>
                                    <View style={[styles.barFill, { height: `${h}%` }]} />
                                </View>
                            ))}
                        </View>
                    </BentoTile>

                    <BentoTile
                        title="Alerts"
                        subtitle="2 New Alerts"
                        size="large"
                        icon={<Feather name="bell" size={22} color={Theme.colors.error} />}
                        onPress={() => handleTilePress('alerts')}
                        style={styles.alertsTile}
                    >
                        <View style={styles.alertItem}>
                            <View style={styles.alertDot} />
                            <Text style={styles.alertText} numberOfLines={1}>Soil moisture low in North Field</Text>
                        </View>
                        <View style={styles.alertItem}>
                            <View style={styles.alertDot} />
                            <Text style={styles.alertText} numberOfLines={1}>Rain forecast for tomorrow</Text>
                        </View>
                    </BentoTile>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    scrollContent: { padding: Theme.spacing.md },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 4,
    },
    welcomeText: { fontSize: 16, color: Theme.colors.moss },
    userRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    userName: { fontSize: 24, fontWeight: 'bold', color: Theme.colors.forest },
    profileButton: {
        width: 50, height: 50, borderRadius: 25,
        backgroundColor: Theme.colors.card, alignItems: 'center',
        justifyContent: 'center', borderWidth: 1, borderColor: Theme.colors.border,
    },
    profileIcon: { fontSize: 24 },
    grid: { flex: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    tileIcon: { fontSize: 24 },
    irrigationFocus: { alignItems: 'center', width: '100%', paddingVertical: 10 },
    focusValue: { fontSize: 40, fontWeight: '800', color: Theme.colors.emerald },
    focusLabel: { fontSize: 14, color: Theme.colors.moss, marginTop: 4 },
    progressBar: {
        width: '80%', height: 8, backgroundColor: Theme.colors.dew,
        borderRadius: 4, marginTop: 16, overflow: 'hidden',
    },
    progressFill: { height: '100%', backgroundColor: Theme.colors.emerald, borderRadius: 4 },
    statValue: { fontSize: 28, fontWeight: 'bold', color: Theme.colors.forest },
    statLabel: { fontSize: 14, color: Theme.colors.moss, marginTop: 4 },
    usageContainer: {
        flexDirection: 'row', alignItems: 'flex-end',
        justifyContent: 'space-around', height: 80, width: '100%', paddingTop: 10,
    },
    chartBar: { width: 20, height: '100%', backgroundColor: Theme.colors.dew, borderRadius: 4, justifyContent: 'flex-end' },
    barFill: { width: '100%', backgroundColor: Theme.colors.sage, borderRadius: 4 },
    alertsTile: { minHeight: 120 },
    alertItem: {
        flexDirection: 'row', alignItems: 'center', width: '100%',
        marginBottom: 8, backgroundColor: Theme.colors.dew, padding: 10, borderRadius: 12,
    },
    alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.error, marginRight: 10 },
    alertText: { fontSize: 14, color: Theme.colors.forest, flex: 1 },
});
