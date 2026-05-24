import React, { useState } from 'react'
import Header from '../../components/Header'
import { TECH_SUBSCRIPTION_TIERS } from '../../data/mockData'
import { Check, Zap, Shield, Star, TrendingUp, ChevronRight, Crown, Award } from 'lucide-react'

const TIER_STYLES = {
  free:  { ring: 'border-surface-200',          bg: 'from-navy-800/60 to-navy-900',   icon: Shield,  iconColor: 'text-surface-400', iconBg: 'bg-surface-700' },
  pro:   { ring: 'border-brand-500/50',       bg: 'from-brand-900/40 to-navy-900',     icon: Zap,     iconColor: 'text-brand-400',   iconBg: 'bg-brand-500/20' },
  elite: { ring: 'border-accent-500/50',      bg: 'from-accent-900/40 to-navy-900',    icon: Crown,   iconColor: 'text-accent-400',  iconBg: 'bg-accent-500/20' },
}

// Breakeven calculator: at what monthly job volume does upgrading pay for itself?
function Breakeven({ current, upgrade }) {
  const cur  = TECH_SUBSCRIPTION_TIERS[current]
  const up   = TECH_SUBSCRIPTION_TIERS[upgrade]
  if (!up || up.price === 0) return null
  const avgJob = 220 // average gross job value
  const savingsPerJob = (cur.platformFee - up.platformFee) * avgJob
  const breakevenJobs = Math.ceil(up.price / savingsPerJob)
  return (
    <div className="mt-3 p-3 rounded-xl bg-white/5 border border-surface-200 text-xs text-surface-400 leading-relaxed">
      <span className="text-white font-semibold">Break-even:</span> At avg $220/job, upgrading pays for itself after just{' '}
      <span className="text-emerald-400 font-bold">{breakevenJobs} jobs</span>. Every job after that is pure savings.
    </div>
  )
}

