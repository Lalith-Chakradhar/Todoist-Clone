/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vista-white': 'hsl(30, 40%, 98%)',
        'serenade': 'hsl(23, 100%, 95%)'
      }
    },
  },
  plugins: [],
}