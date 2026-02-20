/**
 * JalSakhi Color Palette
 * Focused on shades of green for a premium, farm-centric UI.
 */

export const JalSakhiColors = {
    // Primary Greens
    forest: '#1B4332',
    emerald: '#2D6A4F',
    moss: '#40916C',
    sage: '#52B788',
    mint: '#74C69D',
    pale: '#95D5B2',
    leaf: '#B7E4C7',
    dew: '#D8F3DC',

    // HTML Reference Colors
    primary: '#166534',
    secondary: '#059669',
    primaryLight: '#15803d',
    primaryPale: '#dcfce7',
    primaryMid: '#86efac',
    accent: '#22c55e',
    accentDark: '#16a34a',
    bg: '#f0fdf4',
    bg2: '#ffffff',
    textMid: '#166534',
    textLight: '#4ade80',
    textMuted: '#6b7280',
    border: '#bbf7d0', // Updated border color match

    // UI Colors
    background: '#f0fdf4', // Updated to match HTML bg
    card: '#FFFFFF',
    text: '#14532d', // Updated to match HTML text
    textSecondary: '#2D6A4F',
    // border: '#B7E4C7', // Removed old border
    shadow: 'rgba(22,101,52,0.08)',

    // Dynamic
    success: '#16a34a', // Updated
    warning: '#f59e0b', // Updated
    error: '#ef4444',   // Updated
    info: '#3b82f6',    // Updated
    gold: '#FFD700',    // Added for high visibility
};

export const Theme = {
    colors: JalSakhiColors,
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    roundness: {
        sm: 8,
        md: 16,
        lg: 24,
        full: 9999,
    }
};
