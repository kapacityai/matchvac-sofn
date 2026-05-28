import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { SERVICES } from '../../data/mockData'
import { jobs as jobsApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { AlertTriangle, ChevronLeft, Check, Clock, Zap, Shield, Lock, MapPin, ChevronRight, Flame, Thermometer, Droplets, Wind, Star, Wrench } from 'lucide-react'

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51TW6E8CTW1Fm7kzI5f8nM8czOFTl5ZvpZ57TQKN9iSqloGZXFngoZEuKDs54rBZQFjxuXgX0arm2TZXbnV3BzIJf00bQOPrBwE'
)

const PLATFORM_FEE = 0.12

// Category visual config
const CATEGORY_CONFIG = {
  'Heating':     { bg: 'bg-orange-50',  border: 'border-orange-200', iconBg: 'bg-orange-100', text: 'text-orange-600',  icon: Flame },
  'Cooling':     { bg: 'bg-blue-50',    border: 'border-blue-200',   iconBg: 'bg-blue-100',   text: 'text-blue-600',    icon: Wind },
  'Plumbing':    { bg: 'bg-cyan-50',    border: 'border-cyan-200',   iconBg: 'bg-cyan-100',   text: 'text-cyan-600',    icon: Droplets },
  'Air Quality': { bg: 'bg-green-50',   border: 'border-green-200',  iconBg: 'bg-green-100',  text: 'text-green-600',   icon: Wind },
  'Controls':    { bg: 'bg-purple-50',  border: 'border-purple-200', iconBg: 'bg-purple-100', text: 'text-purple-600',  icon: Thermometer },
  'Maintenance': { bg: 'bg-amber-50',   border: 'border-amber-200',  iconBg: 'bg-amber-100',  text: 'text-amber-600',   icon: Wrench },
  'Emergency':   { bg: 'bg-rose-50',    border: 'border-rose-300',   iconBg: 'bg-rose-100',   text: 'text-rose-600',    icon: AlertTriangle },
}

const TIERS = [
  { key: 'basic',    label: 'Basic',    sub: 'Essential fix',        badge: null,        ring: 'ring-surface-300' },
  { key: 'standard', label: 'Standard', sub: 'Most popular',         badge: '⭐ Popular', ring: 'ring-brand-500' },
  { key: 'premium',  label: 'Premium',  sub: 'Full service + parts', badge: null,        ring: 'ring-brand-500' },
]

