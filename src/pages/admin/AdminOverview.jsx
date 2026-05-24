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
const PIE_COLORS = ['#f97316', '#14b8a6', '#10b981', '#f59e0b']

export default function AdminOverview() {
  const activeJobs    = MOCK_JOBS.filter(j => j.status === 'in_progress').length
  const pendingTechs  = MOCK_TECHS.filter(t => t.status === 'pending').length
  const urgentJobs    = MOCK_JOBS.filter(j => j.urgent).length

  return (
    <div className="flex flex-col h-full overflow-auto bg-surface-100">
      <Header title="Platform Overview" subtitle="MatcHvac Admin" />

      <div className="flex-1 p-6 space-y-5 max-w-6xl">

        {/* Alerts */}
        {(pendingTechs > 0 || urgentJobs > 0) && (
          <div className="space-y-2">
            {pendingTechs > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertTriangle size={15} className="text-amber-600 flex-shrink-0" />
                <span className="text-amber-800 text-sm"><strong>{pendingTechs} tech(s)</strong> awaiting document review and approval</span>
                <button className="ml-auto text-amber-600 text-xs font-semibold hover:text-amber-700 transition-colors">Review →</button>
              </div>
            )}
            {urgentJobs > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertTriangle size={15} className="text-rose-500 flex-shrink-0" />
                <span className="text-rose-700 text-sm"><strong>{urgentJobs} emergency job(s)</strong> active — ensure tech availability</span>
              </div>
            )}
          </div>
        )}

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Customers',  value: MOCK_CUSTOMERS.length, sub: '+3 this week',     icon: Users,      color: 'text-brand-500',   bg: 'bg-brand-100',   border: 'border-brand-200',   trend: '+12%' },
            { label: 'Active Techs',     value: MOCK_TECHS.filter(t => t.status === 'active').length, sub: `${pendingTechs} pending`, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200', trend: '+4%' },
            { label: 'Active Jobs',      value: activeJobs,             sub: `${urgentJobs} urgent`,  icon: Briefcase,  color: 'text-amber-600',   bg: 'bg-amber-100',   border: 'border-amber-200',   trend: null },
            { label: 'May Revenue',      value: '$4,800',               sub: '+14% vs Apr',     icon: DollarSign, color: 'text-accent-500',  bg: 'bg-accent-500/10',  border: 'border-accent-400/30',  trend: '+14%' },
          ].map(s => (
            <div key={s.label} className={`relative overflow-hidden bg-white border ${s.border} rounded-2xl p-4 shadow-sm`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon size={17} className={s.color} />
                </div>
                {s.trend && (
                  <div className="flex items-center gap-0.5 text-emerald-600 text-xs font-semibold">
                    <ArrowUpRight size={12} />{s.trend}
                  </div>
                )}
              </div>
              <p className="text-2xl font-black text-surface-900 tracking-tight">{s.value}</p>
              <p className="text-surface-500 text-xs mt-0.5">{s.label}</p>
              <p className="text-surface-400 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="relative overflow-hidden bg-white border border-surface-200 rounded-2xl p-5 lg:col-span-2 shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-surface-900 font-bold">Monthly Revenue</h3>
                <p className="text-surface-500 text-xs mt-0.5">Platform fees + subscriptions + ads</p>
              </div>
              <span className="inline-flex items-center bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">+35% YTD</span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f97316" stopOpacity={0.20} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#d0cfc9" tick={{ fontSize: 11, fill: '#6e6c67' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#d0cfc9" tick={{ fontSize: 11, fill: '#6e6c67' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e4e4e1', borderRadius: 12, color: '#111110', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="url(#revGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#f97316', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-surface-900 font-bold mb-4">Service Mix</h3>
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
                    <span className="text-surface-500 text-xs">{label}</span>
                  </div>
                  <span className="text-surface-900 text-xs font-bold">{pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent jobs table */}
        <div className="relative overflow-hidden bg-white border border-surface-200 rounded-2xl shadow-sm">
          <div className="px-5 py-4 border-b border-surface-200">
            <h3 className="text-surface-900 font-bold">Recent Jobs</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-150">
                <th className="text-left px-5 py-3 text-surface-500 font-medium text-xs uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3 text-surface-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="text-left px-5 py-3 text-surface-500 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Tech</th>
                <th className="text-right px-5 py-3 text-surface-500 font-medium text-xs uppercase tracking-wider">Amount</th>
                <th className="text-right px-5 py-3 text-surface-500 font-medium text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_JOBS.slice(0, 5).map((job, i) => (
                <tr key={job.id} className={`${i < 4 ? 'border-b border-surface-100' : ''} hover:bg-surface-100/60 transition-colors`}>
                  <td className="px-5 py-3.5 text-surface-900 font-medium">{job.service}</td>
                  <td className="px-5 py-3.5 text-surface-500 hidden md:table-cell">{job.customer || 'Jordan S.'}</td>
                  <td className="px-5 py-3.5 text-surface-500 hidden lg:table-cell">{job.tech || '—'}</td>
                  <td className="px-5 py-3.5 text-right text-surface-900 font-semibold">${job.price}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      job.status === 'completed'  ? 'bg-emerald-100 text-emerald-700' :
                      job.status === 'in_progress'? 'bg-brand-100 text-brand-700' :
                                                    'bg-amber-100 text-amber-700'
                    }`}>
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
          <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-3">Active Ad Campaigns</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AD_SLOTS.map(ad => (
              <div key={ad.id} className="bg-white border border-surface-200 rounded-2xl p-4 hover:border-surface-300 hover:shadow-sm transition-all shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-surface-900 text-sm font-bold truncate">{ad.partner}</p>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ad.active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{ad.active ? 'Live' : 'Paused'}</span>
                </div>
                <p className="text-surface-500 text-xs mb-3 capitalize">{ad.type.replace('_', ' ')}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-surface-100 rounded-lg p-2 text-center">
                    <p className="text-surface-400">Impr.</p>
                    <p className="text-surface-900 font-bold mt-0.5">{(ad.impressions / 1000).toFixed(1)}k</p>
                  </div>
                  <div className="bg-surface-100 rounded-lg p-2 text-center">
                    <p className="text-surface-400">Clicks</p>
                    <p className="text-brand-500 font-bold mt-0.5">{ad.clicks}</p>
                  </div>
                  <div className="bg-surface-100 rounded-lg p-2 text-center">
                    <p className="text-surface-400">CTR</p>
                    <p className="text-surface-900 font-bold mt-0.5">{ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : 0}%</p>
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
