import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { MOCK_JOBS, MOCK_TECHS, TECH_SUBSCRIPTION_TIERS } from '../../data/mockData'
import { DollarSign, Download, CreditCard, Crown, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// ── Demo tech: Marcus Rivera on Elite (8%) ───────────────────────────────────
const demoTech = MOCK_TECHS[0]
const subTier  = TECH_SUBSCRIPTION_TIERS[demoTech.subscription]  // elite
const feeRate  = subTier.platformFee                              // 0.08
const feePct   = (feeRate * 100).toFixed(0)                       // "8"

// ── Recalculate every job fee at the tech's actual subscription rate ──────────
const allTechJobs = MOCK_JOBS
  .filter(j => j.tech === demoTech.name)
  .map(j => {
    const fee = parseFloat((j.price * feeRate).toFixed(2))
    const net = parseFloat((j.price - fee).toFixed(2))
    return { ...j, calcFee: fee, calcNet: net }
  })

const completedJobs = allTechJobs.filter(j => j.status === 'completed')
const pendingJobs   = allTechJobs.filter(j => j.status === 'in_progress')

// ── Derived totals ────────────────────────────────────────────────────────────
const totalGross    = completedJobs.reduce((s, j) => s + j.price, 0)
const totalFees     = completedJobs.reduce((s, j) => s + j.calcFee, 0)
const totalNet      = completedJobs.reduce((s, j) => s + j.calcNet, 0)
const pendingNet    = pendingJobs.reduce((s, j) => s + j.calcNet, 0)

// ── Monthly chart — net recalculated at 8% ───────────────────────────────────
const monthlyData = [
  { month: 'Jan', gross: 3200, fee: +(3200 * feeRate).toFixed(0), net: +(3200 * (1 - feeRate)).toFixed(0) },
  { month: 'Feb', gross: 4100, fee: +(4100 * feeRate).toFixed(0), net: +(4100 * (1 - feeRate)).toFixed(0) },
  { month: 'Mar', gross: 5800, fee: +(5800 * feeRate).toFixed(0), net: +(5800 * (1 - feeRate)).toFixed(0) },
  { month: 'Apr', gross: 6200, fee: +(6200 * feeRate).toFixed(0), net: +(6200 * (1 - feeRate)).toFixed(0) },
  { month: 'May', gross: totalGross, fee: +totalFees.toFixed(0),  net: +totalNet.toFixed(0) },
]
const ytdGross = monthlyData.reduce((s, m) => s + m.gross, 0)
const ytdNet   = monthlyData.reduce((s, m) => s + m.net, 0)

export default function TechEarnings() {
  const navigate = useNavigate()

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
              <span className="badge badge-purple">{feePct}% platform fee</span>
            </div>
            <p className="text-surface-400 text-xs">
              Saving {15 - Number(feePct)}% vs Standard on every job · ${subTier.price}/mo
            </p>
          </div>
          <div className="flex items-center gap-1 text-accent-400 text-sm font-medium flex-shrink-0">
            Manage <ChevronRight size={15} />
          </div>
        </div>

        {/* Summary KPI cards — all calculated live */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Gross YTD',   value: `$${ytdGross.toLocaleString()}`,          sub: 'Before fees',              color: 'text-white' },
            { label: 'Net YTD',     value: `$${ytdNet.toLocaleString()}`,             sub: `After ${feePct}% fee`,     color: 'text-emerald-400' },
            { label: 'Pending',     value: `$${pendingNet.toFixed(2)}`,              sub: `${pendingJobs.length} job settling`, color: 'text-amber-400' },
            { label: 'Fees Paid',   value: `$${(ytdGross - ytdNet).toLocaleString()}`, sub: `${feePct}% of gross`,     color: 'text-rose-400' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-surface-300 text-sm font-medium">{s.label}</p>
              <p className="text-surface-500 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Monthly earnings chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Monthly Earnings</h3>
              <p className="section-sub">Gross · Platform Fee · Net — at {feePct}% Elite rate</p>
            </div>
            <button className="btn-secondary py-2 text-xs">
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                  formatter={(v, name) => [`$${v.toLocaleString()}`, name]}
                />
                <Bar dataKey="gross" fill="#334155" radius={[4,4,0,0]} name="Gross" />
                <Bar dataKey="fee"   fill="#f43f5e" radius={[4,4,0,0]} name={`Fee (${feePct}%)`} />
                <Bar dataKey="net"   fill="#0ea5e9" radius={[4,4,0,0]} name="Net Earned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-3 flex-wrap">
            {[['Gross', '#334155'], [`Fee (${feePct}%)`, '#f43f5e'], ['Net Earned', '#0ea5e9']].map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                <span className="text-surface-400 text-xs">{label}</span>
              </div>
            ))}
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

        {/* Transaction history — fees recalculated at 8% */}
        <div>
          <h3 className="section-title mb-3">Transaction History</h3>
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-surface-800/40">
                  <th className="text-left px-5 py-3 text-surface-400 font-medium">Service</th>
                  <th className="text-left px-5 py-3 text-surface-400 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-surface-400 font-medium">Gross</th>
                  <th className="text-right px-5 py-3 text-rose-400 font-medium">Fee ({feePct}%)</th>
                  <th className="text-right px-5 py-3 text-emerald-400 font-medium">Net</th>
                  <th className="text-center px-5 py-3 text-surface-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {allTechJobs.map((job, i) => (
                  <tr
                    key={job.id}
                    className={`${i < allTechJobs.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors ${job.status === 'in_progress' ? 'opacity-60' : ''}`}
                  >
                    <td className="px-5 py-3 text-white font-medium">{job.service}</td>
                    <td className="px-5 py-3 text-surface-400 hidden sm:table-cell">{job.date}</td>
                    <td className="px-5 py-3 text-right text-white">${job.price.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right text-rose-400">−${job.calcFee.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right text-emerald-400 font-bold">${job.calcNet.toFixed(2)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`badge ${job.status === 'completed' ? 'badge-green' : 'badge-blue'}`}>
                        {job.status === 'completed' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-white/20 bg-surface-800/50">
                  <td colSpan={2} className="px-5 py-3 text-white font-bold">Totals (completed)</td>
                  <td className="px-5 py-3 text-right font-bold text-white">${totalGross.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right font-bold text-rose-400">−${totalFees.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right font-extrabold text-emerald-400 text-base">${totalNet.toFixed(2)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Fee savings callout */}
          <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 flex items-center gap-3">
            <Crown size={16} className="text-accent-400 flex-shrink-0" />
            <p className="text-surface-300 text-xs leading-relaxed">
              <span className="text-white font-semibold">Elite plan saving:</span>{' '}
              At Standard (15%) these jobs would have cost{' '}
              <span className="text-rose-400 font-semibold">−${(totalGross * 0.15).toFixed(2)}</span> in fees.
              Your Elite rate saved you{' '}
              <span className="text-emerald-400 font-bold">
                ${(totalGross * 0.15 - totalFees).toFixed(2)}
              </span>{' '}
              on this batch alone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