export default function TechSubscription() {
  // Demo: Marcus Rivera is on Elite
  const [currentPlan, setCurrentPlan] = useState('elite')
  const [confirmTier, setConfirmTier] = useState(null)
  const [upgraded, setUpgraded] = useState(false)

  const handleSelect = (tierId) => {
    if (tierId === currentPlan) return
    setConfirmTier(tierId)
  }

  const handleConfirm = () => {
    setCurrentPlan(confirmTier)
    setConfirmTier(null)
    setUpgraded(true)
    setTimeout(() => setUpgraded(false), 3000)
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Subscription Plan" subtitle="More jobs. Lower fees. Your choice." />

      <div className="flex-1 p-6 max-w-4xl space-y-6">

        {/* Success toast */}
        {upgraded && (
          <div className="rounded-2xl bg-emerald-500/20 border border-emerald-500/40 px-5 py-4 flex items-center gap-3">
            <Check size={20} className="text-emerald-400 flex-shrink-0" />
            <p className="text-white font-semibold">Plan updated! Your new fee rate applies starting on your next job.</p>
          </div>
        )}

        {/* Current plan callout */}
        <div className="rounded-2xl bg-gradient-to-r from-accent-900/30 to-navy-900 border border-accent-500/30 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-500/20 flex items-center justify-center flex-shrink-0">
            <Crown size={24} className="text-accent-400" />
          </div>
          <div className="flex-1">
            <p className="text-surface-400 text-sm">Your Current Plan</p>
            <p className="text-white text-xl font-extrabold">{TECH_SUBSCRIPTION_TIERS[currentPlan].name}</p>
            <p className="text-surface-400 text-sm">
              Platform fee: <span className="text-emerald-400 font-bold">{TECH_SUBSCRIPTION_TIERS[currentPlan].platformFee * 100}%</span>
              {TECH_SUBSCRIPTION_TIERS[currentPlan].price > 0 && <span className="ml-2 text-surface-500">· ${TECH_SUBSCRIPTION_TIERS[currentPlan].price}/mo</span>}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-surface-500 text-xs">vs. Standard (15%)</p>
            <p className="text-emerald-400 font-bold text-lg">
              -{((0.15 - TECH_SUBSCRIPTION_TIERS[currentPlan].platformFee) * 100).toFixed(0)}% fee
            </p>
            <p className="text-surface-600 text-xs">saved per job</p>
          </div>
        </div>

        {/* Savings impact banner */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Standard Fee', value: '15%', sub: '0 jobs/mo advantage', color: 'text-surface-400' },
            { label: 'Pro Fee', value: '11%', sub: 'Save $8.80 per $220 job', color: 'text-brand-400' },
            { label: 'Elite Fee', value: '8%', sub: 'Save $15.40 per $220 job', color: 'text-accent-400' },
          ].map(s => (
            <div key={s.label} className="stat-card text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-white text-sm font-medium">{s.label}</p>
              <p className="text-surface-500 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(TECH_SUBSCRIPTION_TIERS).map(([key, tier]) => {
            const style = TIER_STYLES[key]
            const Icon = style.icon
            const isActive = currentPlan === key
            return (
              <div
                key={key}
                className={`relative rounded-2xl border-2 bg-gradient-to-b ${style.bg} ${isActive ? style.ring + ' ring-2 ring-offset-0' : 'border-surface-200'} p-5 flex flex-col transition-all`}
                style={isActive ? { boxShadow: '0 0 0 2px rgba(255,255,255,0.08)' } : {}}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-500 to-brand-500 text-surface-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                    {tier.badge}
                  </div>
                )}

                {isActive && (
                  <div className="absolute top-3 right-3">
                    <span className="badge badge-green text-xs">Active</span>
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center mb-3`}>
                  <Icon size={20} className={style.iconColor} />
                </div>

                <p className="text-white text-lg font-extrabold">{tier.name}</p>
                <div className="flex items-baseline gap-1 mt-1 mb-4">
                  {tier.price === 0 ? (
                    <p className="text-surface-400 text-2xl font-bold">Free</p>
                  ) : (
                    <>
                      <p className="text-white text-3xl font-extrabold">${tier.price}</p>
                      <p className="text-surface-500 text-sm">/mo</p>
                    </>
                  )}
                </div>

                {/* Fee highlight */}
                <div className={`rounded-xl px-3 py-2 mb-4 ${key === 'elite' ? 'bg-accent-500/15 border border-accent-500/30' : key === 'pro' ? 'bg-brand-500/15 border border-brand-500/30' : 'bg-surface-150 border border-surface-200'}`}>
                  <p className="text-surface-400 text-xs">Platform fee per job</p>
                  <p className={`text-xl font-extrabold ${style.iconColor}`}>{tier.platformFee * 100}%</p>
                  {tier.price > 0 && (
                    <p className="text-surface-500 text-xs mt-0.5">
                      vs 15% Standard · save {((0.15 - tier.platformFee) * 100).toFixed(0)}% per job
                    </p>
                  )}
                </div>

                {/* Perks */}
                <ul className="space-y-2 flex-1">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={14} className={`${style.iconColor} flex-shrink-0 mt-0.5`} />
                      <span className={key === 'free' ? 'text-surface-400' : 'text-surface-300'}>{perk}</span>
                    </li>
                  ))}
                </ul>

                {/* Breakeven hint */}
                {!isActive && key !== 'free' && <Breakeven current={currentPlan === 'free' ? 'free' : currentPlan} upgrade={key} />}

                <button
                  onClick={() => handleSelect(key)}
                  disabled={isActive}
                  className={`mt-5 w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-surface-700 text-surface-400 cursor-default'
                      : key === 'elite'
                      ? 'bg-accent-500 hover:bg-accent-600 text-surface-900 active:scale-[0.98]'
                      : key === 'pro'
                      ? 'bg-brand-500 hover:bg-brand-600 text-surface-900 active:scale-[0.98]'
                      : 'btn-secondary'
                  }`}
                >
                  {isActive ? 'Current Plan' : key === 'free' ? 'Downgrade to Free' : `Upgrade to ${tier.name}`}
                  {!isActive && <ChevronRight size={15} />}
                </button>
              </div>
            )
          })}
        </div>

        {/* ROI calculator */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="section-title">Annual Savings Calculator</h3>
              <p className="section-sub">How much Elite saves vs Standard at different job volumes</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left pb-3 text-surface-500 font-medium">Jobs/Month</th>
                  <th className="text-right pb-3 text-surface-500 font-medium">Avg Job Value</th>
                  <th className="text-right pb-3 text-surface-500 font-medium">Standard (15%)</th>
                  <th className="text-right pb-3 text-surface-500 font-medium">Pro (11%) — $49/mo</th>
                  <th className="text-right pb-3 text-surface-500 font-medium">Elite (8%) — $99/mo</th>
                  <th className="text-right pb-3 text-emerald-400 font-medium">Elite Net Savings</th>
                </tr>
              </thead>
              <tbody>
                {[10, 20, 30, 50, 80].map(jobs => {
                  const avg = 220
                  const gross = jobs * avg
                  const stdFee = gross * 0.15
                  const proFee  = gross * 0.11 + 49
                  const eliteFee = gross * 0.08 + 99
                  const eliteSavings = stdFee - eliteFee
                  return (
                    <tr key={jobs} className="border-b border-surface-150 hover:bg-white/5 transition-colors">
                      <td className="py-3 text-surface-900 font-medium">{jobs} jobs</td>
                      <td className="py-3 text-right text-surface-400">${avg}</td>
                      <td className="py-3 text-right text-rose-400 font-medium">−${stdFee.toLocaleString()}</td>
                      <td className="py-3 text-right text-brand-400 font-medium">−${proFee.toFixed(0)}</td>
                      <td className="py-3 text-right text-accent-400 font-medium">−${eliteFee.toFixed(0)}</td>
                      <td className="py-3 text-right font-bold">
                        <span className={eliteSavings > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {eliteSavings > 0 ? '+' : ''}${eliteSavings.toFixed(0)}/mo
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-surface-600 text-xs mt-3">* Based on avg job gross of $220. Actual savings vary by job mix.</p>
        </div>

        {/* FAQ */}
        <div className="card space-y-4">
          <h3 className="section-title">Common Questions</h3>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes. Downgrade or cancel at any time from this page. Your fee rate returns to 15% at the next billing cycle.' },
            { q: 'Does the subscription fee come out of my earnings?', a: 'No. The monthly fee is a separate charge to your payment method on file. It does not reduce your job payouts.' },
            { q: 'When does the lower fee rate take effect?', a: 'Immediately after upgrading. Your very next job is billed at the new rate.' },
            { q: 'What does "Priority Dispatch" mean?', a: 'When a new job is posted in your area, Pro and Elite techs see it first and have a 60-second head start before Standard techs.' },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-surface-150 pb-4 last:border-0 last:pb-0">
              <p className="text-white font-semibold text-sm mb-1">{q}</p>
              <p className="text-surface-400 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm modal */}
      {confirmTier && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-sm w-full">
            <div className={`w-14 h-14 rounded-2xl ${TIER_STYLES[confirmTier].iconBg} flex items-center justify-center mx-auto mb-4`}>
              {React.createElement(TIER_STYLES[confirmTier].icon, { size: 28, className: TIER_STYLES[confirmTier].iconColor })}
            </div>
            <h3 className="text-white font-extrabold text-xl text-center mb-1">
              {TECH_SUBSCRIPTION_TIERS[confirmTier].name === 'Standard' ? 'Downgrade to Standard' : `Upgrade to ${TECH_SUBSCRIPTION_TIERS[confirmTier].name}`}
            </h3>
            <p className="text-surface-400 text-sm text-center mb-5">
              {TECH_SUBSCRIPTION_TIERS[confirmTier].price > 0
                ? `$${TECH_SUBSCRIPTION_TIERS[confirmTier].price}/month · ${TECH_SUBSCRIPTION_TIERS[confirmTier].platformFee * 100}% platform fee`
                : `Free · 15% platform fee`}
            </p>
            <div className="bg-surface-100 rounded-xl p-4 mb-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-400">New fee rate</span>
                <span className="text-emerald-400 font-bold">{TECH_SUBSCRIPTION_TIERS[confirmTier].platformFee * 100}% per job</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Monthly charge</span>
                <span className="text-white font-medium">${TECH_SUBSCRIPTION_TIERS[confirmTier].price}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Effective</span>
                <span className="text-white font-medium">Immediately</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmTier(null)} className="btn-secondary flex-1 py-3">Cancel</button>
              <button onClick={handleConfirm} className="btn-primary flex-1 py-3">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
