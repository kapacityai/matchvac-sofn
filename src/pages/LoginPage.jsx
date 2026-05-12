import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import { Eye, EyeOff, Zap, Shield, MapPin, ArrowRight, Upload, CheckCircle } from 'lucide-react'

// ── Customer Signup ───────────────────────────────────────────
function CustomerSignup({ onBack }) {
  const { register } = useAuth()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const finish = () => register(form.name || 'New Customer', form.email || 'newcustomer@demo.com', 'demo1234', 'customer')

  return (
    <div className="w-full max-w-sm mx-auto animate-slide-up">
      <button onClick={onBack} style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '4px' }}
        onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = '#6B6B6B'}>
        ← Back to sign in
      </button>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: 'white', fontSize: '24px', marginBottom: '4px' }}>Create Your Account</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '14px', marginBottom: '24px' }}>Book a pro in minutes</p>

      {step === 0 && (
        <div className="space-y-4">
          <div><label className="label">Full Name</label><input className="input" placeholder="Jane Smith" value={form.name} onChange={set('name')} /></div>
          <div><label className="label">Email Address</label><input className="input" type="email" placeholder="jane@email.com" value={form.email} onChange={set('email')} /></div>
          <div><label className="label">Phone (for SMS updates)</label><input className="input" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} /></div>
          <div><label className="label">Service Address</label><input className="input" placeholder="123 Main St, City, MD ZIP" value={form.address} onChange={set('address')} /></div>
          <button onClick={() => setStep(1)} className="btn-primary w-full py-3">Continue <ArrowRight size={16} /></button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '14px' }}>Funds are held in escrow until your job is complete. You only pay when satisfied.</p>
          <div><label className="label">Card Number</label><input className="input font-mono" placeholder="4242 4242 4242 4242" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Expiry</label><input className="input" placeholder="MM / YY" /></div>
            <div><label className="label">CVC</label><input className="input" placeholder="123" /></div>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <Shield size={14} className="text-emerald-400" /> Secured by Stripe — never stored on our servers
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1">Back</button>
            <button onClick={finish} className="btn-primary flex-1">Create Account</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tech Signup ───────────────────────────────────────────────
