/**
 * Design Tokens for Premium Food-Tech Platform
 * Conforming to brand direction:
 * - Warm off-white backgrounds
 * - Deep charcoal typography
 * - Sophisticated terracotta/orange accent
 * - Subtle neutral borders
 * - Warm soft shadows
 */

export const colors = {
  // Background & Surfaces
  canvas: '#FAF8F5',       // Warm off-white body canvas
  surface: {
    DEFAULT: '#FFFFFF',    // Crisp white card surface
    subtle: '#F4EFEB',     // Warm secondary surface for badges/chips
    muted: '#EAE4DC',      // Inactive/muted surface
    hover: '#F7F3EE',      // Hover state on light cards
  },
  
  // Charcoal Text Hierarchy
  charcoal: {
    DEFAULT: '#1C1917',    // Deep Charcoal (Headings & Primary text)
    secondary: '#57534E',  // Warm medium charcoal (Body & Subheadings)
    muted: '#8C857B',      // Warm muted subtext (Meta, timestamps)
    subtle: '#B8B2A8',     // Placeholders, disabled text
  },

  // Primary Accent: Sophisticated Terracotta / Burnt Paprika
  terracotta: {
    50: '#FDF6F3',
    100: '#FBE9E3',
    200: '#F7D4C8',
    300: '#F0B29E',
    400: '#E48467',
    500: '#C85A32',        // Primary brand accent
    600: '#B24723',        // Hover / Active
    700: '#913618',
    800: '#742D16',
    900: '#4B1C0E',
  },

  // Culinary & Semantic Accents
  culinary: {
    veg: '#2D6A4F',        // Indian veg symbol deep sage green
    vegBg: '#EBF4F0',
    nonveg: '#9E2A2B',     // Indian non-veg symbol ruby crimson
    nonvegBg: '#F9ECEC',
    gold: '#D4A373',       // Rating star warm gold
  },

  // Subtle Neutral Borders
  border: {
    light: '#EFEAE2',
    DEFAULT: '#E4DDD2',
    strong: '#CEC5B6',
  },
};

export const typography = {
  fontFamily: {
    display: ["'Playfair Display'", 'Georgia', 'serif'],
    body: ["'Plus Jakarta Sans'", 'Inter', 'system-ui', 'sans-serif'],
  },
};

export const shadows = {
  sm: '0 1px 3px rgba(28, 25, 23, 0.05)',
  warm: '0 4px 16px -2px rgba(28, 25, 23, 0.06), 0 2px 6px -1px rgba(28, 25, 23, 0.03)',
  warmLg: '0 12px 32px -4px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.04)',
  terracotta: '0 4px 14px 0 rgba(200, 90, 50, 0.25)',
};

export const radius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.25rem',// 20px
  '3xl': '1.75rem',// 28px
  full: '9999px',
};

