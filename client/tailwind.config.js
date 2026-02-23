/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // lemonO brand colors - calm, minimal, neutral
        cream: {
          50: '#FEFDFB',
          100: '#FDF9F3',
          200: '#FAF5EB',
          300: '#F5EEE0',
        },
        charcoal: {
          300: '#6B7280',
          400: '#4B5563',
          500: '#374151',
          600: '#1F2937',
          700: '#111827',
        },
        earth: {
          100: '#F5F0EB',
          200: '#E8DED3',
          300: '#D4C4B0',
          400: '#B8A082',
          500: '#9C8565',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subheading': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [],
}
