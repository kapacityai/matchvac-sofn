import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import LocationTicker from '../components/LocationTicker'
import { SERVICES, PRODUCTS } from '../data/mockData'
import {
  Zap, Shield, MapPin, Star, ChevronRight, Menu, X,
  CheckCircle, Clock, Wrench, Camera, ArrowRight, Megaphone,
  DollarSign, FileText, Users, Thermometer, Wind,
  Droplets, Flame, Activity, Phone, Play, Lock
} from 'lucide-react'

// ── Intersection observer hook for scroll animations ─────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ onLogin }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-surface-200 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {[
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Services', href: '#services' },
            { label: 'Store', href: '#store' },
            { label: 'For Techs', href: '#techs' },
          ].map(l => (
            <a key={l.label} href={l.href} className="px-3 py-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-150 transition-all">{l.label}</a>
          ))}
          <button onClick={() => navigate('/financing')} className="px-3 py-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-150 transition-all">Financing</button>
          <button onClick={() => navigate('/contractors')} className="px-3 py-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-150 transition-all">Contractors</button>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={onLogin} className="px-4 py-2 text-surface-600 hover:text-surface-900 text-sm font-medium transition-colors">Sign In</button>
          <button onClick={() => navigate('/login?signup=customer')} className="btn-primary text-sm py-2 px-5 glow-brand">
            Get Started <ArrowRight size={15} />
          </button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} className="text-surface-900" /> : <Menu size={22} className="text-surface-900" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-surface-200 px-6 py-4 space-y-1">
          {['How It Works','Services','Store','For Techs'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="block px-3 py-2.5 text-surface-700 hover:text-surface-900 rounded-lg hover:bg-surface-150 transition-all" onClick={() => setOpen(false)}>{l}</a>
          ))}
          <button onClick={() => { navigate('/financing'); setOpen(false) }} className="block w-full text-left px-3 py-2.5 text-surface-700 hover:text-surface-900 rounded-lg hover:bg-surface-150 transition-all">Financing</button>
          <button onClick={() => { navigate('/contractors'); setOpen(false) }} className="block w-full text-left px-3 py-2.5 text-surface-700 hover:text-surface-900 rounded-lg hover:bg-surface-150 transition-all">For Contractors</button>
          <div className="flex gap-2 pt-3 border-t border-surface-200 mt-2">
            <button onClick={onLogin} className="btn-secondary flex-1 text-sm py-2.5">Sign In</button>
            <button onClick={() => navigate('/login?signup=customer')} className="btn-primary flex-1 text-sm py-2.5">Get Started</button>
          </div>
        </div>
      )}
    </nav>
  )
}

