// ---------------------------------------------------------------------------
// Module shims — these packages are installed in node_modules but do not ship
// TypeScript declaration files. We declare them here so tsc is satisfied.
// ---------------------------------------------------------------------------

declare module 'react-i18next' {
    import { TFunction } from 'i18next';
    export function useTranslation(ns?: string): { t: TFunction; i18n: any };
    export function initReactI18next(): any;
    const initReactI18next: any;
    export { initReactI18next };
}

declare module 'i18next' {
    export interface TFunction {
        (key: string, options?: Record<string, any>): string;
        (key: string, defaultValue?: string, options?: Record<string, any>): string;
    }
    const i18n: {
        use: (plugin: any) => typeof i18n;
        init: (options: any) => Promise<TFunction>;
        changeLanguage: (lang: string) => Promise<TFunction>;
        language: string;
        t: TFunction;
    };
    export default i18n;
}

declare module 'expo-localization' {
    export const locale: string;
    export const locales: string[];
    export const timezone: string;
    export const isRTL: boolean;
    export function getLocales(): Array<{ languageTag: string; languageCode: string; regionCode: string }>;
}

declare module '@react-native-async-storage/async-storage' {
    const AsyncStorage: {
        getItem(key: string): Promise<string | null>;
        setItem(key: string, value: string): Promise<void>;
        removeItem(key: string): Promise<void>;
        mergeItem(key: string, value: string): Promise<void>;
        clear(): Promise<void>;
        getAllKeys(): Promise<string[]>;
        multiGet(keys: string[]): Promise<[string, string | null][]>;
        multiSet(keyValuePairs: [string, string][]): Promise<void>;
        multiRemove(keys: string[]): Promise<void>;
    };
    export default AsyncStorage;
}

declare module 'expo-blur' {
    import { ViewProps } from 'react-native';
    import React from 'react';
    interface BlurViewProps extends ViewProps {
        intensity?: number;
        tint?: 'light' | 'dark' | 'default' | 'extraLight' | 'prominent' | 'systemUltraThinMaterial' | string;
        experimentalBlurMethod?: string;
    }
    export class BlurView extends React.Component<BlurViewProps> { }
}

declare module '@react-native-picker/picker' {
    import React from 'react';
    import { ViewStyle, TextStyle } from 'react-native';
    interface PickerProps<T = any> {
        selectedValue?: T;
        onValueChange?: (itemValue: T, itemIndex: number) => void;
        style?: ViewStyle | TextStyle;
        enabled?: boolean;
        mode?: 'dialog' | 'dropdown';
        itemStyle?: TextStyle;
        prompt?: string;
        children?: React.ReactNode;
    }
    interface PickerItemProps {
        label: string;
        value: any;
        color?: string;
        testID?: string;
    }
    class Picker<T = any> extends React.Component<PickerProps<T>> {
        static Item: React.ComponentType<PickerItemProps>;
    }
    export { Picker };
}

// Old Expo template alias paths — used by some template components (parallax, themed-*)
declare module '@/hooks/use-color-scheme' {
    export function useColorScheme(): 'light' | 'dark' | null;
}
declare module '@/hooks/use-theme-color' {
    export function useThemeColor(props: { light?: string; dark?: string }, colorName: string): string;
}
