import React from 'react'

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 44, text: 'text-3xl' },
  }
  const s = sizes[size]
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-400 to-accent-500 flex-shrink-0"
        style={{ width: s.icon, height: s.icon }}
      >
        <svg width={s.icon * 0.6} height={s.icon * 0.6} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="8" r="4" fill="white" opacity="0.9" />
          <path d="M4 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M10 2v2M14.24 5.76l-1.42 1.42M16 10h-2M14.24 14.24l-1.42-1.42M10 16v-2M5.76 14.24l1.42-1.42M4 10h2M5.76 5.76l1.42 1.42" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </svg>
      </div>
      <span className={`font-bold ${s.text} tracking-tight`}>
        <span className="text-white">Service</span>
        <span className="text-brand-400">Connect</span>
      </span>
    </div>
  )
}
