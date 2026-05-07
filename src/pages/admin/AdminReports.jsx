import React, { useState } from 'react'
import Header from '../../components/Header'
import { Download, FileText, DollarSign, TrendingUp, Users, Star, Building2, Megaphone, ShoppingBag, CreditCard, Home, Wrench, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'
import { MOCK_TECHS, MOCK_CONTRACTORS, MOCK_JOBS, AD_SLOTS } from '../../data/mockData'

// ─── Monthly data with all revenue streams ───────────────────────────────────
const monthlyData = [
  { month: 'Jan', serviceFees: 630, contractorSubs: 1196, adRevenue: 420, storeComm: 180, financingRef: 90,  ccRevenue: 250, total: 2766 },
  { month: 'Feb', serviceFees: 915, contractorSubs: 1196, adRevenue: 540, storeComm: 240, financingRef: 135, ccRevenue: 310, total: 3336 },
  { month: 'Mar', serviceFees: 1335, contractorSubs: 1196, adRevenue: 680, storeComm: 390, financingRef: 190, ccRevenue: 390, total: 4181 },
  { month: 'Apr', serviceFees: 1680, contractorSubs: 1693, adRevenue: 820, storeComm: 510, financingRef: 260, ccRevenue: 475, total: 5438 },
  { month: 'May', serviceFees: 720,  contractorSubs: 1693, adRevenue: 290, storeComm: 180, financingRef: 110, ccRevenue: 210, total: 3203 },
]

const STREAM_COLORS = {
  serviceFees:    '#0ea5e9',
  contractorSubs: '#8b5cf6',
  adRevenue:      '#f59e0b',
  storeComm:      '#10b981',
  financingRef:   '#f43f5e',
  ccRevenue:      '#003478',
}

const STREAM_LABELS = {
  serviceFees:    'Service Fees',
  contractorSubs: 'Contractor Subscriptions',
  adRevenue:      'Ad Revenue',
  storeComm:      'Store Commissions',
  financingRef:   'Financing Referrals',
  ccRevenue:      'Comfort Connect',
}

// ─── Tech payout monthly data ────────────────────────────────────────────────
const techPayoutMonthly = [
  { month: 'Jan', marcus: 1840, deja: 1210, jordan: 490, total: 3540 },
  { month: 'Feb', marcus: 2650, deja: 1580, jordan: 720, total: 4950 },
  { month: 'Mar', marcus: 3890, deja: 2240, jordan: 1050, total: 7180 },
  { month: 'Apr', marcus: 4920, deja: 3100, jordan: 1380, total: 9400 },
  { month: 'May', marcus: 2140, deja: 980, jordan: 0, total: 3120 },
]

const TECH_COLORS = { marcus: '#0ea5e9', deja: '#8b5cf6', jordan: '#f59e0b' }

// Per-job payout data for the transaction log
const JOB_PAYOUTS = MOCK_JOBS.filter(j => j.status === 'completed' || j.status === 'in_progress').map(j => ({
  ...j,
  grossRevenue: j.price,
  platformFee: j.techFee,
  techPayout: j.netPay,
  margin: ((j.techFee / j.price) * 100).toFixed(1),
}))

const PIE_DATA = Object.entries(STREAM_LABELS).map(([key, label]) => ({
  name: label,
  value: monthlyData.reduce((sum, m) => sum + m[key], 0),
  color: STREAM_COLORS[key],
}))

const YTD = Object.keys(STREAM_LABELS).reduce((acc, key) => {
  acc[key] = monthlyData.reduce((sum, m) => sum + m[key], 0)
  return acc
}, {})
const YTD_TOTAL = Object.values(YTD).reduce((a, b) => a + b, 0)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-800 border border-white/10 rounded-xl p-3 text-xs shadow-xl min-w-[180px]">
      <p className="text-white font-bold mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{STREAM_LABELS[p.dataKey] || p.name}</span>
          <span className="text-white font-semibold">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedContractor, setExpandedContractor] = useState(null)

  const tierBadge = (tier) => ({
    Featured: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    Verified: 'bg-brand-500/20 text-brand-400 border border-brand-500/30',
    Free: 'bg-surface-700 text-surface-400 border border-white/10',
  }[tier] || '')

  const tabs = [
    { id: 'overview', label: 'Revenue Overview', icon: TrendingUp },
    { id: 'payouts', label: 'Tech Payouts', icon: DollarSign },
    { id: 'contractors', label: 'Contractors', icon: Building2 },
    { id: 'ads', label: 'Ad Revenue', icon: Megaphone },
    { id: 'tax', label: '1099 / Tax', icon: FileText },
  ]

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Reports" subtitle="Platform financials, revenue streams & tax exports" />

      <div className="px-6 pt-2 pb-0">
        <div className="flex gap-1 border-b border-white/10">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-px ${activeTab === t.id ? 'text-white border-brand-500 bg-brand-500/10' : 'text-surface-400 border-transparent hover:text-white hover:bg-white/5'}`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 max-w-6xl space-y-6">

        {/* ══════════════ OVERVIEW TAB ══════════════ */}
        {activeTab === 'overview' && (
          <>
            {/* KPI tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(STREAM_LABELS).map(([key, label]) => (
                <div key={key} className="stat-card relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ background: STREAM_COLORS[key] }} />
                  <p className="text-xl font-bold text-white pl-2">${YTD[key].toLocaleString()}</p>
                  <p className="text-surface-400 text-xs pl-2 leading-tight">{label}</p>
                  <p className="text-surface-600 text-xs pl-2">YTD 2026</p>
                </div>
              ))}
            </div>

            {/* Total GMV callout */}
            <div className="rounded-2xl bg-gradient-to-r from-brand-900/40 to-surface-900 border border-brand-500/30 p-5 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                <DollarSign size={28} className="text-brand-400" />
              </div>
              <div className="flex-1">
                <p className="text-surface-400 text-sm">Total Platform Revenue — YTD 2026</p>
                <p className="text-white text-4xl font-extrabold">${YTD_TOTAL.toLocaleString()}</p>
                <p className="text-surface-500 text-xs mt-1">Across all 6 revenue streams · Jan–May 2026</p>
              </div>
              <button className="btn-secondary text-sm py-2 flex-shrink-0">
                <Download size={14} /> Export CSV
              </button>
            </div>

            {/* Stacked bar chart */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="section-title">Monthly Revenue by Stream</h3>
                  <p className="section-sub">All income sources stacked</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    {Object.keys(STREAM_LABELS).map(key => (
                      <Bar key={key} dataKey={key} stackId="a" fill={STREAM_COLORS[key]} name={STREAM_LABELS[key]} radius={key === 'ccRevenue' ? [4,4,0,0] : [0,0,0,0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                {Object.entries(STREAM_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: STREAM_COLORS[key] }} />
                    <span className="text-surface-400 text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trend line + Pie side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Growth trend */}
              <div className="card">
                <h3 className="section-title mb-1">Revenue Growth Trend</h3>
                <p className="section-sub mb-4">Total monthly platform revenue</p>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} formatter={v => `$${v.toLocaleString()}`} />
                      <Area type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} fill="url(#totalGrad)" name="Total Revenue" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue mix pie */}
              <div className="card">
                <h3 className="section-title mb-1">Revenue Mix</h3>
                <p className="section-sub mb-2">YTD share by stream</p>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={PIE_DATA} cx="40%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                        {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={v => `$${v.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                  {PIE_DATA.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-surface-500 text-xs truncate">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue stream breakdown table */}
            <div className="card overflow-hidden">
              <h3 className="section-title mb-4">Stream-by-Stream Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-surface-500 font-medium pb-3 pr-4">Revenue Stream</th>
                      <th className="text-right text-surface-500 font-medium pb-3 px-3">Jan</th>
                      <th className="text-right text-surface-500 font-medium pb-3 px-3">Feb</th>
                      <th className="text-right text-surface-500 font-medium pb-3 px-3">Mar</th>
                      <th className="text-right text-surface-500 font-medium pb-3 px-3">Apr</th>
                      <th className="text-right text-surface-500 font-medium pb-3 px-3">May</th>
                      <th className="text-right text-surface-500 font-medium pb-3 pl-3 text-white">YTD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(STREAM_LABELS).map(([key, label]) => (
                      <tr key={key} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: STREAM_COLORS[key] }} />
                            <span className="text-white font-medium">{label}</span>
                          </div>
                        </td>
                        {monthlyData.map(m => (
                          <td key={m.month} className="py-3 px-3 text-right text-surface-300">${m[key]}</td>
                        ))}
                        <td className="py-3 pl-3 text-right font-bold text-white">${YTD[key].toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-surface-800/30">
                      <td className="py-3 pr-4 font-bold text-white">Total</td>
                      {monthlyData.map(m => (
                        <td key={m.month} className="py-3 px-3 text-right font-bold text-brand-400">${m.total.toLocaleString()}</td>
                      ))}
                      <td className="py-3 pl-3 text-right font-extrabold text-emerald-400 text-base">${YTD_TOTAL.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ══════════════ TECH PAYOUTS TAB ══════════════ */}
        {activeTab === 'payouts' && (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Paid Out YTD', value: `$${MOCK_TECHS.reduce((s,t) => s + t.earnings, 0).toLocaleString()}`, color: 'text-white', sub: 'to all active techs' },
                { label: 'Avg Per-Job Payout', value: `$${Math.round(JOB_PAYOUTS.reduce((s,j) => s + j.techPayout, 0) / JOB_PAYOUTS.length).toLocaleString()}`, color: 'text-brand-400', sub: 'net after platform fee' },
                { label: 'Platform Fee Collected', value: `$${JOB_PAYOUTS.reduce((s,j) => s + j.platformFee, 0).toFixed(2)}`, color: 'text-emerald-400', sub: '15% of gross on demo jobs' },
                { label: 'Jobs Completed YTD', value: MOCK_TECHS.reduce((s,t) => s + t.jobs, 0).toLocaleString(), color: 'text-amber-400', sub: 'across all techs' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-surface-400 text-xs mt-0.5">{s.label}</p>
                  <p className="text-surface-600 text-xs">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Monthly payout stacked bar */}
            <div className="card">
              <div className="flex items-center justify-between mb-1">
                <h3 className="section-title">Monthly Tech Payouts by Technician</h3>
                <button className="btn-secondary text-sm py-2"><Download size={14} /> Export</button>
              </div>
              <p className="section-sub mb-4">Net earnings disbursed to each tech per month</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={techPayoutMonthly} barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                      formatter={(v, name) => [`$${v.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                    />
                    <Bar dataKey="marcus" fill={TECH_COLORS.marcus} name="Marcus Rivera" stackId="a" />
                    <Bar dataKey="deja" fill={TECH_COLORS.deja} name="Deja Williams" stackId="a" />
                    <Bar dataKey="jordan" fill={TECH_COLORS.jordan} name="Jordan Lee" stackId="a" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-3 flex-wrap">
                {[['Marcus Rivera', TECH_COLORS.marcus], ['Deja Williams', TECH_COLORS.deja], ['Jordan Lee', TECH_COLORS.jordan]].map(([name, color]) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                    <span className="text-surface-400 text-xs">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-tech payout cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOCK_TECHS.filter(t => t.status === 'active').map(tech => {
                const techJobs = MOCK_JOBS.filter(j => j.tech === tech.name && j.status === 'completed')
                const gross = techJobs.reduce((s, j) => s + j.price, 0)
                const fees = techJobs.reduce((s, j) => s + j.techFee, 0)
                const net = techJobs.reduce((s, j) => s + j.netPay, 0)
                return (
                  <div key={tech.id} className="card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-bold">{tech.name}</p>
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-surface-400 text-xs">{tech.rating} · {tech.jobs} jobs</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-surface-400">Gross Revenue</span>
                        <span className="text-white font-medium">${gross.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-surface-400">Platform Fee (15%)</span>
                        <span className="text-rose-400 font-medium">−${fees.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                        <span className="text-surface-300">Net Paid Out</span>
                        <span className="text-emerald-400">${net.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                      <span className="text-surface-500 text-xs">YTD Earnings</span>
                      <span className="text-white font-extrabold text-lg">${tech.earnings.toLocaleString()}</span>
                    </div>
                    <button className="btn-secondary w-full mt-3 text-xs py-2"><Download size={12} /> Payout Statement</button>
                  </div>
                )
              })}
            </div>

            {/* Transaction-level payout log */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="section-title">Payout Transaction Log</h3>
                  <p className="section-sub">Job-by-job breakdown: gross, platform fee, net disbursed</p>
                </div>
                <button className="btn-secondary text-sm py-2"><Download size={14} /> CSV</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Date', 'Job', 'Technician', 'Tier', 'Gross', 'Platform Fee', 'Net Paid', 'Status'].map(h => (
                        <th key={h} className="text-left text-surface-500 font-medium pb-3 pr-4 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {JOB_PAYOUTS.map(job => (
                      <tr key={job.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4 text-surface-400 whitespace-nowrap">{job.date}</td>
                        <td className="py-3 pr-4 text-white font-medium">{job.service}</td>
                        <td className="py-3 pr-4 text-surface-300 whitespace-nowrap">{job.tech}</td>
                        <td className="py-3 pr-4">
                          <span className={`badge ${job.tier === 'Premium' ? 'badge-purple' : job.tier === 'Standard' ? 'badge-blue' : 'badge-yellow'}`}>{job.tier}</span>
                        </td>
                        <td className="py-3 pr-4 text-white font-semibold">${job.grossRevenue}</td>
                        <td className="py-3 pr-4 text-rose-400">−${job.platformFee.toFixed(2)}</td>
                        <td className="py-3 pr-4 text-emerald-400 font-bold">${job.techPayout.toFixed(2)}</td>
                        <td className="py-3 pr-4">
                          <span className={`badge ${job.status === 'completed' ? 'badge-green' : 'badge-blue'}`}>
                            {job.status === 'completed' ? 'Disbursed' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-surface-800/30 border-t border-white/20">
                      <td colSpan={4} className="py-3 pr-4 font-bold text-white">Totals</td>
                      <td className="py-3 pr-4 font-bold text-white">${JOB_PAYOUTS.reduce((s,j) => s+j.grossRevenue, 0).toLocaleString()}</td>
                      <td className="py-3 pr-4 font-bold text-rose-400">−${JOB_PAYOUTS.reduce((s,j) => s+j.platformFee, 0).toFixed(2)}</td>
                      <td className="py-3 pr-4 font-extrabold text-emerald-400">${JOB_PAYOUTS.reduce((s,j) => s+j.techPayout, 0).toFixed(2)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Gross vs Net area chart */}
            <div className="card">
              <h3 className="section-title mb-1">Gross Revenue vs Tech Payouts</h3>
              <p className="section-sub mb-4">Platform keeps the spread between the two lines</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: 'Jan', gross: 4200, payouts: 3540 },
                    { month: 'Feb', gross: 5880, payouts: 4950 },
                    { month: 'Mar', gross: 8510, payouts: 7180 },
                    { month: 'Apr', gross: 11200, payouts: 9400 },
                    { month: 'May', gross: 3710, payouts: 3120 },
                  ]}>
                    <defs>
                      <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                      formatter={v => `$${v.toLocaleString()}`}
                    />
                    <Area type="monotone" dataKey="gross" stroke="#0ea5e9" strokeWidth={2} fill="url(#grossGrad)" name="Gross Revenue" />
                    <Area type="monotone" dataKey="payouts" stroke="#10b981" strokeWidth={2} fill="url(#payoutGrad)" name="Tech Payouts" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-5 mt-2">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-brand-400" /><span className="text-surface-400 text-xs">Gross Revenue (customer payments)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /><span className="text-surface-400 text-xs">Tech Payouts (disbursed)</span></div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════ CONTRACTORS TAB ══════════════ */}
        {activeTab === 'contractors' && (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Active Contractors', value: MOCK_CONTRACTORS.filter(c => c.status === 'active').length, color: 'text-white', icon: Building2 },
                { label: 'Subscription MRR', value: `$${MOCK_CONTRACTORS.filter(c => c.status === 'active').reduce((s, c) => s + c.monthlyFee, 0).toLocaleString()}`, color: 'text-accent-400', icon: CreditCard },
                { label: 'Referral Revenue YTD', value: `$${MOCK_CONTRACTORS.reduce((s, c) => s + c.referralRevenue, 0).toLocaleString()}`, color: 'text-emerald-400', icon: DollarSign },
                { label: 'Total Leads Generated', value: MOCK_CONTRACTORS.reduce((s, c) => s + c.leads, 0), color: 'text-brand-400', icon: Users },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon size={14} className="text-surface-500" />
                    <p className="text-surface-500 text-xs">{s.label}</p>
                  </div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Tier breakdown */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { tier: 'Featured', fee: '$499/mo', rate: '5% referral', color: 'border-amber-500/40 from-amber-900/20', badge: 'bg-amber-500/20 text-amber-400' },
                { tier: 'Verified', fee: '$299 setup + $99/mo', rate: '7% referral', color: 'border-brand-500/40 from-brand-900/20', badge: 'bg-brand-500/20 text-brand-400' },
                { tier: 'Free', fee: '$0', rate: '10% referral', color: 'border-white/10 from-surface-800/20', badge: 'bg-surface-700 text-surface-400' },
              ].map(t => {
                const count = MOCK_CONTRACTORS.filter(c => c.tier === t.tier && c.status === 'active').length
                const rev = MOCK_CONTRACTORS.filter(c => c.tier === t.tier).reduce((s, c) => s + c.monthlyFee + c.referralRevenue, 0)
                return (
                  <div key={t.tier} className={`rounded-2xl border bg-gradient-to-b ${t.color} to-surface-900 p-4`}>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${t.badge}`}>{t.tier}</span>
                    <p className="text-white font-bold mt-2">{t.fee}</p>
                    <p className="text-surface-500 text-xs">{t.rate}</p>
                    <div className="mt-3 border-t border-white/10 pt-3 flex justify-between text-xs">
                      <span className="text-surface-400">{count} active</span>
                      <span className="text-emerald-400 font-semibold">${rev.toLocaleString()} revenue</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Contractor table */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Contractor Roster</h3>
                <button className="btn-secondary text-sm py-2"><Download size={14} /> Export</button>
              </div>
              <div className="space-y-2">
                {MOCK_CONTRACTORS.map(c => (
                  <div key={c.id} className="rounded-xl border border-white/10 bg-surface-800/40 overflow-hidden">
                    <div
                      className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedContractor(expandedContractor === c.id ? null : c.id)}
                    >
                      {/* Logo placeholder */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/30 to-brand-600/30 border border-white/10 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                        {c.company.split(' ').map(w => w[0]).join('').slice(0,2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-white font-semibold">{c.company}</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${tierBadge(c.tier)}`}>{c.tier}</span>
                          <span className={`badge ${c.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>{c.status}</span>
                        </div>
                        <p className="text-surface-500 text-xs">{c.contact} · {c.location}</p>
                      </div>
                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <p className="text-emerald-400 font-bold text-sm">${(c.monthlyFee + c.referralRevenue).toLocaleString()}</p>
                        <p className="text-surface-500 text-xs">total revenue</p>
                      </div>
                      {expandedContractor === c.id ? <ChevronUp size={16} className="text-surface-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-surface-500 flex-shrink-0" />}
                    </div>

                    {expandedContractor === c.id && (
                      <div className="border-t border-white/10 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface-900/40">
                        <div>
                          <p className="text-surface-500 text-xs mb-1">Monthly Fee</p>
                          <p className="text-white font-bold">{c.monthlyFee > 0 ? `$${c.monthlyFee}/mo` : 'Free'}</p>
                        </div>
                        <div>
                          <p className="text-surface-500 text-xs mb-1">Referral Rate</p>
                          <p className="text-white font-bold">{(c.referralRate * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="text-surface-500 text-xs mb-1">Jobs Referred</p>
                          <p className="text-white font-bold">{c.jobsReferred}</p>
                        </div>
                        <div>
                          <p className="text-surface-500 text-xs mb-1">Referral Revenue</p>
                          <p className="text-emerald-400 font-bold">${c.referralRevenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-surface-500 text-xs mb-1">Ad Impressions</p>
                          <p className="text-white font-bold">{c.adImpressions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-surface-500 text-xs mb-1">Leads Generated</p>
                          <p className="text-brand-400 font-bold">{c.leads}</p>
                        </div>
                        <div>
                          <p className="text-surface-500 text-xs mb-1">Trades</p>
                          <p className="text-white font-bold text-xs">{c.trades.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-surface-500 text-xs mb-1">Member Since</p>
                          <p className="text-white font-bold text-xs">{c.joinDate}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-4 pt-2 border-t border-white/10 flex gap-2">
                          <button className="btn-secondary text-xs py-1.5">View Profile</button>
                          <button className="btn-secondary text-xs py-1.5"><Download size={12} /> Export Report</button>
                          <a href={`mailto:${c.email}`} className="btn-ghost text-xs py-1.5 flex items-center gap-1"><ExternalLink size={12} /> Contact</a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contractor revenue chart */}
            <div className="card">
              <h3 className="section-title mb-1">Contractor Revenue Contribution</h3>
              <p className="section-sub mb-4">Subscription fees + referral commissions by contractor</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_CONTRACTORS.filter(c => c.status === 'active')} layout="vertical" barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                    <YAxis type="category" dataKey="company" stroke="#475569" tick={{ fontSize: 10 }} width={130} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={v => `$${v.toLocaleString()}`} />
                    <Bar dataKey="monthlyFee" fill="#8b5cf6" name="Subscription Fee" radius={[0,0,0,0]} stackId="a" />
                    <Bar dataKey="referralRevenue" fill="#10b981" name="Referral Revenue" radius={[0,4,4,0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-accent-500" /><span className="text-surface-400">Subscription Fee</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /><span className="text-surface-400">Referral Revenue</span></div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════ ADS TAB ══════════════ */}
        {activeTab === 'ads' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Impressions', value: AD_SLOTS.reduce((s, a) => s + a.impressions, 0).toLocaleString(), color: 'text-brand-400' },
                { label: 'Total Clicks', value: AD_SLOTS.reduce((s, a) => s + a.clicks, 0).toLocaleString(), color: 'text-white' },
                { label: 'Avg CTR', value: `${((AD_SLOTS.reduce((s,a)=>s+a.clicks,0)/AD_SLOTS.reduce((s,a)=>s+a.impressions,0))*100).toFixed(1)}%`, color: 'text-amber-400' },
                { label: 'Ad Revenue YTD', value: `$${YTD.adRevenue.toLocaleString()}`, color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-surface-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Ad Slots Performance</h3>
                <button className="btn-secondary text-sm py-2"><Download size={14} /> Export</button>
              </div>
              <div className="space-y-3">
                {[
                  ...AD_SLOTS,
                  { id: 'ad4', partner: 'Comfort Connect Premier', type: 'track_job_banner', active: true, impressions: 3100, clicks: 248 },
                  { id: 'ad5', partner: 'SnapRent-to-Own', type: 'financing_page', active: true, impressions: 1900, clicks: 87 },
                  { id: 'ad6', partner: 'Acorn Finance', type: 'checkout_upsell', active: true, impressions: 2400, clicks: 134 },
                ].map(ad => {
                  const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0'
                  return (
                    <div key={ad.id} className="flex items-center gap-4 px-4 py-3 bg-surface-800/50 rounded-xl">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Megaphone size={16} className="text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold">{ad.partner}</p>
                        <p className="text-surface-500 text-xs capitalize">{ad.type.replace(/_/g, ' ')}</p>
                      </div>
                      <div className="text-right text-xs hidden sm:block">
                        <p className="text-surface-300">{ad.impressions.toLocaleString()} imp.</p>
                        <p className="text-surface-500">{ad.clicks.toLocaleString()} clicks</p>
                      </div>
                      <div className="text-right text-xs w-16">
                        <p className="text-amber-400 font-bold">{ctr}%</p>
                        <p className="text-surface-600">CTR</p>
                      </div>
                      <span className={`badge ${ad.active ? 'badge-green' : 'badge-yellow'} flex-shrink-0`}>{ad.active ? 'Live' : 'Paused'}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Monthly ad revenue trend */}
            <div className="card">
              <h3 className="section-title mb-4">Monthly Ad Revenue</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="adGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={v => `$${v}`} />
                    <Area type="monotone" dataKey="adRevenue" stroke="#f59e0b" strokeWidth={2} fill="url(#adGrad)" name="Ad Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ══════════════ TAX TAB ══════════════ */}
        {activeTab === 'tax' && (
          <>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="section-title">1099-NEC Generation</h3>
                  <p className="section-sub">Year-end tax documents for all active techs</p>
                </div>
              </div>
              <div className="space-y-2">
                {MOCK_TECHS.filter(t => t.status === 'active').map(tech => (
                  <div key={tech.id} className="flex items-center gap-4 px-4 py-3 bg-surface-800/50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{tech.name}</p>
                      <p className="text-surface-500 text-xs">YTD Net: ${tech.earnings.toLocaleString()} · {tech.jobs} jobs · {tech.location}</p>
                    </div>
                    <span className={`badge ${tech.earnings >= 600 ? 'badge-green' : 'badge-yellow'}`}>
                      {tech.earnings >= 600 ? '1099 Required' : 'Below $600'}
                    </span>
                    {tech.earnings >= 600 && (
                      <button className="btn-secondary py-1.5 text-xs"><Download size={13} /> PDF</button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="btn-primary text-sm"><Download size={16} /> Export All 1099s (ZIP)</button>
              </div>
            </div>

            {/* Contractor 1099 section */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="section-title">Contractor Revenue Records</h3>
                  <p className="section-sub">Referral income paid to contractor partners</p>
                </div>
              </div>
              <div className="space-y-2">
                {MOCK_CONTRACTORS.filter(c => c.referralRevenue > 0).map(c => (
                  <div key={c.id} className="flex items-center gap-4 px-4 py-3 bg-surface-800/50 rounded-xl">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500/30 to-brand-600/30 border border-white/10 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                      {c.company.split(' ').map(w => w[0]).join('').slice(0,2)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{c.company}</p>
                      <p className="text-surface-500 text-xs">{c.jobsReferred} referrals · {(c.referralRate*100).toFixed(0)}% rate</p>
                    </div>
                    <div className="text-right text-xs mr-2">
                      <p className="text-emerald-400 font-bold">${c.referralRevenue.toLocaleString()}</p>
                      <p className="text-surface-500">paid out</p>
                    </div>
                    <button className="btn-secondary py-1.5 text-xs"><Download size={13} /> Statement</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo codes */}
            <div className="card">
              <h3 className="section-title mb-3">Promo Codes</h3>
              <div className="space-y-2 mb-4">
                {[
                  { code: 'HVAC20', discount: '20% off', uses: 47, active: true },
                  { code: 'NEWTECH', discount: '$25 off first service', uses: 12, active: true },
                  { code: 'SUMMER10', discount: '10% off A/C', uses: 0, active: false },
                ].map(p => (
                  <div key={p.code} className="flex items-center gap-3 px-4 py-3 bg-surface-800/50 rounded-xl text-sm">
                    <code className="font-mono font-bold text-brand-400 text-sm">{p.code}</code>
                    <span className="text-surface-300 flex-1">{p.discount}</span>
                    <span className="text-surface-500">{p.uses} uses</span>
                    <span className={`badge ${p.active ? 'badge-green' : 'badge-yellow'}`}>{p.active ? 'Active' : 'Inactive'}</span>
                  </div>
                ))}
              </div>
              <button className="btn-secondary text-sm"><FileText size={14} /> Create Promo Code</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
