import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../../components/Header'
import { SERVICES } from '../../data/mockData'
import { AlertTriangle, ChevronRight, ChevronLeft, Check, Clock, Zap, Shield, Upload } from 'lucide-react'

const STEPS = ['Service', 'Details', 'Review', 'Confirmed']
const PLATFORM_FEE = 0.12

export default function ServiceRequest() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [tier, setTier] = useState('standard')
  const [details, setDetails] = useState({ description: '', availability: 'today', address: '1420 Harbor Blvd, Costa Mesa, CA 92627' })
  const [loading, setLoading] = useState(false)

  const emergencyMode = params.get('emergency') === 'true'
  const displayServices = emergencyMode
    ? SERVICES.filter(s => s.emergency)
    : SERVICES

  const categories = [...new Set(displayServices.map(s => s.category))]

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(3) }, 1500)
  }

  const price = selected ? selected.tiers[tier] : 0
  const fee = Math.round(price * PLATFORM_FEE * 100) / 100
  const tax = Math.round(price * 0.0875 * 100) / 100
  const total = price + fee + tax

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Request Service" subtitle="Book a certified HVAC technician" />

      <div className="flex-1 p-6 max-w-2xl">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-400' : 'text-surface-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${i < step ? 'bg-brand-500 border-brand-500 text-white' : i === step ? 'border-brand-400 text-brand-400' : 'border-surface-700 text-surface-600'}`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-white' : ''}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-brand-500' : 'bg-surface-800'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 0: Select service */}
        {step === 0 && (
          <div className="space-y-6 animate-slide-up">
            {emergencyMode && (
              <div className="flex items-center gap-3 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                <AlertTriangle size={18} />
                <span><strong>Emergency Mode</strong> — Priority dispatch, higher pricing</span>
              </div>
            )}

            {categories.map(cat => (
              <div key={cat}>
                <p className="text-surface-400 text-xs font-semibold uppercase tracking-widest mb-2">{cat}</p>
                <div className="space-y-2">
                  {displayServices.filter(s => s.category === cat).map(service => (
                    <button
                      key={service.id}
                      onClick={() => { setSelected(service); setStep(1) }}
                      className={`w-full card-hover text-left flex items-center gap-4 ${service.emergency ? 'border-rose-500/30 bg-rose-500/5' : ''}`}
                    >
                      <div className="text-2xl">{service.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-sm">{service.name}</p>
                          {service.emergency && <span className="badge badge-red">URGENT</span>}
                        </div>
                        <p className="text-surface-400 text-xs">{service.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-brand-400 font-bold text-sm">from ${service.tiers.basic}</p>
                        <p className="text-surface-500 text-xs">3 tiers</p>
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
              <h3 className="section-title mb-1">{selected.icon} {selected.name}</h3>
              <p className="text-surface-400 text-sm">{selected.description}</p>
            </div>

            {/* Tier selection */}
            <div>
              <label className="label">Select Service Tier</label>
              <div className="grid grid-cols-3 gap-3">
                {['basic', 'standard', 'premium'].map(t => {
                  const tLabels = { basic: { label: 'Basic', icon: '⚡', sub: 'Essential service' }, standard: { label: 'Standard', icon: '⭐', sub: 'Most popular', popular: true }, premium: { label: 'Premium', icon: '💎', sub: 'Full service + warranty' } }
                  const tl = tLabels[t]
                  return (
                    <button
                      key={t}
                      onClick={() => setTier(t)}
                      className={`card p-4 text-center transition-all ${tier === t ? 'border-brand-500 bg-brand-500/10' : 'hover:border-white/20'}`}
                    >
                      {tl.popular && <div className="badge badge-blue mx-auto mb-2">Popular</div>}
                      <div className="text-2xl mb-1">{tl.icon}</div>
                      <p className="text-white font-semibold text-sm">{tl.label}</p>
                      <p className="text-brand-400 font-bold text-lg">${selected.tiers[t]}</p>
                      <p className="text-surface-500 text-xs mt-0.5">{tl.sub}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Job details */}
            <div className="space-y-4">
              <div>
                <label className="label">Service Address</label>
                <input className="input" value={details.address} onChange={e => setDetails({...details, address: e.target.value})} />
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
              <div>
                <label className="label">Photos (optional)</label>
                <div className="border border-dashed border-white/[15%] rounded-xl p-6 text-center hover:border-brand-500/40 transition-colors cursor-pointer">
                  <Upload size={20} className="text-surface-500 mx-auto mb-2" />
                  <p className="text-surface-400 text-sm">Click to upload photos</p>
                  <p className="text-surface-600 text-xs mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn-secondary flex-1">
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(2)} className="btn-primary flex-2">
                Review Order <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && selected && (
          <div className="space-y-5 animate-slide-up">
            <div className="card space-y-3">
              <h3 className="font-bold text-white">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-400">{selected.name} ({tier})</span>
                  <span className="text-white font-medium">${price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Platform fee (12%)</span>
                  <span className="text-white">${fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">CA Sales Tax (8.75%)</span>
                  <span className="text-white">${tax}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-brand-400 text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="card space-y-2 text-sm">
              <h3 className="font-bold text-white mb-3">Job Details</h3>
              <div className="flex justify-between"><span className="text-surface-400">Address</span><span className="text-white text-right max-w-[60%]">{details.address}</span></div>
              <div className="flex justify-between"><span className="text-surface-400">Availability</span><span className="text-white">{details.availability.replace('_', ' ')}</span></div>
            </div>

            <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Shield size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-amber-300 text-xs leading-relaxed">Payment is held in secure escrow and only released to the technician after you confirm the job is complete.</p>
            </div>

            <div className="card space-y-2 text-sm">
              <p className="text-surface-400">Payment method</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                <span className="text-white">•••• 4242</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Submit & Pay ${total.toFixed(2)} <ChevronRight size={16} /></>}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmed */}
        {step === 3 && (
          <div className="text-center py-10 animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Job Posted!</h2>
            <p className="text-surface-400 mb-6">Your request has been broadcast to all certified techs in your area. You'll get a notification when someone accepts.</p>
            <div className="card text-left space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Zap size={16} className="text-amber-400" />
                <span className="text-surface-300">Broadcast to 12 nearby techs</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-brand-400" />
                <span className="text-surface-300">Average acceptance time: ~4 minutes</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={16} className="text-emerald-400" />
                <span className="text-surface-300">${total.toFixed(2)} secured in escrow</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/customer/track')} className="btn-primary flex-1">
                Track Job
              </button>
              <button onClick={() => { setStep(0); setSelected(null) }} className="btn-secondary flex-1">
                New Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
