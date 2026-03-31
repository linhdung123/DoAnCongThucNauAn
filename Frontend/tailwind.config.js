/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f7f3eb",
        accent: "#e86830",
        "accent-hover": "#d45520",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 4px 14px rgba(0,0,0,0.06)",
        pill: "0 2px 12px rgba(0,0,0,0.05)",
        filter: "0 4px 12px rgba(232, 104, 48, 0.35)",
      },
    },
  },
  plugins: [],
};
