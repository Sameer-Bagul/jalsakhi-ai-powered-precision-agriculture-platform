import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { CustomButton } from '../../components/shared/CustomButton';

export default function IrrigationDetailsScreen() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Irrigation Details', headerShown: true }} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.recommendationCard}>
                    <Text style={styles.recLabel}>Today's Recommendation</Text>
                    <Text style={styles.recTitle}>Water all fields for 45 mins</Text>
                    <View style={styles.divider} />
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statLabel}>Best Time</Text>
                            <Text style={styles.statValue}>6:00 AM</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statLabel}>Water Quota</Text>
                            <Text style={styles.statValue}>1,200 Liters</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.scheduleSection}>
                    <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
                    {[
                        { day: 'Wednesday', time: '6:30 AM', duration: '30 mins' },
                        { day: 'Friday', time: '6:00 AM', duration: '45 mins' },
                    ].map((item, index) => (
                        <View key={index} style={styles.scheduleItem}>
                            <View>
                                <Text style={styles.itemDay}>{item.day}</Text>
                                <Text style={styles.itemTime}>{item.time}</Text>
                            </View>
                            <Text style={styles.itemDuration}>{item.duration}</Text>
                        </View>
                    ))}
                </View>

                <CustomButton title="Log Manual Irrigation" onPress={() => router.push('/farmer/log-irrigation')} type="outline" />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    content: { padding: Theme.spacing.md },
    recommendationCard: { backgroundColor: Theme.colors.emerald, borderRadius: Theme.roundness.lg, padding: Theme.spacing.lg, marginBottom: 24 },
    recLabel: { color: Theme.colors.leaf, fontSize: 14 },
    recTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 8 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 16 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    stat: { flex: 1 },
    statLabel: { color: Theme.colors.leaf, fontSize: 12 },
    statValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginTop: 4 },
    scheduleSection: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.forest, marginBottom: 16 },
    scheduleItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: Theme.colors.card, padding: Theme.spacing.md, borderRadius: Theme.roundness.md,
        marginBottom: 12, borderWidth: 1, borderColor: Theme.colors.border,
    },
    itemDay: { fontSize: 16, fontWeight: '600', color: Theme.colors.forest, },
    itemTime: { fontSize: 14, color: Theme.colors.moss },
    itemDuration: { fontSize: 14, fontWeight: '700', color: Theme.colors.emerald },
});
