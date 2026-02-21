import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const screenWidth = Dimensions.get('window').width;

export default function WaterAllocationView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allocation, setAllocation] = useState<any>(null);

  useEffect(() => {
    fetchAllocation();
  }, []);

  const fetchAllocation = async () => {
    setLoading(true);
    const sampleData = {
      farmerId: 'F001',
      farmerName: 'Ramesh Kumar',
      village: 'Khadki',
      totalLand: 2.5,
      currentAllocation: {
        amount: 1250,
        validFrom: '2025-01-15',
        validUntil: '2025-01-21',
        status: 'active',
      },
      schedule: [
        { date: 'Jan 15', slot: 'Morning 6-8 AM', amount: 200, status: 'completed' },
        { date: 'Jan 16', slot: 'Morning 6-8 AM', amount: 200, status: 'pending' },
        { date: 'Jan 18', slot: 'Evening 5-7 PM', amount: 250, status: 'pending' },
        { date: 'Jan 20', slot: 'Morning 6-8 AM', amount: 300, status: 'pending' },
        { date: 'Jan 21', slot: 'Evening 5-7 PM', amount: 300, status: 'pending' },
      ],
      reservoirStatus: {
        capacity: 50000,
        currentLevel: 38500,
        percentage: 77,
      },
      priority: 'medium',
      crops: ['Rice', 'Wheat'],
      lastUpdated: new Date().toISOString(),
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const response = await fetch('http://YOUR_SERVER_IP:3000/api/farmer/water-allocation', { signal: controller.signal } as any);
      clearTimeout(timeout);

      if (response && response.ok) {
        const data = await response.json();
        setAllocation(data || sampleData);
      } else {
        setAllocation(sampleData);
      }
    } catch (error) {
      setAllocation(sampleData);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative Layer */}
      <View style={styles.decorativeLayer} pointerEvents="none">
        <View style={[styles.designLine, { top: '20%', left: -60, transform: [{ rotate: '30deg' }] }]} />
        <View style={[styles.designLine, { bottom: '15%', right: -40, width: 250, transform: [{ rotate: '-45deg' }] }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <BlurView intensity={60} tint="light" style={styles.backBlur}>
              <Feather name="chevron-left" size={24} color={Theme.colors.text} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Water Allocation</Text>
            <Text style={styles.subtitle}>Current weekly distribution</Text>
          </View>
          <TouchableOpacity onPress={fetchAllocation} style={styles.refreshBtn}>
            <Ionicons name="reload" size={20} color={Theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Bento Grid */}
          <View style={styles.bentoGrid}>

            {/* Main Level Tile */}
            <GlassCard style={styles.fullWidth} intensity={40}>
              <View style={styles.mainAllocationRow}>
                <View>
                  <Text style={styles.miniLabel}>Weekly Quota</Text>
                  <Text style={styles.mainValue}>{allocation.currentAllocation.amount} L</Text>
                </View>
                <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.dropletIcon}>
                  <Feather name="droplet" size={24} color="white" />
                </LinearGradient>
              </View>
              <View style={styles.statusBadgeRow}>
                <View style={[styles.badge, { backgroundColor: allocation.currentAllocation.status === 'active' ? '#dcfce7' : '#fee2e2' }]}>
                  <Text style={[styles.badgeText, { color: allocation.currentAllocation.status === 'active' ? '#166534' : '#991b1b' }]}>
                    {allocation.currentAllocation.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.dateRange}>
                  {allocation.currentAllocation.validFrom} - {allocation.currentAllocation.validUntil}
                </Text>
              </View>
            </GlassCard>

            {/* Side-by-Side Status */}
            <View style={styles.row}>
              <GlassCard title="Priority" icon="flag-variant" style={styles.halfWidth}>
                <Text style={[styles.priorityText, { color: allocation.priority === 'high' ? '#ef4444' : '#f59e0b' }]}>
                  {allocation.priority.toUpperCase()}
                </Text>
              </GlassCard>
              <GlassCard title="Land size" icon="texture-box" style={styles.halfWidth}>
                <Text style={styles.landText}>{allocation.totalLand} Acres</Text>
              </GlassCard>
            </View>

            {/* Reservoir Progress */}
            <GlassCard title="Village Reservoir" icon="water-percent" style={styles.fullWidth}>
              <View style={styles.reservoirContainer}>
                <View style={styles.reservoirMeta}>
                  <Text style={styles.resPercent}>{allocation.reservoirStatus.percentage}%</Text>
                  <Text style={styles.resVolume}>{allocation.reservoirStatus.currentLevel.toLocaleString()} / {allocation.reservoirStatus.capacity.toLocaleString()} L</Text>
                </View>
                <View style={styles.progressBg}>
                  <LinearGradient
                    colors={['#60a5fa', '#3b82f6']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${allocation.reservoirStatus.percentage}%` }]}
                  />
                </View>
                <Text style={styles.resSubText}>Village backup level is {allocation.reservoirStatus.percentage > 70 ? 'Healthy' : 'Moderate'}</Text>
              </View>
            </GlassCard>

            {/* Schedule Section */}
            <View style={{ marginTop: 8 }}>
              <Text style={styles.sectionHeader}>Irrigation Schedule</Text>
              {allocation.schedule.map((item: any, idx: number) => (
                <GlassCard key={idx} style={[styles.scheduleItem, { marginBottom: 12 }]} intensity={idx % 2 === 0 ? 25 : 15}>
                  <View style={styles.scheduleRow}>
                    <View style={[styles.scheduleStatus, { backgroundColor: item.status === 'completed' ? '#dcfce7' : '#F1F5F9' }]}>
                      <Feather
                        name={item.status === 'completed' ? 'check' : 'clock'}
                        size={18}
                        color={item.status === 'completed' ? '#16a34a' : '#64748b'}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.scheduleDate}>{item.date}</Text>
                      <Text style={styles.scheduleSlot}>{item.slot}</Text>
                    </View>
                    <View style={styles.amountBox}>
                      <Text style={styles.itemAmount}>{item.amount}L</Text>
                      <Text style={styles.itemStatus}>{item.status}</Text>
                    </View>
                  </View>
                </GlassCard>
              ))}
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
  refreshBtn: {
    padding: 10,
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
  miniLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    marginBottom: 4,
  },
  mainAllocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainValue: {
    fontSize: 36,
    fontWeight: '900',
    color: Theme.colors.primary,
  },
  dropletIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  dateRange: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  priorityText: {
    fontSize: 22,
    fontWeight: '900',
  },
  landText: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.text,
  },
  reservoirContainer: {
    marginTop: 4,
  },
  reservoirMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  resPercent: {
    fontSize: 28,
    fontWeight: '900',
    color: Theme.colors.text,
  },
  resVolume: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  progressBg: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  resSubText: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 10,
    fontStyle: 'italic',
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
  scheduleStatus: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleDate: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  scheduleSlot: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: Theme.colors.primary,
  },
  itemStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 2,
  }
});
