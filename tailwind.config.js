export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Hanfan coral — primary brand color
        brand: {
          50:  '#FFF0F0',
          100: '#FFE8E9',
          200: '#FFD0D2',
          300: '#FFB0B3',
          400: '#FF7A7F',
          500: '#FF5A5F',
          600: '#E84E53',
          700: '#C73E43',
          800: '#9B2E32',
          900: '#7A2326',
        },
        // Hanfan amber — pro/secondary
        accent: {
          100: '#FFF3CC',
          200: '#FFE080',
          300: '#FFD040',
          400: '#FFC733',
          500: '#FFB400',
          600: '#E6A200',
          700: '#CC9000',
        },
        // Hanfan ink surface scale
        surface: {
          50:  '#F7F7F7',
          100: '#EFEFEF',
          200: '#E0E0E0',
          300: '#C8C8C8',
          400: '#A0A0A0',
          500: '#6B6B6B',
          600: '#4A4A4A',
          700: '#3A3A3A',
          800: '#2A2A2A',
          900: '#1F1F1F',
          950: '#1A1A1A',
        },
        // Hanfan semantic
        coral:  '#FF5A5F',
        amber:  '#FFB400',
        ink:    '#1A1A1A',
        ash:    '#6B6B6B',
        warm:   '#FFF8F4',
        blush:  '#FFE8E9',
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'card-sm': '12px',
        'btn':  '10px',
        'pill': '100px',
      },
    }
  },
  plugins: []
}