function TechSignup({ onBack }) {
  const { register } = useAuth()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', phone: '', coverage: '', plan: 'per_job' })
  const [uploaded, setUploaded] = useState({})
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const DOCS = [
    { key: 'license', label: "Driver's License (front & back)" },
    { key: 'w9',      label: 'IRS Form W-9' },
    { key: 'certs',   label: 'HVAC Certifications (EPA 608, NATE, etc.)' },
  ]

  const finish = () => register(form.name || 'New Tech', form.email || 'newtech@demo.com', 'demo1234', 'tech')
  const steps = ['Info', 'Docs', 'Plan', 'Review']

  return (
    <div className="w-full max-w-sm mx-auto animate-slide-up">
      <button onClick={onBack} style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '4px' }}
        onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = '#6B6B6B'}>
        ← Back to sign in
      </button>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: 'white', fontSize: '24px', marginBottom: '4px' }}>Apply as a Pro</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '14px', marginBottom: '20px' }}>Real work. Real pay. Built for people like you.</p>

      {/* Step progress */}
      <div className="flex gap-1 mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div style={{ height: '3px', borderRadius: '99px', marginBottom: '4px', background: i <= step ? '#FF5A5F' : 'rgba(255,255,255,0.1)' }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: i === step ? '#FF5A5F' : 'rgba(255,255,255,0.3)' }}>{s}</p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div><label className="label">Full Name</label><input className="input" placeholder="Marcus Rivera" value={form.name} onChange={set('name')} /></div>
          <div><label className="label">Email Address</label><input className="input" type="email" placeholder="marcus@email.com" value={form.email} onChange={set('email')} /></div>
          <div><label className="label">Phone</label><input className="input" type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} /></div>
          <div><label className="label">Coverage Area</label><input className="input" placeholder="e.g. Bethesda, Arlington, Silver Spring" value={form.coverage} onChange={set('coverage')} /></div>
          <button onClick={() => setStep(1)} className="btn-primary w-full py-3">Next: Upload Documents <ArrowRight size={16} /></button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '13px' }}>Documents reviewed within 24 hours. Account shows <span style={{ color: '#FFB400' }}>Pending Review</span> until approved.</p>
          {DOCS.map(doc => (
            <div key={doc.key}>
              <label className="label">{doc.label}</label>
              <button onClick={() => setUploaded(u => ({ ...u, [doc.key]: true }))}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', border: uploaded[doc.key] ? '1px solid rgba(52,211,153,0.4)' : '1px dashed rgba(255,255,255,0.15)', background: uploaded[doc.key] ? 'rgba(52,211,153,0.08)' : 'transparent', color: uploaded[doc.key] ? '#34d399' : 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
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
        <div className="space-y-3">
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '13px' }}>Choose your platform fee structure:</p>
          {[
            { key: 'per_job', label: 'Standard', detail: '15% platform fee per job. No monthly cost.' },
            { key: 'subscription', label: 'Elite — Best Value', detail: '$99/mo — reduced 8% per-job rate + priority dispatch', badge: true },
          ].map(p => (
            <button key={p.key} onClick={() => setForm(f => ({ ...f, plan: p.key }))}
              style={{ width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: '12px', border: form.plan === p.key ? '1px solid rgba(255,90,95,0.5)' : '0.5px solid rgba(255,255,255,0.08)', background: form.plan === p.key ? 'rgba(255,90,95,0.08)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div className="flex items-center justify-between mb-1">
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'white', fontSize: '14px' }}>{p.label}</p>
                {p.badge && <span style={{ background: 'rgba(255,180,0,0.15)', color: '#FFB400', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 500, padding: '2px 10px', borderRadius: '99px' }}>Best Value</span>}
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '13px' }}>{p.detail}</p>
            </button>
          ))}
          <div className="flex gap-3 pt-1">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', fontSize: '13px', color: '#6B6B6B', height: '112px', overflowY: 'auto', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'white', marginBottom: '6px', fontSize: '13px' }}>Independent Contractor Agreement</p>
            You are an independent contractor, not an employee of Hanfan. You will receive a 1099-NEC at year-end for earnings over $600. Platform fee: {form.plan === 'subscription' ? '8% + $99/mo' : '15%'} per job. By clicking Submit you e-sign this agreement.
          </div>
          <div><label className="label">Bank Account for Payouts</label><input className="input" placeholder="Routing + Account number" /></div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
            <button onClick={finish} className="btn-primary flex-1">Submit Application</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Login Page ───────────────────────────────────────────
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

  const handleSubmit = (e) => { e.preventDefault(); doLogin(email, password) }

  const signupWrapper = (
    <div style={{ minHeight: '100vh', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      {mode === 'customer_signup'
        ? <CustomerSignup onBack={() => { setMode('login'); setError('') }} />
        : <TechSignup onBack={() => { setMode('login'); setError('') }} />
      }
    </div>
  )

  if (mode === 'customer_signup' || mode === 'tech_signup') return signupWrapper

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A1A', display: 'flex' }}>

      {/* ── Left panel — coral brand ── */}
      <div style={{ background: '#FF5A5F', flex: 1, display: 'none', position: 'relative', overflow: 'hidden' }}
        className="lg:flex flex-col">
        {/* Ghost handshake watermark */}
        <svg style={{ position: 'absolute', right: '-5%', bottom: '5%', opacity: 0.12, pointerEvents: 'none' }}
          width="440" height="440" viewBox="0 0 200 200" fill="none">
          <path d="M40 110c0 0 15-20 35-20s30 15 45 15 25-10 40-10" stroke="white" strokeWidth="8" strokeLinecap="round"/>
          <path d="M30 130c0 0 20-15 40-15s35 20 50 20 30-15 50-15" stroke="white" strokeWidth="6" strokeLinecap="round"/>
          <circle cx="100" cy="70" r="22" fill="white"/>
          <path d="M80 90 Q100 110 120 90" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
        </svg>

        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center justify-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '14px', color: 'white' }}>H</span>
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '20px', color: 'white', letterSpacing: '-0.02em' }}>Hanfan</span>
            </div>
            <button onClick={() => navigate('/')}
              style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.6)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
              ← Website
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div style={{ maxWidth: '380px' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginBottom: '16px' }}>
                Have a need. Fill a need.
              </p>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: 'white', fontSize: '42px', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '20px' }}>
                Real pros<br />on demand.
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.75)', fontSize: '16px', lineHeight: 1.65, marginBottom: '36px' }}>
                Connect with verified home service professionals in minutes. Secure payments, live tracking, guaranteed quality.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Zap,    text: 'Instant dispatch to nearby pros',         color: '#FFB400' },
                  { icon: MapPin, text: 'Live GPS tracking of your professional',  color: 'rgba(255,255,255,0.9)' },
                  { icon: Shield, text: 'Secure escrow — pay only when complete',  color: 'rgba(255,255,255,0.9)' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>© 2026 Hanfan. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right panel — login form ── */}
      <div style={{ flex: 1, maxWidth: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 32px' }}>
        <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>

          {/* Mobile logo */}
          <div className="lg:hidden mb-8"><Logo size="md" /></div>

          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: 'white', fontSize: '22px', marginBottom: '4px' }}>Welcome back</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B', fontSize: '14px', marginBottom: '24px' }}>Sign in to your account</p>

          {/* One-click demo */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              One-Click Demo Access
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { role: 'Admin',    email: 'admin@demo.com',    bg: '#2A2A2A',          accent: '#FF5A5F' },
                { role: 'Customer', email: 'customer@demo.com', bg: '#FF5A5F',          accent: 'white' },
                { role: 'Pro Tech', email: 'tech@demo.com',     bg: '#FFB400',          accent: '#1A1A1A' },
              ].map(c => (
                <button key={c.role} onClick={() => doLogin(c.email, 'demo1234')} disabled={loading}
                  style={{ padding: '12px 8px', borderRadius: '10px', background: c.bg, color: c.accent, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.5 : 1, textAlign: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  {loading ? '…' : c.role}
                </button>
              ))}
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '8px' }}>
              Tap any button to instantly enter that role
            </p>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>or sign in manually</span>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmailVal(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" style={{ paddingRight: '44px' }} type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow(!show)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(255,90,95,0.1)', border: '0.5px solid rgba(255,90,95,0.3)', borderRadius: '10px', color: '#FF7A7F', fontFamily: "'DM Sans', sans-serif", fontSize: '13px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading
                ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                : 'Sign In'
              }
            </button>
          </form>

          {/* Sign up options */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>new here?</span>
              <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button onClick={() => { setMode('customer_signup'); setError('') }} className="btn-secondary text-sm py-2.5 justify-center">
                Customer Sign Up
              </button>
              <button onClick={() => { setMode('tech_signup'); setError('') }} className="btn-secondary text-sm py-2.5 justify-center">
                Apply as a Pro
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
