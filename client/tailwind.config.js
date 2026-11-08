/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm off-white canvas and surfaces
        canvas: "#FAF8F5",
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F5EFEB",
          muted: "#EAE3D9",
          hover: "#F9F5F0",
          card: "#FFFFFF",
        },
        // Deep charcoal text hierarchy
        charcoal: {
          DEFAULT: "#1C1917", // Primary heading/text
          secondary: "#57534E",
          muted: "#8C857B",
          subtle: "#B8B2A8",
        },
        // Sophisticated Terracotta / Burnt Sienna accent
        terracotta: {
          50:  "#FDF7F4",
          100: "#FBECE6",
          200: "#F6D8CC",
          300: "#EEB8A5",
          400: "#E28F72",
          500: "#C85A32", // Primary Brand Accent
          600: "#B24823",
          700: "#913516",
          800: "#742B14",
          900: "#4C1C0D",
        },
        // Subtle Neutral Borders
        neutralBorder: {
          light: "#EFEAE2",
          DEFAULT: "#E4DDD2",
          strong: "#CEC5B6",
        },
        // Culinary Symbols & Semantic Indicators
        culinary: {
          veg: "#2D6A4F",
          vegBg: "#EFF7F2",
          nonveg: "#9E2A2B",
          nonvegBg: "#FDF2F2",
          gold: "#D4A373",
          goldBg: "#FAF4EC",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Plus Jakarta Sans'", "Inter", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        "warm-xs": "0 1px 2px rgba(28, 25, 23, 0.04)",
        "warm-sm": "0 2px 6px -1px rgba(28, 25, 23, 0.05), 0 1px 3px -1px rgba(28, 25, 23, 0.03)",
        "warm-md": "0 6px 18px -2px rgba(28, 25, 23, 0.06), 0 2px 6px -1px rgba(28, 25, 23, 0.03)",
        "warm-lg": "0 14px 34px -4px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.04)",
        "terracotta": "0 4px 16px -2px rgba(200, 90, 50, 0.28)",
      },
      borderRadius: {
        "xl": "0.75rem",
        "2xl": "1.125rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
}
