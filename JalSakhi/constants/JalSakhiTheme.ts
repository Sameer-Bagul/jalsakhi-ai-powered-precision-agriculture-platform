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

    // UI Colors
    background: '#F8FAF8', // Very faint green-white
    card: '#FFFFFF',
    text: '#081C15',
    textSecondary: '#2D6A4F',
    border: '#B7E4C7',

    // Dynamic
    success: '#52B788',
    warning: '#FFB703',
    error: '#EF476F',
    info: '#118AB2',
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
