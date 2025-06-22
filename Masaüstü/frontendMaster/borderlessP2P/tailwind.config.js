/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFCC00', // Ana sarı renk
          50: '#FFFDF2',
          100: '#FFFBE6',
          200: '#FFF7CC',
          300: '#FFF3B3',
          400: '#FFEF99',
          500: '#FFEB80',
          600: '#FFE766',
          700: '#FFE34D',
          800: '#FFDF33',
          900: '#FFDB1A',
        },
        secondary: {
          DEFAULT: '#111111', // Koyu gri/siyah
        },
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      transitionDuration: {
        '120': '120ms',
        '200': '200ms',
      },
      scale: {
        '108': '1.08',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'tab': '0 1px 3px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'tab': '0.5rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
} 