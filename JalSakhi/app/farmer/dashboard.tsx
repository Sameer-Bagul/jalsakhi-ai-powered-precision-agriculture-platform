import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { WeatherWidget } from '../../components/WeatherWidget';
import { LineChart } from 'react-native-chart-kit';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function FarmerDashboard() {
    const router = useRouter();

    // Mock Data
    const today = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short' };
    const dateString = today.toLocaleDateString('en-US', dateOptions);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode="contain" />
                        <View style={styles.headerText}>
                            <Text style={styles.greeting}>Welcome,</Text>
                            <Text style={styles.username}>Rajesh Kumar</Text>
                            <Text style={styles.date}>{dateString}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
                        <Feather name="bell" size={24} color="white" />
                        <View style={styles.badgeDot} />
                    </TouchableOpacity>
                </View>

                {/* Hero Section: Weather & Calendar */}
                <View style={styles.heroRow}>
                    {/* Weather - Left */}
                    <View style={styles.weatherContainer}>
                        <WeatherWidget style={styles.weatherWidgetFixed} compact={true} />
                    </View>

                    {/* Crop Calendar - Center/Right */}
                    <View style={styles.calendarContainer}>
                        <LinearGradient colors={['#fff', '#f0f9ff']} style={styles.calendarCard}>
                            <View style={styles.calendarHeader}>
                                <Feather name="calendar" size={16} color={Theme.colors.primary} />
                                <Text style={styles.calendarTitle}>Crop Calendar</Text>
                            </View>

                            <View style={styles.seasonRow}>
                                <View style={styles.seasonItem}>
                                    <Text style={styles.seasonLabel}>Winter</Text>
                                    <View style={[styles.monthPill, styles.activePill]}>
                                        <Text style={styles.monthTextActive}>Feb</Text>
                                    </View>
                                </View>
                                <Feather name="chevron-right" size={16} color={Theme.colors.textMuted} />
                                <View style={styles.seasonItem}>
                                    <Text style={styles.seasonLabel}>Summer</Text>
                                    <Text style={styles.monthText}>starts Mar</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.calendarFooter}>
                                Ideal for <Text style={{ fontWeight: 'bold', color: Theme.colors.forest }}>Wheat, Gram</Text>
                            </Text>
                        </LinearGradient>
                    </View>
                </View>

                {/* Detailed Crop Suggestions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Seasonal Suggestions</Text>
                    <Text style={styles.sectionSub}>Recommended crops for current weather & water levels</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>

                        <TouchableOpacity style={styles.cropCardLarge}>
                            <View style={styles.cropHeader}>
                                <View style={[styles.cropIconCb, { backgroundColor: '#dcfce7' }]}>
                                    <MaterialCommunityIcons name="corn" size={24} color="#16a34a" />
                                </View>
                                <View>
                                    <Text style={styles.cropNameLarge}>Maize</Text>
                                    <Text style={styles.cropSeason}>Summer Crop</Text>
                                </View>
                            </View>

                            <View style={styles.waterInfo}>
                                <Feather name="droplet" size={14} color="#3b82f6" />
                                <Text style={styles.waterText}>Requires ~4500 L/acre</Text>
                            </View>

                            <View style={styles.suitabilityBadge}>
                                <Text style={styles.suitabilityText}>High Suitability</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cropCardLarge}>
                            <View style={styles.cropHeader}>
                                <View style={[styles.cropIconCb, { backgroundColor: '#fef9c3' }]}>
                                    <MaterialCommunityIcons name="seed" size={24} color="#ca8a04" />
                                </View>
                                <View>
                                    <Text style={styles.cropNameLarge}>Bajra</Text>
                                    <Text style={styles.cropSeason}>All Season</Text>
                                </View>
                            </View>

                            <View style={styles.waterInfo}>
                                <Feather name="droplet" size={14} color="#3b82f6" />
                                <Text style={styles.waterText}>Requires ~3000 L/acre</Text>
                            </View>

                            <View style={styles.suitabilityBadge}>
                                <Text style={styles.suitabilityText}>Drought Safe</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cropCardLarge}>
                            <View style={styles.cropHeader}>
                                <View style={[styles.cropIconCb, { backgroundColor: '#fee2e2' }]}>
                                    <MaterialCommunityIcons name="flower-tulip" size={24} color="#dc2626" />
                                </View>
                                <View>
                                    <Text style={styles.cropNameLarge}>Onion</Text>
                                    <Text style={styles.cropSeason}>Late Winter</Text>
                                </View>
                            </View>

                            <View style={styles.waterInfo}>
                                <Feather name="droplet" size={14} color="#3b82f6" />
                                <Text style={styles.waterText}>Requires ~5000 L/acre</Text>
                            </View>

                            <View style={[styles.suitabilityBadge, { backgroundColor: '#ffedd5' }]}>
                                <Text style={[styles.suitabilityText, { color: '#ea580c' }]}>Moderate Match</Text>
                            </View>
                        </TouchableOpacity>

                    </ScrollView>
                </View>

                {/* ML Models Integration */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Smart Farm Tools</Text>
                    <View style={styles.toolsGrid}>

                        {/* Crop Water Model */}
                        <TouchableOpacity
                            style={styles.toolCard}
                            onPress={() => router.push('/farmer/crop-water-prediction')}
                        >
                            <LinearGradient
                                colors={['#0ea5e9', '#0284c7']}
                                style={styles.toolIconBox}
                            >
                                <MaterialCommunityIcons name="water-pump" size={32} color="white" />
                            </LinearGradient>
                            <Text style={styles.toolTitle}>Crop Water Prediction</Text>
                            <Text style={styles.toolDesc}>Calculate exact water needs for your crop</Text>
                            <View style={styles.toolArrow}>
                                <Feather name="arrow-right" size={20} color={Theme.colors.primary} />
                            </View>
                        </TouchableOpacity>

                        {/* Soil Moisture Model */}
                        <TouchableOpacity
                            style={styles.toolCard}
                            onPress={() => router.push('/farmer/soil-moisture-forecast')}
                        >
                            <LinearGradient
                                colors={['#8b5cf6', '#7c3aed']}
                                style={styles.toolIconBox}
                            >
                                <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={32} color="white" />
                            </LinearGradient>
                            <Text style={styles.toolTitle}>Soil Moisture Forecast</Text>
                            <Text style={styles.toolDesc}>Check moisture levels & irrigation advice</Text>
                            <View style={styles.toolArrow}>
                                <Feather name="arrow-right" size={20} color={Theme.colors.primary} />
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* Water Management: Usage & Credits */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Water Management</Text>

                    {/* Water Credits Card */}
                    <View style={styles.creditCard}>
                        <View>
                            <Text style={styles.creditLabel}>Total Water Credits</Text>
                            <Text style={styles.creditValue}>1,250</Text>
                            <Text style={styles.creditSub}>Excellent! You saved 20% more water.</Text>
                        </View>
                        <Image source={require('../../assets/images/logo.png')} style={{ width: 60, height: 60, opacity: 0.8 }} resizeMode="contain" />
                    </View>

                    {/* Usage Graph */}
                    <Text style={[styles.sectionTitle, { fontSize: 16, marginTop: 16 }]}>Weekly Usage (Liters)</Text>
                    <LineChart
                        data={{
                            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                            datasets: [{ data: [450, 320, 200, 400, 380, 500, 250] }]
                        }}
                        width={screenWidth - 40}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix="L"
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: { r: "6", strokeWidth: "2", stroke: "#16a34a" }
                        }}
                        bezier
                        style={{ borderRadius: 16, marginVertical: 8, elevation: 2 }}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bg,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Theme.colors.primary,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    headerLogo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    headerText: {
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
    },
    username: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
    },
    notifBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    badgeDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.error,
        borderWidth: 1,
        borderColor: 'white',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 8,
    },
    sectionTitleCenter: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    sectionSub: {
        fontSize: 13,
        color: Theme.colors.textMuted,
        marginBottom: 16,
    },
    heroRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 24,
        gap: 16,
    },
    weatherContainer: {
        flex: 1,
    },
    weatherWidgetFixed: {
        height: 180,
        borderRadius: 16,
        padding: 16,
        marginBottom: 0,
    },
    calendarContainer: {
        flex: 1,
    },
    calendarCard: {
        height: 180,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0f2fe',
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        justifyContent: 'space-between',
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    calendarTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Theme.colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    seasonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    seasonItem: {
        alignItems: 'center',
    },
    seasonLabel: {
        fontSize: 11,
        color: Theme.colors.textMuted,
        marginBottom: 4,
    },
    monthPill: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activePill: {
        backgroundColor: Theme.colors.primary,
    },
    monthTextActive: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    monthText: {
        color: Theme.colors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 8,
    },
    calendarFooter: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        textAlign: 'center',
    },
    suggestionsScroll: {
        paddingRight: 20,
        gap: 16,
    },
    cropCardLarge: {
        width: 180,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cropIconCb: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    cropHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    cropNameLarge: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    cropSeason: {
        fontSize: 11,
        color: Theme.colors.textMuted,
    },
    waterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#f0f9ff',
        padding: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    waterText: {
        fontSize: 11,
        color: '#0284c7',
        fontWeight: '600',
    },
    suitabilityBadge: {
        backgroundColor: '#dcfce7',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    suitabilityText: {
        color: '#16a34a',
        fontSize: 10,
        fontWeight: 'bold',
    },
    toolsGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    toolCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        minHeight: 160,
        justifyContent: 'space-between',
    },
    toolIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    toolTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    toolDesc: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        lineHeight: 16,
    },
    toolArrow: {
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    creditCard: {
        backgroundColor: Theme.colors.primary,
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    creditLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    creditValue: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    creditSub: {
        color: 'white',
        fontSize: 12,
        opacity: 0.9,
    },
});
