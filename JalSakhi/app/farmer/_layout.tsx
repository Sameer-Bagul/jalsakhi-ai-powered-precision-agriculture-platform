import React from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function FarmerLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const hideBar = pathname?.startsWith('/farmer/chatbot');

    return (
        <>
        <Tabs
            screenOptions={{
                headerShown: false,
                // hide default tab bar, we'll render a custom minimal bar
                tabBarStyle: { display: 'none' },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
                }}
            />
            {/* Keep minimal visible tabs: Dashboard, My Farms, Profile */}
            <Tabs.Screen
                name="my-farms"
                options={{
                    title: 'My Farms',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="sprout-outline" size={24} color={color} />,
                }}
            />
            {/* Other routes remain accessible via router.push but are not declared as tab items here */}
            {/* profile handled as top-level route via custom bottom bar */}
        </Tabs>

        {/* Custom minimal bottom bar (hidden on chat page) */}
        {!hideBar && (
        <View style={styles.bottomBar} pointerEvents="box-none">
            <View style={styles.bottomBarInner}>
                <TouchableOpacity style={styles.tabBtn} onPress={() => router.push('/farmer/dashboard')}>
                    <Feather name="home" size={20} color="white" />
                    <Text style={styles.tabLabel}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabBtn} onPress={() => router.push('/farmer/my-farms')}>
                    <MaterialCommunityIcons name="sprout-outline" size={20} color="white" />
                    <Text style={styles.tabLabel}>Farms</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabBtn} onPress={() => router.push('/profile')}>
                    <Feather name="user" size={20} color="white" />
                    <Text style={styles.tabLabel}>Profile</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.tabBtn} onPress={() => router.push('/farmer/chatbot')}>
                    <Feather name="message-circle" size={20} color="white" />
                    <Text style={styles.tabLabel}>Chat</Text>
                </TouchableOpacity>
            </View>
        </View>
        )}
        </>
    );
}

const styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    bottomBarInner: {
        margin: 12,
        borderRadius: 12,
        backgroundColor: Theme.colors.primary,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    tabBtn: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 11,
        color: 'white',
        marginTop: 2,
    },
});
