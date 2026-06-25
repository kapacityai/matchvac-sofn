export function SofnLogo({ size = 'md', showTagline = true, className = '' }) {
  const sizes = { sm: 32, md: 40, lg: 48, xl: 64 }
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

export function SofnLogoIcon({ size = 'sm', className = '' }) {
  const sizes = { sm: 32, md: 40, lg: 48 }
  const px = sizes[size] || 32
  return (
    <img
      src="/sofn-logo.png"
      alt="SOFN"
      className={className}
      style={{ height: px, width: 'auto' }}
    />
  )
}