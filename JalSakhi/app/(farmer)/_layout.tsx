import React from 'react';
import { Stack } from 'expo-router';
import { Theme } from '../../constants/JalSakhiTheme';

export default function FarmerLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: Theme.colors.background,
                },
                headerTintColor: Theme.colors.forest,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
