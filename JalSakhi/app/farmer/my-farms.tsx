import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { FarmsService, Farm } from '../../services/farms';
import { useIsFocused } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const SAMPLE_FARMS: Farm[] = [
    { id: '1', name: 'North Field', crop: 'Wheat', size: '3.5 Acres', status: 'Optimal', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop' },
    { id: '2', name: 'River Bank', crop: 'Rice', size: '2.5 Acres', status: 'Needs Water', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1000&auto=format&fit=crop' },
    { id: '3', name: 'Hill Side', crop: 'Cotton', size: '1.5 Acres', status: 'Optimal', image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=1000&auto=format&fit=crop' },
];

export default function MyFarmsScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const [farms, setFarms] = useState<Farm[]>([]);

    useEffect(() => {
        const load = async () => {
            const list = await FarmsService.list();
            if (!list || list.length === 0) {
                // seed sample farms for first run
                for (const f of SAMPLE_FARMS) {
                    await FarmsService.create(f);
                }
                setFarms(SAMPLE_FARMS);
            } else {
                setFarms(list);
            }
        };
        load();
    }, []);

    // reload when screen focuses (after add/edit/delete)
    useEffect(() => {
        if (!isFocused) return;
        (async () => {
            const list = await FarmsService.list();
            setFarms(list);
        })();
    }, [isFocused]);

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
                <TouchableOpacity style={styles.cardActionBtn} onPress={() => {
                    // confirm delete
                    Alert.alert('Delete farm', 'Are you sure you want to delete this farm?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: async () => { await FarmsService.remove(item.id); const list = await FarmsService.list(); setFarms(list); } }
                    ]);
                }}>
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
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    list: {
        padding: 16,
        gap: 16,
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
