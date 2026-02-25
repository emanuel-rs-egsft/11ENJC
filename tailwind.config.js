/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["var(--font-title)"],
        crayon: ["var(--font-crayon)"],
        arabic: ["var(--font-arabic)"],
      },
    },
  },
  plugins: [],
};
