/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: { extend: { colors: { ink: '#102321', muted: '#667875', canvas: '#f4f7f5', brand: '#137c68', mint: '#d9f3e9' }, boxShadow: { soft: '0 8px 30px rgba(22, 56, 49, 0.06)' } } },
  plugins: []
};
