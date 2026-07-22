/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B6E4F",
        ecoGreen: "#22C55E",
        aiBlue: "#2563EB",
        bgLight: "#F8FAFC",
      },
    },
  },
  plugins: [],
};