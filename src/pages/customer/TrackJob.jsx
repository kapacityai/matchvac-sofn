import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { CheckCircle, Car, MapPin, Wrench, Camera, Star, Phone, MessageCircle, Shield, DollarSign, ArrowRight, Lock } from 'lucide-react'

const TIMELINE = [
  { key: 'accepted', icon: CheckCircle, label: 'Job Accepted', sub: 'Marcus is on the way', color: 'text-emerald-400', bg: 'bg-emerald-400' },
  { key: 'enroute', icon: Car, label: 'En Route', sub: 'ETA: ~12 minutes', color: 'text-brand-400', bg: 'bg-brand-400' },
  { key: 'arrived', icon: MapPin, label: 'Arrived', sub: 'Tech has arrived', color: 'text-amber-400', bg: 'bg-amber-400' },
  { key: 'working', icon: Wrench, label: 'Work in Progress', sub: 'Diagnostics underway', color: 'text-accent-400', bg: 'bg-accent-400' },
  { key: 'photos', icon: Camera, label: 'Completion Photos', sub: 'Photos uploaded by tech', color: 'text-purple-400', bg: 'bg-purple-400' },
  { key: 'complete', icon: CheckCircle, label: 'Marked Complete by Tech', sub: 'Awaiting your confirmation', color: 'text-emerald-400', bg: 'bg-emerald-400' },
]

