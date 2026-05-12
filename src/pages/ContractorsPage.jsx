import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import {
  ChevronLeft, CheckCircle, ArrowRight, Star, Users, DollarSign,
  TrendingUp, Shield, Zap, Phone, MapPin, Wrench, Award,
  BarChart3, Bell, X
} from 'lucide-react'

const TIERS = [
  {
    id: 'basic',
    name: 'Standard Listing',
    price: 0,
    billing: 'Free',
    badge: '',
    color: 'border-white/10',
    btnClass: 'btn-secondary',
    features: [
      'Business listed in contractor directory',
      'Basic profile (name, trade, phone)',
      'Receive referral inquiries from customers',
      '10% referral fee on completed jobs',
      'Standard visibility in search results',
    ],
    notIncluded: [
      'Featured placement',
      'Verified badge',
      'Priority lead routing',
      'Performance analytics',
    ],
  },
  {
    id: 'verified',
    name: 'Verified Partner',
    price: 299,
    billing: 'One-time setup + $99/mo',
    badge: 'Popular',
    color: 'border-brand-500',
    btnClass: 'btn-primary',
    features: [
      'Everything in Standard',
      '✅ Verified Partner badge on all listings',
      'Enhanced profile (logo, photos, reviews)',
      'Priority lead routing in your trade area',
      'Reduced referral fee — 7% on completed jobs',
      'Customer review collection tools',
      'Monthly performance report',
    ],
    notIncluded: [
      'Featured / #1 placement',
      'Co-marketing in app',
    ],
  },
  {
    id: 'featured',
    name: 'Featured Partner',
    price: 499,
    billing: '/month',
    badge: 'Best ROI',
    color: 'border-accent-500',
    btnClass: 'bg-accent-500 hover:bg-accent-600 text-white font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 justify-center',
    features: [
      'Everything in Verified',
      '🥇 #1 Featured placement in your category',
      'In-app banner ads to customers in your area',
      'Post-job referral ads (e.g. shown after HVAC job)',
      'Co-branded email to local customer base',
      'Lowest referral fee — 5% on completed jobs',
      'Dedicated account manager',
      'Priority support line',
      'Full analytics dashboard',
    ],
    notIncluded: [],
  },
]

const TRADES = [
  { icon: '⚡', name: 'Electrical', desc: 'Licensed electricians for panel upgrades, EV chargers, whole-home rewiring' },
  { icon: '🔧', name: 'Plumbing', desc: 'Water lines, drain clearing, fixture installs, water damage restoration' },
  { icon: '🏗️', name: 'Roofing', desc: 'Repair, replacement, inspections — all roof types' },
  { icon: '🪟', name: 'Windows & Doors', desc: 'Energy-efficient window and door replacement' },
  { icon: '🎨', name: 'Interior Painting', desc: 'Residential interior and exterior painting services' },
  { icon: '🌿', name: 'Landscaping', desc: 'Lawn care, irrigation, landscape design' },
  { icon: '🧹', name: 'Home Cleaning', desc: 'Post-construction, deep clean, recurring service' },
  { icon: '🔒', name: 'Security', desc: 'Smart locks, camera systems, alarm monitoring' },
]

