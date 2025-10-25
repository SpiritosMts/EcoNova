/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        safe: '#3DD598',
        warning: '#FFC542',
        danger: '#FC5A5A',
        primary: '#1E293B',
      },
    },
  },
  plugins: [],
}
