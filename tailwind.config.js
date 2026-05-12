function withOpacity(hex) {
  // Convert hex to r g b for Tailwind opacity modifier support
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
          50:  withOpacity('#f0f9ff'),
          100: withOpacity('#e0f2fe'),
          200: withOpacity('#bae6fd'),
          300: withOpacity('#7dd3fc'),
          400: withOpacity('#38bdf8'),
          500: withOpacity('#0ea5e9'),
          600: withOpacity('#0284c7'),
          700: withOpacity('#0369a1'),
          800: withOpacity('#075985'),
          900: withOpacity('#0c4a6e'),
        },
        surface: {
          50:  withOpacity('#f8fafc'),
          100: withOpacity('#f1f5f9'),
          200: withOpacity('#e2e8f0'),
          300: withOpacity('#cbd5e1'),
          400: withOpacity('#94a3b8'),
          500: withOpacity('#64748b'),
          600: withOpacity('#475569'),
          700: withOpacity('#334155'),
          800: withOpacity('#1e293b'),
          900: withOpacity('#0f172a'),
          950: withOpacity('#020617'),
        },
        accent: {
          400: withOpacity('#a78bfa'),
          500: withOpacity('#8b5cf6'),
          600: withOpacity('#7c3aed'),
          900: withOpacity('#2e1065'),
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
        'card': '16px',
        'card-sm': '12px',
        'btn':  '10px',
        'pill': '100px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: []
}
