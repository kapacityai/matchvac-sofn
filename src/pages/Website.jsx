import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import LocationTicker from '../components/LocationTicker'
import { SERVICES, PRODUCTS } from '../data/mockData'
import {
  Zap, Shield, MapPin, Star, ChevronRight, Menu, X,
  CheckCircle, Clock, Wrench, Camera, Phone, ArrowRight,
  ShoppingBag, DollarSign, FileText, Users
} from 'lucide-react'

// ── Ad Banner Component ──────────────────────────────────────────────────────
function AdBanner({ slot }) {
  const ads = {
    hero: {
      partner: 'Comfort Connect Premier',
      headline: '0% APR Financing on New HVAC Systems',
      sub: 'Get approved in 60 seconds. Up to $15,000 in financing.',
      cta: 'Check My Rate',
      badge: 'Featured Partner',
      gradient: 'from-brand-900/60 to-accent-900/40',
      border: 'border-brand-500/30',
    },
    sidebar: {
      partner: 'GreenLeaf Financing',
      headline: 'HVAC Loans from 5.9% APR',
      sub: 'For qualified customers. Terms apply.',
      cta: 'Apply Now',
      badge: 'Sponsored',
      gradient: 'from-emerald-900/40 to-surface-900',
      border: 'border-emerald-500/20',
    },
    strip: {
      partner: 'ProElectric Services',
      headline: 'Need an Electrician Too?',
      sub: 'Partner trade — same trusted marketplace.',
      cta: 'Learn More',
      badge: 'Partner Ad',
      gradient: 'from-amber-900/30 to-surface-900',
      border: 'border-amber-500/20',
    },
  }
  const ad = ads[slot] || ads.hero
  return (
    <div className={`rounded-2xl border bg-gradient-to-r ${ad.gradient} ${ad.border} p-4 flex items-center gap-4`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-purple text-xs">{ad.badge}</span>
          <span className="text-surface-500 text-xs">{ad.partner}</span>
        </div>
        <p className="text-white font-bold text-sm">{ad.headline}</p>
        <p className="text-surface-400 text-xs mt-0.5">{ad.sub}</p>
      </div>
      <button className="btn-primary text-xs py-2 px-3 flex-shrink-0 whitespace-nowrap">
        {ad.cta}
      </button>
    </div>
  )
}

// ── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ onLogin }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-surface-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#store" className="hover:text-white transition-colors">Store</a>
          <button onClick={() => navigate('/financing')} className="hover:text-white transition-colors">Financing</button>
          <button onClick={() => navigate('/contractors')} className="hover:text-white transition-colors">For Contractors</button>
          <a href="#techs" className="hover:text-white transition-colors">For Technicians</a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={onLogin} className="btn-ghost text-sm">Sign In</button>
          <button onClick={() => navigate('/login?signup=customer')} className="btn-primary text-sm py-2">Get Started</button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-surface-900 border-t border-white/10 px-6 py-4 space-y-3 text-sm">
          {['How It Works','Services','Store','For Technicians'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="block text-surface-300 hover:text-white py-1" onClick={() => setOpen(false)}>{l}</a>
          ))}
          <button onClick={() => { navigate('/financing'); setOpen(false) }} className="block text-surface-300 hover:text-white py-1 w-full text-left">Financing</button>
          <button onClick={() => { navigate('/contractors'); setOpen(false) }} className="block text-surface-300 hover:text-white py-1 w-full text-left">For Contractors</button>
          <div className="flex gap-2 pt-2">
            <button onClick={onLogin} className="btn-secondary flex-1 text-sm py-2">Sign In</button>
            <button onClick={() => navigate('/login?signup=customer')} className="btn-primary flex-1 text-sm py-2">Sign Up</button>
          </div>
        </div>
      )}
    </nav>
  )
}

