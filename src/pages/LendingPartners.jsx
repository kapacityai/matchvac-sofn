import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import {
  ArrowRight, CheckCircle, DollarSign, TrendingUp, Users, Zap,
  Shield, Star, BarChart3, ChevronRight, X, Building2, Mail,
  Phone, Globe, FileText, CreditCard
} from 'lucide-react'

// ── Tier data ─────────────────────────────────────────────────────────────────
const TIERS = [
  {
    key: 'starter',
    name: 'Starter',
    price: 299,
    period: '/mo',
    badge: null,
    color: 'border-white/10',
    btnClass: 'btn-secondary',
    features: [
      'Branded listing on Financing page',
      'Up to 500 impressions/month',
      'Link to your application portal',
      'Basic performance report (monthly)',
      'ServiceConnect Verified badge',
    ],
    notIncluded: [
      'Hero ad placement',
      'In-app pop-up offers',
      'Co-branded landing page',
      'Priority customer matching',
    ],
  },
  {
    key: 'growth',
    name: 'Growth',
    price: 699,
    period: '/mo',
    badge: 'Most Popular',
    color: 'border-brand-500',
    btnClass: 'btn-primary',
    features: [
      'Everything in Starter',
      'Hero banner on Financing page',
      'In-app offer cards (during checkout)',
      'Up to 5,000 impressions/month',
      'Bi-weekly performance analytics',
      'Dedicated account manager',
      'Co-branded landing page',
    ],
    notIncluded: [
      'Priority customer matching',
      'Exclusive category lock',
    ],
  },
  {
    key: 'premier',
    name: 'Premier',
    price: 1499,
    period: '/mo',
    badge: 'Best Visibility',
    color: 'border-accent-500',
    btnClass: 'bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 justify-center',
    features: [
      'Everything in Growth',
      'Priority customer matching at booking',
      'Exclusive category lock (no competing ads)',
      'Unlimited impressions',
      'Real-time analytics dashboard access',
      'Custom SMS / push offer campaigns',
      'Quarterly strategy call with growth team',
      'Featured in customer onboarding emails',
    ],
    notIncluded: [],
  },
]

const STATS = [
  { icon: Users,     value: '12,000+', label: 'Active Homeowners' },
  { icon: DollarSign, value: '$2.4M',  label: 'Avg Monthly Job Value' },
  { icon: TrendingUp, value: '38%',    label: 'Customers Open to Financing' },
  { icon: Star,       value: '4.9★',   label: 'Platform Rating' },
]

const PARTNERS_DEMO = [
  { name: 'Comfort Connect Premier', category: 'Equipment-as-a-Service', tier: 'Premier' },
  { name: 'GreenLeaf Financing',     category: 'Green Energy Loans',      tier: 'Growth' },
  { name: 'SnapRent-to-Own',         category: 'Rent-to-Own HVAC',        tier: 'Growth' },
  { name: 'Acorn Finance',           category: 'Personal Loans',          tier: 'Starter' },
]

