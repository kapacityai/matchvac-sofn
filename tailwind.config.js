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
        // Teal — primary CTA, brand color (from "Find a Pro" button in mockups)
        brand: {
          50:  withOpacity('#e6f9f9'),
          100: withOpacity('#c0efef'),
          200: withOpacity('#88e1e1'),
          300: withOpacity('#4dcfcf'),
          400: withOpacity('#2dc4c4'),
          500: withOpacity('#2abfbf'),  // primary teal
          600: withOpacity('#22adad'),
          700: withOpacity('#189494'),
          800: withOpacity('#0e7878'),
          900: withOpacity('#075555'),
          950: withOpacity('#033838'),
        },
        // Navy — logo text, headings, deep backgrounds
        navy: {
          50:  withOpacity('#eef2fa'),
          100: withOpacity('#d5dff2'),
          200: withOpacity('#a8bde4'),
          300: withOpacity('#7a96d5'),
          400: withOpacity('#4d6ec6'),
          500: withOpacity('#2a52b5'),
          600: withOpacity('#1e3f99'),
          700: withOpacity('#1a3770'),  // main navy matching logo
          800: withOpacity('#142d5c'),
          900: withOpacity('#0d1f42'),
          950: withOpacity('#070f22'),
        },
        // Surface — light/white neutrals for backgrounds, cards, borders
        surface: {
          50:  withOpacity('#ffffff'),
          100: withOpacity('#f8fafc'),
          150: withOpacity('#f1f5f9'),
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
        // Accent — warm orange (heating icons only, not buttons)
        accent: {
          50:  withOpacity('#fff7ed'),
          100: withOpacity('#ffedd5'),
          200: withOpacity('#fed7aa'),
          300: withOpacity('#fdba74'),
          400: withOpacity('#fb923c'),
          500: withOpacity('#f97316'),
          600: withOpacity('#ea6a0a'),
          700: withOpacity('#c2560a'),
          800: withOpacity('#9a4209'),
          900: withOpacity('#7c3509'),
        },
        emerald: {
          50:  withOpacity('#ecfdf5'),
          100: withOpacity('#d1fae5'),
          200: withOpacity('#a7f3d0'),
          400: withOpacity('#34d399'),
          500: withOpacity('#10b981'),
          600: withOpacity('#059669'),
          900: withOpacity('#064e3b'),
        },
        amber: {
          50:  withOpacity('#fffbeb'),
          100: withOpacity('#fef3c7'),
          200: withOpacity('#fde68a'),
          400: withOpacity('#fbbf24'),
          500: withOpacity('#f59e0b'),
          600: withOpacity('#d97706'),
          900: withOpacity('#451a03'),
        },
        rose: {
          50:  withOpacity('#fff1f2'),
          100: withOpacity('#ffe4e6'),
          200: withOpacity('#fecdd3'),
          400: withOpacity('#fb7185'),
          500: withOpacity('#f43f5e'),
          600: withOpacity('#e11d48'),
          900: withOpacity('#4c0519'),
        },
        blue: {
          50:  withOpacity('#eff6ff'),
          100: withOpacity('#dbeafe'),
          200: withOpacity('#bfdbfe'),
          400: withOpacity('#60a5fa'),
          500: withOpacity('#3b82f6'),
          600: withOpacity('#2563eb'),
        },
        cyan: {
          50:  withOpacity('#ecfeff'),
          100: withOpacity('#cffafe'),
          200: withOpacity('#a5f3fc'),
          400: withOpacity('#22d3ee'),
          500: withOpacity('#06b6d4'),
          600: withOpacity('#0891b2'),
        },
        green: {
          50:  withOpacity('#f0fdf4'),
          100: withOpacity('#dcfce7'),
          200: withOpacity('#bbf7d0'),
          400: withOpacity('#4ade80'),
          500: withOpacity('#22c55e'),
          600: withOpacity('#16a34a'),
        },
        purple: {
          50:  withOpacity('#faf5ff'),
          100: withOpacity('#f3e8ff'),
          200: withOpacity('#e9d5ff'),
          400: withOpacity('#c084fc'),
          500: withOpacity('#a855f7'),
          600: withOpacity('#9333ea'),
        },
        orange: {
          50:  withOpacity('#fff7ed'),
          100: withOpacity('#ffedd5'),
          200: withOpacity('#fed7aa'),
          400: withOpacity('#fb923c'),
          500: withOpacity('#f97316'),
          600: withOpacity('#ea580c'),
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
