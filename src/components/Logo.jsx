import React from 'react'

export default function Logo({ size = 'md', className = '' }) {
  const sizes = {
    xs: { height: 24, text: 14, gap: 5 },
    sm: { height: 30, text: 18, gap: 6 },
    md: { height: 40, text: 24, gap: 8 },
    lg: { height: 56, text: 34, gap: 10 },
    xl: { height: 72, text: 44, gap: 12 },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className={`flex items-center ${className}`} style={{ gap: s.gap }}>
      {/* House/H icon */}
      <svg width={s.height} height={s.height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`hg-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2abfbf" />
            <stop offset="100%" stopColor="#1a3770" />
          </linearGradient>
        </defs>
        {/* Roof */}
        <polygon points="50,6 96,46 82,46 82,34 50,8 18,34 18,46 4,46" fill={`url(#hg-${size})`} />
        {/* Body */}
        <rect x="18" y="44" width="64" height="50" rx="4" fill={`url(#hg-${size})`} />
        {/* H shape in white */}
        <rect x="29" y="55" width="13" height="30" rx="2" fill="white" />
        <rect x="58" y="55" width="13" height="30" rx="2" fill="white" />
        <rect x="29" y="64" width="42" height="10" rx="2" fill="white" />
        {/* Skylight */}
        <rect x="43" y="20" width="14" height="14" rx="3" fill="white" opacity="0.45" />
      </svg>

      {/* Wordmark */}
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: s.text, fontWeight: 900, fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#1a3770' }}>Matc</span>
          <span style={{ color: '#2abfbf' }}>H</span>
          <span style={{ color: '#1a3770' }}>vac</span>
        </div>
        {s.text >= 18 && (
          <div style={{ fontSize: s.text * 0.28, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.06em', marginTop: 2, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Certified Pros. On Demand.
          </div>
        )}
      </div>
    </div>
  )
}

export function LogoIcon({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="hgicon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2abfbf" />
          <stop offset="100%" stopColor="#1a3770" />
        </linearGradient>
      </defs>
      <polygon points="50,6 96,46 82,46 82,34 50,8 18,34 18,46 4,46" fill="url(#hgicon)" />
      <rect x="18" y="44" width="64" height="50" rx="4" fill="url(#hgicon)" />
      <rect x="29" y="55" width="13" height="30" rx="2" fill="white" />
      <rect x="58" y="55" width="13" height="30" rx="2" fill="white" />
      <rect x="29" y="64" width="42" height="10" rx="2" fill="white" />
    </svg>
  )
}
