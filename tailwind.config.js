/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors'); // ✅ Import colors from Tailwind

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.gray, // ✅ Now correctly imported
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
            backdropBlur: {
        lg: "16px",
      },
      boxShadow: {
        'neon-blue': '0 0 5px theme("colors.cyan.400"), 0 0 20px theme("colors.cyan.600")',
        'neon-purple': '0 0 5px theme("colors.purple.400"), 0 0 20px theme("colors.purple.600")',
      },
      backgroundColor: {
        'glass-panel': 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
};
