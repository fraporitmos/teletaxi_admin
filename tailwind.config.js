/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFD203',
        'primaryDark': '#A38A16',
        'primaryLight': '#9E7206',
        'background': '#2B2B2B',
        'backgroundDark': '#1F1E1E',
        'onBackground': '#FFFADF',
        'onBackgroundDark': '#FFFADF'

      },
    },
  },
  plugins: [],
}

