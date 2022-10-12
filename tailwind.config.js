/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  important: '#root',
  theme: {
    extend: {},
  },
  plugins: [],
}
