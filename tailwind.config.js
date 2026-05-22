function withOpacity(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return ({ opacityValue }) =>
    opacityValue !== undefined
      ? `rgb(${r} ${g} ${b} / ${opacityValue})`
      : `rgb(${r} ${g} ${b})`
}

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  withOpacity('#fff7ed'),
          100: withOpacity('#ffedd5'),
          200: withOpacity('#fed7aa'),
          300: withOpacity('#fdba74'),
          400: withOpacity('#fb923c'),
          500: withOpacity('#f97316'),
          600: withOpacity('#ea580c'),
          700: withOpacity('#c2410c'),
          800: withOpacity('#9a3412'),
          900: withOpacity('#7c2d12'),
        },
        surface: {
          50:  withOpacity('#fafaf9'),
          100: withOpacity('#f5f5f4'),
          200: withOpacity('#e7e5e4'),
          300: withOpacity('#d6d3d1'),
          400: withOpacity('#a8a29e'),
          500: withOpacity('#78716c'),
          600: withOpacity('#57534e'),
          700: withOpacity('#44403c'),
          800: withOpacity('#292524'),
          900: withOpacity('#1c1917'),
          950: withOpacity('#0c0a09'),
        },
        accent: {
          400: withOpacity('#2dd4bf'),
          500: withOpacity('#14b8a6'),
          600: withOpacity('#0d9488'),
          900: withOpacity('#042f2e'),
        },
        emerald: {
          400: withOpacity('#34d399'),
          500: withOpacity('#10b981'),
          600: withOpacity('#059669'),
          900: withOpacity('#064e3b'),
        },
        amber: {
          400: withOpacity('#fbbf24'),
          500: withOpacity('#f59e0b'),
          600: withOpacity('#d97706'),
          900: withOpacity('#451a03'),
        },
        rose: {
          400: withOpacity('#fb7185'),
          500: withOpacity('#f43f5e'),
          600: withOpacity('#e11d48'),
          900: withOpacity('#4c0519'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card':    '16px',
        'card-sm': '12px',
        'btn':     '10px',
        'pill':    '100px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: []
}
