import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Farm, IrrigationLog } from '../../services/farms';
import { useApp } from '../../context/AppContext';
import { Feather } from '@expo/vector-icons';

export default function MyFarmDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const { getFarm, deleteFarm, irrigationLogs, loadIrrigationLogs } = useApp();

  const [farm, setFarm] = useState<Farm | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const f = await getFarm(id);
        if (f) {
          setFarm(f);
          await loadIrrigationLogs(id);
        }
      }
    })();
  }, [id]);

  const logs = irrigationLogs[id] || [];

  const handleEdit = () => router.push({ pathname: '/farmer/my-farms-add-edit', params: { id } } as any);

  const handleDelete = async () => {
    Alert.alert('Confirm', 'Delete this farm?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteFarm(id);
          router.replace('/farmer/my-farms');
        }
      }
    ]);
  };

  const handleLog = () => router.push({ pathname: '/farmer/log-irrigation', params: { farmId: id } } as any);

  if (!farm) return (
    <View style={styles.center}><Text style={{ color: Theme.colors.textSecondary }}>Loading farm...</Text></View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: farm.name }} />
      <View style={styles.header}>
        <Text style={styles.name}>{farm.name}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleEdit}><Feather name="edit" size={18} color={Theme.colors.primary} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleDelete}><Feather name="trash" size={18} color={Theme.colors.error} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Crop</Text>
        <Text style={styles.infoValue}>{farm.crop}</Text>
        <Text style={styles.infoLabel}>Size</Text>
        <Text style={styles.infoValue}>{farm.size}</Text>
        <Text style={styles.infoLabel}>Status</Text>
        <Text style={styles.infoValue}>{farm.status}</Text>
      </View>

      <TouchableOpacity style={styles.logBtn} onPress={handleLog}><Feather name="plus" size={16} color="#fff" /><Text style={styles.logText}>Log Manual Irrigation</Text></TouchableOpacity>

      <Text style={styles.sectionTitle}>Irrigation History</Text>
      <FlatList data={logs} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={styles.logItem}>
          <Text style={styles.logDate}>{new Date(item.date).toLocaleString()}</Text>
          <Text style={styles.logAmount}>{item.amount} L</Text>
        </View>
      )} ListEmptyComponent={<Text style={{ color: Theme.colors.textSecondary }}>No logs yet.</Text>} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Theme.colors.bg, overflow: 'hidden' as const },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700', color: Theme.colors.text },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 8, borderRadius: 8, backgroundColor: '#fff' },
  infoCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  infoLabel: { fontSize: 12, color: Theme.colors.textSecondary, marginTop: 8 },
  infoValue: { fontSize: 16, fontWeight: '600', color: Theme.colors.text },
  logBtn: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.colors.primary, padding: 14, borderRadius: 12, marginVertical: 12 },
  logText: { color: '#fff', fontWeight: '600', marginLeft: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Theme.colors.text, marginTop: 12, marginBottom: 8 },
  logItem: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  logDate: { color: Theme.colors.textSecondary },
  logAmount: { fontWeight: '700', color: Theme.colors.primary }
});