function SignupModal({ tier, onClose }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ bizName: '', contact: '', phone: '', email: '', trade: '', zip: '', license: '', website: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const canNext = form.bizName && form.contact && form.phone && form.email && form.trade && form.zip

  if (step === 1) return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-900 border border-white/10 rounded-2xl max-w-md w-full p-8 text-center">
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="absolute inset-0 bg-brand-500/20 rounded-full animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <CheckCircle size={32} className="text-brand-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
        <p className="text-surface-400 mb-4">
          Thanks, <strong className="text-white">{form.bizName}</strong>! Our partnerships team will review your application and reach out to <strong className="text-white">{form.email}</strong> within 1–2 business days.
        </p>
        <div className="card text-left text-sm space-y-1.5 mb-6">
          <p className="text-surface-400">Plan selected: <span className="text-white font-medium">{tier.name}</span></p>
          <p className="text-surface-400">Trade: <span className="text-white font-medium">{form.trade}</span></p>
          <p className="text-surface-400">Coverage area: <span className="text-white font-medium">{form.zip}</span></p>
        </div>
        <button onClick={onClose} className="btn-primary w-full">Done</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-surface-900 border border-white/10 rounded-2xl max-w-lg w-full my-4">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <p className="text-white font-bold">Apply for {tier.name}</p>
            <p className="text-surface-400 text-sm">{tier.billing}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20">
            <X size={16} className="text-white" />
          </button>
        </div>
        <form className="p-5 space-y-4" onSubmit={e => { e.preventDefault(); if (canNext) setStep(1) }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="label">Business Name *</label><input className="input" placeholder="ABC Plumbing Co." value={form.bizName} onChange={set('bizName')} required /></div>
            <div><label className="label">Contact Name *</label><input className="input" placeholder="John Smith" value={form.contact} onChange={set('contact')} required /></div>
            <div><label className="label">Phone *</label><input className="input" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} required /></div>
            <div className="col-span-2"><label className="label">Email *</label><input className="input" type="email" placeholder="john@abcplumbing.com" value={form.email} onChange={set('email')} required /></div>
            <div>
              <label className="label">Trade / Service *</label>
              <select className="input" value={form.trade} onChange={set('trade')} required>
                <option value="">Select trade…</option>
                {TRADES.map(t => <option key={t.name}>{t.name}</option>)}
                <option>HVAC (Sub-contractor)</option>
                <option>Other</option>
              </select>
            </div>
            <div><label className="label">Primary ZIP Code *</label><input className="input" placeholder="92627" value={form.zip} onChange={set('zip')} required /></div>
            <div><label className="label">State License # (if applicable)</label><input className="input" placeholder="C-36 #12345" value={form.license} onChange={set('license')} /></div>
            <div><label className="label">Website (optional)</label><input className="input" placeholder="www.yourbiz.com" value={form.website} onChange={set('website')} /></div>
          </div>
          <div className="px-3 py-2.5 bg-surface-800/60 rounded-xl text-xs text-surface-400">
            By applying you agree to ServiceConnect's Contractor Partner Terms. Featured listings require a valid contractor's license and proof of insurance.
          </div>
          <button type="submit" disabled={!canNext} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${canNext ? 'bg-brand-500 hover:bg-brand-600 text-white' : 'bg-surface-800 text-surface-500 cursor-not-allowed'}`}>
            Submit Application <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ContractorsPage() {
  const navigate = useNavigate()
  const [selectedTier, setSelectedTier] = useState(null)

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors text-sm">
            <ChevronLeft size={18} /> Home
          </button>
          <Logo size="sm" />
          <button onClick={() => navigate('/')} className="text-surface-400 hover:text-white text-sm">Website</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-14 space-y-16">

        {/* Hero */}
        <div className="text-center">
          <div className="badge badge-purple px-4 py-1.5 text-sm mb-4 inline-flex items-center gap-2">
            <Wrench size={14} /> For Contractors & Trade Partners
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Grow Your Business With<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">ServiceConnect Referrals</span>
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto mb-8">
            Our platform serves thousands of homeowners actively seeking home service contractors. Get your business in front of qualified, ready-to-book customers in your area.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              { icon: Users, text: '2,400+ active homeowners', color: 'text-brand-400' },
              { icon: MapPin, text: '15 cities & growing', color: 'text-emerald-400' },
              { icon: TrendingUp, text: 'Avg. 12 leads/mo per partner', color: 'text-accent-400' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2 bg-surface-800/50 px-4 py-2 rounded-xl border border-white/10">
                <Icon size={15} className={color} />
                <span className="text-surface-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue model callout */}
        <div className="card bg-gradient-to-r from-brand-900/30 to-accent-900/20 border-brand-500/20">
          <h2 className="text-white font-bold text-xl mb-4 text-center">Why Partner With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: DollarSign, title: 'Pay Only for Results', body: 'Referral-based model — you pay a small fee only when a job is completed, not per click.', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { icon: Bell, title: 'In-App Placement', body: 'Featured contractors are shown to customers immediately after their HVAC job is complete — exactly when they need you.', color: 'text-brand-400', bg: 'bg-brand-400/10' },
              { icon: Award, title: 'Verified Badge', body: 'Stand out with a Verified Partner badge that signals trust and quality to every potential customer.', color: 'text-amber-400', bg: 'bg-amber-400/10' },
              { icon: BarChart3, title: 'Full Analytics', body: 'Track impressions, referrals, and completed jobs from your contractor dashboard in real time.', color: 'text-accent-400', bg: 'bg-accent-400/10' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className={`w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-3`}>
                  <item.icon size={20} className={item.color} />
                </div>
                <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-surface-400 text-xs leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trades we support */}
        <div>
          <h2 className="text-white font-bold text-2xl text-center mb-6">Trades We're Expanding Into</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRADES.map(trade => (
              <div key={trade.name} className="card text-center hover:border-brand-500/30 transition-all p-4">
                <div className="text-3xl mb-2">{trade.icon}</div>
                <p className="text-white font-semibold text-sm mb-1">{trade.name}</p>
                <p className="text-surface-500 text-xs leading-tight">{trade.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing tiers */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2">Partner Plans</h2>
            <p className="text-surface-400">Choose the right level of visibility for your business</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map(tier => (
              <div key={tier.id} className={`card flex flex-col border-2 ${tier.color} relative`}>
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`badge px-3 py-1 font-bold text-xs ${tier.id === 'featured' ? 'badge-purple' : 'badge-blue'}`}>{tier.badge}</span>
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-white font-bold text-lg">{tier.name}</p>
                  <div className="flex items-end gap-1 mt-1">
                    {tier.price === 0 ? (
                      <span className="text-emerald-400 font-extrabold text-2xl">Free</span>
                    ) : (
                      <>
                        <span className="text-white font-extrabold text-2xl">${tier.price}</span>
                        <span className="text-surface-400 text-sm mb-0.5">{tier.billing}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2 flex-1 mb-5">
                  {tier.features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-surface-300">{f}</span>
                    </div>
                  ))}
                  {tier.notIncluded.map(f => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <X size={14} className="text-surface-600 flex-shrink-0 mt-0.5" />
                      <span className="text-surface-600">{f}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setSelectedTier(tier)} className={tier.btnClass}>
                  {tier.price === 0 ? 'Get Listed Free' : `Apply for ${tier.name}`} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-surface-500 text-sm mt-6">
            All plans include referral fee structure. Referral fees are only charged on completed, paid jobs.
          </p>
        </div>

        {/* Revenue model transparency */}
        <div className="card bg-surface-800/30">
          <h2 className="text-white font-bold text-xl mb-4 text-center">How ServiceConnect Earns — Full Transparency</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {[
              { icon: '🔧', title: 'HVAC Job Platform Fees', body: '10–15% fee on every HVAC job completed through the platform, deducted from tech payout.' },
              { icon: '📋', title: 'Tech Subscriptions', body: '$149/mo subscription option for techs — reduces per-job fee from 15% to 8% + unlocks instant payouts.' },
              { icon: '💰', title: 'Contractor Referral Fees', body: '5–10% referral fee on completed trade jobs referred through the platform.' },
              { icon: '📣', title: 'Advertising Slots', body: 'Financing partners, contractors, and trade businesses pay for banner placement throughout the app.' },
              { icon: '📊', title: 'Tax Preparation (Future)', body: 'Upcoming premium feature for tech 1099 management, quarterly filing prep, and mileage tracking.' },
              { icon: '🏪', title: 'Store Margin', body: 'Product margin on HVAC equipment sold through the in-app merchant store, plus installation upsells.' },
            ].map(s => (
              <div key={s.title} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                <div>
                  <p className="text-white font-semibold">{s.title}</p>
                  <p className="text-surface-400 text-xs mt-0.5 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center card bg-gradient-to-br from-brand-900/30 to-accent-900/20 border-brand-500/20 py-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to Start Getting Referrals?</h2>
          <p className="text-surface-400 mb-6">Listings are reviewed and approved within 2 business days.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setSelectedTier(TIERS[1])} className="btn-primary py-3.5 px-8 text-base">
              Apply as Verified Partner <ArrowRight size={18} />
            </button>
            <button onClick={() => setSelectedTier(TIERS[0])} className="btn-secondary py-3.5 px-8 text-base">
              Get Listed Free
            </button>
          </div>
        </div>
      </div>

      {selectedTier && <SignupModal tier={selectedTier} onClose={() => setSelectedTier(null)} />}
    </div>
  )
}
