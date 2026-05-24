import React from 'react'

export default function Logo({ size = 'md', dark = false }) {
  const scales = { sm: 1, md: 1.4, lg: 2 }
  const s = scales[size] || 1.4

  const textColor = dark ? '#ffffff' : '#0f1d38'
  const subColor  = dark ? 'rgba(255,255,255,0.55)' : '#6e6c67'

  return (
    <svg
      viewBox="0 0 260 54"
      style={{ height: 36 * s, width: 'auto' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MatcHvac — Certified Pros. On Demand."
    >
      {/* Shield icon */}
      <g>
        {/* Shield outline */}
        <path
          d="M4 5.5 L26 2 L48 5.5 L48 28 C48 39 26 48 26 48 C26 48 4 39 4 28 Z"
          fill="#0f1d38"
        />
        {/* Quadrant dividers */}
        <line x1="26" y1="2" x2="26" y2="48" stroke="white" strokeWidth="1.2" opacity="0.3"/>
        <line x1="4" y1="25" x2="48" y2="25" stroke="white" strokeWidth="1.2" opacity="0.3"/>

        {/* Top-left: Flame */}
        <text x="13" y="21" textAnchor="middle" fontSize="10" fill="#f97316">🔥</text>

        {/* Top-right: Snowflake */}
        <g transform="translate(26,12)">
          <line x1="6" y1="0" x2="6" y2="12" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="0" y1="6" x2="12" y2="6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="1.8" y1="1.8" x2="10.2" y2="10.2" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="10.2" y1="1.8" x2="1.8" y2="10.2" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round"/>
        </g>

        {/* Bottom-left: Water drop */}
        <g transform="translate(10,27)">
          <path d="M5 0 C5 0 0 5 0 7.5 A5 5 0 0 0 10 7.5 C10 5 5 0 5 0Z" fill="#60a5fa" opacity="0.9"/>
        </g>

        {/* Bottom-right: Lightning bolt */}
        <path d="M31 27 L37 27 L33 33 L38 33 L30 46 L33 36 L28 36 Z" fill="#fbbf24"/>
      </g>

      {/* "Matc" */}
      <text
        x="56"
        y="34"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="26"
        fill={textColor}
        letterSpacing="-0.5"
      >Matc</text>

      {/* "H" with house roof – orange/blue gradient */}
      <defs>
        <linearGradient id="hGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f4601e"/>
          <stop offset="100%" stopColor="#1e6ec8"/>
        </linearGradient>
      </defs>
      {/* House roof above H */}
      <polyline
        points="117,10 124,4 131,10"
        stroke="url(#hGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Small window square */}
      <rect x="121" y="5.5" width="6" height="5" rx="0.5" fill="#0f1d38" opacity="0.25"/>
      {/* H letter */}
      <text
        x="113"
        y="34"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="26"
        fill="url(#hGrad)"
        letterSpacing="-0.5"
      >H</text>

      {/* "vac" */}
      <text
        x="133"
        y="34"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="26"
        fill={textColor}
        letterSpacing="-0.5"
      >vac</text>

      {/* ".com" */}
      <text
        x="188"
        y="34"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="400"
        fontSize="13"
        fill="#f4601e"
        letterSpacing="0"
      >.com</text>

      {/* Tagline */}
      <text
        x="56"
        y="48"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
        fontSize="7.5"
        fill={subColor}
        letterSpacing="1.8"
      >CERTIFIED PROS. ON DEMAND.</text>
    </svg>
  )
}
