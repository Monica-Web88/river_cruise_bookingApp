/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm off-white backgrounds
        cream: { 50: '#FFFDF8', 100: '#FAF6EE', 200: '#F3EBDD' },
        // Soft light-brown accents
        sand: {
          100: '#EFE3D3',
          200: '#E2CFB6',
          300: '#D3B896',
          400: '#C2A07B',
          500: '#A98467',
          600: '#8B6B52',
          700: '#6F5441',
        },
        // Deep brown for text
        bark: { 600: '#5A463A', 800: '#3B2F27', 900: '#2B221C' },
        // Light river blues
        mist: {
          50: '#F0F7FB',
          100: '#DCECF4',
          200: '#C2DCEA',
          300: '#A3C9DC',
          400: '#7FB0C9',
          500: '#5E96B3',
          600: '#467D99',
          700: '#3A667E',
          800: '#2F5164',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(59,47,39,.05), 0 8px 24px -12px rgba(59,47,39,.18)',
        lift: '0 2px 4px rgba(59,47,39,.06), 0 18px 36px -16px rgba(59,47,39,.28)',
      },
      borderRadius: { '4xl': '2rem' },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp .7s ease-out both',
        drift: 'drift 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
