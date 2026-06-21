/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "'Helvetica Neue'", "sans-serif"],
        body: ["'DM Sans'", "'Helvetica Neue'", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "#F3C265",
          light: "#FFD588",
          soft: "rgba(243,194,101,0.10)",
          glow: "rgba(243,194,101,0.35)",
        },
        dark: {
          DEFAULT: "#0A0F2A",
          mid: "#0E1437",
          deep: "#151D48",
        },
        cream: "#F4F2EA",
      },
    },
  },
  plugins: [],
};