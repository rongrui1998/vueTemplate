import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e8ecff',
          200: '#cad6ff',
          300: '#a5b8ff',
          400: '#7c93ff',
          500: '#5f73f6',
          600: '#4c5be0',
          700: '#3e49bc',
          800: '#343d98',
          900: '#2f3978',
        },
      },
      boxShadow: {
        panel: '0 14px 36px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