// ── Floating mock job card ────────────────────────────────────────────────────
function MockJobCard() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 4), 2200)
    return () => clearInterval(t)
  }, [])
  const steps = [
    { icon: '🔧', label: 'Job Requested', sub: 'Thermostat Installation', color: 'text-brand-600', badge: 'Broadcast to 14 techs', badgeClass: 'bg-brand-100 text-brand-700' },
    { icon: '⚡', label: 'Tech Accepted', sub: 'Marcus Rivera • 4.9★', color: 'text-amber-600', badge: 'ETA 11 min', badgeClass: 'bg-amber-100 text-amber-700' },
    { icon: '📍', label: 'En Route', sub: '2.4 mi away • Live GPS', color: 'text-emerald-600', badge: 'Tracking live', badgeClass: 'bg-emerald-100 text-emerald-700' },
    { icon: '✅', label: 'Job Complete', sub: '$149 released from escrow', color: 'text-emerald-600', badge: 'Paid instantly', badgeClass: 'bg-emerald-100 text-emerald-700' },
  ]
  const s = steps[step]
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Glow base */}
      <div className="absolute inset-0 bg-brand-500/15 blur-3xl rounded-3xl" />

      {/* Main card */}
      <div className="relative bg-white border border-surface-200 rounded-2xl p-5 shadow-xl animate-float">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-surface-500 font-medium">Live Job Feed</span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.badgeClass}`}>{s.badge}</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-100 border border-surface-200 flex items-center justify-center text-2xl flex-shrink-0">
            {s.icon}
          </div>
          <div>
            <p className={`font-bold text-sm ${s.color}`}>{s.label}</p>
            <p className="text-surface-500 text-xs mt-0.5">{s.sub}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-surface-150 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-navy-700 rounded-full transition-all duration-700"
            style={{ width: `${(step + 1) * 25}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {['Request','Match','Track','Complete'].map((l, i) => (
            <span key={l} className={`text-xs font-medium ${i <= step ? 'text-brand-500' : 'text-surface-300'}`}>{l}</span>
          ))}
        </div>
      </div>

      {/* Secondary floating card — escrow */}
      <div className="absolute -bottom-5 -right-4 bg-white border border-emerald-300 rounded-xl px-3 py-2 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
        <div className="flex items-center gap-2">
          <Lock size={13} className="text-emerald-500" />
          <div>
            <p className="text-surface-900 text-xs font-bold">$149 Escrowed</p>
            <p className="text-emerald-600 text-xs">Released on confirm</p>
          </div>
        </div>
      </div>

      {/* Secondary floating card — rating */}
      <div className="absolute -top-4 -left-4 bg-white border border-amber-300 rounded-xl px-3 py-2 shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
          </div>
          <span className="text-surface-900 text-xs font-bold">4.9</span>
        </div>
        <p className="text-surface-500 text-xs">247 reviews</p>
      </div>
    </div>
  )
}

// ── Main Website ──────────────────────────────────────────────────────────────
export default function Website() {
  const navigate = useNavigate()
  const goLogin = () => navigate('/login')

  const [heroRef, heroIn] = useInView(0.1)
  const [howRef, howIn] = useInView(0.1)
  const [statsRef, statsIn] = useInView(0.2)
  const [servicesRef, servicesIn] = useInView(0.1)
  const [techRef, techIn] = useInView(0.1)
  const [reviewsRef, reviewsIn] = useInView(0.1)

  return (
    <div className="bg-white min-h-screen text-surface-900 overflow-x-hidden">
      <Nav onLogin={goLogin} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 px-6 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] bg-brand-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-500/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
          {/* Left — copy */}
          <div className={`transition-all duration-700 ${heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex mb-6">
              <LocationTicker />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-3 text-surface-900">
              Certified Pros.<br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-400 to-navy-700 animate-gradient">
                  On Demand.
                </span>
              </span>
            </h1>
            <p className="text-brand-500 font-bold tracking-[0.14em] uppercase text-sm mb-5">matchvac.com</p>
            <p className="text-surface-500 text-xl leading-relaxed mb-8 max-w-lg">
              Book a certified technician in minutes. Real-time GPS tracking, AI-powered diagnostics, and escrow-protected payments — all in one platform.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button onClick={() => navigate('/login?signup=customer')} className="btn-primary py-4 px-8 text-base glow-brand">
                Book a Technician <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/login?signup=tech')} className="btn-navy py-4 px-8 text-base">
                Apply as a Tech <ArrowRight size={18} />
              </button>
              <button onClick={goLogin} className="btn-secondary py-4 px-8 text-base">
                Sign In
              </button>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Shield, text: 'Escrow Protected', color: 'text-emerald-500' },
                { icon: CheckCircle, text: 'Background Checked', color: 'text-brand-500' },
                { icon: Zap, text: '< 15 Min Response', color: 'text-amber-500' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-surface-500">
                  <Icon size={15} className={color} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — animated mock */}
          <div className={`transition-all duration-700 delay-200 ${heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <MockJobCard />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-12 px-6 border-y border-surface-200 bg-surface-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Jobs Completed', icon: Wrench, color: 'text-brand-500' },
              { value: '4.9★', label: 'Average Rating', icon: Star, color: 'text-amber-500' },
              { value: '< 15m', label: 'Avg. Response', icon: Zap, color: 'text-emerald-500' },
              { value: '100%', label: 'Escrow Safe', icon: Shield, color: 'text-brand-500' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`text-center transition-all duration-500 ${statsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <s.icon size={20} className={`${s.color} mx-auto mb-2`} />
                <p className="text-3xl font-black text-surface-900 tracking-tight">{s.value}</p>
                <p className="text-surface-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AD PLACEMENT ─────────────────────────────────────────────────── */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-surface-300 bg-surface-50 hover:border-brand-300 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-5 p-8">
              <div className="w-14 h-14 rounded-xl bg-surface-200 flex items-center justify-center text-2xl flex-shrink-0">
                <Megaphone size={24} className="text-surface-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-surface-400 text-xs font-bold uppercase tracking-widest">Sponsored Placement</span>
                <p className="text-surface-500 font-semibold mt-1">Your ad could be here — reach thousands of local homeowners</p>
              </div>
              <button onClick={() => navigate('/contractors')} className="btn-secondary py-2.5 px-5 flex-shrink-0 whitespace-nowrap text-sm">
                Advertise Here <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how-it-works" ref={howRef} className="py-24 px-6 relative overflow-hidden bg-surface-100">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="relative max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-600 ${howIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="inline-block bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">How It Works</span>
            <h2 className="text-4xl sm:text-5xl font-black text-surface-900 mt-3 mb-4">Request to Complete<br />in 4 Steps</h2>
            <p className="text-surface-500 text-lg">Built for speed. Designed for trust.</p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-300 via-accent-300 to-brand-300" />

            {[
              { num: '01', icon: Wrench, title: 'Pick Your Service', body: 'Browse services, choose a tier, describe your issue and upload a photo.', color: 'from-brand-500 to-brand-400', glow: 'shadow-brand-500/20' },
              { num: '02', icon: Zap, title: 'Instant Broadcast', body: 'Your job hits all certified techs nearby simultaneously. Fastest finger gets the job.', color: 'from-amber-500 to-amber-400', glow: 'shadow-amber-500/20' },
              { num: '03', icon: MapPin, title: 'Live GPS Tracking', body: "See your tech's exact location, ETA, vehicle, and photo in real time.", color: 'from-emerald-500 to-emerald-400', glow: 'shadow-emerald-500/20' },
              { num: '04', icon: Lock, title: 'Pay When Done', body: 'Funds sit in secure escrow. You release payment only after confirming the job.', color: 'from-brand-500 to-brand-600', glow: 'shadow-brand-500/20' },
            ].map((s, i) => (
              <div
                key={s.num}
                className={`flex flex-col items-center text-center px-6 transition-all duration-600 ${howIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 shadow-lg ${s.glow} flex-shrink-0`}>
                  <s.icon size={28} className="text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-surface-200 flex items-center justify-center shadow-sm">
                    <span className="text-surface-900 text-xs font-black">{i + 1}</span>
                  </div>
                </div>
                <h3 className="text-surface-900 font-bold text-base mb-2">{s.title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMERGENCY BANNER ───────────────────────────────────────────────── */}
      <section className="py-6 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-white">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-l-2xl" />
            <div className="relative flex flex-col sm:flex-row items-center gap-5 p-6">
              <div className="text-4xl animate-pulse-slow">🚨</div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-rose-600 text-xs font-bold uppercase tracking-widest mb-1">24 / 7 Emergency Dispatch</p>
                <h3 className="text-surface-900 font-bold text-xl">No Heat? No A/C? We're Always On.</h3>
                <p className="text-surface-500 text-sm mt-1">Priority dispatch — a tech is notified the moment you submit. Day or night.</p>
              </div>
              <button onClick={() => navigate('/login')} className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center gap-2 flex-shrink-0 shadow-lg shadow-rose-500/20">
                Request Emergency <Zap size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────────────── */}
      <section id="services" ref={servicesRef} className="py-24 px-6 relative">
        <div className="relative max-w-5xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-600 ${servicesIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">All Services</span>
            <h2 className="text-4xl sm:text-5xl font-black text-surface-900 mt-3 mb-4">Every HVAC Job Covered</h2>
            <p className="text-surface-500 text-lg">Transparent preset pricing — no surprise quotes</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {SERVICES.filter(s => !s.emergency).map((service, i) => (
              <button
                key={service.id}
                onClick={() => navigate('/login')}
                className={`group relative overflow-hidden bg-white border border-surface-200 rounded-2xl p-4 text-left hover:border-brand-400 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${servicesIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-brand-500/0 group-hover:from-brand-50 group-hover:to-transparent transition-all duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <p className="text-surface-900 text-sm font-semibold leading-tight">{service.name}</p>
                  <p className="text-brand-500 text-xs font-bold mt-1.5">from ${service.tiers.basic}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Partner ad strip */}
          <div
            onClick={() => navigate('/contractors')}
            className="cursor-pointer group rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-4 hover:border-amber-400 hover:bg-amber-100/60 transition-all"
          >
            <span className="text-2xl">⚡</span>
            <div className="flex-1 min-w-0">
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full mb-1">Partner Ad</span>
              <p className="text-surface-900 font-bold text-sm">ProElectric Services — Need an Electrician Too?</p>
              <p className="text-surface-500 text-xs">Partner trade on the same trusted marketplace.</p>
            </div>
            <ChevronRight size={18} className="text-surface-400 group-hover:text-surface-700 transition-colors flex-shrink-0" />
          </div>
        </div>
      </section>

      {/* ── STORE PREVIEW ──────────────────────────────────────────────────── */}
      <section id="store" className="py-24 px-6 bg-surface-100 border-y border-surface-200 relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-block bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">HVAC Store</span>
              <h2 className="text-4xl sm:text-5xl font-black text-surface-900 mt-3 mb-2">Equipment & Parts</h2>
              <p className="text-surface-500 text-lg">Filters, thermostats, furnaces — delivered to your door</p>
            </div>
            <button onClick={() => navigate('/login')} className="btn-secondary text-sm flex-shrink-0">
              Browse All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {PRODUCTS.slice(0, 3).map((product, i) => (
              <div
                key={product.id}
                className="group relative bg-white border border-surface-200 rounded-2xl p-5 hover:border-brand-400 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer overflow-hidden"
                onClick={() => navigate('/login')}
              >
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center text-3xl flex-shrink-0">
                    {product.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    {product.badge && <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">{product.badge}</span>}
                    <p className="text-surface-900 font-semibold text-sm leading-tight">{product.name}</p>
                    <div className="flex items-center gap-1 my-1.5">
                      {Array.from({length: 5}).map((_, j) => (
                        <Star key={j} size={11} className={j < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-300'} />
                      ))}
                      <span className="text-surface-400 text-xs">({product.reviews.toLocaleString()})</span>
                    </div>
                    <p className="text-brand-500 font-bold text-base">${product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* GreenLeaf financing ad */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <DollarSign size={18} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">Sponsored · GreenLeaf Financing</span>
              <p className="text-surface-900 font-bold text-sm">HVAC Loans from 5.9% APR</p>
              <p className="text-surface-500 text-xs">For qualified customers. Terms apply.</p>
            </div>
            <button className="btn-secondary text-xs py-2 px-4 flex-shrink-0">Apply Now</button>
          </div>
        </div>
      </section>

      {/* ── FOR TECHS ──────────────────────────────────────────────────────── */}
      <section id="techs" ref={techRef} className="py-24 px-6 relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className={`transition-all duration-700 ${techIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">For Technicians</span>
            <h2 className="text-4xl sm:text-5xl font-black text-surface-900 mt-3 mb-4 leading-tight">
              Earn More.<br />Work Your Way.
            </h2>
            <p className="text-surface-500 text-lg mb-8 leading-relaxed">
              Join our network of certified HVAC techs. Set your radius, claim jobs first-come first-served, and get paid fast — on your schedule.
            </p>
            <div className="space-y-3 mb-8">
              {[
                { icon: DollarSign, text: 'See net payout before accepting any job', color: 'text-emerald-600', bg: 'bg-emerald-100' },
                { icon: Zap,        text: 'Instant payouts with Pro or Elite plan', color: 'text-brand-500', bg: 'bg-brand-100' },
                { icon: FileText,   text: '1099-NEC & quarterly tax estimates built-in', color: 'text-amber-600', bg: 'bg-amber-100' },
                { icon: Users,      text: '247 verified techs already on the platform', color: 'text-brand-500', bg: 'bg-brand-50' },
              ].map(({ icon: Icon, text, color, bg }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className={color} />
                  </div>
                  <span className="text-surface-600 text-sm">{text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/login?signup=tech')} className="btn-primary py-3.5 px-7 text-base">
              Apply as a Tech <ArrowRight size={18} />
            </button>
          </div>

          <div className={`space-y-3 transition-all duration-700 delay-200 ${techIn ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {[
              { label: 'Standard', detail: 'Free · 15% platform fee per job · Standard dispatch', badge: '', highlight: false },
              { label: 'Pro',      detail: '$49/mo · 11% fee · Priority dispatch queue', badge: 'Most Popular', highlight: true },
              { label: 'Elite',    detail: '$99/mo · 8% fee · First in queue + instant payouts', badge: 'Best Value', highlight: false, accent: true },
            ].map(p => (
              <div
                key={p.label}
                className={`relative overflow-hidden rounded-2xl border p-4 transition-all ${
                  p.highlight
                    ? 'border-brand-400 bg-brand-50 shadow-sm'
                    : p.accent
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-surface-200 bg-white'
                }`}
              >
                {p.highlight && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-surface-900 font-bold">{p.label}</p>
                  {p.badge && (
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.accent ? 'bg-brand-50 text-brand-600' : 'bg-brand-100 text-brand-700'}`}>{p.badge}</span>
                  )}
                </div>
                <p className="text-surface-500 text-sm">{p.detail}</p>
              </div>
            ))}

            {/* Earnings preview */}
            <div className="relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-4">
              <p className="text-surface-400 text-xs font-bold uppercase tracking-widest mb-3">Sample Week · Elite Plan</p>
              <div className="space-y-2.5 text-sm">
                {[
                  { service: 'Furnace Repair', gross: 249 },
                  { service: 'No A/C Emergency', gross: 499 },
                  { service: 'Duct Cleaning', gross: 549 },
                ].map(e => {
                  const fee = +(e.gross * 0.08).toFixed(2)
                  const net = +(e.gross - fee).toFixed(2)
                  return (
                    <div key={e.service} className="flex items-center justify-between">
                      <span className="text-surface-300">{e.service}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 text-xs">−${fee}</span>
                        <span className="text-emerald-400 font-bold">${net}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-surface-200 mt-3 pt-3 flex justify-between items-center">
                <span className="text-surface-400 text-sm">3-Day Take-Home</span>
                <span className="text-emerald-400 text-xl font-black">$1,193</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ────────────────────────────────────────────────────────── */}
      <section ref={reviewsRef} className="py-24 px-6 bg-surface-100 border-t border-surface-200 relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-600 ${reviewsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex justify-center gap-1 mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} size={22} className="text-amber-400 fill-amber-400" />)}
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-surface-900 mb-3">Trusted by Homeowners</h2>
            <p className="text-surface-500 text-lg">4.9 average across 500+ completed jobs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { name: 'Sarah K.',   text: 'Tech arrived in 18 minutes and fixed our furnace same day. Best home service app I\'ve ever used.', rating: 5, service: 'Furnace Repair', avatar: 'SK' },
              { name: 'Diana P.',   text: 'No heat emergency at 11pm — a tech accepted in 6 minutes. Absolutely saved us. The live tracking is amazing.', rating: 5, service: 'No Heat Emergency', avatar: 'DP' },
              { name: 'Robert M.', text: 'Transparent pricing, real-time tracking, and I only paid after the job was done. Will never use anything else.', rating: 5, service: 'A/C Tune-Up', avatar: 'RM' },
            ].map((r, i) => (
              <div
                key={r.name}
                className={`card-gradient-border p-5 hover:-translate-y-1 transition-all duration-200 cursor-default ${reviewsIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({length: r.rating}).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-surface-600 text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-navy-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-surface-900 font-semibold text-sm">{r.name}</p>
                    <p className="text-surface-400 text-xs">{r.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="bg-white border border-surface-200 rounded-3xl p-12 shadow-xl">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <Zap size={12} /> Available Now in Your Area
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-surface-900 mb-4 leading-tight">
              Your home deserves<br />better than a wait list.
            </h2>
            <p className="text-surface-500 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of homeowners getting fast, verified HVAC service with real-time tracking and protected payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/login?signup=customer')} className="btn-primary py-4 px-8 text-base glow-brand">
                Book a Service <ArrowRight size={18} />
              </button>
              <button onClick={goLogin} className="btn-secondary py-4 px-8 text-base">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-200 py-10 px-6 bg-surface-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <Logo size="sm" />
            <div className="flex flex-wrap justify-center gap-5 text-surface-500 text-sm">
              <button onClick={() => navigate('/financing')} className="hover:text-surface-900 transition-colors">Financing</button>
              <button onClick={() => navigate('/contractors')} className="hover:text-surface-900 transition-colors">For Contractors</button>
              <button onClick={() => navigate('/lending-partners')} className="hover:text-surface-900 transition-colors">Lending Partners</button>
              <button onClick={() => navigate('/terms')} className="hover:text-surface-900 transition-colors">Terms of Service</button>
              <span className="hover:text-surface-900 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-surface-900 cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
          <div className="border-t border-surface-200 pt-6 text-center">
            <p className="text-surface-400 text-sm">© 2026 MatcHvac. All rights reserved. · Maryland · DMV &amp; Expanding Nationwide</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
