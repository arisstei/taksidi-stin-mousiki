/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.js",
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
        teal: {
          DEFAULT: "#3f6d64",
          light: "#e3ece9",
        },
        clay: {
          DEFAULT: "#a15c3a",
          light: "#f1e2d5",
        },
      },
      fontFamily: {
        serif: ["Georgia", "'Times New Roman'", "serif"],
        mono: [
          "'Courier New'",
          "Consolas",
          "Menlo",
          "'Liberation Mono'",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
