import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { CheckCircle, Car, MapPin, Wrench, Camera, Star, Phone, MessageCircle } from 'lucide-react'

const TIMELINE = [
  { key: 'accepted', icon: CheckCircle, label: 'Job Accepted', sub: 'Marcus is on the way', color: 'text-emerald-400', bg: 'bg-emerald-400' },
  { key: 'enroute', icon: Car, label: 'En Route', sub: 'ETA: ~12 minutes', color: 'text-brand-400', bg: 'bg-brand-400' },
  { key: 'arrived', icon: MapPin, label: 'Arrived', sub: 'Tech has arrived', color: 'text-amber-400', bg: 'bg-amber-400' },
  { key: 'working', icon: Wrench, label: 'Work in Progress', sub: 'Diagnostics underway', color: 'text-accent-400', bg: 'bg-accent-400' },
  { key: 'photos', icon: Camera, label: 'Completion Photos', sub: 'Awaiting upload', color: 'text-surface-400', bg: 'bg-surface-600' },
  { key: 'complete', icon: CheckCircle, label: 'Job Complete', sub: 'Awaiting confirmation', color: 'text-surface-400', bg: 'bg-surface-600' },
]

export default function TrackJob() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [eta, setEta] = useState(12)

  useEffect(() => {
    const t = setInterval(() => {
      setEta(e => Math.max(0, e - 1))
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Track Job" subtitle="Thermostat Installation — In Progress" />

      <div className="flex-1 p-6 max-w-2xl space-y-5">
        {/* Map placeholder */}
        <div className="relative h-52 rounded-2xl overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-900 flex items-center justify-center">
            {/* Fake map grid */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} className="absolute w-full h-px bg-brand-400" style={{ top: `${i * 14}%` }} />
              ))}
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} className="absolute h-full w-px bg-brand-400" style={{ left: `${i * 14}%` }} />
              ))}
            </div>
            {/* Tech pin */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center border-2 border-white shadow-lg animate-pulse-slow">
                <Car size={18} className="text-white" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-500 rotate-45" />
            </div>
            {/* Home pin */}
            <div className="absolute bottom-8 right-16">
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center border-2 border-white shadow-lg">
                <MapPin size={14} className="text-white" />
              </div>
            </div>
            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 50 50 Q 65 45 80 35" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeDasharray="4 2" />
            </svg>
          </div>
          {eta > 0 && (
            <div className="absolute top-3 left-3 glass px-3 py-1.5 rounded-xl text-sm font-semibold text-white">
              ETA: {eta} min
            </div>
          )}
          <div className="absolute top-3 right-3 glass px-3 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* Tech card */}
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
            MR
          </div>
          <div className="flex-1">
            <p className="text-white font-bold">Marcus Rivera</p>
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({length: 5}).map((_, i) => (
                <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="text-surface-400 text-xs ml-1">4.9 · 247 jobs</span>
            </div>
            <p className="text-surface-500 text-xs mt-0.5">2018 White Ford Transit Van · CA 7ABC123</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/[15%] transition-colors">
              <Phone size={16} className="text-brand-400" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/[15%] transition-colors">
              <MessageCircle size={16} className="text-brand-400" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <h3 className="font-bold text-white mb-4">Job Status</h3>
          <div className="space-y-4">
            {TIMELINE.map((item, i) => {
              const done = i < currentStep
              const active = i === currentStep
              return (
                <div key={item.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? `${item.bg} text-white` : active ? `border-2 border-current ${item.color}` : 'bg-surface-800 text-surface-600'}`}>
                      <item.icon size={15} />
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className={`w-px flex-1 min-h-4 mt-1 ${done ? item.bg : 'bg-surface-800'}`} style={{ minHeight: 16 }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-semibold ${active ? 'text-white' : done ? 'text-surface-300' : 'text-surface-600'}`}>{item.label}</p>
                    <p className={`text-xs mt-0.5 ${active ? item.color : done ? 'text-surface-400' : 'text-surface-700'}`}>{item.sub}</p>
                    {active && <span className="badge badge-blue mt-1">Current</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Post-job ad — Comfort Connect Premier */}
        <div
          onClick={() => navigate('/comfort-connect')}
          className="cursor-pointer rounded-2xl border-2 border-[#003478] bg-gradient-to-r from-[#003478]/40 to-[#001a3d]/60 hover:border-[#4da6ff] transition-all group overflow-hidden"
        >
          <div className="bg-[#003478] px-4 py-1.5 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 40 40" fill="none"><path d="M20 4L4 16v20h10V24h12v12h10V16L20 4z" fill="white" opacity="0.9"/></svg>
            <span className="text-white font-bold text-xs">Comfort Connect Premier Program®</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="text-2xl flex-shrink-0">❄️</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">Need a New System? Don't Buy — Get It Included.</p>
              <p className="text-surface-400 text-xs">Low monthly payment covers everything. No up-front cost.</p>
            </div>
            <button className="bg-[#003478] border border-[#4da6ff]/40 text-white font-bold py-2 px-3 rounded-xl text-xs flex-shrink-0 group-hover:bg-[#00449e] transition-all">
              See If I Qualify
            </button>
          </div>
        </div>

        {/* Demo controls */}
        <div className="card border-dashed border-white/10">
          <p className="text-surface-500 text-xs font-semibold uppercase tracking-widest mb-3">Demo Controls</p>
          <div className="flex gap-2">
            <button disabled={currentStep === 0} onClick={() => setCurrentStep(s => s - 1)} className="btn-secondary text-sm py-2">← Prev</button>
            <button disabled={currentStep >= TIMELINE.length - 1} onClick={() => setCurrentStep(s => s + 1)} className="btn-primary text-sm py-2">Next →</button>
          </div>
        </div>

        {/* Rating modal */}
        {showRating && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="card max-w-sm w-full text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Job Complete!</h3>
              <p className="text-surface-400 text-sm mb-5">How was your experience with Marcus?</p>
              <div className="flex justify-center gap-2 mb-5">
                {[1,2,3,4,5].map(r => (
                  <button key={r} onClick={() => setRating(r)}>
                    <Star size={32} className={r <= rating ? 'text-amber-400 fill-amber-400' : 'text-surface-600'} />
                  </button>
                ))}
              </div>
              <button className="btn-primary w-full" onClick={() => setShowRating(false)}>Submit Review</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
