import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { MOCK_JOBS, MOCK_TECHS, TECH_SUBSCRIPTION_TIERS } from '../../data/mockData'
import { DollarSign, TrendingUp, Download, CreditCard, Crown, ChevronRight, Zap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// Marcus Rivera is the demo tech
const demoTech = MOCK_TECHS[0]
const subTier = TECH_SUBSCRIPTION_TIERS[demoTech.subscription]

const monthlyData = [
  { month: 'Jan', gross: 3200, net: 2720 }, { month: 'Feb', gross: 4100, net: 3485 },
  { month: 'Mar', gross: 5800, net: 4930 }, { month: 'Apr', gross: 6200, net: 5270 },
  { month: 'May', gross: 2650, net: 2252 },
]

const completedJobs = MOCK_JOBS.filter(j => j.status === 'completed')

export default function TechEarnings() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('month')
  const feeRate = subTier.platformFee
  const feePct  = (feeRate * 100).toFixed(0)

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Earnings" subtitle="Your payouts & financial overview" />

      <div className="flex-1 p-6 space-y-6 max-w-4xl">

        {/* Subscription plan banner */}
        <div
          onClick={() => navigate('/tech/subscription')}
          className="cursor-pointer rounded-2xl border border-accent-500/40 bg-gradient-to-r from-accent-900/30 to-surface-900 hover:border-accent-400 transition-all flex items-center gap-4 px-5 py-4"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center flex-shrink-0">
            <Crown size={20} className="text-accent-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-white font-bold">{subTier.name} Plan</p>
              <span className="badge badge-purple">{feePct}% fee</span>
            </div>
            <p className="text-surface-400 text-xs">
              You save {(15 - Number(feePct))}% vs Standard on every job
              {subTier.price > 0 && ` · $${subTier.price}/mo`}
            </p>
          </div>
          <div className="flex items-center gap-1 text-accent-400 text-sm font-medium flex-shrink-0">
            Manage <ChevronRight size={15} />
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Gross YTD', value: '$50,462', sub: 'Before fees', color: 'text-white' },
            { label: 'Net YTD', value: '$42,850', sub: `After ${feePct}% fee`, color: 'text-emerald-400' },
            { label: 'Pending', value: '$126.65', sub: '1 job settling', color: 'text-amber-400' },
            { label: 'Paid Out', value: '$42,723', sub: 'All time', color: 'text-brand-400' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-surface-300 text-sm font-medium">{s.label}</p>
              <p className="text-surface-500 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Monthly Earnings</h3>
              <p className="section-sub">Gross vs Net (after platform fees)</p>
            </div>
            <button className="btn-secondary py-2 text-xs">
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={4}>
                <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="gross" fill="#334155" radius={[6, 6, 0, 0]} name="Gross" />
                <Bar dataKey="net" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Net" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payout info */}
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
            <CreditCard size={22} className="text-brand-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Bank Account ••••7892</p>
            <p className="text-surface-400 text-sm">Chase Bank · Standard payout (2–3 business days)</p>
          </div>
          <button className="btn-secondary text-sm py-2">Update</button>
        </div>

        {/* Transaction history */}
        <div>
          <h3 className="section-title mb-3">Transaction History</h3>
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 text-surface-400 font-medium">Service</th>
                  <th className="text-left px-5 py-3 text-surface-400 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-surface-400 font-medium">Gross</th>
                  <th className="text-right px-5 py-3 text-surface-400 font-medium">Fee</th>
                  <th className="text-right px-5 py-3 text-surface-400 font-medium text-emerald-400">Net</th>
                </tr>
              </thead>
              <tbody>
                {completedJobs.map((job, i) => (
                  <tr key={job.id} className={`${i < completedJobs.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}>
                    <td className="px-5 py-3 text-white font-medium">{job.service}</td>
                    <td className="px-5 py-3 text-surface-400 hidden sm:table-cell">{job.date}</td>
                    <td className="px-5 py-3 text-right text-white">${job.price}</td>
                    <td className="px-5 py-3 text-right text-rose-400">-${job.techFee}</td>
                    <td className="px-5 py-3 text-right text-emerald-400 font-bold">${job.netPay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
