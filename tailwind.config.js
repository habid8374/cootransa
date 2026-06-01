export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#16a34a',
          'green-light': '#22c55e',
          purple: '#7c3aed',
          'purple-light': '#8b5cf6',
          yellow: '#eab308',
          dark: '#0A0F1E',
          darker: '#050810',
        }
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      }
    }
  },
  plugins: []
}
