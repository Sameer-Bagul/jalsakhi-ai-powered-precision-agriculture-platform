import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { useApp } from '../../context/AppContext';
import { Feather } from '@expo/vector-icons';

export default function MyFarmsAddEdit() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editingId = params.id as string | undefined;
  const { getFarm, createFarm, updateFarm } = useApp();

  const [name, setName] = useState('');
  const [crop, setCrop] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingId) {
      (async () => {
        const f = await getFarm(editingId);
        if (f) {
          setName(f.name);
          setCrop(f.crop);
          setSize(f.size);
        }
      })();
    }
  }, [editingId]);

  const handleSave = async () => {
    if (!name || !crop || !size) {
      Alert.alert('Missing fields', 'Please provide name, crop and size.');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateFarm(editingId, { name, crop, size });
        Alert.alert('Saved', 'Farm updated.');
      } else {
        await createFarm({ name, crop, size, status: 'Unknown' });
        Alert.alert('Saved', 'Farm created.');
      }
      router.replace('/farmer/my-farms');
    } catch (error) {
      console.error('Save farm error', error);
      Alert.alert('Error', 'Failed to save farm.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: editingId ? 'Edit Farm' : 'Add Farm' }} />
      <View style={styles.content}>
        <Text style={styles.label}>Farm Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g., North Field" />

        <Text style={styles.label}>Primary Crop</Text>
        <TextInput style={styles.input} value={crop} onChangeText={setCrop} placeholder="e.g., Wheat" />

        <Text style={styles.label}>Area (Acres)</Text>
        <TextInput style={styles.input} value={size} onChangeText={setSize} placeholder="e.g., 3.5" keyboardType="numeric" />

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleSave} disabled={loading}>
          <Feather name="save" size={18} color="#fff" />
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Farm'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bg, overflow: 'hidden' as const },
  content: { padding: 16 },
  label: { fontSize: 14, color: Theme.colors.text, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: Theme.colors.border },
  button: { marginTop: 24, backgroundColor: Theme.colors.primary, padding: 14, borderRadius: 12, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
