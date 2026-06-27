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

// ── Tech Signup (mirrors SOFN 5-step requirements) ──────────────────────────
function TechSignup({ onBack }) {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  // Step 0: Account
  const [account, setAccount] = useState({ email: '', password: '', confirmPw: '', name: '', phone: '' })
  // Step 1: License & Insurance
  const [license, setLicense] = useState({
    licenseNum: '', licenseExp: '', epa608: false, epa608Num: '',
    insuranceFile: null, insuranceName: '', insurancePolicy: '', insuranceExp: ''
  })
  const [uploadedFile, setUploadedFile] = useState(null)
  // Step 2: Service Area & Payment
  const ZIPS = ['20109', '22153', '22301', '22202', '20872', '20110', '20112', '20120', '20121', '20124']
  const [serviceZips, setServiceZips] = useState([])
  const [payMethod, setPayMethod] = useState('flat_fee')
  const [bank, setBank] = useState({ holder: '', routing: '', account: '', type: 'checking', confirm: false })
  // Step 3: Plan
  const [tier, setTier] = useState('free')

  const setA = k => e => setAccount(f => ({ ...f, [k]: e.target.value }))
  const setL = k => e => setLicense(f => ({ ...f, [k]: e.target.value }))

  const steps = ['Account', 'License', 'Setup', 'Plan', 'Ready']

  const finish = async () => {
    if (!account.name || !account.email || !account.password) return setError('Name, email and password are required.')
    if (account.password.length < 8) return setError('Password must be at least 8 characters.')
    if (account.password !== account.confirmPw) return setError('Passwords do not match.')
    setError(''); setLoading(true)
    try {
      await register(account.name, account.email, 'tech', account.password, account.phone, 'matchvac_tech')
      setStep(4)
    } catch (e) { setError(e.message || 'Registration failed. Please try again.') }
    finally { setLoading(false) }
  }

  const toggleZip = (z) => {
    setServiceZips(prev =>
      prev.includes(z) ? prev.filter(x => x !== z) : prev.length < 5 ? [...prev, z] : prev
    )
  }

  const STEPS = [
    { num: 1, label: 'Account' },
    { num: 2, label: 'License' },
    { num: 3, label: 'Setup' },
    { num: 4, label: 'Plan' },
    { num: 5, label: 'Ready' },
  ]

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up">
      <button onClick={onBack} className="text-surface-400 hover:text-navy-700 text-sm mb-6 flex items-center gap-1 transition-colors">← Back to sign in</button>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              i < step ? 'bg-brand-500 text-white' :
              i === step ? 'bg-brand-500 text-white ring-4 ring-brand-500/20' :
              'bg-surface-200 text-surface-500'
            }`}>
              {i < step ? <Check size={16} /> : s.num}
            </div>
            <span className={`text-xs font-medium hidden sm:inline ${i <= step ? 'text-brand-600' : 'text-surface-400'}`}>{s.label}</span>
            {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-brand-500' : 'bg-surface-200'}`} />}
          </div>
        ))}
      </div>

      {error && <div className="mb-6 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">{error}</div>}

      {/* Step 0: Account */}
      {step === 0 && (
        <div>
          <h2 className="text-2xl font-bold text-navy-700 mb-1">Create Your Tech Account</h2>
          <p className="text-surface-500 text-sm mb-6">Join the MatcHvac service network — also dispatched through SOFN.</p>
          <div className="space-y-4">
            <div><label className="label">Full Name</label><input className="input" placeholder="John Smith" value={account.name} onChange={setA('name')} /></div>
            <div><label className="label">Email Address</label><input className="input" type="email" placeholder="john@email.com" value={account.email} onChange={setA('email')} /></div>
            <div><label className="label">Phone</label><input className="input" type="tel" placeholder="(555) 000-0000" value={account.phone} onChange={setA('phone')} /></div>
            <div className="relative">
              <label className="label">Password</label>
              <input className="input pr-11" type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" value={account.password} onChange={setA('password')} />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-surface-400">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
            <div><label className="label">Confirm Password</label><input className="input" type={showPw ? 'text' : 'password'} placeholder="Re-enter password" value={account.confirmPw} onChange={setA('confirmPw')} /></div>
            <button onClick={() => setStep(1)} className="btn-primary w-full py-3">Next: License & Insurance <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Step 1: License & Insurance */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-navy-700 mb-1">License & Insurance</h2>
          <p className="text-surface-500 text-sm mb-6">Verify your credentials.</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">VA HVAC License #</label><input className="input" value={license.licenseNum} onChange={setL('licenseNum')} placeholder="12345-67890" /></div>
              <div><label className="label">License Expiration</label><input className="input" type="date" value={license.licenseExp} onChange={setL('licenseExp')} /></div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-surface-200">
              <input type="checkbox" id="epa-match" checked={license.epa608} onChange={e => setLicense(f => ({ ...f, epa608: e.target.checked }))} className="w-4 h-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
              <label htmlFor="epa-match" className="text-sm text-surface-600 font-medium">EPA 608 Certified</label>
            </div>
            {license.epa608 && <div><label className="label">EPA 608 Cert #</label><input className="input" value={license.epa608Num} onChange={setL('epa608Num')} placeholder="EPA123456" /></div>}
            <div className="border-t border-surface-200 pt-4 mt-4">
              <h3 className="font-bold text-navy-700 mb-4">General Liability Insurance</h3>
              <div className="border-2 border-dashed border-surface-300 rounded-xl p-6 text-center hover:border-brand-400 transition-colors cursor-pointer" onClick={() => document.getElementById('insMatchUpload').click()}>
                <Upload size={24} className="mx-auto mb-2 text-surface-500" />
                <p className="text-sm text-surface-600 font-medium">Upload Insurance Certificate</p>
                <p className="text-xs text-surface-500 mt-1">PDF, JPG, or PNG • Max 5MB</p>
                <input id="insMatchUpload" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => { const f = e.target.files[0]; if (f && f.size <= 5*1024*1024) { setLicense(prev => ({ ...prev, insuranceFile: f })); setUploadedFile(f.name) } else { setError('File too large. Max 5MB.') } }} />
                {uploadedFile && <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center justify-center gap-1"><Check size={12} />{uploadedFile}</div>}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div><label className="label">Insurance Company</label><input className="input" value={license.insuranceName} onChange={setL('insuranceName')} placeholder="State Farm" /></div>
                <div><label className="label">Policy #</label><input className="input" value={license.insurancePolicy} onChange={setL('insurancePolicy')} placeholder="POL123456" /></div>
              </div>
              <div className="mt-4"><label className="label">Insurance Expiration</label><input className="input" type="date" value={license.insuranceExp} onChange={setL('insuranceExp')} /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(0)} className="btn-secondary flex-1">Back</button>
              <button onClick={() => setStep(2)} className="btn-primary flex-1">Next: Service Area <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Service Area & Payment */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-navy-700 mb-1">Service Area & Payment</h2>
          <p className="text-surface-500 text-sm mb-6">Where do you serve and how do you get paid?</p>
          <div className="space-y-6">
            <div>
              <label className="label">Service ZIP Codes ({serviceZips.length}/5 selected)</label>
              <div className="grid grid-cols-3 gap-2">
                {ZIPS.map(z => (
                  <button key={z} onClick={() => toggleZip(z)} className={`h-10 rounded-lg border text-sm font-medium transition-all ${
                    serviceZips.includes(z) ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-surface-600 border-surface-200 hover:border-brand-400'
                  }`}>{z}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Payment Method</label>
              <div className="space-y-2">
                {[
                  { id: 'hourly', label: 'Hourly', desc: '$45–$75/hr depending on job' },
                  { id: 'flat_fee', label: 'Per-Job Flat Fee', desc: '$35–$350 depending on complexity' },
                  { id: 'commission', label: 'Commission', desc: '20–28% of authorized repair value' },
                ].map(p => (
                  <label key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    payMethod === p.id ? 'border-brand-500 bg-brand-50' : 'border-surface-200 bg-white'
                  }`}>
                    <input type="radio" name="pay" value={p.id} checked={payMethod === p.id} onChange={e => setPayMethod(e.target.value)} className="text-brand-500 focus:ring-brand-500" />
                    <div><p className="text-sm font-medium text-navy-700">{p.label}</p><p className="text-xs text-surface-500">{p.desc}</p></div>
                  </label>
                ))}
              </div>
            </div>
            <div className="border-t border-surface-200 pt-4">
              <h3 className="font-bold text-navy-700 mb-4 flex items-center gap-2"><CreditCard size={18} className="text-brand-500" /> Bank Account for Payouts</h3>
              <div className="space-y-3">
                <div><label className="label">Account Holder Name</label><input className="input" value={bank.holder} onChange={e => setBank(f => ({ ...f, holder: e.target.value }))} placeholder="John Smith" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Routing Number</label><input className="input font-mono" maxLength={9} value={bank.routing} onChange={e => setBank(f => ({ ...f, routing: e.target.value.replace(/\D/g, '') }))} placeholder="021000021" /></div>
                  <div><label className="label">Account Number</label><input className="input font-mono" value={bank.account} onChange={e => setBank(f => ({ ...f, account: e.target.value }))} placeholder="••••1234" /></div>
                </div>
                <div className="flex gap-4">
                  {['checking', 'savings'].map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="acctTypeMatch" value={t} checked={bank.type === t} onChange={e => setBank(f => ({ ...f, type: e.target.value }))} className="text-brand-500 focus:ring-brand-500" />
                      <span className="text-sm text-surface-600 capitalize">{t}</span>
                    </label>
                  ))}
                </div>
                <label className="flex items-start gap-2 cursor-pointer pt-2">
                  <input type="checkbox" checked={bank.confirm} onChange={e => setBank(f => ({ ...f, confirm: e.target.checked }))} className="mt-0.5 w-4 h-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
                  <span className="text-xs text-surface-600">I confirm this is my own account and I authorize direct deposits</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button onClick={() => setStep(3)} disabled={serviceZips.length < 1} className="btn-primary flex-1">Next: Choose Plan <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Plan */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold text-navy-700 mb-1">Choose Your Plan</h2>
          <p className="text-surface-500 text-sm mb-6">Upgrade for priority dispatch and lower fees.</p>
          <div className="space-y-3">
            {[
              { id: 'free', name: 'Free', price: '$0', badge: null, features: ['Access to dispatched jobs', 'Up to 15 jobs/month', 'Weekly payouts', 'Basic support'] },
              { id: 'pro', name: 'Pro', price: '$49', badge: 'Popular', features: ['Priority dispatch access', 'Up to 30 jobs/month', 'Advanced earnings analytics', 'Email + chat support', 'Calendar management'] },
              { id: 'elite', name: 'Elite', price: '$99', badge: null, features: ['All Pro features', 'Unlimited jobs', 'Dedicated account manager', 'Priority customer support', 'Co-branded materials'] },
            ].map(t => (
              <div key={t.id} onClick={() => setTier(t.id)} className={`relative rounded-xl p-4 cursor-pointer transition-all border-2 ${
                tier === t.id ? 'border-brand-500 bg-brand-50' : 'border-surface-200 bg-white hover:border-brand-300'
              }`}>
                {t.badge && <div className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">{t.badge}</div>}
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-navy-700">{t.name}</p>
                  <p className="text-xl font-bold text-brand-600">{t.price}<span className="text-sm font-normal text-surface-500">/mo</span></p>
                </div>
                <ul className="space-y-1">
                  {t.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-xs text-surface-600"><Check size={12} className="text-brand-500 flex-shrink-0" />{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
            <button onClick={finish} disabled={loading} className="btn-primary flex-1">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Submit Application'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Ready */}
      {step === 4 && (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6">
            <Crown size={32} className="text-brand-600" />
          </div>
          <h2 className="text-3xl font-bold text-navy-700 mb-2">Application Submitted!</h2>
          <p className="text-surface-500 mb-8">You're in the network — both MatcHvac and SOFN. Start watching for dispatches.</p>
          <div className="space-y-3 max-w-sm mx-auto mb-8 text-left">
            <div className="bg-white rounded-xl p-4 border border-surface-200 flex items-center gap-3">
              <Shield size={20} className="text-brand-500" />
              <div><p className="text-sm font-medium text-navy-700">License & Insurance</p><p className="text-xs text-emerald-600 font-medium flex items-center gap-1"><Check size={10} /> On file</p></div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-surface-200 flex items-center gap-3">
              <MapPin size={20} className="text-brand-500" />
              <div><p className="text-sm font-medium text-navy-700">Service Areas</p><p className="text-xs text-surface-600">{serviceZips.join(', ') || 'DMV area'}</p></div>
            </div>
          </div>
          <button onClick={() => navigate('/tech')} className="btn-primary mx-auto">Go to Dashboard <ArrowRight size={18} /></button>
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
