import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Header from '../../components/Header'
import { SERVICES } from '../../data/mockData'
import { jobs as jobsApi } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { AlertTriangle, ChevronRight, ChevronLeft, Check, Clock, Zap, Shield, Lock } from 'lucide-react'

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51TW6E8CTW1Fm7kzI5f8nM8czOFTl5ZvpZ57TQKN9iSqloGZXFngoZEuKDs54rBZQFjxuXgX0arm2TZXbnV3BzIJf00bQOPrBwE'
)

const CARD_STYLE = {
  style: {
    base: { color: '#0f1826', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px', '::placeholder': { color: '#8e97ab' } },
    invalid: { color: '#f43f5e' },
  },
}

const STEPS = ['Service', 'Details', 'Payment', 'Confirmed']
const PLATFORM_FEE = 0.12

function PaymentForm({ onSuccess, total, loading, setLoading, jobData }) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const [cardError, setCardError] = useState('')
  const isLive = !!import.meta.env.VITE_API_URL

  const handlePay = async () => {
    setCardError('')
    setLoading(true)
    try {
      if (isLive) {
        const { job, clientSecret } = await jobsApi.create(jobData)
        const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement), billing_details: { name: user?.name, email: user?.email } },
        })
        if (stripeErr) { setCardError(stripeErr.message); setLoading(false); return }
        if (paymentIntent.status === 'requires_capture') onSuccess(job)
      } else {
        await new Promise(r => setTimeout(r, 1500))
        onSuccess({ id: 'demo-' + Date.now(), ...jobData })
      }
    } catch (err) {
      setCardError(err.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-surface-900 text-sm">Card Details</h3>
          <div className="flex items-center gap-1.5 text-surface-400 text-xs"><Lock size={11} /> Secured by Stripe</div>
        </div>
        <div className="border border-surface-200 rounded-xl px-4 py-3.5 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
          <CardElement options={CARD_STYLE} />
        </div>
        {!isLive && (
          <p className="text-xs text-surface-500 bg-surface-100 rounded-lg px-3 py-2">
            Demo mode — use <strong>4242 4242 4242 4242</strong>, any future expiry &amp; CVC
          </p>
        )}
        {cardError && <p className="text-rose-500 text-sm flex items-center gap-2"><AlertTriangle size={14} /> {cardError}</p>}
      </div>
      <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
        <Shield size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-amber-700 text-xs leading-relaxed">Your card is <strong>authorized but not charged</strong> until you confirm the job is complete. Funds are held in secure escrow.</p>
      </div>
      <button onClick={handlePay} disabled={loading || !stripe} className="btn-primary w-full disabled:opacity-50">
        {loading
          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><Lock size={15} /> Authorize ${total.toFixed(2)} in Escrow <ChevronRight size={16} /></>
        }
      </button>
    </div>
  )
}

