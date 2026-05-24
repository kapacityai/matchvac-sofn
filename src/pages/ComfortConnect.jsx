import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, Home, Droplets, Wind, Zap, Shield, Clock, Star, Phone, ChevronLeft, User, MapPin, CreditCard, Wrench } from 'lucide-react'

// ── Comfort Connect Logo Component ──────────────────────────────────────────
function CCLogo({ size = 'md' }) {
  const sizes = { sm: 'h-8', md: 'h-12', lg: 'h-16' }
  return (
    <div className={`inline-flex items-center gap-2.5 bg-[#003478] px-4 py-2 rounded-xl ${sizes[size]}`}>
      <div className="flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
          <path d="M20 4L4 16v20h10V24h12v12h10V16L20 4z" fill="white" opacity="0.9"/>
          <rect x="15" y="24" width="10" height="12" fill="white" opacity="0.6"/>
        </svg>
      </div>
      <div className="text-left">
        <p className="text-white font-bold text-sm leading-tight tracking-wide">Comfort</p>
        <p className="text-white font-bold text-sm leading-tight tracking-wide">Connect</p>
      </div>
    </div>
  )
}

const BENEFITS_LEFT = [
  { text: 'No Hassle, Worry-Free Service', sub: 'Everything your system needs, worry-free.' },
  { text: 'No Large Up-Front Payment', sub: 'Everything included for a predictable, low monthly payment.' },
  { text: 'No Charge Annual Maintenance', sub: 'Keeps your system running at peak efficiency.' },
  { text: 'No Charge Covered Repairs', sub: 'Service and repairs (parts & labor) are included.' },
  { text: 'No Charge Consumable Parts', sub: 'UV bulbs, air filters, and other consumables are included.' },
  { text: 'No Hidden Charges or Fees', sub: 'No trip, diagnostic, or overtime fees.' },
]

const BENEFITS_RIGHT = [
  { text: 'Comprehensive Installation', sub: 'Professional installation by Premier Program Authorized Contractors.' },
  { text: '24/7 Priority Scheduling', sub: 'Your needs will be prioritized and a technician typically dispatched within 24 hours.' },
  { text: 'Most Advanced Home Comfort Systems', sub: 'Access to the latest HVAC, water heaters, water filtration systems, and standby generators.' },
  { text: 'Transferable Service', sub: 'Worry-free service can be transferred to the buyer of your home.' },
  { text: 'Flexible End-of-Term Options', sub: 'Including options to upgrade your system.' },
  { text: 'Billing and Payment Support', sub: 'Live, US-Based customer support for billing, payment, and other assistance.' },
]

const EQUIPMENT = [
  { icon: '🌀', label: 'HVAC Systems &\nHeat Pumps' },
  { icon: '💧', label: 'Tank, Tankless, &\nHeat Pump Water Heaters' },
  { icon: '🚿', label: 'Water Purification\nSystems' },
  { icon: '⚡', label: 'Standby\nGenerators' },
]

