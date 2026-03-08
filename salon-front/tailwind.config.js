/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          bg:     '#fff5f7',
          light:  '#fce4ec',
          mid:    '#f8bbd0',
          warm:   '#f48fb1',
          dark:   '#e91e8c',
          deeper: '#880e4f',
        }
      }
    },
  },
  plugins: [],
}