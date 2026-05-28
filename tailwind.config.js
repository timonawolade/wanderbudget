/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "'Helvetica Neue'", "sans-serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#e8613c",
          light: "#f4845f",
          soft: "#fff0eb",
          glow: "rgba(232,97,60,0.35)",
        },
        dark: {
          DEFAULT: "#1a1a2e",
          mid: "#16213e",
          deep: "#0f3460",
        },
        cream: "#f5f0eb",
      },
    },
  },
  plugins: [],
};
