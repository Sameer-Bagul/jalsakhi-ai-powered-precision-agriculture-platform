import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';

const FARMS = [
    { id: '1', name: 'North Field', crop: 'Wheat', size: '3.5 Acres', status: 'Optimal' },
    { id: '2', name: 'River Bank', crop: 'Rice', size: '2.5 Acres', status: 'Needs Water' },
    { id: '3', name: 'Hill Side', crop: 'Cotton', size: '1.5 Acres', status: 'Optimal' },
];

export default function MyFarmsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'My Farms', headerShown: true }} />
            <FlatList
                data={FARMS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.farmCard}>
                        <View style={styles.farmHeader}>
                            <Text style={styles.farmName}>{item.name}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: item.status === 'Optimal' ? Theme.colors.dew : '#FFE5E5' }]}>
                                <Text style={[styles.statusText, { color: item.status === 'Optimal' ? Theme.colors.emerald : '#FF4D4D' }]}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.farmDetails}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Crop</Text>
                                <Text style={styles.detailValue}>{item.crop}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Size</Text>
                                <Text style={styles.detailValue}>{item.size}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    list: { padding: Theme.spacing.md, gap: Theme.spacing.md },
    farmCard: {
        backgroundColor: Theme.colors.card, borderRadius: Theme.roundness.md,
        padding: Theme.spacing.md, borderWidth: 1, borderColor: Theme.colors.border,
    },
    farmHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    farmName: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.forest },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 12, fontWeight: '600' },
    farmDetails: { flexDirection: 'row', gap: 24 },
    detailItem: { flex: 1 },
    detailLabel: { fontSize: 12, color: Theme.colors.moss },
    detailValue: { fontSize: 14, fontWeight: '600', color: Theme.colors.forest, marginTop: 2 },
});
