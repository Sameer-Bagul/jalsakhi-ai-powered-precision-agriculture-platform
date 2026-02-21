import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function CropWaterResults() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const prediction = params.prediction ? JSON.parse(params.prediction as string) : null;
  const inputData = params.inputData ? JSON.parse(params.inputData as string) : null;

  const waterRequirement = prediction?.waterRequirement || 45.5;
  const irrigationRecommendation = prediction?.recommendation || 'Irrigate in next 24 hours';
  const schedule = prediction?.schedule || [
    { day: 'Today', amount: 25, time: 'Morning 6-8 AM' },
    { day: 'Day 3', amount: 20, time: 'Evening 5-7 PM' },
    { day: 'Day 7', amount: 30, time: 'Morning 6-8 AM' },
  ];
  const confidence = prediction?.confidence || 92;

  const GlassCard = ({ title, icon, children, style, intensity = 20 }: any) => (
    <View style={[styles.glassCard, style]}>
      <BlurView intensity={intensity} tint="light" style={styles.cardBlur}>
        {title && (
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <MaterialCommunityIcons name={icon} size={18} color={Theme.colors.primary} />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
        )}
        {children}
      </BlurView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative Layer */}
      <View style={styles.decorativeLayer} pointerEvents="none">
        <View style={[styles.designLine, { top: '15%', right: -60, transform: [{ rotate: '-45deg' }] }]} />
        <View style={[styles.designLine, { bottom: '25%', left: -80, width: 300, transform: [{ rotate: '30deg' }] }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <BlurView intensity={60} tint="light" style={styles.backBlur}>
              <Feather name="chevron-left" size={24} color={Theme.colors.text} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Prediction Results</Text>
            <Text style={styles.subtitle}>Optimized for {inputData?.cropType || 'N/A'}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bentoGrid}>

            {/* Main Requirement Tile */}
            <GlassCard style={styles.fullWidth} intensity={40}>
              <View style={styles.mainResultRow}>
                <View>
                  <Text style={styles.miniLabel}>Water Needed</Text>
                  <Text style={styles.mainValue}>{waterRequirement}<Text style={styles.mainUnit}> mm/day</Text></Text>
                </View>
                <View style={styles.confidenceCircle}>
                  <BlurView intensity={80} tint="light" style={styles.confBlur}>
                    <Text style={styles.confValue}>{confidence}%</Text>
                    <Text style={styles.confLabel}>CONF.</Text>
                  </BlurView>
                </View>
              </View>
              <View style={[styles.recommendationBadge, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="sunny" size={16} color="#166534" />
                <Text style={styles.recommendationText}>{irrigationRecommendation}</Text>
              </View>
            </GlassCard>

            {/* Input Summary - Bento Style */}
            <View style={styles.row}>
              <GlassCard title="Growth" icon="sprout" style={styles.halfWidth}>
                <Text style={styles.summaryValue}>{inputData?.growthStage || 'N/A'}</Text>
              </GlassCard>
              <GlassCard title="Soil Type" icon="texture-box" style={styles.halfWidth}>
                <Text style={styles.summaryValue}>{inputData?.soilType || 'N/A'}</Text>
              </GlassCard>
            </View>

            <View style={styles.row}>
              <GlassCard title="Temp" icon="thermometer" style={styles.halfWidth}>
                <Text style={styles.summaryValue}>{inputData?.temperature || 'N/A'}°C</Text>
              </GlassCard>
              <GlassCard title="Humidity" icon="water-percent" style={styles.halfWidth}>
                <Text style={styles.summaryValue}>{inputData?.humidity || 'N/A'}%</Text>
              </GlassCard>
            </View>

            {/* Irrigation Schedule */}
            <View style={{ marginTop: 8 }}>
              <Text style={styles.sectionHeader}>Irrigation Schedule</Text>
              {schedule.map((item: any, idx: number) => (
                <GlassCard key={idx} style={[styles.scheduleItem, { marginBottom: 12 }]}>
                  <View style={styles.scheduleRow}>
                    <View style={styles.scheduleTimeBox}>
                      <Text style={styles.scheduleDay}>{item.day}</Text>
                      <Text style={styles.scheduleTimeText}>{item.time}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text style={styles.itemAmount}>{item.amount} mm</Text>
                      <View style={styles.progressBg}>
                        <LinearGradient
                          colors={['#10b981', '#059669']}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                          style={[styles.progressFill, { width: `${(item.amount / 50) * 100}%` }]}
                        />
                      </View>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => router.back()}
              >
                <Feather name="refresh-cw" size={18} color={Theme.colors.primary} />
                <Text style={styles.secondaryBtnText}>Recalculate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.push('/farmer')}
              >
                <LinearGradient colors={['#10b981', '#059669']} style={styles.gradientBtn}>
                  <Feather name="home" size={18} color="white" />
                  <Text style={styles.primaryBtnText}>Done</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

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
  scrollView: {
    flex: 1,
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
    gap: 8,
    marginBottom: 12,
  },
  cardIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    marginBottom: 4,
  },
  mainValue: {
    fontSize: 32,
    fontWeight: '900',
    color: Theme.colors.primary,
  },
  mainUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  confidenceCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Theme.colors.success,
  },
  confBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  confValue: {
    fontSize: 16,
    fontWeight: '900',
    color: Theme.colors.success,
  },
  confLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Theme.colors.textMuted,
  },
  recommendationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 16,
    marginLeft: 4,
  },
  scheduleItem: {
    padding: 0,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scheduleTimeBox: {
    flex: 1,
  },
  scheduleDay: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  scheduleTimeText: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.colors.primary,
    marginBottom: 6,
  },
  progressBg: {
    height: 6,
    width: 100,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  secondaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  primaryBtn: {
    flex: 1.2,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  gradientBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  }
});
