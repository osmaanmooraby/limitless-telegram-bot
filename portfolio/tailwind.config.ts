import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C97A",
          bright: "#FFD700",
          deep: "#A07830",
        },
        emerald: {
          DEFAULT: "#10B981",
          dark: "#059669",
          glow: "#00C6A7",
          deep: "#047857",
        },
        silver: {
          DEFAULT: "#C0C0C0",
          light: "#E8E8E8",
          dark: "#8A8A8A",
        },
        obsidian: {
          DEFAULT: "#050505",
          light: "#0D0D0D",
          mid: "#111111",
          card: "#141414",
          border: "#1A1A1A",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Playfair Display'", "serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "counter": "counter 2s ease-out",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "border-glow": "borderGlow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(201,168,76,0.3)" },
          "50%": { borderColor: "rgba(201,168,76,0.8)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C, #FFD700, #C9A84C)",
        "emerald-gradient": "linear-gradient(135deg, #10B981, #00C6A7, #10B981)",
        "dark-gradient": "linear-gradient(180deg, #050505 0%, #0D0D0D 100%)",
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        "gold": "0 0 20px rgba(201,168,76,0.3), 0 0 40px rgba(201,168,76,0.1)",
        "gold-lg": "0 0 40px rgba(201,168,76,0.4), 0 0 80px rgba(201,168,76,0.2)",
        "emerald": "0 0 20px rgba(16,185,129,0.3), 0 0 40px rgba(16,185,129,0.1)",
        "emerald-lg": "0 0 40px rgba(16,185,129,0.4)",
        "glass": "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card": "0 20px 60px rgba(0,0,0,0.8)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
