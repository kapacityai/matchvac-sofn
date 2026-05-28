import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { CheckCircle, ArrowRight, ChevronLeft, Shield, Clock, DollarSign, X, Star, Zap, CreditCard, RefreshCw, TrendingUp } from 'lucide-react'

// ── Partner Pre-Qual Modal ────────────────────────────────────────────────────
function PreQualModal({ partner, onClose }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', address: '', zip: '', last4: '', need: '', income: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const canSubmit = form.firstName && form.lastName && form.phone && form.zip && form.last4 && form.need

  if (step === 1) return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-surface-200 rounded-2xl max-w-md w-full p-8 text-center">
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-surface-900 mb-2">Application Received!</h3>
        <p className="text-surface-400 mb-4">
          <strong className="text-white">{partner.name}</strong> will contact <strong className="text-white">{form.firstName}</strong> at <strong className="text-white">{form.phone}</strong> within 1 business day to discuss your options.
        </p>
        <div className="card text-left text-sm space-y-2 mb-6">
          <p className="text-surface-400">You applied for: <span className="text-white font-medium">{form.need}</span></p>
          <p className="text-surface-400">ZIP Code: <span className="text-white font-medium">{form.zip}</span></p>
          <p className="text-surface-500 text-xs mt-2">Soft inquiry only — your credit score was not affected.</p>
        </div>
        <button onClick={onClose} className="btn-primary w-full">Done</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white border border-surface-200 rounded-2xl max-w-lg w-full my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: partner.bgColor }}>
              {partner.icon}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{partner.name}</p>
              <p className="text-surface-400 text-xs">{partner.tagline}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X size={16} className="text-white" />
          </button>
        </div>

        <form className="p-5 space-y-4" onSubmit={e => { e.preventDefault(); if (canSubmit) setStep(1) }}>
          <p className="text-surface-400 text-sm">Soft credit check — <strong className="text-white">will not affect your score</strong></p>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">First Name *</label><input className="input" placeholder="Jane" value={form.firstName} onChange={set('firstName')} required /></div>
            <div><label className="label">Last Name *</label><input className="input" placeholder="Smith" value={form.lastName} onChange={set('lastName')} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Phone *</label><input className="input" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} required /></div>
            <div><label className="label">Email</label><input className="input" type="email" placeholder="jane@email.com" value={form.email} onChange={set('email')} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">ZIP Code *</label><input className="input" placeholder="92627" value={form.zip} onChange={set('zip')} required /></div>
            <div>
              <label className="label">Last 4 SSN *</label>
              <input className="input font-mono tracking-widest" placeholder="••••" maxLength={4} value={form.last4}
                onChange={e => setForm(f => ({ ...f, last4: e.target.value.replace(/\D/g,'').slice(0,4) }))} required />
            </div>
          </div>
          <div>
            <label className="label">What Do You Need Financing For? *</label>
            <select className="input" value={form.need} onChange={set('need')} required>
              <option value="">Select…</option>
              {['HVAC System / Heat Pump', 'Water Heater', 'Furnace', 'Air Conditioning', 'Multiple Systems', 'Not Sure — Need Assessment'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          {partner.requiresIncome && (
            <div>
              <label className="label">Annual Household Income (approximate)</label>
              <select className="input" value={form.income} onChange={set('income')}>
                <option value="">Prefer not to say</option>
                {['Under $30,000','$30,000–$50,000','$50,000–$75,000','$75,000–$100,000','$100,000+'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          )}
          <div className="px-3 py-2.5 bg-surface-100 rounded-xl text-xs text-surface-400 leading-relaxed">
            By submitting you authorize {partner.name} to perform a soft credit inquiry and contact you about financing options. This does not affect your credit score.
          </div>
          <button type="submit" disabled={!canSubmit}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${canSubmit ? 'text-white' : 'bg-surface-150 text-surface-500 cursor-not-allowed'}`}
            style={canSubmit ? { background: partner.btnColor || '#0284c7' } : {}}>
            Get Pre-Qualified <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Financing Partners Data ───────────────────────────────────────────────────
const PARTNERS = [
  {
    id: 'cc',
    name: 'Comfort Connect Premier Program®',
    tagline: 'All-inclusive monthly subscription — not a loan',
    type: 'subscription',
    typeLabel: 'Preferred Partner',
    icon: '❄️',
    bgColor: '#003478',
    btnColor: '#003478',
    featured: true,
    apr: 'No interest — flat monthly payment',
    amount: 'All systems covered',
    term: 'Month-to-month, transferable',
    decision: 'Same day',
    minCredit: 'All credit considered',
    highlights: [
      'Equipment + installation included',
      'All repairs & maintenance included',
      'No charge consumable parts (filters, UV bulbs)',
      '24/7 priority service scheduling',
      'Transferable to new home buyer',
      'No hidden fees — ever',
    ],
    route: '/comfort-connect',
    cta: 'See If I Qualify',
    requiresIncome: false,
  },
  {
    id: 'greenleaf',
    name: 'GreenLeaf Home Finance',
    tagline: 'Traditional HVAC loans with competitive rates',
    type: 'loan',
    typeLabel: 'Traditional Loan',
    icon: '🌿',
    bgColor: '#14532d',
    btnColor: '#16a34a',
    featured: false,
    apr: 'From 5.9% APR',
    amount: 'Up to $25,000',
    term: '12–84 months',
    decision: '< 2 minutes',
    minCredit: '620+ FICO',
    highlights: [
      'Fixed monthly payments',
      'No prepayment penalty',
      'Funds deposited directly to contractor',
      'Co-applicant allowed',
    ],
    cta: 'Apply in 2 Minutes',
    requiresIncome: true,
  },
  {
    id: 'snapfinance',
    name: 'SnapRent-to-Own',
    tagline: 'No credit needed — 100-day payoff option',
    type: 'rto',
    typeLabel: 'Rent-to-Own',
    icon: '⚡',
    bgColor: '#7c2d12',
    btnColor: '#ea580c',
    featured: false,
    apr: 'Early payoff available',
    amount: 'Up to $5,000',
    term: '12–24 month lease',
    decision: 'Instant approval',
    minCredit: 'No credit needed',
    highlights: [
      'No minimum credit score',
      '100-day payoff — pay only cost of goods',
      'Flexible weekly/bi-weekly/monthly payments',
      'Own it or return it',
    ],
    cta: 'Get Instant Approval',
    requiresIncome: false,
  },
  {
    id: 'acorn',
    name: 'Acorn Finance',
    tagline: 'Compare multiple lender offers at once',
    type: 'loan',
    typeLabel: 'Loan Marketplace',
    icon: '🌰',
    bgColor: '#422006',
    btnColor: '#a16207',
    featured: false,
    apr: '0%–35.99% APR',
    amount: 'Up to $100,000',
    term: '24–144 months',
    decision: '60 seconds',
    minCredit: '600+ FICO',
    highlights: [
      'One application, multiple offers',
      'No impact to credit to check rates',
      'Lenders compete for your business',
      'Same-day funding available',
    ],
    cta: 'Compare My Offers',
    requiresIncome: true,
  },
  {
    id: 'fortiva',
    name: 'Fortiva Retail Credit',
    tagline: 'Fair-credit and rebuilding credit welcome',
    type: 'lto',
    typeLabel: 'Lease-to-Own',
    icon: '🏦',
    bgColor: '#1e3a5f',
    btnColor: '#1d4ed8',
    featured: false,
    apr: 'Promotional 0% if paid in 12 mo.',
    amount: 'Up to $7,500',
    term: '12–48 months',
    decision: '< 5 minutes',
    minCredit: 'Fair credit OK (550+)',
    highlights: [
      '0% promo period available',
      'Build credit with on-time payments',
      'No security deposit',
      'Easy online account management',
    ],
    cta: 'Check My Options',
    requiresIncome: false,
  },
]

const TYPE_COLORS = {
  subscription: 'badge-teal',
  loan: 'badge-green',
  rto: 'badge-yellow',
  lto: 'badge-purple',
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FinancingPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const featured = PARTNERS.find(p => p.featured)
  const others = PARTNERS.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-surface-100">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface-100/90 backdrop-blur-xl border-b border-surface-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors text-sm">
            <ChevronLeft size={18} /> Back
          </button>
          <Logo size="sm" />
          <button onClick={() => navigate('/')} className="text-surface-400 hover:text-white text-sm transition-colors">Website</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-14 space-y-12">
        {/* Header */}
        <div className="text-center">
          <div className="badge badge-teal px-4 py-1.5 text-sm mb-4 inline-flex items-center gap-2">
            <DollarSign size={14} /> HVAC Financing Options
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-surface-900 mb-3">
            Flexible Financing<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">For Every Situation</span>
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            From no-credit-needed rent-to-own to all-inclusive monthly subscriptions — find the right payment option for your home comfort needs.
          </p>
        </div>

        {/* ── Comfort Connect — ALWAYS #1 FEATURED ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-surface-200" />
            <span className="text-brand-600 text-xs font-bold uppercase tracking-widest">#1 Recommended — Most Popular Choice</span>
            <div className="h-px flex-1 bg-surface-200" />
          </div>

          <div
            onClick={() => navigate('/comfort-connect')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-brand-200 bg-white hover:border-brand-400 hover:shadow-lg transition-all"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-400" />
            {/* Header bar */}
            <div className="bg-brand-50 border-b border-brand-100 px-5 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-brand-700 font-bold tracking-wide">Comfort Connect</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700">Premier Program®</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={13} className="text-amber-400 fill-amber-400" />)}
                <span className="text-surface-600 text-xs font-semibold ml-1">4.9 · 2,400+ members</span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-surface-900 font-extrabold text-2xl mb-2">
                  Don't Buy — Get It All Included for One Monthly Payment
                </h2>
                <p className="text-surface-500 mb-4">Equipment + professional installation + all repairs + annual maintenance + consumable parts. No up-front cost. No surprise bills. Ever.</p>
                <div className="grid grid-cols-2 gap-2">
                  {featured.highlights.map(h => (
                    <div key={h} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-brand-500 flex-shrink-0" />
                      <span className="text-surface-600">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-between gap-4">
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Monthly Cost', value: 'One flat rate', icon: DollarSign },
                    { label: 'Up-Front Cost', value: '$0', icon: Shield },
                    { label: 'Approval', value: 'Same day', icon: Zap },
                    { label: 'Credit Required', value: 'All considered', icon: CreditCard },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-2">
                      <s.icon size={14} className="text-brand-500 flex-shrink-0" />
                      <span className="text-surface-500">{s.label}:</span>
                      <span className="text-surface-900 font-semibold">{s.value}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-primary w-full py-3.5 px-5 text-sm">
                  See If I Qualify <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Other Partners ── */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-surface-400 text-xs font-semibold uppercase tracking-widest">More Financing Options</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {others.map(partner => (
              <div key={partner.id} className="card hover:border-white/20 transition-all flex flex-col">
                {/* Partner header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: partner.bgColor + '60' }}>
                    {partner.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-white font-bold text-sm">{partner.name}</p>
                      <span className={`badge ${TYPE_COLORS[partner.type]} text-xs`}>{partner.typeLabel}</span>
                    </div>
                    <p className="text-surface-400 text-xs">{partner.tagline}</p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  {[
                    { label: 'Rate', value: partner.apr },
                    { label: 'Amount', value: partner.amount },
                    { label: 'Term', value: partner.term },
                    { label: 'Min Credit', value: partner.minCredit },
                  ].map(s => (
                    <div key={s.label} className="bg-surface-150/50 rounded-lg px-2.5 py-2">
                      <p className="text-surface-500 text-xs">{s.label}</p>
                      <p className="text-white font-semibold text-xs">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div className="space-y-1.5 mb-4 flex-1">
                  {partner.highlights.map(h => (
                    <div key={h} className="flex items-center gap-2 text-xs">
                      <CheckCircle size={11} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-surface-300">{h}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelected(partner)}
                  className="w-full py-3 rounded-xl font-bold text-sm text-surface-900 flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: partner.btnColor }}
                >
                  {partner.cta} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-surface-600 text-xs max-w-2xl mx-auto">
          MatcHvac is not a lender. Financing options are provided by independent third-party partners. Approval is subject to each partner's credit criteria. Rates and terms are subject to change. All soft inquiries have no impact on your credit score.
        </p>
      </div>

      {selected && <PreQualModal partner={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
