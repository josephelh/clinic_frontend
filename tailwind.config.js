/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
     colors: {
        // Horizon UI core colors
        brand: {
          50: "#EBEFFF",
          100: "#D1DBFF",
          200: "#B8C7FF",
          300: "#A1B4FF",
          400: "#8EA1FF",
          500: "#422AFB", // This is the primary purple/blue
          600: "#3311DB",
          700: "#2111A5",
          800: "#190793",
          900: "#11047A",
        },
        navy: {
          50: "#E2E8F0",
          100: "#CBD5E1",
          200: "#94A3B8",
          300: "#64748B",
          400: "#475569",
          500: "#334155",
          600: "#1E293B",
          700: "#111C44", // Most of your text uses this
          800: "#0F172A",
          900: "#0B1437", // The deep sidebar/card color
        },
    },
  },
  plugins: [
    require('tailwindcss-rtl'), // Add this
  ],
}
}