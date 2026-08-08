/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#241b16",
        cream: "#faf5ea",
        brand: {
          DEFAULT: "#8c3a3a",
          dark: "#5e2626",
          light: "#f3e3e0",
        },
        gold: {
          DEFAULT: "#b8863c",
          light: "#f2e6d0",
        },
      },
      fontFamily: {
        serif: ["Georgia", "'Times New Roman'", "serif"],
      },
    },
  },
  plugins: [],
};