// ── Main Website ─────────────────────────────────────────────────────────────
export default function Website() {
  const navigate = useNavigate()
  const goLogin = () => navigate('/login')

  return (
    <div className="bg-surface-950 min-h-screen text-white">
      <Nav onLogin={goLogin} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <LocationTicker />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            HVAC Service,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400">
              On Demand
            </span>
          </h1>
          <p className="text-surface-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Book a certified HVAC technician in minutes. Real-time tracking, escrow payments, and guaranteed quality — all in one app.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <button onClick={() => navigate('/login?signup=customer')} className="btn-primary py-4 px-8 text-lg">
              Book a Technician <ArrowRight size={20} />
            </button>
            <button onClick={goLogin} className="btn-secondary py-4 px-8 text-lg">
              Sign In
            </button>
          </div>
          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-surface-400">
            {[
              { value: '500+', label: 'Jobs Completed' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '< 15 min', label: 'Avg. Acceptance' },
              { value: '100%', label: 'Escrow Protected' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-white font-bold text-lg">{s.value}</p>
                <p className="text-surface-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMFORT CONNECT HERO AD ── */}
      <section className="max-w-5xl mx-auto px-6 mb-12">
        <div
          onClick={() => navigate('/comfort-connect')}
          className="cursor-pointer rounded-2xl border-2 border-[#003478] bg-gradient-to-r from-[#003478]/50 to-[#001a3d]/70 overflow-hidden hover:border-[#4da6ff] transition-all group"
        >
          <div className="bg-[#003478] px-5 py-2 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 40 40" fill="none"><path d="M20 4L4 16v20h10V24h12v12h10V16L20 4z" fill="white" opacity="0.9"/></svg>
              <span className="text-white font-bold text-sm tracking-wide">Comfort Connect</span>
              <span className="badge bg-[#4da6ff]/30 text-[#4da6ff] border-0 text-xs">Premier Program®</span>
            </div>
            <span className="text-[#4da6ff] text-xs font-semibold">#1 Recommended Financing Partner</span>
          </div>
          <div className="p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="text-5xl flex-shrink-0">❄️</div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-white font-bold text-xl mb-1">Don't Buy Your HVAC — Get It All Included</h3>
              <p className="text-surface-300 text-sm">Equipment + installation + repairs + maintenance + consumable parts — all for one low monthly payment. No up-front cost, no hidden fees.</p>
            </div>
            <button className="bg-[#003478] group-hover:bg-[#00449e] border border-[#4da6ff]/50 text-white font-bold py-3 px-6 rounded-xl transition-all flex-shrink-0 flex items-center gap-2 whitespace-nowrap">
              See If I Qualify <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-6 bg-surface-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-3">How It Works</h2>
            <p className="text-surface-400 text-lg">From request to complete in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: Wrench, title: 'Pick Your Service', body: 'Browse services, choose a tier (Basic / Standard / Premium), and describe your issue.', color: 'text-brand-400', bg: 'bg-brand-400/10' },
              { step: '02', icon: Zap, title: 'Instant Broadcast', body: 'Your job is broadcast to all certified techs in your area simultaneously — first to accept gets the job.', color: 'text-amber-400', bg: 'bg-amber-400/10' },
              { step: '03', icon: MapPin, title: 'Live GPS Tracking', body: "See your tech's real-time location, name, photo, and ETA on a live map.", color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { step: '04', icon: Shield, title: 'Pay When Done', body: 'Funds are held in secure escrow and only released when you confirm the job is complete.', color: 'text-accent-400', bg: 'bg-accent-400/10' },
            ].map(s => (
              <div key={s.step} className="card relative">
                <div className="absolute top-4 right-4 text-4xl font-black text-white/5">{s.step}</div>
                <div className={`w-11 h-11 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                  <s.icon size={22} className={s.color} />
                </div>
                <h3 className="text-white font-bold mb-2">{s.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMERGENCY BANNER ── */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-rose-900/40 to-surface-900 border border-rose-500/30 p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="text-5xl">🚨</div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-white font-bold text-xl mb-1">No Heat? No A/C? We're 24/7</h3>
              <p className="text-surface-400">Emergency services with priority dispatch. A tech is notified instantly.</p>
            </div>
            <button onClick={() => navigate('/login')} className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex-shrink-0">
              Request Emergency
            </button>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-20 px-6 bg-surface-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-3">Services Offered</h2>
            <p className="text-surface-400 text-lg">All major HVAC work covered — preset prices, no surprises</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {SERVICES.filter(s => !s.emergency).map(service => (
              <button key={service.id} onClick={() => navigate('/login')}
                className="card-hover text-left p-4">
                <div className="text-3xl mb-2">{service.icon}</div>
                <p className="text-white text-sm font-semibold leading-tight">{service.name}</p>
                <p className="text-brand-400 text-xs font-medium mt-1">from ${service.tiers.basic}</p>
              </button>
            ))}
          </div>
          {/* Strip ad */}
          <AdBanner slot="strip" />
        </div>
      </section>

      {/* ── STORE PREVIEW ── */}
      <section id="store" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-2">HVAC Store</h2>
              <p className="text-surface-400 text-lg">Filters, thermostats, furnaces & water heaters — delivered to your door</p>
            </div>
            <button onClick={() => navigate('/login')} className="btn-secondary text-sm flex-shrink-0">
              Browse All Products <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {PRODUCTS.slice(0, 3).map(product => (
              <div key={product.id} className="card-hover flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{product.image}</div>
                <div className="flex-1 min-w-0">
                  {product.badge && <span className="badge badge-blue mb-1">{product.badge}</span>}
                  <p className="text-white font-semibold text-sm leading-tight">{product.name}</p>
                  <div className="flex items-center gap-1 my-1">
                    {Array.from({length: 5}).map((_, i) => (
                      <Star key={i} size={11} className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-700'} />
                    ))}
                    <span className="text-surface-500 text-xs">({product.reviews.toLocaleString()})</span>
                  </div>
                  <p className="text-brand-400 font-bold">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Sidebar ad */}
          <AdBanner slot="sidebar" />
        </div>
      </section>

      {/* ── FOR TECHS ── */}
      <section id="techs" className="py-20 px-6 bg-surface-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="badge badge-green mb-4">For HVAC Technicians</div>
              <h2 className="text-4xl font-extrabold text-white mb-4">
                Earn More.<br />Work Your Way.
              </h2>
              <p className="text-surface-400 text-lg mb-6 leading-relaxed">
                Join our network of certified techs. Set your coverage area, claim jobs first-come first-served, and get paid fast.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: DollarSign, text: 'See your net payout before accepting every job', color: 'text-emerald-400' },
                  { icon: Clock,      text: 'Instant payouts with monthly subscription plan', color: 'text-brand-400' },
                  { icon: FileText,   text: '1099-NEC & quarterly tax estimates built-in', color: 'text-amber-400' },
                  { icon: Users,      text: '247 verified techs already on the platform', color: 'text-accent-400' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className={color} />
                    </div>
                    <span className="text-surface-300 text-sm">{text}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/login?signup=tech')} className="btn-primary py-3 px-6 text-base">
                Apply as a Tech <ArrowRight size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {/* Tier cards — corrected pricing */}
              {[
                { label: 'Standard',      detail: 'Free · 15% platform fee per job · Standard dispatch', badge: '' },
                { label: 'Pro',           detail: '$49/mo · 11% fee · Priority dispatch queue', badge: 'Most Popular' },
                { label: 'Elite',         detail: '$99/mo · 8% fee · First in queue + instant payouts', badge: 'Best Value' },
              ].map(p => (
                <div key={p.label} className={`card ${p.badge === 'Best Value' ? 'border-accent-500/40 bg-gradient-to-br from-accent-900/20 to-surface-900' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-bold">{p.label}</p>
                    {p.badge && <span className={`badge ${p.badge === 'Best Value' ? 'badge-purple' : 'badge-blue'}`}>{p.badge}</span>}
                  </div>
                  <p className="text-surface-400 text-sm">{p.detail}</p>
                </div>
              ))}

              {/* Example earnings — itemized at 8% Elite rate */}
              <div className="card bg-gradient-to-br from-brand-900/40 to-surface-900 border-brand-500/20">
                <p className="text-surface-400 text-xs font-semibold uppercase tracking-widest mb-3">Example Earnings This Week</p>
                <p className="text-surface-600 text-xs mb-3">Elite plan · 8% fee applied</p>
                <div className="space-y-3 text-sm">
                  {[
                    { service: 'Furnace Repair',   gross: 249, fee: 8 },
                    { service: 'No A/C Emergency', gross: 499, fee: 8 },
                    { service: 'Duct Cleaning',    gross: 549, fee: 8 },
                  ].map(e => {
                    const feeAmt = +(e.gross * e.fee / 100).toFixed(2)
                    const net    = +(e.gross - feeAmt).toFixed(2)
                    return (
                      <div key={e.service} className="space-y-0.5">
                        <div className="flex justify-between">
                          <span className="text-white font-medium">{e.service}</span>
                          <span className="text-white">${e.gross.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 text-xs pl-2">Platform fee ({e.fee}%)</span>
                          <span className="text-rose-400 text-xs">−${feeAmt.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 text-xs pl-2">Your net</span>
                          <span className="text-emerald-400 font-bold text-xs">${net.toFixed(2)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-white/10 mt-3 pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Total gross</span>
                    <span className="text-white font-medium">$1,297.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Total fees (8%)</span>
                    <span className="text-rose-400 font-medium">−$103.76</span>
                  </div>
                  <div className="flex justify-between font-bold mt-1 pt-1 border-t border-white/10">
                    <span className="text-white">3-Day Take-Home</span>
                    <span className="text-emerald-400 text-lg">$1,193.24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-3">What Customers Say</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { name: 'Sarah K.', text: 'Tech arrived in 18 minutes and fixed our furnace same day. Best app ever for home services!', rating: 5, service: 'Furnace Repair' },
            { name: 'Diana P.', text: 'No heat emergency at 11pm — a tech accepted in 6 minutes. Absolutely saved us.', rating: 5, service: 'No Heat Emergency' },
            { name: 'Robert M.', text: 'Transparent pricing, live tracking, and I only paid after the job was done. Will use again.', rating: 5, service: 'A/C Tune-Up' },
          ].map(r => (
            <div key={r.name} className="card">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({length: r.rating}).map((_, i) => (
                  <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-surface-300 text-sm leading-relaxed mb-4">"{r.text}"</p>
              <div>
                <p className="text-white font-semibold text-sm">{r.name}</p>
                <p className="text-surface-500 text-xs">{r.service}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card bg-gradient-to-br from-brand-900/40 to-accent-900/30 border-brand-500/20 py-14 px-8">
            <h2 className="text-4xl font-extrabold text-white mb-4">Ready to get started?</h2>
            <p className="text-surface-400 text-lg mb-8">Join thousands of homeowners who trust ServiceConnect for fast, verified HVAC service.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/login?signup=customer')} className="btn-primary py-4 px-8 text-base">
                Book a Service <ArrowRight size={18} />
              </button>
              <button onClick={goLogin} className="btn-secondary py-4 px-8 text-base">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-surface-500 text-sm text-center">© 2026 ServiceConnect. All rights reserved. · Maryland · DMV &amp; Expanding Nationwide</p>
          <div className="flex gap-4 text-surface-500 text-sm flex-wrap justify-center">
            <button onClick={() => navigate('/financing')} className="hover:text-white transition-colors">Financing</button>
            <button onClick={() => navigate('/contractors')} className="hover:text-white transition-colors">For Contractors</button>
<span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
