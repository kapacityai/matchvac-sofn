import React from 'react'
import Header from '../../components/Header'
import { MOCK_JOBS, MOCK_TECHS, MOCK_CUSTOMERS, AD_SLOTS } from '../../data/mockData'
import { Users, Briefcase, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, UserCheck } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 4200, jobs: 28 }, { month: 'Feb', revenue: 6100, jobs: 41 },
  { month: 'Mar', revenue: 8900, jobs: 60 }, { month: 'Apr', revenue: 11200, jobs: 75 },
  { month: 'May', revenue: 4800, jobs: 32 },
]
const PIE_COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b']

export default function AdminOverview() {
  const activeJobs = MOCK_JOBS.filter(j => j.status === 'in_progress').length
  const pendingTechs = MOCK_TECHS.filter(t => t.status === 'pending').length
  const urgentJobs = MOCK_JOBS.filter(j => j.urgent).length

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Platform Overview" subtitle="ServiceConnect Admin Dashboard" />

      <div className="flex-1 p-6 space-y-6 max-w-6xl">
        {/* Alerts */}
        {(pendingTechs > 0 || urgentJobs > 0) && (
          <div className="space-y-2">
            {pendingTechs > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm">
                <AlertTriangle size={16} className="flex-shrink-0" />
                <span><strong>{pendingTechs} tech(s)</strong> awaiting document review and approval</span>
                <button className="ml-auto btn-secondary py-1 text-xs">Review</button>
              </div>
            )}
            {urgentJobs > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                <AlertTriangle size={16} className="flex-shrink-0" />
                <span><strong>{urgentJobs} emergency job(s)</strong> active — ensure tech availability</span>
              </div>
            )}
          </div>
        )}

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Customers', value: MOCK_CUSTOMERS.length, sub: '+3 this week', icon: Users, color: 'text-brand-400', bg: 'bg-brand-400/10' },
            { label: 'Active Techs', value: MOCK_TECHS.filter(t => t.status === 'active').length, sub: `${pendingTechs} pending`, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { label: 'Active Jobs', value: activeJobs, sub: `${urgentJobs} urgent`, icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { label: 'May Revenue', value: '$4,800', sub: '+14% vs Apr', icon: DollarSign, color: 'text-accent-400', bg: 'bg-accent-400/10' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon size={18} className={s.color} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-surface-400 text-xs">{s.label}</p>
              <p className="text-surface-600 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue chart */}
          <div className="card lg:col-span-2">
            <h3 className="section-title mb-4">Monthly Revenue</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} formatter={v => [`$${v}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5} dot={{ fill: '#0ea5e9', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service mix */}
          <div className="card">
            <h3 className="section-title mb-4">Service Mix</h3>
            <div className="h-44 flex items-center justify-center">
              <PieChart width={160} height={160}>
                <Pie data={[{v:35},{v:28},{v:22},{v:15}]} dataKey="v" cx={75} cy={75} innerRadius={40} outerRadius={70}>
                  {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </div>
            <div className="space-y-1 text-xs">
              {['Cooling (35%)', 'Heating (28%)', 'Maintenance (22%)', 'Emergency (15%)'].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-surface-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent jobs */}
        <div className="card overflow-hidden p-0">
          <div className="px-5 py-4 border-b border-white/10">
            <h3 className="section-title">Recent Jobs</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-surface-400 font-medium">Service</th>
                <th className="text-left px-5 py-3 text-surface-400 font-medium hidden md:table-cell">Customer</th>
                <th className="text-left px-5 py-3 text-surface-400 font-medium hidden lg:table-cell">Tech</th>
                <th className="text-right px-5 py-3 text-surface-400 font-medium">Amount</th>
                <th className="text-right px-5 py-3 text-surface-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_JOBS.slice(0, 5).map((job, i) => (
                <tr key={job.id} className={`${i < 4 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}>
                  <td className="px-5 py-3 text-white font-medium">{job.service}</td>
                  <td className="px-5 py-3 text-surface-400 hidden md:table-cell">{job.customer || 'Jordan S.'}</td>
                  <td className="px-5 py-3 text-surface-400 hidden lg:table-cell">{job.tech || '—'}</td>
                  <td className="px-5 py-3 text-right text-white">${job.price}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`badge ${job.status === 'completed' ? 'badge-green' : job.status === 'in_progress' ? 'badge-blue' : 'badge-yellow'}`}>
                      {job.status === 'in_progress' ? 'Active' : job.status === 'available' ? 'Open' : 'Done'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ad slots */}
        <div>
          <h3 className="section-title mb-3">Active Ad Campaigns</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AD_SLOTS.map(ad => (
              <div key={ad.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white text-sm font-semibold truncate">{ad.partner}</p>
                  <span className={`badge ${ad.active ? 'badge-green' : 'badge-yellow'}`}>{ad.active ? 'Active' : 'Paused'}</span>
                </div>
                <p className="text-surface-500 text-xs mb-2">{ad.type.replace('_', ' ')}</p>
                <div className="flex gap-4 text-xs">
                  <div><p className="text-surface-400">Impressions</p><p className="text-white font-semibold">{ad.impressions.toLocaleString()}</p></div>
                  <div><p className="text-surface-400">Clicks</p><p className="text-brand-400 font-semibold">{ad.clicks}</p></div>
                  <div><p className="text-surface-400">CTR</p><p className="text-white font-semibold">{ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : 0}%</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
