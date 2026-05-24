import React from 'react'
import logoImg from '../assets/matchvac-logo.png'

const sizes = {
  sm: { height: 48 },
  md: { height: 64 },
  lg: { height: 88 },
}

export default function Logo({ size = 'md', dark = false }) {
  const { height } = sizes[size] || sizes.md

  if (dark) {
    // On dark backgrounds, show logo inside a white rounded pill
    return (
      <div className="bg-white rounded-xl px-3 py-1.5 inline-flex items-center shadow-sm">
        <img
          src={logoImg}
          alt="MatcHvac — Certified Pros. On Demand."
          style={{ height: height * 0.85, width: 'auto', objectFit: 'contain' }}
        />
      </div>
    )
  }

  return (
    <img
      src={logoImg}
      alt="MatcHvac — Certified Pros. On Demand."
      style={{ height, width: 'auto', objectFit: 'contain' }}
    />
  )
}
