import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { WeatherWidget } from '../../components/WeatherWidget';
import { LineChart } from 'react-native-chart-kit';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BentoTile } from '../../components/bento/BentoTile';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function FarmerDashboard() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { user } = useAuth();

    // Mock Data
    const today = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short' };
    const dateString = today.toLocaleDateString(i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-US', dateOptions);

    return (
        <ImageBackground
            source={require('../../assets/images/background.jpeg')}
            style={styles.container}
            imageStyle={{ opacity: 0.15 }} // Subtle background
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Header Section - Floating Minimalist Bar */}
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode="contain" />
                            <View style={styles.headerText}>
                                <Text style={styles.greeting}>{t('dashboard.welcomeBack')}</Text>
                                <Text style={styles.username}>{user?.name || 'User'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
                            <Feather name="bell" size={22} color={Theme.colors.primary} />
                            <View style={styles.badgeDot} />
                        </TouchableOpacity>
                    </View>

                    {/* Date sub-header */}
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{dateString}</Text>
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
                                    <Text style={styles.calendarTitle}>{t('dashboard.cropCalendar')}</Text>
                                </View>

                                <View style={styles.seasonRow}>
                                    <View style={styles.seasonItem}>
                                        <Text style={styles.seasonLabel}>{t('dashboard.winter')}</Text>
                                        <View style={[styles.monthPill, styles.activePill]}>
                                            <Text style={styles.monthTextActive}>Feb</Text>
                                        </View>
                                    </View>
                                    <Feather name="chevron-right" size={16} color={Theme.colors.textMuted} />
                                    <View style={styles.seasonItem}>
                                        <Text style={styles.seasonLabel}>{t('dashboard.summer')}</Text>
                                        <Text style={styles.monthText}>{t('dashboard.starts', { month: 'Mar' })}</Text>
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                <Text style={styles.calendarFooter}>
                                    {t('dashboard.idealFor')} <Text style={{ fontWeight: 'bold', color: Theme.colors.forest }}>Wheat, Gram</Text>
                                </Text>
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Detailed Crop Suggestions */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('dashboard.seasonalSuggestions')}</Text>
                        <Text style={styles.sectionSub}>{t('dashboard.recommendedCrops')}</Text>

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
                        <Text style={styles.sectionTitle}>{t('dashboard.farmOperations')}</Text>
                        <View style={styles.toolsGridBento}>
                            <BentoTile
                                title={t('dashboard.cropPrediction')}
                                subtitle={t('dashboard.predictDesc')}
                                icon={<MaterialCommunityIcons name="water-pump" size={22} color="white" />}
                                onPress={() => router.push('/farmer/crop-water-input')}
                                size="large"
                            />

                            <BentoTile
                                title={t('dashboard.moistureForecast')}
                                subtitle={t('dashboard.moistureDesc')}
                                icon={<MaterialCommunityIcons name="chart-bell-curve-cumulative" size={22} color="white" />}
                                onPress={() => router.push('/farmer/soil-moisture-forecast')}
                                size="large"
                            />

                            <BentoTile
                                title={t('dashboard.waterAllocation')}
                                subtitle={t('dashboard.recommendedCrops')}
                                icon={<MaterialCommunityIcons name="water-outline" size={22} color="white" />}
                                onPress={() => router.push('/farmer/water-allocation-view')}
                                size="large"
                            />

                            <BentoTile
                                title={t('dashboard.chat')}
                                subtitle={t('dashboard.predictDesc')}
                                icon={<Feather name="message-circle" size={22} color={Theme.colors.primary} />}
                                onPress={() => router.push('/farmer/chatbot')}
                                size="medium"
                            />

                        </View>
                    </View>

                    {/* Water Management: Usage & Credits */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('dashboard.waterAllocation')}</Text>

                        {/* Water Credits Card */}
                        <View style={styles.creditCard}>
                            <View>
                                <Text style={styles.creditLabel}>{t('dashboard.totalCredits')}</Text>
                                <Text style={styles.creditValue}>1,250</Text>
                                <Text style={styles.creditSub}>{t('dashboard.savingsMsg')}</Text>
                            </View>
                            <Image source={require('../../assets/images/logo.png')} style={{ width: 60, height: 60, opacity: 0.8 }} resizeMode="contain" />
                        </View>

                        {/* Usage Graph */}
                        <Text style={[styles.sectionTitle, { fontSize: 16, marginTop: 16 }]}>{t('dashboard.weeklyUsage')}</Text>
                        <LineChart
                            data={{
                                labels: [
                                    t('dashboard.days.mon'),
                                    t('dashboard.days.tue'),
                                    t('dashboard.days.wed'),
                                    t('dashboard.days.thu'),
                                    t('dashboard.days.fri'),
                                    t('dashboard.days.sat'),
                                    t('dashboard.days.sun')
                                ],
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
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 20,
        marginTop: 10,
        backgroundColor: Theme.colors.glass,
        borderRadius: Theme.roundness.lg,
        ...Theme.shadows.soft,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    headerLogo: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
    },
    headerText: {
        flex: 1,
    },
    greeting: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        fontWeight: '500',
    },
    username: {
        fontSize: 16,
        color: Theme.colors.text,
        fontWeight: '700',
    },
    dateContainer: {
        paddingHorizontal: 24,
        marginTop: 20,
        marginBottom: 10,
    },
    dateText: {
        fontSize: 22,
        fontWeight: '800',
        color: Theme.colors.text,
        letterSpacing: -0.5,
    },
    notifBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    badgeDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.error,
        borderWidth: 1.5,
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
        flexWrap: 'wrap',
        gap: 16,
    },
    toolsGridBento: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        gap: 12,
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
