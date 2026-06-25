export function SofnLogo({ size = 'md', className = '' }) {
  const sizes = { sm: 40, md: 52, lg: 64, xl: 80 }
  const px = sizes[size] || 52
  return (
    <img
      src="/sofn-logo.png"
      alt="SOFN — Complete. Guaranteed."
      className={className}
      style={{ height: px, width: 'auto' }}
    />
  )
}

export function SofnLogoIcon({ size = 'sm', className = '' }) {
  const sizes = { sm: 40, md: 52, lg: 64 }
  const px = sizes[size] || 40
  return (
    <img
      src="/sofn-logo.png"
      alt="SOFN"
      className={className}
      style={{ height: px, width: 'auto' }}
    />
  )
}