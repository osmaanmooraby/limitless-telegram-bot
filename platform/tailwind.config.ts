import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf0',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#D4AF37',
          600: '#B8960C',
          700: '#92740A',
          800: '#78600C',
          900: '#6B5310',
          950: '#3C2E00',
        },
        dark: {
          50: '#1a1a1a',
          100: '#141414',
          200: '#111111',
          300: '#0e0e0e',
          400: '#0b0b0b',
          500: '#080808',
          600: '#050505',
          700: '#030303',
          800: '#020202',
          900: '#010101',
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          elevated: 'rgba(255,255,255,0.07)',
          border: 'rgba(255,255,255,0.08)',
          highlight: 'rgba(212,175,55,0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'ticker': 'ticker 30s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212,175,55,0.6)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'ticker': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'shimmer': {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5E47E 50%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.3) 50%, transparent 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(212,175,55,0.3)',
        'gold-sm': '0 0 15px rgba(212,175,55,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        'glow-green': '0 0 20px rgba(34,197,94,0.3)',
        'glow-red': '0 0 20px rgba(239,68,68,0.3)',
      },
    },
  },
  plugins: [],
}
export default config
