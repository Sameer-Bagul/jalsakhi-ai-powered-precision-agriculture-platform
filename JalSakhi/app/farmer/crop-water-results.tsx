import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CropWaterResults() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse the prediction and input data
  const prediction = params.prediction ? JSON.parse(params.prediction as string) : null;
  const inputData = params.inputData ? JSON.parse(params.inputData as string) : null;

  // Sample data structure (replace with actual API response)
  const waterRequirement = prediction?.waterRequirement || 45.5; // mm/day
  const irrigationRecommendation = prediction?.recommendation || 'Irrigate in next 24 hours';
  const schedule = prediction?.schedule || [
    { day: 'Today', amount: 25, time: 'Morning 6-8 AM' },
    { day: 'Day 3', amount: 20, time: 'Evening 5-7 PM' },
    { day: 'Day 7', amount: 30, time: 'Morning 6-8 AM' },
  ];
  const confidence = prediction?.confidence || 92;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <LinearGradient
          colors={[Theme.colors.primary, Theme.colors.secondary]}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Water Requirement</Text>
            <Text style={styles.headerSubtitle}>Crop: {inputData?.cropType || 'N/A'}</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Main Result Card */}
          <View style={styles.resultCard}>
            <View style={styles.resultIconContainer}>
              <Feather name="droplet" size={48} color={Theme.colors.primary} />
            </View>
            <Text style={styles.resultValue}>{waterRequirement} mm/day</Text>
            <Text style={styles.resultLabel}>Daily Water Requirement</Text>
            
            <View style={styles.confidenceBadge}>
              <Feather name="check-circle" size={16} color={Theme.colors.success} />
              <Text style={styles.confidenceText}>{confidence}% Confidence</Text>
            </View>
          </View>

          {/* Recommendation Card */}
          <View style={styles.recommendationCard}>
            <View style={styles.cardHeader}>
              <Feather name="alert-circle" size={20} color={Theme.colors.primary} />
              <Text style={styles.cardTitle}>Recommendation</Text>
            </View>
            <Text style={styles.recommendationText}>{irrigationRecommendation}</Text>
          </View>

          {/* Irrigation Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Irrigation Schedule</Text>
            <Text style={styles.sectionSubtitle}>Next 7 days based on forecast</Text>
            
            {schedule.map((item: any, index: number) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.scheduleLeft}>
                  <Text style={styles.scheduleDay}>{item.day}</Text>
                  <Text style={styles.scheduleTime}>{item.time}</Text>
                </View>
                <View style={styles.scheduleRight}>
                  <Text style={styles.scheduleAmount}>{item.amount} mm</Text>
                  <View style={styles.waterBar}>
                    <View style={[styles.waterFill, { width: `${(item.amount / 50) * 100}%` }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Input Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Input Summary</Text>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Growth Stage</Text>
                <Text style={styles.infoValue}>{inputData?.growthStage || 'N/A'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Soil Type</Text>
                <Text style={styles.infoValue}>{inputData?.soilType || 'N/A'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Temperature</Text>
                <Text style={styles.infoValue}>{inputData?.temperature || 'N/A'}°C</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Humidity</Text>
                <Text style={styles.infoValue}>{inputData?.humidity || 'N/A'}%</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Feather name="refresh-cw" size={18} color={Theme.colors.primary} />
              <Text style={styles.secondaryButtonText}>New Prediction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/farmer')}
            >
              <Feather name="home" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resultIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  resultLabel: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginTop: 8,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Theme.colors.success}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 16,
    gap: 6,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.success,
  },
  recommendationCard: {
    backgroundColor: `${Theme.colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  recommendationText: {
    fontSize: 16,
    color: Theme.colors.text,
    lineHeight: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scheduleLeft: {
    flex: 1,
  },
  scheduleDay: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  scheduleTime: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  scheduleRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  scheduleAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 4,
  },
  waterBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e5e5e5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  waterFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    width: (width - 64) / 2,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Theme.colors.primary,
    elevation: 4,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
