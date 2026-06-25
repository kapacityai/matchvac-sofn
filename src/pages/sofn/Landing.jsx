import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SofnLogo } from '../../components/sofn/Logo'
import { Shield, Zap, MapPin, CreditCard, Wrench, ArrowRight, Check, ChevronRight } from 'lucide-react'

const FEATURES = [
  { icon: Wrench, title: 'Service Dispatch', desc: 'Get matched with homeowners who need your skills — tune-ups, repairs, and emergency service.' },
  { icon: MapPin, title: 'GPS Routing', desc: 'Jobs filtered by your service ZIPs and sorted by proximity. Less driving, more earning.' },
  { icon: Shield, title: 'Verified Payments', desc: 'Escrow-protected payouts. Stripe direct deposit every Tuesday — no chasing invoices.' },
  { icon: CreditCard, title: 'Flexible Payouts', desc: 'Choose hourly, flat fee, or commission. Upgrade for priority dispatch and lower platform fees.' },
]

export default function SofnLanding() {
  useEffect(() => { document.body.classList.add('sofn-body'); return () => document.body.classList.remove('sofn-body') }, [])
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F4F3EF]">
      {/* Header */}
      <header className="bg-white border-b border-[#DAD8D2] px-6 py-4 flex items-center justify-center">
        <SofnLogo size="sm" />
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="flex items-center justify-center mx-auto mb-8">
          <SofnLogo size="xl" className="!h-32 md:!h-56" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-[#16202B] mb-4 leading-tight">
          Service-Obligation<br />
          <span className="text-[#0C6B5E]">Fulfillment Network</span>
        </h1>
        <p className="text-lg text-[#33485C] max-w-2xl mx-auto mb-10">
          SOFN connects certified HVAC technicians with service dispatches from lenders, lessors, and homeowners.
          <span className="block mt-2 font-semibold text-[#0C6B5E]">You do the work. We handle the rest.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/sofn/register')} className="h-12 px-8 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm">
            Sign Up as a Technician <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/sofn/dashboard')} className="h-12 px-8 border border-[#DAD8D2] bg-white hover:bg-white text-[#33485C] font-semibold rounded-lg transition-colors text-sm">
            Tech Dashboard Login
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-t border-[#DAD8D2] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-[#16202B] text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Sign Up', desc: 'Create your account, upload credentials, set service areas.' },
              { num: '02', title: 'Get Dispatched', desc: 'Available jobs appear in your dashboard. Accept the ones you want.' },
              { num: '03', title: 'Complete Work', desc: 'Arrive on site, do the job, upload photos as proof.' },
              { num: '04', title: 'Get Paid', desc: 'Customer confirms, payment released. Weekly direct deposits.' },
            ].map(s => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#0C6B5E]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0C6B5E] font-bold text-sm">{s.num}</span>
                </div>
                <h3 className="font-bold text-[#16202B] text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-[#33485C]/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-white rounded-xl border border-[#DAD8D2] p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#0C6B5E]/10 flex items-center justify-center flex-shrink-0">
                <f.icon size={24} className="text-[#0C6B5E]" />
              </div>
              <div>
                <h3 className="font-bold text-[#16202B] mb-1">{f.title}</h3>
                <p className="text-sm text-[#33485C]/70">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-white border-t border-[#DAD8D2] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-[#16202B] text-center mb-4">Choose Your Tier</h2>
          <p className="text-[#33485C] text-center mb-10">Start free. Upgrade for priority dispatch and lower fees.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', badge: null, features: ['Access to dispatched jobs', 'Up to 15 jobs/month', 'Weekly payouts', 'Basic support'], cta: 'Start Free' },
              { name: 'Pro', price: '$49', badge: 'Most popular', features: ['Priority dispatch access', 'Up to 30 jobs/month', 'Advanced earnings analytics', 'Email + chat support', 'Calendar management'], cta: 'Upgrade to Pro' },
              { name: 'Elite', price: '$99', badge: null, features: ['All Pro features', 'Unlimited jobs', 'Dedicated account manager', 'Priority customer support', 'Co-branded materials'], cta: 'Upgrade to Elite' },
            ].map(t => (
              <div key={t.name} className={`relative rounded-xl p-6 border-2 ${t.badge ? 'border-[#0C6B5E]' : 'border-[#DAD8D2]'} bg-white`}>
                {t.badge && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#C9852A] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">{t.badge}</div>}
                <div className="text-center mb-4">
                  <p className="text-lg font-display font-bold text-[#16202B]">{t.name}</p>
                  <p className="text-3xl font-bold text-[#0C6B5E] mt-1">{t.price}<span className="text-sm font-normal text-[#33485C]">/month</span></p>
                </div>
                <ul className="space-y-2 mb-6">
                  {t.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-xs text-[#33485C]"><Check size={12} className="text-[#0C6B5E] mt-0.5 flex-shrink-0" />{f}</li>)}
                </ul>
                <button className="w-full h-10 bg-[#0C6B5E] hover:bg-[#094A40] text-white text-sm font-semibold rounded-lg transition-colors">{t.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-bold text-[#16202B] mb-4">Ready to Start Accepting Dispatches?</h2>
        <p className="text-[#33485C] mb-8">Join the network that connects certified techs with guaranteed work.</p>
        <button onClick={() => navigate('/sofn/register')} className="h-12 px-10 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto text-sm">
          Get Started <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DAD8D2] px-6 py-6 text-center">
        <p className="text-xs text-[#33485C]/50">
          SOFN — Service-Obligation Fulfillment Network. A MatcHvac platform.
        </p>
      </footer>
    </div>
  )
}