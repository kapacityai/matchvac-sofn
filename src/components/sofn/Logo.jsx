export function SofnLogo({ size = 'md', showTagline = true, className = '' }) {
  const sizes = { sm: 'h-8', md: 'h-10', lg: 'h-12', xl: 'h-16' }
  const taglineSizes = { sm: 'text-[10px]', md: 'text-[11px]', lg: 'text-xs', xl: 'text-sm' }
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 44 44" className={`${sizes[size]} aspect-square`} fill="none">
        <defs>
          <radialGradient id="sofn-teal" cx="0.4" cy="0.35" r="0.65" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#0F4C47" />
          </radialGradient>
        </defs>
        {/* Thick ring, 270° arc leaving gap at upper-left */}
        <circle
          cx="22" cy="22" r="18"
          stroke="url(#sofn-teal)" strokeWidth="5"
          strokeDasharray="255 36.4"
          strokeLinecap="round"
        />
        {/* Amber dot rest inside the upper-left gap */}
        <circle cx="11" cy="8" r="3.5" fill="#F5A623" />
      </svg>
      <div className="flex flex-col">
        <span className={`leading-none text-[#0C4640] ${
          size === 'xl' ? 'text-[22px]' : size === 'lg' ? 'text-lg' : 'text-base'
        }`}>
          <span className="font-extrabold tracking-tight">SO</span><span className="font-normal tracking-tight">FN</span>
        </span>
        {showTagline && (
          <span className={`${taglineSizes[size]} font-bold tracking-[0.15em] text-[#0C4640] leading-none mt-0.5`}>
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
      <defs>
        <radialGradient id="sofn-teal-i" cx="0.4" cy="0.35" r="0.65" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F4C47" />
        </radialGradient>
      </defs>
      <circle
        cx="22" cy="22" r="18"
        stroke="url(#sofn-teal-i)" strokeWidth="5"
        strokeDasharray="255 36.4"
        strokeLinecap="round"
      />
      <circle cx="11" cy="8" r="3.5" fill="#F5A623" />
    </svg>
  )
}