import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const NOTIFICATIONS = [
    { id: '1', title: 'Water Allocation Approved', message: 'Your request for 500L has been approved.', time: '2 mins ago', type: 'success', read: false },
    { id: '2', title: 'Critical Low Level', message: 'Main Reservoir is below 20% capacity.', time: '1 hour ago', type: 'critical', read: false },
    { id: '3', title: 'Weather Alert', message: 'Heavy rain expected tomorrow. Delay irrigation.', time: '5 hours ago', type: 'info', read: true },
    { id: '4', title: 'Weekly Report Ready', message: 'Your farming insights for last week are available.', time: '1 day ago', type: 'info', read: true },
];

export default function Notifications() {
    const router = useRouter();
    const [list, setList] = useState(NOTIFICATIONS);

    const markAllRead = () => {
        setList(list.map(n => ({ ...n, read: true })));
    };

    const renderItem = ({ item }: { item: typeof NOTIFICATIONS[0] }) => (
        <TouchableOpacity style={[styles.card, !item.read && styles.unreadCard]}>
            <View style={[styles.iconBox,
            item.type === 'success' && { backgroundColor: '#dcfce7' },
            item.type === 'critical' && { backgroundColor: '#fee2e2' },
            item.type === 'info' && { backgroundColor: '#e0f2fe' },
            ]}>
                <Feather
                    name={item.type === 'success' ? 'check-circle' : item.type === 'critical' ? 'alert-triangle' : 'info'}
                    size={20}
                    color={
                        item.type === 'success' ? Theme.colors.success :
                            item.type === 'critical' ? Theme.colors.error : Theme.colors.primary
                    }
                />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color={Theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity onPress={markAllRead}>
                    <Text style={styles.actionText}>Read All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={list}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Feather name="bell-off" size={48} color={Theme.colors.textMuted} />
                        <Text style={styles.emptyText}>No notifications</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.bg },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
        justifyContent: 'space-between',
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.text },
    actionText: { fontSize: 14, fontWeight: '600', color: Theme.colors.primary },
    list: { padding: 16, gap: 12 },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        gap: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    unreadCard: {
        backgroundColor: '#f8fafc', // Slight off-white/blue tint
        borderColor: '#e2e8f0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconBox: {
        width: 40, height: 40, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    textContainer: { flex: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    title: { fontSize: 15, fontWeight: '600', color: Theme.colors.text },
    unreadTitle: { fontWeight: 'bold', color: '#0f172a' },
    time: { fontSize: 11, color: Theme.colors.textMuted },
    message: { fontSize: 13, color: Theme.colors.textMuted, lineHeight: 18 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.primary, position: 'absolute', right: 16, top: 16 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, gap: 16 },
    emptyText: { fontSize: 16, color: Theme.colors.textMuted },
});