// ── Application Form ──────────────────────────────────────────────────────────
function ApplicationForm({ tier, onClose }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    company: '', website: '', contact: '', email: '', phone: '',
    category: '', description: '', tier: tier?.key || 'growth',
    billingName: '', billingCard: '', billingExp: '', billingCvc: '',
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const [submitted, setSubmitted] = useState(false)

  const selectedTier = TIERS.find(t => t.key === form.tier) || TIERS[1]

  if (submitted) return (
    <div className="text-center py-8 px-4">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={32} className="text-emerald-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Application Received!</h3>
      <p className="text-surface-400 text-sm mb-6">
        Our partnerships team will review your application and reach out within 2 business days.
        You'll receive a confirmation at <span className="text-brand-400">{form.email}</span>.
      </p>
      <button onClick={onClose} className="btn-primary">Done</button>
    </div>
  )

  return (
    <div className="w-full">
      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {['Company Info', 'Ad Tier', 'Billing'].map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div className={`h-1 rounded-full mb-1 ${i <= step ? 'bg-brand-500' : 'bg-surface-700'}`} />
            <p className={`text-xs ${i === step ? 'text-brand-400' : 'text-surface-600'}`}>{s}</p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div><label className="label">Company / Lender Name</label><input className="input" placeholder="e.g. GreenLeaf Financing" value={form.company} onChange={set('company')} /></div>
          <div><label className="label">Website</label><input className="input" placeholder="https://yourcompany.com" value={form.website} onChange={set('website')} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Contact Name</label><input className="input" placeholder="Jane Smith" value={form.contact} onChange={set('contact')} /></div>
            <div><label className="label">Phone</label><input className="input" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} /></div>
          </div>
          <div><label className="label">Business Email</label><input className="input" type="email" placeholder="partnerships@yourcompany.com" value={form.email} onChange={set('email')} /></div>
          <div>
            <label className="label">Financing Category</label>
            <select className="input" value={form.category} onChange={set('category')}>
              <option value="">Select a category…</option>
              <option>Personal / Installment Loans</option>
              <option>Equipment-as-a-Service (EaaS)</option>
              <option>Rent-to-Own</option>
              <option>Home Equity / HELOC</option>
              <option>Green / Clean Energy Loans</option>
              <option>Lease-to-Own</option>
              <option>Buy Now Pay Later (BNPL)</option>
              <option>Other</option>
            </select>
          </div>
          <div><label className="label">Brief Description of Your Offering</label><textarea className="input resize-none h-20 text-sm" placeholder="Describe your loan/financing product, typical APR range, and target customer…" value={form.description} onChange={set('description')} /></div>
          <button onClick={() => setStep(1)} className="btn-primary w-full py-3">Next: Choose Ad Tier <ArrowRight size={16} /></button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-surface-400 text-sm mb-2">Select the advertising tier that fits your goals:</p>
          {TIERS.map(t => (
            <button key={t.key} onClick={() => setForm(f => ({ ...f, tier: t.key }))}
              className={`w-full text-left card transition-all ${form.tier === t.key ? 'border-brand-500 bg-brand-500/10' : 'hover:border-white/20'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold">{t.name}</p>
                  {t.badge && <span className="badge badge-blue">{t.badge}</span>}
                </div>
                <p className="text-white font-bold">${t.price.toLocaleString()}<span className="text-surface-400 font-normal text-xs">/mo</span></p>
              </div>
              <ul className="space-y-0.5">
                {t.features.slice(0, 3).map(f => (
                  <li key={f} className="text-surface-400 text-xs flex items-center gap-1.5">
                    <CheckCircle size={11} className="text-emerald-400 flex-shrink-0" />{f}
                  </li>
                ))}
                {t.features.length > 3 && <li className="text-surface-500 text-xs">+{t.features.length - 3} more…</li>}
              </ul>
            </button>
          ))}
          <div className="flex gap-3 pt-1">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1">Back</button>
            <button onClick={() => setStep(2)} className="btn-primary flex-1">Next: Billing</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="card bg-surface-800/50 flex items-center justify-between">
            <div>
              <p className="text-surface-400 text-xs">Selected Plan</p>
              <p className="text-white font-bold">{selectedTier.name} — ${selectedTier.price.toLocaleString()}/mo</p>
            </div>
            <button onClick={() => setStep(1)} className="text-brand-400 text-xs hover:underline">Change</button>
          </div>
          <p className="text-surface-400 text-sm">Enter billing details. You'll be charged monthly. Cancel anytime.</p>
          <div><label className="label">Name on Card</label><input className="input" placeholder="Jane Smith" value={form.billingName} onChange={set('billingName')} /></div>
          <div><label className="label">Card Number</label><input className="input font-mono" placeholder="4242 4242 4242 4242" value={form.billingCard} onChange={set('billingCard')} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Expiry</label><input className="input" placeholder="MM / YY" value={form.billingExp} onChange={set('billingExp')} /></div>
            <div><label className="label">CVC</label><input className="input" placeholder="123" value={form.billingCvc} onChange={set('billingCvc')} /></div>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <Shield size={13} className="text-emerald-400" />
            Secured by Stripe — your card is never stored on our servers
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            <button onClick={() => setSubmitted(true)} className="btn-primary flex-1">Submit Application</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LendingPartners() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [selectedTier, setSelectedTier] = useState(null)

  const openForm = (tier = null) => { setSelectedTier(tier); setShowForm(true) }

  return (
    <div className="bg-surface-950 min-h-screen text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')}><Logo size="sm" /></button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="btn-ghost text-sm hidden sm:flex">← Back to Site</button>
            <button onClick={() => openForm()} className="btn-primary text-sm py-2">Apply Now</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6 border-b border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="badge badge-blue mb-5">💳 Lending & Financing Partners</div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Reach Homeowners <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
              Ready to Finance
            </span>
          </h1>
          <p className="text-surface-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Partner with ServiceConnect to place your financing offers directly in front of homeowners who are actively booking HVAC services — the moment they need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <button onClick={() => openForm()} className="btn-primary py-4 px-8 text-lg">
              Apply as a Partner <ArrowRight size={20} />
            </button>
            <a href="#tiers" className="btn-secondary py-4 px-8 text-lg">See Ad Tiers</a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="card text-center py-5">
                <Icon size={20} className="text-brand-400 mx-auto mb-2" />
                <p className="text-white font-extrabold text-xl">{value}</p>
                <p className="text-surface-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why partner */}
      <section className="py-20 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Why Partner With Us?</h2>
            <p className="text-surface-400 max-w-xl mx-auto">Your offers reach homeowners at exactly the right moment — during an HVAC service booking, when financing is most relevant.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
                title: 'Intent-Driven Placement',
                body: 'Ads are shown to homeowners who are actively booking a service — not passive browsers. Conversion rates are 4–6× higher than typical display ads.',
              },
              {
                icon: BarChart3,
                color: 'text-brand-400',
                bg: 'bg-brand-500/10',
                title: 'Full Transparency',
                body: 'Real-time impression counts, click-through rates, application starts, and conversion data — all in your partner dashboard.',
              },
              {
                icon: Shield,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                title: 'Brand-Safe Context',
                body: 'ServiceConnect is a vetted, licensed HVAC marketplace. Your brand appears alongside trusted technicians — not random web content.',
              },
            ].map(item => (
              <div key={item.title} className="card">
                <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                  <item.icon size={22} className={item.color} />
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement examples */}
      <section className="py-20 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Where Your Ads Appear</h2>
            <p className="text-surface-400 max-w-xl mx-auto">Multiple high-visibility placements across the customer journey.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Financing Page Hero', detail: 'Top-of-page hero banner on the dedicated Financing section', badge: 'Growth+' },
              { label: 'Booking Checkout', detail: 'Offer card shown before customers enter payment info', badge: 'Growth+' },
              { label: 'Customer Dashboard', detail: 'Sidebar ad displayed on the customer home screen', badge: 'Starter+' },
              { label: 'Onboarding Emails', detail: 'Featured in the welcome email series sent to new customers', badge: 'Premier' },
            ].map(p => (
              <div key={p.label} className="card flex flex-col gap-2">
                <div className="h-24 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center">
                  <FileText size={28} className="text-surface-600" />
                </div>
                <p className="text-white text-sm font-semibold">{p.label}</p>
                <p className="text-surface-400 text-xs leading-relaxed flex-1">{p.detail}</p>
                <span className="badge badge-blue self-start">{p.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="py-20 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Advertising Tiers</h2>
            <p className="text-surface-400 max-w-xl mx-auto">Simple monthly pricing. No long-term contract required. Cancel anytime.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TIERS.map(tier => (
              <div key={tier.key} className={`card border-2 ${tier.color} flex flex-col relative`}>
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`badge ${tier.key === 'premier' ? 'badge-purple' : 'badge-blue'} px-3 py-1`}>{tier.badge}</span>
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-surface-400 text-sm font-medium mb-1">{tier.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-white text-4xl font-extrabold">${tier.price.toLocaleString()}</span>
                    <span className="text-surface-400 text-sm mb-1">/mo</span>
                  </div>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-surface-300">
                      <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {tier.notIncluded.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-surface-600">
                      <X size={14} className="flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => openForm(tier)} className={tier.btnClass}>
                  Get Started <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-surface-500 text-xs text-center mt-6">All plans include onboarding support. Enterprise pricing available for national lenders — contact partnerships@serviceconnect.io</p>
        </div>
      </section>

      {/* Current partners */}
      <section className="py-20 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-3">Current Financing Partners</h2>
            <p className="text-surface-400 max-w-xl mx-auto">Join the lenders already reaching our homeowner base.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PARTNERS_DEMO.map(p => (
              <div key={p.name} className="card flex flex-col gap-2 text-center">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto">
                  <Building2 size={22} className="text-brand-400" />
                </div>
                <p className="text-white font-semibold text-sm">{p.name}</p>
                <p className="text-surface-400 text-xs">{p.category}</p>
                <span className={`badge self-center ${p.tier === 'Premier' ? 'badge-purple' : p.tier === 'Growth' ? 'badge-blue' : 'bg-surface-700 text-surface-400'}`}>{p.tier}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to reach motivated homeowners?</h2>
          <p className="text-surface-400 text-lg mb-8">Apply in minutes. Our partnerships team reviews all applications within 2 business days.</p>
          <button onClick={() => openForm()} className="btn-primary py-4 px-10 text-lg mx-auto">
            Apply as a Lending Partner <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-surface-500 text-xs">
          <Logo size="sm" />
          <p>© 2026 ServiceConnect. All rights reserved.</p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => navigate('/financing')} className="hover:text-white transition-colors">Financing</button>
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Sign In</button>
          </div>
        </div>
      </footer>

      {/* Application Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative animate-slide-up">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-surface-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-1">Partner Application</h2>
            <p className="text-surface-400 text-sm mb-6">
              {selectedTier ? `Applying for ${selectedTier.name} tier — $${selectedTier.price.toLocaleString()}/mo` : 'Choose your plan after completing your company info.'}
            </p>
            <ApplicationForm tier={selectedTier} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
