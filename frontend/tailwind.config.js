/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede6',
          200: '#c5dcd0',
          300: '#9dc2b0',
          400: '#6ea18a',
          500: '#4a846c',
          600: '#386a55',
          700: '#2d5545',
          800: '#254438',
          900: '#1b4332',
          950: '#10271d',
        },
        amber: {
          warm: '#f4a261',
          golden: '#e76f51',
        },
        offwhite: '#faf8f5',
        charcoal: {
          light: '#374151',
          DEFAULT: '#1f2937',
          dark: '#111827',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