const CARD_STYLE = {
  style: {
    base: { color: '#1a2332', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px', '::placeholder': { color: '#8e97ab' } },
    invalid: { color: '#f43f5e' },
  },
}

// ── Payment inner component ──────────────────────────────────────────────────
function PaymentForm({ onSuccess, total, loading, setLoading, jobData }) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const [cardError, setCardError] = useState('')
  const isLive = !!import.meta.env.VITE_API_URL

  const handlePay = async () => {
    setCardError('')
    setLoading(true)
    try {
      if (isLive) {
        const { job, clientSecret } = await jobsApi.create(jobData)
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement), billing_details: { name: user?.name, email: user?.email } },
        })
        if (error) { setCardError(error.message); setLoading(false); return }
        if (paymentIntent.status === 'requires_capture') onSuccess(job)
      } else {
        await new Promise(r => setTimeout(r, 1500))
        onSuccess({ id: 'demo-' + Date.now(), ...jobData })
      }
    } catch (err) {
      setCardError(err.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="border border-surface-200 rounded-2xl px-4 py-4 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Card Details</p>
        <CardElement options={CARD_STYLE} />
      </div>
      {!isLive && (
        <p className="text-xs text-surface-500 bg-surface-100 rounded-xl px-3 py-2">
          Demo — use <strong>4242 4242 4242 4242</strong>, any future expiry &amp; CVC
        </p>
      )}
      {cardError && <p className="text-rose-500 text-sm flex items-center gap-2"><AlertTriangle size={14} />{cardError}</p>}
      <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
        <Shield size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-amber-700 text-xs leading-relaxed"><strong>Card not charged yet.</strong> Funds held in escrow — released only after you confirm the job is done.</p>
      </div>
      <button onClick={handlePay} disabled={loading || !stripe} className="btn-primary w-full py-4 text-base disabled:opacity-50">
        {loading
          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          : <span className="flex items-center justify-center gap-2"><Lock size={16} /> Authorize ${total.toFixed(2)} in Escrow</span>
        }
      </button>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ServiceRequest() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)        // 0=browse 1=details 2=payment 3=confirmed
  const [selected, setSelected] = useState(null)
  const [tier, setTier] = useState('standard')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [availability, setAvailability] = useState('today')
  const [loading, setLoading] = useState(false)

  const emergencyMode = params.get('emergency') === 'true'
  const displayServices = emergencyMode ? SERVICES.filter(s => s.emergency) : SERVICES
  const categories = [...new Set(displayServices.map(s => s.category))]

  const price = selected ? selected.tiers[tier] : 0
  const fee = Math.round(price * PLATFORM_FEE * 100) / 100
  const total = price + fee

  const jobData = {
    service_id: selected?.id,
    service_name: selected?.name,
    tier, price: total,
    address_street: address.split(',')[0]?.trim() || address,
    address_city: address.split(',')[1]?.trim() || 'Unknown',
    address_state: address.split(',')[2]?.trim() || 'MD',
    address_zip: address.split(',')[3]?.trim() || '',
    notes, urgent: emergencyMode,
  }

  const selectService = (service) => { setSelected(service); setStep(1) }
  const handleJobConfirmed = () => { setLoading(false); setStep(3) }

  // ── Step 0: Browse ──────────────────────────────────────────────────────
  if (step === 0) return (
    <div className="flex flex-col h-full overflow-auto bg-surface-100">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-5 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors">
          <ChevronLeft size={20} className="text-surface-600" />
        </button>
        <div>
          <h1 className="text-surface-900 font-bold text-lg leading-tight">Book a Technician</h1>
          <p className="text-surface-400 text-xs">What do you need fixed?</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-6 max-w-2xl mx-auto w-full">
        {/* Emergency banner */}
        {!emergencyMode && (
          <button
            onClick={() => navigate('/customer/request?emergency=true')}
            className="w-full flex items-center gap-4 bg-rose-500 hover:bg-rose-600 active:scale-[0.98] transition-all rounded-2xl px-5 py-4 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-base">No Heat or No A/C?</p>
              <p className="text-rose-100 text-sm">Priority dispatch — techs respond in minutes</p>
            </div>
            <ChevronRight size={20} className="text-white/70" />
          </button>
        )}

        {/* Service categories */}
        {categories.filter(c => c !== 'Emergency').map(cat => {
          const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Maintenance']
          const CatIcon = cfg.icon
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-6 h-6 rounded-lg ${cfg.iconBg} flex items-center justify-center`}>
                  <CatIcon size={13} className={cfg.text} />
                </div>
                <h2 className="text-surface-900 font-bold text-sm uppercase tracking-wider">{cat}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {displayServices.filter(s => s.category === cat).map(service => (
                  <button
                    key={service.id}
                    onClick={() => selectService(service)}
                    className={`group text-left ${cfg.bg} border ${cfg.border} rounded-2xl p-4 hover:shadow-md active:scale-[0.97] transition-all duration-150`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${cfg.iconBg} flex items-center justify-center mb-3 text-2xl`}>
                      {service.icon}
                    </div>
                    <p className="text-surface-900 font-semibold text-sm leading-tight mb-1">{service.name}</p>
                    <p className="text-surface-500 text-xs leading-tight mb-2">{service.description}</p>
                    <p className={`font-bold text-sm ${cfg.text}`}>from ${service.tiers.basic}</p>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ── Step 1: Details ─────────────────────────────────────────────────────
  if (step === 1 && selected) {
    const cfg = CATEGORY_CONFIG[selected.category] || CATEGORY_CONFIG['Maintenance']
    return (
      <div className="flex flex-col h-full overflow-auto bg-surface-100">
        {/* Header */}
        <div className="bg-white border-b border-surface-200 px-5 py-4 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setStep(0)} className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors">
            <ChevronLeft size={20} className="text-surface-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-surface-900 font-bold text-base leading-tight">{selected.name}</h1>
            <p className="text-surface-400 text-xs">{selected.description}</p>
          </div>
          <div className={`text-2xl w-11 h-11 ${cfg.iconBg} rounded-xl flex items-center justify-center`}>{selected.icon}</div>
        </div>

        <div className="flex-1 px-4 py-5 space-y-5 max-w-2xl mx-auto w-full">
          {/* Tier picker */}
          <div>
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Choose Your Service Level</p>
            <div className="grid grid-cols-3 gap-2">
              {TIERS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTier(t.key)}
                  className={`relative rounded-2xl border-2 p-3 text-center transition-all ${
                    tier === t.key
                      ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                      : 'border-surface-200 bg-white hover:border-surface-300'
                  }`}
                >
                  {t.badge && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">
                      {t.badge}
                    </span>
                  )}
                  <p className="text-surface-900 font-bold text-sm mt-1">{t.label}</p>
                  <p className="text-brand-600 font-black text-xl">${selected.tiers[t.key]}</p>
                  <p className="text-surface-400 text-xs mt-0.5 leading-tight">{t.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">Service Address</p>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                className="input pl-10"
                placeholder="123 Main St, Annapolis, MD 21401"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">Describe the Issue <span className="text-surface-400 font-normal normal-case">(optional)</span></p>
            <textarea
              className="input h-20 resize-none"
              placeholder="e.g. Furnace making loud banging noise and not heating properly…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Availability */}
          <div>
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">When do you need service?</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'today',       label: 'Today',           sub: 'ASAP dispatch' },
                { value: 'tomorrow_am', label: 'Tomorrow AM',     sub: 'Before noon' },
                { value: 'tomorrow_pm', label: 'Tomorrow PM',     sub: 'After noon' },
                { value: 'this_week',   label: 'This Week',       sub: 'Flexible' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAvailability(opt.value)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                    availability === opt.value
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-surface-200 bg-white hover:border-surface-300'
                  }`}
                >
                  <p className={`font-semibold text-sm ${availability === opt.value ? 'text-brand-600' : 'text-surface-900'}`}>{opt.label}</p>
                  <p className="text-surface-400 text-xs">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-white border border-surface-200 rounded-2xl px-4 py-4 space-y-2 text-sm">
            <div className="flex justify-between text-surface-500">
              <span>{selected.name} ({TIERS.find(t => t.key === tier)?.label})</span>
              <span>${price}</span>
            </div>
            <div className="flex justify-between text-surface-500">
              <span>Platform fee (12%)</span>
              <span>${fee}</span>
            </div>
            <div className="border-t border-surface-100 pt-2 flex justify-between font-bold">
              <span className="text-surface-900">Total (held in escrow)</span>
              <span className="text-brand-600 text-lg">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!address.trim()}
            className="btn-primary w-full py-4 text-base disabled:opacity-40"
          >
            Continue to Payment <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ── Step 2: Payment ─────────────────────────────────────────────────────
  if (step === 2 && selected) return (
    <div className="flex flex-col h-full overflow-auto bg-surface-100">
      <div className="bg-white border-b border-surface-200 px-5 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => setStep(1)} className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors">
          <ChevronLeft size={20} className="text-surface-600" />
        </button>
        <div>
          <h1 className="text-surface-900 font-bold text-base">Confirm & Pay</h1>
          <p className="text-surface-400 text-xs">Funds held securely until job complete</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-4 max-w-2xl mx-auto w-full">
        {/* Order summary */}
        <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-surface-50 border-b border-surface-100">
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Order Summary</p>
          </div>
          <div className="px-4 py-4 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selected.icon}</span>
              <div className="flex-1">
                <p className="text-surface-900 font-semibold">{selected.name}</p>
                <p className="text-surface-400 text-xs">{TIERS.find(t => t.key === tier)?.label} tier · {availability.replace(/_/g, ' ')}</p>
              </div>
              <p className="text-surface-900 font-bold">${price}</p>
            </div>
            <div className="flex items-center gap-2 text-surface-500 text-xs">
              <MapPin size={12} /><span>{address}</span>
            </div>
            {notes && <p className="text-surface-500 text-xs italic">"{notes}"</p>}
            <div className="border-t border-surface-100 pt-3 flex justify-between font-bold">
              <span className="text-surface-900">Total Authorized</span>
              <span className="text-brand-600 text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Stripe */}
        <Elements stripe={stripePromise}>
          <PaymentForm onSuccess={handleJobConfirmed} total={total} loading={loading} setLoading={setLoading} jobData={jobData} />
        </Elements>
      </div>
    </div>
  )

  // ── Step 3: Confirmed ───────────────────────────────────────────────────
  if (step === 3) return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center bg-surface-100">
      <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center mb-6 animate-bounce-once">
        <Check size={44} className="text-emerald-500" />
      </div>
      <h2 className="text-2xl font-black text-surface-900 mb-2">You're booked!</h2>
      <p className="text-surface-500 mb-8 max-w-xs leading-relaxed">Your request is live. Certified techs nearby are being notified right now.</p>

      <div className="w-full max-w-xs space-y-3 mb-8">
        {[
          { icon: Zap,    color: 'text-amber-500',   bg: 'bg-amber-50',   text: 'Broadcast to nearby techs' },
          { icon: Clock,  color: 'text-brand-500',   bg: 'bg-brand-50',   text: 'Avg. acceptance: ~4 minutes' },
          { icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50', text: `$${total.toFixed(2)} secured in escrow` },
        ].map(({ icon: Icon, color, bg, text }) => (
          <div key={text} className={`flex items-center gap-3 ${bg} rounded-xl px-4 py-3`}>
            <Icon size={18} className={color} />
            <span className="text-surface-700 text-sm font-medium">{text}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <button onClick={() => navigate('/customer/track')} className="btn-primary flex-1 py-3">Track Job</button>
        <button onClick={() => { setStep(0); setSelected(null); setAddress(''); setNotes('') }} className="btn-secondary flex-1 py-3">New Request</button>
      </div>
    </div>
  )

  return null
}
