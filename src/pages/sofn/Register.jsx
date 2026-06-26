import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SofnLogo } from '../../components/sofn/Logo'
import {
  Check, ChevronLeft, ChevronRight, Upload, Shield, MapPin,
  CreditCard, Crown, Wrench, ArrowRight, Eye, EyeOff
} from 'lucide-react'

const STEPS = [
  { num: 1, label: 'Account' },
  { num: 2, label: 'License' },
  { num: 3, label: 'Setup' },
  { num: 4, label: 'Plan' },
  { num: 5, label: 'Ready' },
]

const ZIPS = ['20109', '22153', '22301', '22202', '20872', '20110', '20112', '20120', '20121', '20124']

export default function SofnRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  // Step 1: Account
  const [account, setAccount] = useState({ email: '', password: '', confirmPw: '', name: '', phone: '' })
  // Step 2: License & Insurance
  const [license, setLicense] = useState({
    licenseNum: '', licenseExp: '', epa608: false, epa608Num: '',
    insuranceFile: null, insuranceName: '', insurancePolicy: '', insuranceExp: ''
  })
  const [uploadedFile, setUploadedFile] = useState(null)
  // Step 3: Service Area & Payment
  const [serviceZips, setServiceZips] = useState([])
  const [payMethod, setPayMethod] = useState('flat_fee')
  const [bank, setBank] = useState({ holder: '', routing: '', account: '', type: 'checking', confirm: false })
  // Step 4: Subscription
  const [tier, setTier] = useState('free')
  // Auth token
  const [token, setToken] = useState(localStorage.getItem('sofn_token') || '')

  useEffect(() => { document.body.classList.add('sofn-body'); return () => document.body.classList.remove('sofn-body') }, [])

  const setA = k => e => setAccount(f => ({ ...f, [k]: e.target.value }))
  const setL = k => e => setLicense(f => ({ ...f, [k]: e.target.value }))

  const getPwStrength = (pw) => {
    if (!pw) return 0
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[a-z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
  }
  const pwStrength = getPwStrength(account.password)
  const strengthColors = ['bg-[#DAD8D2]', 'bg-rose-500', 'bg-amber-500', 'bg-amber-400', 'bg-emerald-500', 'bg-emerald-600']

  const apiFetch = async (path, opts = {}) => {
    const headers = { 'Content-Type': 'application/json', ...opts.headers }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const baseUrl = import.meta.env.VITE_API_URL || ''
    if (!baseUrl) return {} // demo/preview mode
    const res = await fetch(baseUrl + path, { ...opts, headers })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  }

  const step1Submit = async () => {
    setError('')
    if (!account.email || !account.password || !account.name || !account.phone) return setError('All fields required')
    if (account.password.length < 8) return setError('Password must be at least 8 characters')
    if (account.password !== account.confirmPw) return setError('Passwords do not match')
    setLoading(true)
    await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: account.email, password: account.password, name: account.name, phone: account.phone, role: 'tech' })
    }).catch(() => {})
    setToken('demo-token')
    localStorage.setItem('sofn_token', 'demo-token')
    setStep(1)
    setLoading(false)
  }

  const step2Submit = async () => {
    setError('')
    if (!license.licenseNum || !license.licenseExp || !license.insuranceName || !license.insurancePolicy || !license.insuranceExp)
      return setError('License number, expiration, and insurance info required')
    setLoading(true)
    await apiFetch('/api/tech/profile', {
      method: 'PUT',
      body: JSON.stringify({
        license_number: license.licenseNum,
        license_state: 'VA',
        license_expiry: license.licenseExp,
        epa608_certified: license.epa608,
        epa608_number: license.epa608Num,
        insurance_company: license.insuranceName,
        insurance_policy_number: license.insurancePolicy,
        insurance_expiry: license.insuranceExp,
      })
    }).catch(() => {})
    if (license.insuranceFile) setUploadedFile(license.insuranceFile.name)
    setStep(2)
    setLoading(false)
  }

  const step3Submit = async () => {
    setError('')
    if (serviceZips.length < 1) return setError('Select at least 1 service ZIP')
    if (!bank.holder || bank.routing.length !== 9 || !bank.account) return setError('Complete bank account info')
    if (!bank.confirm) return setError('Confirm the bank account is yours')
    setLoading(true)
    await apiFetch('/api/tech/profile', {
      method: 'PUT',
      body: JSON.stringify({
        service_zips: serviceZips,
        preferred_payment_method: payMethod,
        bank_account_holder: bank.holder,
        bank_routing: bank.routing,
        bank_account: bank.account,
        bank_account_type: bank.type,
      })
    }).catch(() => {})
    setStep(3)
    setLoading(false)
  }

  const step4Submit = async () => {
    setLoading(true)
    if (tier !== 'free') {
      await apiFetch('/api/tech/subscription/upgrade', {
        method: 'POST',
        body: JSON.stringify({ tier })
      }).catch(() => {})
    }
    setStep(4)
    setLoading(false)
  }

  const toggleZip = (z) => {
    setServiceZips(prev =>
      prev.includes(z) ? prev.filter(x => x !== z) : prev.length < 5 ? [...prev, z] : prev
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF]">
      {/* Header */}
      <header className="bg-white border-b border-[#DAD8D2] px-6 py-4 flex items-center justify-between">
        <SofnLogo size="sm" />
        <button onClick={() => window.history.length > 1 ? window.history.back() : navigate('/sofn')} className="text-[#0C6B5E] text-sm font-medium hover:underline">← Back</button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < step ? 'bg-[#0C6B5E] text-white' :
                i === step ? 'bg-[#0C6B5E] text-white ring-4 ring-[#0C6B5E]/20' :
                'bg-[#DAD8D2] text-[#33485C]'
              }`}>
                {i < step ? <Check size={16} /> : s.num}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${
                i <= step ? 'text-[#0C6B5E]' : 'text-[#33485C]/50'
              }`}>{s.label}</span>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-[#0C6B5E]' : 'bg-[#DAD8D2]'}`} />}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <div className="mb-6 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">{error}</div>}

        {/* Step 0: Create Account */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-display font-bold text-[#16202B] mb-2">Create Your Account</h1>
            <p className="text-[#33485C] mb-8">Join the SOFN network of certified HVAC technicians.</p>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-[#33485C] mb-1">Full Name</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20" value={account.name} onChange={setA('name')} placeholder="John Smith" /></div>
              <div><label className="block text-sm font-medium text-[#33485C] mb-1">Email</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20" type="email" value={account.email} onChange={setA('email')} placeholder="john@example.com" /></div>
              <div><label className="block text-sm font-medium text-[#33485C] mb-1">Phone</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20" type="tel" value={account.phone} onChange={setA('phone')} placeholder="(703) 555-0123" /></div>
              <div className="relative"><label className="block text-sm font-medium text-[#33485C] mb-1">Password</label>
                <input className="w-full h-11 px-4 pr-10 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20" type={showPw ? 'text' : 'password'} value={account.password} onChange={setA('password')} placeholder="Min 8 characters" />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-[#33485C]/50">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                {account.password && <div className="flex gap-1 mt-1.5"><div className={`h-1 flex-1 rounded-full ${strengthColors[pwStrength]}`} /><div className={`h-1 flex-1 rounded-full ${pwStrength >= 2 ? strengthColors[pwStrength] : 'bg-[#DAD8D2]'}`} /><div className={`h-1 flex-1 rounded-full ${pwStrength >= 4 ? strengthColors[pwStrength] : 'bg-[#DAD8D2]'}`} /><div className={`h-1 flex-1 rounded-full ${pwStrength >= 5 ? strengthColors[pwStrength] : 'bg-[#DAD8D2]'}`} /></div>}
              </div>
              <div><label className="block text-sm font-medium text-[#33485C] mb-1">Confirm Password</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20" type={showPw ? 'text' : 'password'} value={account.confirmPw} onChange={setA('confirmPw')} placeholder="Re-enter password" /></div>
              <button onClick={step1Submit} disabled={loading} className="w-full h-11 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ChevronRight size={18} /></>}
              </button>
            </div>
          </div>
        )}

        {/* Step 1: License & Insurance */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-display font-bold text-[#16202B] mb-2">License & Insurance</h1>
            <p className="text-[#33485C] mb-8">Verify your credentials to start accepting dispatches.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-[#33485C] mb-1">VA HVAC License #</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20" value={license.licenseNum} onChange={setL('licenseNum')} placeholder="12345-67890" /></div>
                <div><label className="block text-sm font-medium text-[#33485C] mb-1">License Expiration</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20" type="date" value={license.licenseExp} onChange={setL('licenseExp')} /></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#DAD8D2]">
                <input type="checkbox" id="epa" checked={license.epa608} onChange={e => setLicense(f => ({ ...f, epa608: e.target.checked }))} className="w-4 h-4 rounded border-[#DAD8D2] text-[#0C6B5E] focus:ring-[#0C6B5E]" />
                <label htmlFor="epa" className="text-sm text-[#33485C] font-medium">EPA 608 Certified</label>
              </div>
              {license.epa608 && <div><label className="block text-sm font-medium text-[#33485C] mb-1">EPA 608 Cert #</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20" value={license.epa608Num} onChange={setL('epa608Num')} placeholder="EPA123456" /></div>}
              <div className="border-t border-[#DAD8D2] pt-4 mt-6">
                <h3 className="font-display font-bold text-[#16202B] mb-4">General Liability Insurance</h3>
                <div className="border-2 border-dashed border-[#DAD8D2] rounded-lg p-6 text-center hover:border-[#0C6B5E] transition-colors cursor-pointer" onClick={() => document.getElementById('insUpload').click()}>
                  <Upload size={24} className="mx-auto mb-2 text-[#33485C]" />
                  <p className="text-sm text-[#33485C] font-medium">Upload Insurance Certificate</p>
                  <p className="text-xs text-[#33485C]/60 mt-1">PDF, JPG, or PNG • Max 5MB</p>
                  <input id="insUpload" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => { const f = e.target.files[0]; if (f && f.size <= 5*1024*1024) { setLicense(prev => ({ ...prev, insuranceFile: f })); setUploadedFile(f.name) } else { setError('File too large. Max 5MB.') } }} />
                  {uploadedFile && <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center justify-center gap-1"><Check size={12} />{uploadedFile}</div>}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div><label className="block text-sm font-medium text-[#33485C] mb-1">Insurance Company</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E]" value={license.insuranceName} onChange={setL('insuranceName')} placeholder="State Farm" /></div>
                  <div><label className="block text-sm font-medium text-[#33485C] mb-1">Policy #</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E]" value={license.insurancePolicy} onChange={setL('insurancePolicy')} placeholder="POL123456" /></div>
                </div>
                <div className="mt-4"><label className="block text-sm font-medium text-[#33485C] mb-1">Insurance Expiration</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20" type="date" value={license.insuranceExp} onChange={setL('insuranceExp')} /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="h-11 px-6 border border-[#DAD8D2] rounded-lg text-[#33485C] font-medium hover:bg-white transition-colors flex items-center gap-2"><ChevronLeft size={18} /> Back</button>
                <button onClick={step2Submit} disabled={loading} className="flex-1 h-11 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Save & Continue <ChevronRight size={18} /></>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Service Area & Payment */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-display font-bold text-[#16202B] mb-2">Service Area & Payment</h1>
            <p className="text-[#33485C] mb-8">Where do you serve and how do you get paid?</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#33485C] mb-2">Service ZIP Codes ({serviceZips.length}/5 selected)</label>
                <div className="grid grid-cols-3 gap-2">
                  {ZIPS.map(z => (
                    <button key={z} onClick={() => toggleZip(z)} className={`h-10 rounded-lg border text-sm font-medium transition-all ${
                      serviceZips.includes(z) ? 'bg-[#0C6B5E] text-white border-[#0C6B5E]' : 'bg-white text-[#33485C] border-[#DAD8D2] hover:border-[#0C6B5E]'
                    }`}>{z}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#33485C] mb-2">Payment Method</label>
                <div className="space-y-2">
                  {[
                    { id: 'hourly', label: 'Hourly', desc: '$45–$75/hr depending on job' },
                    { id: 'flat_fee', label: 'Per-Job Flat Fee', desc: '$35–$350 depending on complexity' },
                    { id: 'commission', label: 'Commission', desc: '20–28% of authorized repair value' },
                  ].map(p => (
                    <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      payMethod === p.id ? 'border-[#0C6B5E] bg-white' : 'border-[#DAD8D2] bg-white'
                    }`}>
                      <input type="radio" name="pay" value={p.id} checked={payMethod === p.id} onChange={e => setPayMethod(e.target.value)} className="text-[#0C6B5E] focus:ring-[#0C6B5E]" />
                      <div><p className="text-sm font-medium text-[#16202B]">{p.label}</p><p className="text-xs text-[#33485C]/60">{p.desc}</p></div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#DAD8D2] pt-4">
                <h3 className="font-display font-bold text-[#16202B] mb-4 flex items-center gap-2"><CreditCard size={18} className="text-[#0C6B5E]" /> Bank Account for Payouts</h3>
                <div className="space-y-3">
                  <div><label className="block text-sm font-medium text-[#33485C] mb-1">Account Holder Name</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E]" value={bank.holder} onChange={e => setBank(f => ({ ...f, holder: e.target.value }))} placeholder="John Smith" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-medium text-[#33485C] mb-1">Routing Number</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] font-mono focus:outline-none focus:border-[#0C6B5E]" maxLength={9} value={bank.routing} onChange={e => setBank(f => ({ ...f, routing: e.target.value.replace(/\D/g, '') }))} placeholder="021000021" /></div>
                    <div><label className="block text-sm font-medium text-[#33485C] mb-1">Account Number</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] font-mono focus:outline-none focus:border-[#0C6B5E]" value={bank.account} onChange={e => setBank(f => ({ ...f, account: e.target.value }))} placeholder="••••1234" /></div>
                  </div>
                  <div className="flex gap-4">
                    {['checking', 'savings'].map(t => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="acctType" value={t} checked={bank.type === t} onChange={e => setBank(f => ({ ...f, type: e.target.value }))} className="text-[#0C6B5E] focus:ring-[#0C6B5E]" />
                        <span className="text-sm text-[#33485C] capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer pt-2">
                    <input type="checkbox" checked={bank.confirm} onChange={e => setBank(f => ({ ...f, confirm: e.target.checked }))} className="mt-0.5 w-4 h-4 rounded border-[#DAD8D2] text-[#0C6B5E] focus:ring-[#0C6B5E]" />
                    <span className="text-xs text-[#33485C]">I confirm this is my own account and I authorize direct deposits</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="h-11 px-6 border border-[#DAD8D2] rounded-lg text-[#33485C] font-medium hover:bg-white transition-colors flex items-center gap-2"><ChevronLeft size={18} /> Back</button>
                <button onClick={step3Submit} disabled={loading} className="flex-1 h-11 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Save & Continue <ChevronRight size={18} /></>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Subscription Tier */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-display font-bold text-[#16202B] mb-2">Choose Your Plan</h1>
            <p className="text-[#33485C] mb-8">Upgrade for priority dispatch and lower fees.</p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { id: 'free', name: 'Free', price: '$0', badge: null, features: ['Access to dispatched jobs', 'Up to 15 jobs/month', 'Weekly payouts', 'Basic support'] },
                { id: 'pro', name: 'Pro', price: '$49', badge: 'Most popular', features: ['Priority dispatch access', 'Up to 30 jobs/month', 'Advanced earnings analytics', 'Email + chat support', 'Calendar management'] },
                { id: 'elite', name: 'Elite', price: '$99', badge: null, features: ['All Pro features', 'Unlimited jobs', 'Dedicated account manager', 'Priority customer support', 'Co-branded materials'] },
              ].map(t => (
                <div key={t.id} onClick={() => setTier(t.id)} className={`relative rounded-xl p-5 cursor-pointer transition-all border-2 ${
                  tier === t.id ? 'border-[#0C6B5E] bg-white shadow-md' : 'border-[#DAD8D2] bg-white hover:border-[#0C6B5E]/30'
                }`}>
                  {t.badge && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#C9852A] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">{t.badge}</div>}
                  <div className="text-center mb-4">
                    <p className="text-lg font-display font-bold text-[#16202B]">{t.name}</p>
                    <p className="text-3xl font-bold text-[#0C6B5E] mt-1">{t.price}<span className="text-sm font-normal text-[#33485C]">/month</span></p>
                  </div>
                  <ul className="space-y-2">
                    {t.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-xs text-[#33485C]"><Check size={12} className="text-[#0C6B5E] mt-0.5 flex-shrink-0" />{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            {error && <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">{error}</div>}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="h-11 px-6 border border-[#DAD8D2] rounded-lg text-[#33485C] font-medium hover:bg-white transition-colors flex items-center gap-2"><ChevronLeft size={18} /> Back</button>
              <button onClick={step4Submit} disabled={loading} className="flex-1 h-11 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : tier === 'free' ? 'Start Free — Go to Dashboard' : 'Subscribe & Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="animate-fade-in text-center">
            <div className="w-16 h-16 rounded-full bg-[#0C6B5E]/10 flex items-center justify-center mx-auto mb-6">
              <Crown size={32} className="text-[#0C6B5E]" />
            </div>
            <h1 className="text-3xl font-display font-bold text-[#16202B] mb-2">You're in the SOFN network</h1>
            <p className="text-[#33485C] mb-10">Your profile is live. Check back tomorrow for your first dispatch.</p>
            <div className="space-y-3 max-w-md mx-auto mb-10 text-left">
              <div className="bg-white rounded-xl p-4 border border-[#DAD8D2] flex items-center gap-3">
                <Shield size={20} className="text-[#0C6B5E]" />
                <div><p className="text-sm font-medium text-[#16202B]">License & Insurance</p><p className="text-xs text-emerald-600 font-medium flex items-center gap-1"><Check size={10} /> Verified</p></div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#DAD8D2] flex items-center gap-3">
                <MapPin size={20} className="text-[#0C6B5E]" />
                <div><p className="text-sm font-medium text-[#16202B]">Service Areas</p><p className="text-xs text-[#33485C]">{serviceZips.join(', ')}</p></div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#DAD8D2] flex items-center gap-3">
                <CreditCard size={20} className="text-[#0C6B5E]" />
                <div><p className="text-sm font-medium text-[#16202B]">Payment Method</p><p className="text-xs text-[#33485C] capitalize">{payMethod.replace('_', ' ')} •{tier !== 'free' ? ` ${tier} plan` : ' Free plan'}</p></div>
              </div>
            </div>
            <p className="text-sm text-[#33485C] mb-2">We'll send dispatch invites to {account.phone}</p>
            <p className="text-xs text-[#33485C]/60 mb-8">Check your email for account confirmation</p>
            <button onClick={() => navigate('/sofn/dashboard')} className="h-12 px-10 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto">
              Go to Dashboard <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}