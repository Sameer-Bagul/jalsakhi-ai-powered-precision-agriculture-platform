import React from 'react';
import { Tabs } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function FarmerLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
                tabBarStyle: {
                    backgroundColor: Theme.colors.primary,
                    borderTopWidth: 0,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="my-farms"
                options={{
                    title: 'My Farms',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="sprout-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="irrigation-details"
                options={{
                    title: 'Irrigation',
                    tabBarIcon: ({ color }) => <Feather name="droplet" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="weather"
                options={{
                    title: 'Weather',
                    tabBarIcon: ({ color }) => <Feather name="cloud" size={24} color={color} />,
                    href: null, // Hide from tab bar if not needed, or keep it.
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    href: null, // Hide index from tab bar
                }}
            />
            <Tabs.Screen
                name="crop-water-prediction"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="soil-moisture-forecast"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="alerts"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="usage-history"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
                    href: '/profile', // Explicitly point to the shared profile route
                }}
            />
        </Tabs>
    );
}
