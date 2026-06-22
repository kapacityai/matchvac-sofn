import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import { Eye, EyeOff, Zap, Shield, MapPin, ArrowRight, Upload, CheckCircle, FileText, Clock } from 'lucide-react'

// ── Customer Signup ───────────────────────────────────────────────────────────
function CustomerSignup({ onBack }) {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const finish = async () => {
    if (!form.name || !form.email || !form.password) return setError('Name, email and password are required.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setError(''); setLoading(true)
    try { await register(form.name, form.email, 'customer', form.password, form.phone) }
    catch (e) { setError(e.message || 'Registration failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="w-full max-w-sm mx-auto animate-slide-up">
      <button onClick={onBack} className="text-surface-400 hover:text-navy-700 text-sm mb-6 flex items-center gap-1 transition-colors">← Back to sign in</button>
      <h2 className="text-2xl font-bold text-navy-700 mb-1">Create Your Account</h2>
      <p className="text-surface-500 text-sm mb-6">Book HVAC service in minutes — no card required to sign up</p>
      <div className="space-y-4">
        <div><label className="label">Full Name</label><input className="input" placeholder="Jane Smith" value={form.name} onChange={set('name')} /></div>
        <div><label className="label">Email Address</label><input className="input" type="email" placeholder="jane@email.com" value={form.email} onChange={set('email')} /></div>
        <div><label className="label">Phone <span className="text-surface-400 font-normal">(for SMS updates)</span></label><input className="input" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} /></div>
        <div><label className="label">Service Address <span className="text-surface-400 font-normal">(optional)</span></label><input className="input" placeholder="123 Main St, City, State ZIP" value={form.address} onChange={set('address')} /></div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input className="input pr-11" type={show ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={set('password')} />
            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-navy-700">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div><label className="label">Confirm Password</label><input className="input" type="password" placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} /></div>
        {error && <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">{error}</div>}
        <div className="flex items-start gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
          <Shield size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="text-emerald-700 text-xs">Payment info is only needed when you book — not to create your account.</p>
        </div>
        <button onClick={finish} disabled={loading} className="btn-primary w-full py-3">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Create Account'}
        </button>
        <p className="text-surface-500 text-xs text-center">
          By creating an account you agree to our{' '}
          <a href="/terms?tab=customer" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Customer Terms</a>
          {' '}and{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">General Terms</a>.
        </p>
      </div>
    </div>
  )
}

// ── Tech Signup ───────────────────────────────────────────────────────────────
function TechSignup({ onBack }) {
  const { register } = useAuth()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', coverage: '', plan: 'per_job' })
  const [uploaded, setUploaded] = useState({})
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const DOCS = [
    { key: 'license', label: "Driver's License (front & back)" },
    { key: 'w9',      label: 'IRS Form W-9' },
    { key: 'certs',   label: 'HVAC Certifications (EPA 608, NATE, etc.)' },
  ]
  const finish = () => register(form.name, form.email, 'tech', form.password, form.phone)
  const steps = ['Info', 'Docs', 'Plan', 'Review']

  return (
    <div className="w-full max-w-sm mx-auto animate-slide-up">
      <button onClick={onBack} className="text-surface-400 hover:text-navy-700 text-sm mb-6 flex items-center gap-1 transition-colors">← Back to sign in</button>
      <h2 className="text-2xl font-bold text-navy-700 mb-1">Apply as HVAC Tech</h2>
      <p className="text-surface-500 text-sm mb-5">Start earning in your area</p>
      <div className="flex gap-1 mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div className={`h-1.5 rounded-full mb-1 ${i <= step ? 'bg-brand-500' : 'bg-surface-200'}`} />
            <p className={`text-xs font-medium ${i === step ? 'text-brand-600' : 'text-surface-400'}`}>{s}</p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div><label className="label">Full Name</label><input className="input" placeholder="Marcus Rivera" value={form.name} onChange={set('name')} /></div>
          <div><label className="label">Email Address</label><input className="input" type="email" placeholder="marcus@email.com" value={form.email} onChange={set('email')} /></div>
          <div><label className="label">Phone</label><input className="input" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} /></div>
          <div><label className="label">Password</label><input className="input" type="password" placeholder="Create a password" value={form.password} onChange={set('password')} /></div>
          <div><label className="label">Coverage Area</label><input className="input" placeholder="e.g. Silver Spring, Bethesda, Rockville" value={form.coverage} onChange={set('coverage')} /></div>
          <button onClick={() => setStep(1)} className="btn-primary w-full py-3">Next: Upload Documents <ArrowRight size={16} /></button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-surface-500 text-sm">Reviewed within 24 hours. Account shows <span className="text-amber-600 font-medium">Pending</span> until approved.</p>
          {DOCS.map(doc => (
            <div key={doc.key}>
              <label className="label">{doc.label}</label>
              <button onClick={() => setUploaded(u => ({ ...u, [doc.key]: true }))}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-all text-sm font-medium ${uploaded[doc.key] ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-surface-300 text-surface-500 hover:border-brand-400 hover:text-brand-600'}`}>
                {uploaded[doc.key] ? <CheckCircle size={16} /> : <Upload size={16} />}
                {uploaded[doc.key] ? 'Uploaded ✓' : 'Tap to upload'}
              </button>
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1">Back</button>
            <button onClick={() => setStep(2)} className="btn-primary flex-1">Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-surface-500 text-sm">Choose your platform fee structure:</p>
          {[
            { key: 'per_job',      label: 'Pay-per-Job',          detail: '15% platform fee per job, no monthly cost' },
            { key: 'subscription', label: 'Monthly Subscription', detail: '$149/mo — reduced 8% per-job rate + instant payouts', badge: 'Best Value' },
          ].map(p => (
            <button key={p.key} onClick={() => setForm(f => ({ ...f, plan: p.key }))}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${form.plan === p.key ? 'border-brand-500 bg-brand-50' : 'border-surface-200 bg-white hover:border-brand-300'}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-navy-700 font-semibold">{p.label}</p>
                {p.badge && <span className="badge badge-teal">{p.badge}</span>}
              </div>
              <p className="text-surface-500 text-sm">{p.detail}</p>
            </button>
          ))}
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-surface-100 border border-surface-200 rounded-xl p-4 text-sm text-surface-600 h-28 overflow-y-auto leading-relaxed">
            <p className="font-semibold text-navy-700 mb-1">Independent Contractor Agreement</p>
            You are an independent contractor, not an employee of MatcHvac. Platform fee: {form.plan === 'subscription' ? '8% + $149/mo' : '15%'} per job. Off-platform solicitation is strictly prohibited. By clicking Submit you e-sign this agreement and the Technician Terms of Service.
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-brand-50 border border-brand-200 rounded-xl">
            <FileText size={13} className="text-brand-600 flex-shrink-0" />
            <a href="/terms?tab=tech" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline text-xs">Read full Technician Terms of Service →</a>
          </div>
          <div><label className="label">Bank Account for Payouts</label><input className="input" placeholder="Routing + Account number" /></div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
            <button onClick={finish} className="btn-primary flex-1">Submit Application</button>
          </div>
          <p className="text-surface-500 text-xs text-center">
            By submitting you agree to our{' '}
            <a href="/terms?tab=tech" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Technician Terms</a>
            {' '}and{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">General Terms</a>.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Main Login ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login, error, setError } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmailVal] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(() => {
    const s = searchParams.get('signup')
    if (s === 'customer') return 'customer_signup'
    if (s === 'tech') return 'tech_signup'
    return 'login'
  })

  const doLogin = (em, pw) => {
    setLoading(true)
    setTimeout(() => { login(em, pw); setLoading(false) }, 500)
  }
  const handleSubmit = e => { e.preventDefault(); doLogin(email, password) }

  if (mode === 'customer_signup') return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center px-6 py-12">
      <CustomerSignup onBack={() => { setMode('login'); setError('') }} />
    </div>
  )
  if (mode === 'tech_signup') return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center px-6 py-12">
      <TechSignup onBack={() => { setMode('login'); setError('') }} />
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-100 flex">
      {/* Left hero — navy brand panel */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-gradient-to-br from-navy-700 to-navy-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')}><Logo size="md" /></button>
            <button onClick={() => navigate('/')} className="text-white/50 hover:text-white text-sm transition-colors">← Website</button>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-brand-300 text-sm font-semibold">HVAC On-Demand</span>
              </div>
              <h2 className="text-4xl font-black text-white leading-tight mb-4">
                Fast help.<br />
                <span className="text-brand-400">Right match.</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Certified HVAC technicians matched to you in minutes.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap,    text: 'Matched in under 2 minutes',          color: 'bg-amber-400/20 text-amber-300' },
                  { icon: MapPin, text: 'Live GPS tracking to your door',       color: 'bg-brand-400/20 text-brand-300' },
                  { icon: Shield, text: 'Escrow protected — pay after done',    color: 'bg-emerald-400/20 text-emerald-300' },
                  { icon: Clock,  text: 'Background checked, certified pros',   color: 'bg-blue-400/20 text-blue-300' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={15} />
                    </div>
                    <span className="text-white/70 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-white/30 text-xs">© 2026 MatcHvac. All rights reserved.</p>
        </div>
      </div>

      {/* Right form — white panel */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden mb-8"><button onClick={() => navigate('/')}><Logo size="md" /></button></div>

          <h2 className="text-2xl font-bold text-navy-700 mb-1">Welcome back</h2>
          <p className="text-surface-500 text-sm mb-6">Sign in to your MatcHvac account</p>

          {/* One-click demo */}
          <div className="mb-6">
            <p className="text-surface-400 text-xs font-semibold uppercase tracking-wider mb-2">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'Customer',  email: 'customer@demo.com', bg: 'bg-brand-500 hover:bg-brand-600' },
                { role: 'HVAC Tech', email: 'tech@demo.com',     bg: 'bg-emerald-500 hover:bg-emerald-600' },
                { role: 'Admin',     email: 'admin@demo.com',    bg: 'bg-navy-700 hover:bg-navy-800' },
              ].map(c => (
                <button key={c.role} onClick={() => doLogin(c.email, 'demo1234')} disabled={loading}
                  className={`py-2.5 px-2 rounded-xl ${c.bg} text-white text-xs font-bold text-center active:scale-95 transition-all disabled:opacity-50`}>
                  {loading ? '…' : c.role}
                </button>
              ))}
            </div>
            <p className="text-surface-400 text-xs text-center mt-2">Tap to instantly enter that role</p>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-surface-400 text-xs">or sign in manually</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmailVal(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-11" type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-navy-700">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-surface-200" />
              <span className="text-surface-400 text-xs">new here?</span>
              <div className="flex-1 h-px bg-surface-200" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setMode('customer_signup'); setError('') }} className="btn-secondary text-sm py-2.5 justify-center">
                Customer Sign Up
              </button>
              <button onClick={() => { setMode('tech_signup'); setError('') }} className="btn-secondary text-sm py-2.5 justify-center">
                Apply as Tech
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
