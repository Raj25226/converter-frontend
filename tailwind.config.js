/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: Object.fromEntries(['primary', 'brand'].map(name => [name, {
        50: '#f0f6f1', 100: '#e1eee3', 200: '#c5ddcb', 300: '#9bc4a8',
        400: '#67a780', 500: '#327f5d', 600: '#185f46', 700: '#114a36',
        800: '#123e2e', 900: '#123326', 950: '#0a1f17',
      }])),
    },
  },
  plugins: [],
}