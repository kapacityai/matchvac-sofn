import React from 'react'
import Header from '../../components/Header'
import { MOCK_JOBS, MOCK_TECHS, MOCK_CUSTOMERS, AD_SLOTS } from '../../data/mockData'
import { Users, Briefcase, DollarSign, TrendingUp, AlertTriangle, CheckCircle, UserCheck, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 4200, jobs: 28 }, { month: 'Feb', revenue: 6100, jobs: 41 },
  { month: 'Mar', revenue: 8900, jobs: 60 }, { month: 'Apr', revenue: 11200, jobs: 75 },
  { month: 'May', revenue: 4800, jobs: 32 },
]
const PIE_COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b']

export default function AdminOverview() {
  const activeJobs    = MOCK_JOBS.filter(j => j.status === 'in_progress').length
  const pendingTechs  = MOCK_TECHS.filter(t => t.status === 'pending').length
  const urgentJobs    = MOCK_JOBS.filter(j => j.urgent).length

  return (
    <div className="flex flex-col h-full overflow-auto bg-surface-950">
      <Header title="Platform Overview" subtitle="ServiceConnect Admin" />

      <div className="flex-1 p-6 space-y-5 max-w-6xl">

        {/* Alerts */}
        {(pendingTechs > 0 || urgentJobs > 0) && (
          <div className="space-y-2">
            {pendingTechs > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/8 border border-amber-500/20 rounded-xl">
                <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
                <span className="text-amber-300 text-sm"><strong>{pendingTechs} tech(s)</strong> awaiting document review and approval</span>
                <button className="ml-auto text-amber-400 text-xs font-semibold hover:text-amber-300 transition-colors">Review →</button>
              </div>
            )}
            {urgentJobs > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-rose-500/8 border border-rose-500/20 rounded-xl">
                <AlertTriangle size={15} className="text-rose-400 flex-shrink-0" />
                <span className="text-rose-300 text-sm"><strong>{urgentJobs} emergency job(s)</strong> active — ensure tech availability</span>
              </div>
            )}
          </div>
        )}

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Customers',  value: MOCK_CUSTOMERS.length, sub: '+3 this week',     icon: Users,      color: 'text-brand-400',   bg: 'bg-brand-500/10',   border: 'border-brand-500/15',   trend: '+12%' },
            { label: 'Active Techs',     value: MOCK_TECHS.filter(t => t.status === 'active').length, sub: `${pendingTechs} pending`, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', trend: '+4%' },
            { label: 'Active Jobs',      value: activeJobs,             sub: `${urgentJobs} urgent`,  icon: Briefcase,  color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/15',   trend: null },
            { label: 'May Revenue',      value: '$4,800',               sub: '+14% vs Apr',     icon: DollarSign, color: 'text-accent-400',  bg: 'bg-accent-500/10',  border: 'border-accent-500/15',  trend: '+14%' },
          ].map(s => (
            <div key={s.label} className={`relative overflow-hidden bg-surface-900 border ${s.border} rounded-2xl p-4`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon size={17} className={s.color} />
                </div>
                {s.trend && (
                  <div className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold">
                    <ArrowUpRight size={12} />{s.trend}
                  </div>
                )}
              </div>
              <p className="text-2xl font-black text-white tracking-tight">{s.value}</p>
              <p className="text-surface-500 text-xs mt-0.5">{s.label}</p>
              <p className="text-surface-600 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="relative overflow-hidden bg-surface-900 border border-white/[0.07] rounded-2xl p-5 lg:col-span-2">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold">Monthly Revenue</h3>
                <p className="text-surface-500 text-xs mt-0.5">Platform fees + subscriptions + ads</p>
              </div>
              <span className="badge badge-green text-xs">+35% YTD</span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#334155" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#334155" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 12 }} formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fill="url(#revGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-900 border border-white/[0.07] rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">Service Mix</h3>
            <div className="flex items-center justify-center mb-4">
              <PieChart width={140} height={140}>
                <Pie data={[{v:35},{v:28},{v:22},{v:15}]} dataKey="v" cx={65} cy={65} innerRadius={38} outerRadius={62} paddingAngle={3}>
                  {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2">
              {[['Cooling', '35%'], ['Heating', '28%'], ['Maintenance', '22%'], ['Emergency', '15%']].map(([label, pct], i) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-surface-400 text-xs">{label}</span>
                  </div>
                  <span className="text-white text-xs font-bold">{pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent jobs table */}
        <div className="relative overflow-hidden bg-surface-900 border border-white/[0.07] rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/15 to-transparent" />
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <h3 className="text-white font-bold">Recent Jobs</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="text-left px-5 py-3 text-surface-500 font-medium text-xs uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3 text-surface-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="text-left px-5 py-3 text-surface-500 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Tech</th>
                <th className="text-right px-5 py-3 text-surface-500 font-medium text-xs uppercase tracking-wider">Amount</th>
                <th className="text-right px-5 py-3 text-surface-500 font-medium text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_JOBS.slice(0, 5).map((job, i) => (
                <tr key={job.id} className={`${i < 4 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.03] transition-colors`}>
                  <td className="px-5 py-3.5 text-white font-medium">{job.service}</td>
                  <td className="px-5 py-3.5 text-surface-400 hidden md:table-cell">{job.customer || 'Jordan S.'}</td>
                  <td className="px-5 py-3.5 text-surface-400 hidden lg:table-cell">{job.tech || '—'}</td>
                  <td className="px-5 py-3.5 text-right text-white font-semibold">${job.price}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`badge text-xs ${job.status === 'completed' ? 'badge-green' : job.status === 'in_progress' ? 'badge-blue' : 'badge-yellow'}`}>
                      {job.status === 'in_progress' ? 'Active' : job.status === 'available' ? 'Open' : 'Done'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ad campaigns */}
        <div>
          <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-widest mb-3">Active Ad Campaigns</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AD_SLOTS.map(ad => (
              <div key={ad.id} className="bg-surface-900 border border-white/[0.07] rounded-2xl p-4 hover:border-white/12 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white text-sm font-bold truncate">{ad.partner}</p>
                  <span className={`badge text-xs ${ad.active ? 'badge-green' : 'badge-yellow'}`}>{ad.active ? 'Live' : 'Paused'}</span>
                </div>
                <p className="text-surface-500 text-xs mb-3 capitalize">{ad.type.replace('_', ' ')}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-surface-800/60 rounded-lg p-2 text-center">
                    <p className="text-surface-500">Impr.</p>
                    <p className="text-white font-bold mt-0.5">{(ad.impressions / 1000).toFixed(1)}k</p>
                  </div>
                  <div className="bg-surface-800/60 rounded-lg p-2 text-center">
                    <p className="text-surface-500">Clicks</p>
                    <p className="text-brand-400 font-bold mt-0.5">{ad.clicks}</p>
                  </div>
                  <div className="bg-surface-800/60 rounded-lg p-2 text-center">
                    <p className="text-surface-500">CTR</p>
                    <p className="text-white font-bold mt-0.5">{ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : 0}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