export default function TrackJob() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(5) // Start at tech-marked-complete
  const [paymentReleased, setPaymentReleased] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewDone, setReviewDone] = useState(false)
  const [releasing, setReleasing] = useState(false)
  const [eta, setEta] = useState(0) // Already arrived

  // ETA countdown (only relevant for early steps)
  useEffect(() => {
    if (currentStep >= 2) return
    const t = setInterval(() => setEta(e => Math.max(0, e - 1)), 3000)
    return () => clearInterval(t)
  }, [currentStep])

  const handleReleasePayment = () => {
    setReleasing(true)
    setTimeout(() => {
      setReleasing(false)
      setPaymentReleased(true)
      setTimeout(() => setShowRating(true), 800)
    }, 1800)
  }

  const handleSubmitReview = () => {
    setShowRating(false)
    setReviewDone(true)
  }

  const techCompletedJob = currentStep >= 5

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header
        title="Track Job"
        subtitle={paymentReleased ? 'Thermostat Installation — Completed ✓' : 'Thermostat Installation — In Progress'}
      />

      <div className="flex-1 p-6 max-w-2xl space-y-5">

        {/* ── PAYMENT RELEASED BANNER ── */}
        {paymentReleased && !reviewDone && (
          <div className="rounded-2xl bg-gradient-to-r from-emerald-900/50 to-surface-900 border border-emerald-500/40 p-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Payment Released!</h3>
            <p className="text-surface-400 text-sm">$149.00 has been released to Marcus Rivera. A receipt has been sent to your email.</p>
          </div>
        )}

        {reviewDone && (
          <div className="rounded-2xl bg-gradient-to-r from-brand-900/40 to-surface-900 border border-brand-500/30 p-5 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-3">
              <Star size={28} className="text-amber-400 fill-amber-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">All Done — Thanks!</h3>
            <p className="text-surface-400 text-sm mb-4">Your review has been submitted. Marcus will appreciate it!</p>
            <button onClick={() => navigate('/customer/jobs')} className="btn-primary py-2.5 px-6">
              View Job History <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Map placeholder */}
        <div className="relative h-52 rounded-2xl overflow-hidden border border-surface-200">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-900 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10">
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} className="absolute w-full h-px bg-brand-400" style={{ top: `${i * 14}%` }} />
              ))}
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} className="absolute h-full w-px bg-brand-400" style={{ left: `${i * 14}%` }} />
              ))}
            </div>
            {/* Tech pin — at home location once arrived */}
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-lg ${paymentReleased ? 'bg-emerald-500' : 'bg-brand-500 animate-pulse-slow'}`}>
                {paymentReleased ? <CheckCircle size={18} className="text-white" /> : <Car size={18} className="text-white" />}
              </div>
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${paymentReleased ? 'bg-emerald-500' : 'bg-brand-500'}`} />
            </div>
            {/* Home pin */}
            <div className="absolute bottom-8 right-16">
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center border-2 border-white shadow-lg">
                <MapPin size={14} className="text-white" />
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-3 glass px-3 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${paymentReleased ? 'bg-surface-500' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="text-white text-xs font-medium">{paymentReleased ? 'Complete' : 'Live'}</span>
            </div>
          </div>
        </div>

        {/* Tech card */}
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xl font-bold text-surface-900 flex-shrink-0">
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
          <h3 className="font-bold text-surface-900 mb-4">Job Status</h3>
          <div className="space-y-4">
            {TIMELINE.map((item, i) => {
              const done = i < currentStep
              const active = i === currentStep
              return (
                <div key={item.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? `${item.bg} text-surface-900` : active ? `border-2 border-current ${item.color}` : 'bg-surface-150 text-surface-600'}`}>
                      <item.icon size={15} />
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className={`w-px flex-1 mt-1 ${done ? item.bg : 'bg-surface-150'}`} style={{ minHeight: 16 }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-semibold ${active ? 'text-white' : done ? 'text-surface-300' : 'text-surface-600'}`}>{item.label}</p>
                    <p className={`text-xs mt-0.5 ${active ? item.color : done ? 'text-surface-400' : 'text-surface-700'}`}>{item.sub}</p>
                    {active && !paymentReleased && <span className="badge badge-blue mt-1">Current</span>}
                    {active && paymentReleased && <span className="badge badge-green mt-1">Confirmed ✓</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CUSTOMER CONFIRM & RELEASE PAYMENT ── */}
        {techCompletedJob && !paymentReleased && (
          <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-900/30 to-surface-900 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
                <Lock size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-bold">Marcus has marked the job complete</p>
                <p className="text-surface-400 text-xs">Review the work and release payment from escrow</p>
              </div>
            </div>

            {/* Escrow summary */}
            <div className="bg-surface-100 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-400">Service</span>
                <span className="text-white">Thermostat Installation (Standard)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Technician</span>
                <span className="text-white">Marcus Rivera</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Escrow Hold</span>
                <span className="text-amber-400 font-semibold flex items-center gap-1"><Shield size={12} /> $149.00 secured</span>
              </div>
              <div className="border-t border-surface-200 pt-2 flex justify-between font-bold">
                <span className="text-white">Total to Release</span>
                <span className="text-emerald-400 text-base">$149.00</span>
              </div>
            </div>

            <p className="text-surface-500 text-xs mb-4 leading-relaxed">
              By confirming, you release the escrowed funds to Marcus Rivera. Only confirm if the work was completed to your satisfaction.
            </p>

            <button
              onClick={handleReleasePayment}
              disabled={releasing}
              className={`w-full py-4 rounded-xl font-bold text-surface-900 flex items-center justify-center gap-2 transition-all text-base ${releasing ? 'bg-emerald-700 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98]'}`}
            >
              {releasing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Releasing Payment…
                </>
              ) : (
                <>
                  <DollarSign size={20} />
                  Confirm &amp; Release Payment
                </>
              )}
            </button>
          </div>
        )}

        {/* Completion photos preview (shown at step 4+) */}
        {currentStep >= 4 && (
          <div className="card">
            <h3 className="font-bold text-surface-900 mb-3 text-sm">Completion Photos from Marcus</h3>
            <div className="grid grid-cols-3 gap-2">
              {['Before', 'During', 'After'].map((label, i) => (
                <div key={label} className="aspect-square rounded-xl bg-surface-150 flex flex-col items-center justify-center border border-surface-200">
                  <Camera size={18} className="text-surface-500 mb-1" />
                  <span className="text-surface-600 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
            <button className="bg-[#003478] border border-[#4da6ff]/40 text-surface-900 font-bold py-2 px-3 rounded-xl text-xs flex-shrink-0 group-hover:bg-[#00449e] transition-all">
              See If I Qualify
            </button>
          </div>
        </div>

        {/* Demo controls */}
        <div className="card border-dashed border-surface-200">
          <p className="text-surface-500 text-xs font-semibold uppercase tracking-widest mb-3">Demo Controls</p>
          <div className="flex gap-2 flex-wrap">
            <button disabled={currentStep === 0} onClick={() => { setCurrentStep(s => s - 1); setPaymentReleased(false); setReviewDone(false) }} className="btn-secondary text-sm py-2">← Prev Step</button>
            <button disabled={currentStep >= TIMELINE.length - 1} onClick={() => setCurrentStep(s => s + 1)} className="btn-primary text-sm py-2">Next Step →</button>
            <button onClick={() => { setCurrentStep(5); setPaymentReleased(false); setReviewDone(false); setRating(0) }} className="btn-ghost text-sm py-2">Reset Demo</button>
          </div>
          <p className="text-surface-600 text-xs mt-2">Step {currentStep + 1} of {TIMELINE.length}: {TIMELINE[currentStep]?.label}</p>
        </div>
      </div>

      {/* ── RATING MODAL ── */}
      {showRating && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-sm w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-2xl font-bold text-surface-900 mx-auto mb-4">
              MR
            </div>
            <h3 className="text-xl font-bold text-surface-900 mb-1">Rate Your Experience</h3>
            <p className="text-surface-400 text-sm mb-1">How was Marcus Rivera?</p>
            <p className="text-surface-500 text-xs mb-5">Thermostat Installation · $149.00</p>
            <div className="flex justify-center gap-3 mb-4">
              {[1,2,3,4,5].map(r => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  onMouseEnter={() => setHoverRating(r)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star size={36} className={r <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-700'} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-amber-400 font-semibold text-sm mb-4">
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
              </p>
            )}
            <button
              disabled={rating === 0}
              onClick={handleSubmitReview}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${rating > 0 ? 'btn-primary' : 'bg-surface-150 text-surface-500 cursor-not-allowed'}`}
            >
              Submit Review
            </button>
            <button onClick={() => { setShowRating(false); setReviewDone(true) }} className="text-surface-500 text-xs mt-3 hover:text-surface-400 transition-colors">
              Skip for now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
