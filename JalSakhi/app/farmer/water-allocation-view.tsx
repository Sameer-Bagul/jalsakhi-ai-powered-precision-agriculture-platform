import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/JalSakhiTheme';
import { LinearGradient } from 'expo-linear-gradient';

// Model 3 Output: Farmer View - See their allocated water from village admin
export default function WaterAllocationView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allocation, setAllocation] = useState<any>(null);

  useEffect(() => {
    fetchAllocation();
  }, []);

  const fetchAllocation = async () => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('http://YOUR_SERVER_IP:5000/api/farmer/water-allocation');
      const data = await response.json();
      
      // Sample data structure
      const sampleData = {
        farmerId: 'F001',
        farmerName: 'Ramesh Kumar',
        village: 'Khadki',
        totalLand: 2.5,
        currentAllocation: {
          amount: 1250, // liters
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
          capacity: 50000, // liters
          currentLevel: 38500,
          percentage: 77,
        },
        priority: 'medium',
        crops: ['Rice', 'Wheat'],
        lastUpdated: new Date().toISOString(),
      };
      
      setAllocation(data || sampleData);
    } catch (error) {
      console.error('Error fetching allocation:', error);
      setAllocation({
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
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Not Set';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>Loading allocation...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.headerTitle}>Water Allocation</Text>
            <Text style={styles.headerSubtitle}>Your weekly water quota</Text>
          </View>
          <TouchableOpacity onPress={fetchAllocation} style={styles.refreshBtn}>
            <Feather name="refresh-cw" size={20} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.content}>
          {/* Current Allocation Card */}
          <View style={styles.allocationCard}>
            <View style={styles.allocationHeader}>
              <View>
                <Text style={styles.allocationLabel}>Current Weekly Allocation</Text>
                <Text style={styles.allocationValue}>{allocation.currentAllocation.amount} L</Text>
              </View>
              <View style={styles.allocationIcon}>
                <Feather name="droplet" size={32} color={Theme.colors.primary} />
              </View>
            </View>

            <View style={styles.allocationDetails}>
              <View style={styles.detailRow}>
                <Feather name="calendar" size={16} color={Theme.colors.textSecondary} />
                <Text style={styles.detailText}>
                  Valid: {new Date(allocation.currentAllocation.validFrom).toLocaleDateString()} - {new Date(allocation.currentAllocation.validUntil).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Feather name="map-pin" size={16} color={Theme.colors.textSecondary} />
                <Text style={styles.detailText}>
                  Land: {allocation.totalLand} acres • Crops: {allocation.crops.join(', ')}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Feather name="flag" size={16} color={getPriorityColor(allocation.priority)} />
                <Text style={[styles.detailText, { color: getPriorityColor(allocation.priority) }]}>
                  {getPriorityLabel(allocation.priority)}
                </Text>
              </View>
            </View>

            <View style={[
              styles.statusBadge,
              {
                backgroundColor: allocation.currentAllocation.status === 'active' ? '#dcfce7' : '#fee2e2'
              }
            ]}>
              <Text style={[
                styles.statusText,
                {
                  color: allocation.currentAllocation.status === 'active' ? '#16a34a' : '#dc2626'
                }
              ]}>
                {allocation.currentAllocation.status === 'active' ? '✓ Active' : '✗ Inactive'}
              </Text>
            </View>
          </View>

          {/* Reservoir Status */}
          <View style={styles.reservoirCard}>
            <Text style={styles.sectionTitle}>💧 Village Reservoir Status</Text>
            
            <View style={styles.reservoirBar}>
              <View style={[styles.reservoirFill, { width: `${allocation.reservoirStatus.percentage}%` }]} />
            </View>

            <View style={styles.reservoirStats}>
              <View style={styles.reservoirStat}>
                <Text style={styles.reservoirStatValue}>
                  {allocation.reservoirStatus.currentLevel.toLocaleString()} L
                </Text>
                <Text style={styles.reservoirStatLabel}>Current Level</Text>
              </View>
              <View style={styles.reservoirStat}>
                <Text style={styles.reservoirStatValue}>
                  {allocation.reservoirStatus.capacity.toLocaleString()} L
                </Text>
                <Text style={styles.reservoirStatLabel}>Total Capacity</Text>
              </View>
              <View style={styles.reservoirStat}>
                <Text style={[styles.reservoirStatValue, { color: Theme.colors.primary }]}>
                  {allocation.reservoirStatus.percentage}%
                </Text>
                <Text style={styles.reservoirStatLabel}>Fill Level</Text>
              </View>
            </View>
          </View>

          {/* Irrigation Schedule */}
          <View style={styles.scheduleCard}>
            <Text style={styles.sectionTitle}>📅 Your Irrigation Schedule</Text>
            <Text style={styles.sectionSubtitle}>Optimized by village admin</Text>

            {allocation.schedule.map((item: any, index: number) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={[
                  styles.scheduleStatus,
                  {
                    backgroundColor: item.status === 'completed' ? '#dcfce7' : '#fff7ed'
                  }
                ]}>
                  <Feather
                    name={item.status === 'completed' ? 'check-circle' : 'clock'}
                    size={20}
                    color={item.status === 'completed' ? '#16a34a' : '#f59e0b'}
                  />
                </View>

                <View style={styles.scheduleContent}>
                  <Text style={styles.scheduleDate}>{item.date}</Text>
                  <Text style={styles.scheduleSlot}>{item.slot}</Text>
                </View>

                <View style={styles.scheduleAmount}>
                  <Text style={styles.scheduleAmountValue}>{item.amount} L</Text>
                  <Text style={styles.scheduleAmountLabel}>
                    {item.status === 'completed' ? 'Used' : 'Allocated'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/farmer/usage-history')}
            >
              <Feather name="bar-chart-2" size={18} color={Theme.colors.primary} />
              <Text style={styles.secondaryButtonText}>Usage History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/farmer')}
            >
              <Feather name="home" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Home</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.lastUpdated}>
            Last updated: {new Date(allocation.lastUpdated).toLocaleString()}
          </Text>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Theme.colors.textSecondary,
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
  refreshBtn: {
    padding: 8,
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
  allocationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  allocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  allocationLabel: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  allocationValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  allocationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${Theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allocationDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Theme.colors.text,
  },
  statusBadge: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reservoirCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
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
  reservoirBar: {
    height: 12,
    backgroundColor: '#e5e5e5',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  reservoirFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
  },
  reservoirStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reservoirStat: {
    alignItems: 'center',
  },
  reservoirStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  reservoirStatLabel: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scheduleStatus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleDate: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  scheduleSlot: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  scheduleAmount: {
    alignItems: 'flex-end',
  },
  scheduleAmountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  scheduleAmountLabel: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
  lastUpdated: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
});
