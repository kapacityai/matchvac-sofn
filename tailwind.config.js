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
        // Orange — logo H warm side / brand CTA
        brand: {
          50:  withOpacity('#fff4ee'),
          100: withOpacity('#ffe4d0'),
          200: withOpacity('#ffc4a0'),
          300: withOpacity('#ff9a64'),
          400: withOpacity('#f97333'),
          500: withOpacity('#f4601e'),
          600: withOpacity('#e04a0c'),
          700: withOpacity('#b8390a'),
          800: withOpacity('#8f2c09'),
          900: withOpacity('#6b2008'),
        },
        // Sky blue — logo H cool side / snowflake
        accent: {
          50:  withOpacity('#eff6ff'),
          100: withOpacity('#dbeafe'),
          200: withOpacity('#bfdbfe'),
          300: withOpacity('#93c5fd'),
          400: withOpacity('#60a5fa'),
          500: withOpacity('#1e6ec8'),
          600: withOpacity('#1a5fad'),
          700: withOpacity('#154f91'),
          800: withOpacity('#103d70'),
          900: withOpacity('#0a2a50'),
        },
        // Neutral surface — blue-grey tint matching logo
        surface: {
          50:  withOpacity('#ffffff'),
          100: withOpacity('#f8f9fb'),
          150: withOpacity('#f0f2f6'),
          200: withOpacity('#e2e6ee'),
          300: withOpacity('#bec5d4'),
          400: withOpacity('#8e97ab'),
          500: withOpacity('#5e6880'),
          600: withOpacity('#3d4760'),
          700: withOpacity('#263044'),
          800: withOpacity('#18202e'),
          900: withOpacity('#0f1826'),
          950: withOpacity('#080f18'),
        },
        // Deep navy — logo dark background / dark panels
        navy: {
          50:  withOpacity('#eef1f7'),
          100: withOpacity('#d5dcea'),
          200: withOpacity('#aab9d5'),
          300: withOpacity('#7590ba'),
          400: withOpacity('#4a6a9f'),
          500: withOpacity('#2a4d85'),
          600: withOpacity('#1e3d6e'),
          700: withOpacity('#162e55'),
          800: withOpacity('#0f1d38'),
          900: withOpacity('#09142a'),
          950: withOpacity('#060d1c'),
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
        sans:    ['Inter', 'system-ui', 'sans-serif'],
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
