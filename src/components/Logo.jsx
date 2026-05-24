import React from 'react'

// Shield icon with HVAC symbols matching the MatcHvac brand
function Shield({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield outline */}
      <path d="M22 2L4 10v16c0 11 8 20 18 24 10-4 18-13 18-24V10L22 2z" fill="url(#shieldGrad)" />
      <path d="M22 2L4 10v16c0 11 8 20 18 24 10-4 18-13 18-24V10L22 2z" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
      {/* Divider lines */}
      <line x1="22" y1="2" x2="22" y2="50" stroke="white" strokeWidth="0.8" strokeOpacity="0.25"/>
      <line x1="4" y1="26" x2="40" y2="26" stroke="white" strokeWidth="0.8" strokeOpacity="0.25"/>
      {/* Top-left: flame */}
      <path d="M13 22c0-3 2-5 2-7 1.5 1 2 3 1 5 1-1 1.5-2.5 1-4 2 1.5 3 4 1 7-1 1.5-2.5 2-3 2-.5 0-2-.5-2-3z" fill="white" fillOpacity="0.9"/>
      {/* Top-right: snowflake */}
      <g stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.9">
        <line x1="31" y1="17" x2="31" y2="23"/>
        <line x1="28" y1="20" x2="34" y2="20"/>
        <line x1="28.5" y1="17.5" x2="33.5" y2="22.5"/>
        <line x1="33.5" y1="17.5" x2="28.5" y2="22.5"/>
      </g>
      {/* Bottom-left: water drop */}
      <path d="M13 28c0 0 4 4 4 6.5a4 4 0 0 1-8 0C9 32 13 28 13 28z" fill="white" fillOpacity="0.9"/>
      {/* Bottom-right: lightning bolt */}
      <path d="M34 29l-4 5h3l-3 6 6-7h-3.5l3.5-4H34z" fill="white" fillOpacity="0.9"/>
      <defs>
        <linearGradient id="shieldGrad" x1="4" y1="2" x2="40" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444"/>
          <stop offset="40%" stopColor="#f97316"/>
          <stop offset="70%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#1d4ed8"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// House-shaped "H" matching logo style
function HouseH({ size, textClass }) {
  const h = size
  return (
    <svg width={h * 1.1} height={h} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Roof */}
      <path d="M14 3L4 11h2v12h6v-7h4v7h6V11h2L14 3z" fill="url(#houseGrad)"/>
      {/* Window */}
      <rect x="11" y="11" width="6" height="5" rx="0.5" fill="white" fillOpacity="0.85"/>
      <defs>
        <linearGradient id="houseGrad" x1="4" y1="3" x2="24" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444"/>
          <stop offset="100%" stopColor="#f97316"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Logo({ size = 'md', dark = false }) {
  const configs = {
    sm: { shield: 22, houseH: 16, textClass: 'text-base', gap: 'gap-2', tagline: false },
    md: { shield: 28, houseH: 20, textClass: 'text-xl',   gap: 'gap-2.5', tagline: false },
    lg: { shield: 40, houseH: 28, textClass: 'text-3xl',  gap: 'gap-3', tagline: true },
  }
  const c = configs[size] || configs.md
  const baseText = dark ? 'text-white' : 'text-surface-900'
  const mutedText = dark ? 'text-white/50' : 'text-surface-400'

  return (
    <div className={`flex items-center ${c.gap} flex-shrink-0`}>
      <Shield size={c.shield} />
      <div className="flex flex-col leading-none">
        <div className={`flex items-center font-black tracking-tight ${c.textClass} ${baseText}`}>
          <span>Matc</span>
          <HouseH size={c.houseH} />
          <span>vac</span>
          <span className={`font-normal ${mutedText} ml-0.5`} style={{ fontSize: '0.55em' }}>.com</span>
        </div>
        {c.tagline && (
          <p className="text-xs font-bold tracking-[0.18em] uppercase mt-0.5" style={{ color: '#f97316', letterSpacing: '0.15em' }}>
            Certified Pros. <span className="text-surface-500">On Demand.</span>
          </p>
        )}
      </div>
    </div>
  )
}
