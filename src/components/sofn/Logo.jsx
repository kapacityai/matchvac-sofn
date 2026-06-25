export function SofnLogo({ size = 'md', showTagline = true, className = '' }) {
  const sizes = { sm: 'h-8', md: 'h-10', lg: 'h-12', xl: 'h-16' }
  const taglineSizes = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm', xl: 'text-base' }
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 44 44" className={`${sizes[size]} aspect-square`} fill="none">
        {/* Incomplete circle (teal) */}
        <path d="M22 4 C34 4 40 12 40 22 C40 32 34 40 22 40"
          stroke="#0C6B5E" strokeWidth="4" strokeLinecap="round"
          strokeDasharray="0 0" />
        {/* Amber dot */}
        <circle cx="4" cy="12" r="3.5" fill="#C9852A" />
      </svg>
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight leading-none text-[#0C6B5E] ${
          size === 'xl' ? 'text-2xl' : size === 'lg' ? 'text-xl' : 'text-lg'
        }`}>
          SOFN
        </span>
        {showTagline && (
          <span className={`${taglineSizes[size]} font-semibold tracking-wider text-[#33485C] leading-tight`}>
            COMPLETE. GUARANTEED.
          </span>
        )}
      </div>
    </div>
  )
}

export function SofnLogoIcon({ size = 'sm', className = '' }) {
  const sizes = { sm: 'h-8', md: 'h-10', lg: 'h-12' }
  return (
    <svg viewBox="0 0 44 44" className={`${sizes[size]} aspect-square ${className}`} fill="none">
      <path d="M22 4 C34 4 40 12 40 22 C40 32 34 40 22 40"
        stroke="#0C6B5E" strokeWidth="4" strokeLinecap="round" />
      <circle cx="4" cy="12" r="3.5" fill="#C9852A" />
    </svg>
  )
}