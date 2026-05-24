import React from 'react'
import { MapPin, Zap } from 'lucide-react'
import { SERVICE_LOCATIONS } from '../data/mockData'

export default function LocationTicker() {
  // Double the list so the seamless loop works
  const items = [...SERVICE_LOCATIONS, ...SERVICE_LOCATIONS]

  return (
    <div className="inline-flex items-center gap-2 bg-navy-800/80 border border-white/10 rounded-full px-4 py-1.5 overflow-hidden max-w-xs sm:max-w-sm">
      {/* Static label */}
      <div className="flex items-center gap-1.5 flex-shrink-0 border-r border-white/10 pr-3">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
        <span className="text-surface-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Now Serving</span>
      </div>

      {/* Scrolling area — clips to one line height */}
      <div className="h-5 overflow-hidden relative flex-1 min-w-0">
        <div className="ticker-track flex flex-col">
          {items.map((loc, i) => (
            <div key={i} className="h-5 flex items-center gap-1.5 flex-shrink-0">
              <MapPin size={10} className="text-brand-400 flex-shrink-0" />
              <span className="text-white text-xs font-medium whitespace-nowrap">
                {loc.city}, {loc.state}
              </span>
              {loc.new && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0 rounded-full flex-shrink-0">
                  <Zap size={8} />NEW
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
