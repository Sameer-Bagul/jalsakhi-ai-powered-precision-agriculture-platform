import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Farm } from '../../services/farms';
import { useApp } from '../../context/AppContext';
import { useIsFocused } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function MyFarmsScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const { farms, farmsLoading, loadFarms, deleteFarm } = useApp();

    useEffect(() => {
        loadFarms();
    }, []);

    // Refresh when screen comes back into focus
    useEffect(() => {
        if (isFocused) loadFarms();
    }, [isFocused]);

    const handleDelete = (id: string) => {
        Alert.alert('Delete farm', 'Are you sure you want to delete this farm?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteFarm(id) }
        ]);
    };

    const renderFarmItem = ({ item }: { item: Farm }) => (
        <View style={styles.farmCard}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push({ pathname: '/farmer/my-farm-detail', params: { id: item.id } } as any)}>
                <Image source={{ uri: item.image }} style={styles.farmImage} />
                <View style={styles.farmContent}>
                    <View style={styles.farmHeader}>
                        <Text style={styles.farmName}>{item.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Optimal' ? Theme.colors.dew : '#fef2f2' }]}>
                            <Text style={[styles.statusText, { color: item.status === 'Optimal' ? Theme.colors.emerald : Theme.colors.error }]}>
                                {item.status}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.farmDetails}>
                        <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="sprout" size={16} color={Theme.colors.moss} />
                            <Text style={styles.detailText}>{item.crop}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Feather name="map" size={16} color={Theme.colors.moss} />
                            <Text style={styles.detailText}>{item.size}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.cardActionBtn} onPress={() => handleDelete(item.id)}>
                    <Feather name="trash-2" size={18} color={Theme.colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Farms</Text>
            </View>

            <FlatList
                data={farms}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={renderFarmItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', paddingTop: 60 }}>
                        <MaterialCommunityIcons name="sprout-outline" size={48} color={Theme.colors.textMuted} />
                        <Text style={{ color: Theme.colors.textMuted, marginTop: 12 }}>
                            {farmsLoading ? 'Loading farms...' : 'No farms yet. Tap + to add one!'}
                        </Text>
                    </View>
                }
            />

            {/* Floating Add Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/farmer/my-farms-add-edit')}
            >
                <Feather name="plus" size={20} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bg,
        overflow: 'hidden' as const,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Theme.colors.forest,
    },
    list: {
        padding: 16,
        gap: 16,
        paddingBottom: 80,
    },
    farmCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    farmImage: {
        width: '100%',
        height: 150,
        backgroundColor: Theme.colors.dew,
    },
    farmContent: {
        padding: 16,
    },
    farmHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    farmName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    farmDetails: {
        flexDirection: 'row',
        gap: 16,
    },
    cardActions: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        gap: 8,
    },
    cardActionBtn: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 14,
        color: Theme.colors.textMuted,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 28,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
        elevation: 6,
    },
});
