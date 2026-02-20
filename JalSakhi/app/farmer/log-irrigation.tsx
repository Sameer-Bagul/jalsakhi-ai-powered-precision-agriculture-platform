import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { useApp } from '../../context/AppContext';
import { Feather } from '@expo/vector-icons';

export default function LogIrrigation() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const farmId = params.farmId as string | undefined;
  const { addIrrigationLog } = useApp();

  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount) {
      Alert.alert('Missing', 'Enter amount in liters');
      return;
    }
    setLoading(true);
    try {
      await addIrrigationLog({
        farmId: farmId || 'unknown',
        date: new Date().toISOString(),
        amount: parseFloat(amount),
        duration,
        notes,
      });
      Alert.alert('Logged', 'Manual irrigation logged');
      router.replace({ pathname: '/farmer/my-farm-detail', params: { id: farmId } } as any);
    } catch (error) {
      console.error('Log irrigation error', error);
      Alert.alert('Error', 'Failed to log irrigation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Log Irrigation' }} />
      <View style={styles.content}>
        <Text style={styles.label}>Amount (Liters)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} placeholder="e.g., 200" />

        <Text style={styles.label}>Duration (e.g., 30 mins)</Text>
        <TextInput style={styles.input} value={duration} onChangeText={setDuration} placeholder="e.g., 30 mins" />

        <Text style={styles.label}>Notes</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={notes} onChangeText={setNotes} placeholder="Optional notes" multiline />

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
          <Feather name="save" size={16} color="#fff" />
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Log Irrigation'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bg, overflow: 'hidden' as const },
  content: { padding: 16 },
  label: { fontSize: 14, color: Theme.colors.text, marginTop: 12 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: Theme.colors.border, marginTop: 8 },
  button: { marginTop: 20, backgroundColor: Theme.colors.primary, padding: 14, borderRadius: 12, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', marginLeft: 6 }
});
