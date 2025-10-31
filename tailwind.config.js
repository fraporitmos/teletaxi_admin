/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#136019',
        'primaryDark': '#06340B',
        'primaryLight': '#C3FFC8',
        'background': '#FFFFFF',
        'backgroundDark': '#1F1E1E',
        'onBackground': '#000000',
        'onBackgroundDark': '#FFFFFF'

      },
    },
  },
  plugins: [],
}