export default function ServiceRequest() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [tier, setTier] = useState('standard')
  const [details, setDetails] = useState({ description: '', availability: 'today', address: '' })
  const [loading, setLoading] = useState(false)

  const emergencyMode = params.get('emergency') === 'true'
  const displayServices = emergencyMode ? SERVICES.filter(s => s.emergency) : SERVICES
  const categories = [...new Set(displayServices.map(s => s.category))]

  const price = selected ? selected.tiers[tier] : 0
  const fee = Math.round(price * PLATFORM_FEE * 100) / 100
  const total = price + fee

  const addressParts = details.address.split(',').map(s => s.trim())
  const jobData = {
    service_id: selected?.id,
    service_name: selected?.name,
    tier, price: total,
    address_street: addressParts[0] || details.address,
    address_city: addressParts[1] || 'Unknown',
    address_state: addressParts[2] || 'MD',
    address_zip: addressParts[3] || '',
    notes: details.description,
    urgent: emergencyMode,
  }

  const handleJobConfirmed = (job) => { setLoading(false); setStep(3) }

  return (
    <div className="flex flex-col h-full overflow-auto bg-surface-100">
      <Header title="Request Service" subtitle="Book a certified HVAC technician" />
      <div className="flex-1 p-6 max-w-2xl">

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-500' : 'text-surface-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i < step ? 'bg-brand-500 border-brand-500 text-white'
                  : i === step ? 'border-brand-500 text-brand-600 bg-brand-50'
                  : 'border-surface-200 text-surface-400'
                }`}>
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-surface-900' : 'text-surface-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-brand-400' : 'bg-surface-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 0: Select service */}
        {step === 0 && (
          <div className="space-y-6 animate-slide-up">
            {emergencyMode && (
              <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                <AlertTriangle size={18} /><span><strong>Emergency Mode</strong> — Priority dispatch, higher pricing</span>
              </div>
            )}
            {categories.map(cat => (
              <div key={cat}>
                <p className="text-surface-400 text-xs font-bold uppercase tracking-widest mb-2">{cat}</p>
                <div className="space-y-2">
                  {displayServices.filter(s => s.category === cat).map(service => (
                    <button key={service.id} onClick={() => { setSelected(service); setStep(1) }}
                      className={`w-full card-hover text-left flex items-center gap-4 ${service.emergency ? 'border-rose-200 bg-rose-50 hover:border-rose-300' : ''}`}>
                      <div className="text-2xl">{service.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-surface-900 font-semibold text-sm">{service.name}</p>
                          {service.emergency && <span className="badge badge-red">URGENT</span>}
                        </div>
                        <p className="text-surface-400 text-xs">{service.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-brand-500 font-bold text-sm">from ${service.tiers.basic}</p>
                        <p className="text-surface-400 text-xs">3 tiers</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Tier + details */}
        {step === 1 && selected && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h3 className="text-lg font-bold text-surface-900 mb-1">{selected.icon} {selected.name}</h3>
              <p className="text-surface-500 text-sm">{selected.description}</p>
            </div>
            <div>
              <label className="label">Select Service Tier</label>
              <div className="grid grid-cols-3 gap-3">
                {['basic','standard','premium'].map(t => {
                  const tl = { basic:{label:'Basic',icon:'⚡',sub:'Essential service'}, standard:{label:'Standard',icon:'⭐',sub:'Most popular',popular:true}, premium:{label:'Premium',icon:'💎',sub:'Full service + warranty'} }[t]
                  return (
                    <button key={t} onClick={() => setTier(t)}
                      className={`card p-4 text-center transition-all ${tier===t ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20' : 'hover:border-surface-300'}`}>
                      {tl.popular && <div className="badge badge-blue mx-auto mb-2">Popular</div>}
                      <div className="text-2xl mb-1">{tl.icon}</div>
                      <p className="text-surface-900 font-semibold text-sm">{tl.label}</p>
                      <p className="text-brand-500 font-bold text-lg">${selected.tiers[t]}</p>
                      <p className="text-surface-400 text-xs mt-0.5">{tl.sub}</p>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Service Address</label>
                <input className="input" placeholder="123 Main St, Annapolis, MD 21401" value={details.address} onChange={e => setDetails({...details, address: e.target.value})} />
              </div>
              <div>
                <label className="label">Describe the issue</label>
                <textarea className="input h-24 resize-none" placeholder="e.g. Furnace making loud banging noise, doesn't heat properly…" value={details.description} onChange={e => setDetails({...details, description: e.target.value})} />
              </div>
              <div>
                <label className="label">Preferred Availability</label>
                <select className="input" value={details.availability} onChange={e => setDetails({...details, availability: e.target.value})}>
                  <option value="today">Today (ASAP)</option>
                  <option value="tomorrow_am">Tomorrow Morning</option>
                  <option value="tomorrow_pm">Tomorrow Afternoon</option>
                  <option value="this_week">This Week</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn-secondary flex-1"><ChevronLeft size={16} /> Back</button>
              <button onClick={() => setStep(2)} disabled={!details.address.trim()} className="btn-primary flex-1 disabled:opacity-50">Review & Pay <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && selected && (
          <div className="space-y-5 animate-slide-up">
            <div className="card space-y-3">
              <h3 className="font-bold text-surface-900">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-surface-500">{selected.name} ({tier})</span><span className="text-surface-900 font-medium">${price}</span></div>
                <div className="flex justify-between"><span className="text-surface-500">Platform fee (12%)</span><span className="text-surface-900">${fee}</span></div>
                <div className="border-t border-surface-200 pt-2 flex justify-between font-bold">
                  <span className="text-surface-900">Total Authorized</span>
                  <span className="text-brand-500 text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="card space-y-2 text-sm">
              <h3 className="font-bold text-surface-900 mb-2">Job Details</h3>
              <div className="flex justify-between gap-4"><span className="text-surface-500">Address</span><span className="text-surface-900 text-right">{details.address}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Availability</span><span className="text-surface-900 capitalize">{details.availability.replace(/_/g,' ')}</span></div>
            </div>
            <Elements stripe={stripePromise}>
              <PaymentForm onSuccess={handleJobConfirmed} total={total} loading={loading} setLoading={setLoading} jobData={jobData} />
            </Elements>
            <button onClick={() => setStep(1)} className="btn-secondary w-full"><ChevronLeft size={16} /> Back</button>
          </div>
        )}

        {/* Step 3: Confirmed */}
        {step === 3 && (
          <div className="text-center py-10 animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-surface-900 mb-2">Job Posted!</h2>
            <p className="text-surface-500 mb-6">Your request has been broadcast to certified techs in your area. You'll get notified when someone accepts.</p>
            <div className="card text-left space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm"><Zap size={16} className="text-amber-500" /><span className="text-surface-700">Broadcast to nearby techs</span></div>
              <div className="flex items-center gap-3 text-sm"><Clock size={16} className="text-brand-500" /><span className="text-surface-700">Average acceptance time: ~4 minutes</span></div>
              <div className="flex items-center gap-3 text-sm"><Shield size={16} className="text-emerald-500" /><span className="text-surface-700">${total.toFixed(2)} secured in escrow</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/customer/track')} className="btn-primary flex-1">Track Job</button>
              <button onClick={() => { setStep(0); setSelected(null) }} className="btn-secondary flex-1">New Request</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
