import React from 'react'
import logoImg from '../assets/matchvac-logo.png'

const sizes = {
  sm: { height: 32 },
  md: { height: 40 },
  lg: { height: 56 },
}

export default function Logo({ size = 'md', dark = false }) {
  const { height } = sizes[size] || sizes.md
  return (
    <img
      src={logoImg}
      alt="MatcHvac — Certified Pros. On Demand."
      style={{ height, width: 'auto', objectFit: 'contain' }}
      className={dark ? 'brightness-0 invert' : ''}
    />
  )
}