const NEEDS = [
  'HVAC System (Heating & Cooling)',
  'Heat Pump',
  'Water Heater (Tank or Tankless)',
  'Water Purification System',
  'Standby Generator',
  'Multiple Systems',
  'Not Sure — Need Assessment',
]

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ComfortConnect() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
    last4: '', need: '',
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const canSubmit = form.firstName && form.lastName && form.phone && form.address && form.zip && form.last4 && form.need

  const handleSubmit = (e) => {
    e.preventDefault()
    if (canSubmit) setSubmitted(true)
  }

  if (submitted) return <ConfirmationScreen form={form} navigate={navigate} />

  return (
    <div className="min-h-screen bg-surface-100">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface-100/90 backdrop-blur-xl border-b border-surface-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors text-sm">
            <ChevronLeft size={18} /> Back
          </button>
          <CCLogo size="sm" />
          <div className="w-20" />
        </div>
      </nav>

      {/* Hero */}
      <section className="py-14 px-6 text-center bg-gradient-to-b from-[#003478]/20 to-navy-950 border-b border-surface-200">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-5">
            <CCLogo size="lg" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-surface-900 mb-3 leading-tight">
            Our Home Comfort Solution:<br />
            <span className="text-[#4da6ff]">The Premier Program®</span>
          </h1>
          <p className="text-surface-400 text-lg mb-6">
            Make Your Entire Home Comfortable And Worry-Free With Low Monthly Payments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="badge badge-blue px-3 py-1.5">No Up-Front Costs</span>
            <span className="badge badge-green px-3 py-1.5">Includes All Repairs</span>
            <span className="badge badge-purple px-3 py-1.5">24/7 Priority Service</span>
            <span className="badge badge-blue px-3 py-1.5">Transferable</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left column */}
            <div className="space-y-4">
              {BENEFITS_LEFT.map(b => (
                <div key={b.text} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#003478] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={13} className="text-[#4da6ff]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{b.text}</p>
                    <p className="text-surface-400 text-xs mt-0.5">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Right column */}
            <div className="space-y-4">
              {BENEFITS_RIGHT.map(b => (
                <div key={b.text} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#003478] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={13} className="text-[#4da6ff]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{b.text}</p>
                    <p className="text-surface-400 text-xs mt-0.5">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment covered */}
          <div className="card bg-[#003478]/20 border-[#003478]/40 mb-12">
            <h3 className="text-white font-bold text-xl text-center mb-6">Equipment Premier Program Covers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {EQUIPMENT.map(eq => (
                <div key={eq.label} className="text-center p-4 bg-surface-100 rounded-2xl">
                  <div className="text-4xl mb-2">{eq.icon}</div>
                  <p className="text-white text-xs font-semibold leading-tight whitespace-pre-line">{eq.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-qual form */}
          <div id="prequal" className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 badge badge-blue px-4 py-2 text-sm mb-3">
                <Shield size={14} /> Soft credit check — won't affect your score
              </div>
              <h2 className="text-3xl font-extrabold text-surface-900 mb-2">Find an Authorized Dealer Near You</h2>
              <p className="text-surface-400">Fill out the form below and a local Premier Program Authorized Contractor will contact you to schedule your free consultation.</p>
            </div>

            <form onSubmit={handleSubmit} className="card space-y-5">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name *</label>
                  <input className="input" placeholder="Jane" value={form.firstName} onChange={set('firstName')} required />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input className="input" placeholder="Smith" value={form.lastName} onChange={set('lastName')} required />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone Number *</label>
                  <input className="input" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} required />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input className="input" type="email" placeholder="jane@email.com" value={form.email} onChange={set('email')} />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="label">Service Address *</label>
                <input className="input" placeholder="123 Main Street" value={form.address} onChange={set('address')} required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="label">City *</label>
                  <input className="input" placeholder="Costa Mesa" value={form.city} onChange={set('city')} />
                </div>
                <div>
                  <label className="label">State</label>
                  <input className="input" placeholder="CA" value={form.state} onChange={set('state')} />
                </div>
                <div>
                  <label className="label">ZIP *</label>
                  <input className="input" placeholder="92627" value={form.zip} onChange={set('zip')} required />
                </div>
              </div>

              {/* Last 4 SSN */}
              <div>
                <label className="label">Last 4 Digits of Social Security Number *</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
                  <input
                    className="input pl-9 tracking-widest font-mono"
                    placeholder="••••"
                    maxLength={4}
                    pattern="\d{4}"
                    value={form.last4}
                    onChange={e => setForm(f => ({ ...f, last4: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    required
                  />
                </div>
                <p className="text-surface-500 text-xs mt-1">Used only for soft identity verification — does not affect your credit score.</p>
              </div>

              {/* System need */}
              <div>
                <label className="label">What Does Your Home Need? *</label>
                <select className="input" value={form.need} onChange={set('need')} required>
                  <option value="">Select an option…</option>
                  {NEEDS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              {/* Consent */}
              <div className="px-4 py-3 bg-surface-150/50 rounded-xl text-xs text-surface-400 leading-relaxed">
                By submitting this form, you agree to be contacted by a Comfort Connect Premier Program Authorized Contractor in your area. Your information is kept confidential and is not sold to third parties. This is a soft inquiry and will <strong className="text-white">not</strong> impact your credit score.
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${canSubmit ? 'bg-[#003478] hover:bg-[#00449e] text-surface-900' : 'bg-surface-150 text-surface-500 cursor-not-allowed'}`}
              >
                Find My Authorized Dealer <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <footer className="border-t border-surface-200 py-8 px-6 text-center text-surface-500 text-xs">
        <p>Comfort Connect Premier Program® is a registered service. All equipment and services provided by authorized contractors.</p>
        <p className="mt-1">© 2026 Comfort Connect. All rights reserved.</p>
      </footer>
    </div>
  )
}

// ── Confirmation Screen ──────────────────────────────────────────────────────
function ConfirmationScreen({ form, navigate }) {
  return (
    <div className="min-h-screen bg-surface-100 flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-lg w-full">
        {/* Animated success icon */}
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 bg-[#003478]/30 rounded-full animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-[#003478] flex items-center justify-center">
            <CheckCircle size={44} className="text-[#4da6ff]" />
          </div>
        </div>

        <div className="mb-6">
          <CCLogo size="md" />
        </div>

        <h2 className="text-3xl font-extrabold text-surface-900 mb-3">
          We're Locating Your Nearest<br />Authorized Premier Program Dealer
        </h2>
        <p className="text-surface-400 text-lg mb-8 leading-relaxed">
          Thank you, <strong className="text-white">{form.firstName}</strong>! Our team is matching you with a certified Comfort Connect Premier Program Authorized Contractor in <strong className="text-white">{form.city || form.zip}</strong>.
        </p>

        {/* What happens next */}
        <div className="card text-left space-y-4 mb-8">
          <h3 className="text-white font-bold text-center mb-2">What Happens Next</h3>
          {[
            { icon: Phone, color: 'text-brand-400', bg: 'bg-brand-400/10', step: '1', title: 'A local dealer will call you', sub: `Expect a call to ${form.phone} within 24 hours to confirm your consultation.` },
            { icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-400/10', step: '2', title: 'Free in-home consultation', sub: 'Your authorized contractor will assess your home and recommend the right system.' },
            { icon: Wrench, color: 'text-accent-400', bg: 'bg-accent-400/10', step: '3', title: 'Professional installation', sub: 'Equipment installed by certified technicians — covered under the Premier Program from day one.' },
            { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-400/10', step: '4', title: 'Worry-free from here on', sub: 'All maintenance, repairs, and consumables included with your low monthly payment.' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon size={18} className={item.color} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{item.title}</p>
                <p className="text-surface-400 text-xs mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/')} className="btn-secondary py-3 px-6">
            Return to Website
          </button>
          <button onClick={() => navigate(-2)} className="bg-[#003478] hover:bg-[#00449e] text-surface-900 font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
            Back to Store <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
