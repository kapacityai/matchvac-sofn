import React from 'react'

export default function Logo({ size = 'md', dark = false }) {
  const sizes = {
    sm: { mark: 28, text: '18px', gap: '8px' },
    md: { mark: 34, text: '22px', gap: '10px' },
    lg: { mark: 44, text: '30px', gap: '12px' },
  }
  const s = sizes[size] || sizes.md

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      {/* Coral square mark with ghosted handshake */}
      <div style={{
        width: s.mark, height: s.mark,
        borderRadius: '8px',
        background: '#FF5A5F',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ghost handshake watermark */}
        <svg
          style={{ position: 'absolute', opacity: 0.15 }}
          width={s.mark * 1.4} height={s.mark * 1.4}
          viewBox="0 0 40 40" fill="none"
        >
          <path d="M8 22c0 0 3-4 7-4s6 3 9 3 5-2 8-2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M6 26c0 0 4-3 8-3s7 4 10 4 6-3 10-3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <circle cx="20" cy="16" r="4" fill="white" opacity="0.5"/>
        </svg>
        {/* H mark */}
        <span style={{
          fontFamily: "'Syne', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: s.mark * 0.55 + 'px',
          color: 'white',
          lineHeight: 1,
          position: 'relative',
          zIndex: 1,
        }}>H</span>
      </div>

      {/* Wordmark */}
      <span style={{
        fontFamily: "'Syne', system-ui, sans-serif",
        fontWeight: 800,
        fontSize: s.text,
        color: dark ? '#1A1A1A' : '#FFFFFF',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        Hanfan
      </span>
    </div>
  )
}
