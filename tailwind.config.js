/** @type {import('tailwindcss').Config} */
const defaults = require("tailwindcss/colors");

// Màu lấy từ biến CSS (globals.css) để cùng một class đổi theo theme sáng/tối và vùng .theme-dark
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const scale = (name, shades) => Object.fromEntries(shades.map((s) => [s, v(`${name}-${s}`)]));
const ALL = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        white: v("white"),
        slate: scale("slate", ALL),
        // "cyan" trong code cũ = màu chủ đạo, nay ánh xạ sang xanh EVN
        cyan: scale("cyan", ALL),
        emerald: { ...defaults.emerald, ...scale("emerald", [100, 200, 300, 400, 500]) },
        amber: { ...defaults.amber, ...scale("amber", [100, 200, 300, 400, 500]) },
        rose: { ...defaults.rose, ...scale("rose", [300, 400, 500]) },
        indigo: { ...defaults.indigo, ...scale("indigo", [300, 400, 500]) },
        blue: { ...defaults.blue, ...scale("blue", [300, 400, 500, 600]) },
        violet: { ...defaults.violet, ...scale("violet", [400]) },
        teal: { ...defaults.teal, ...scale("teal", [300]) },
        // Màu nhận diện EVNNPT (đo từ logo trong tài liệu nội bộ)
        evn: { DEFAULT: "#164499", deep: "#0B2A66", ink: "#0A1D45" },
        npt: { DEFAULT: "#FE0000", text: "#D40000" },
        star: "#FFE600",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
