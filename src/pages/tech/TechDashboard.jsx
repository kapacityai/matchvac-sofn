import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { MOCK_JOBS, MOCK_TECHS, TECH_SUBSCRIPTION_TIERS } from '../../data/mockData'
import { DollarSign, Briefcase, Star, TrendingUp, ChevronRight, AlertTriangle, Clock, Zap, Crown, ArrowRight, MapPin } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const demoTech = MOCK_TECHS[0]
const subTier  = TECH_SUBSCRIPTION_TIERS[demoTech.subscription]

const earningsData = [
  { day: 'Mon', earnings: 211 }, { day: 'Tue', earnings: 75 }, { day: 'Wed', earnings: 594 },
  { day: 'Thu', earnings: 0 }, { day: 'Fri', earnings: 340 }, { day: 'Sat', earnings: 466 }, { day: 'Sun', earnings: 127 },
]

const availableJobs = MOCK_JOBS.filter(j => j.status === 'available')

export default function TechDashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full overflow-auto bg-surface-950">
      <Header title="Dashboard" subtitle="Thursday, May 7, 2026" />

      <div className="flex-1 p-6 space-y-5 max-w-5xl">

        {/* Subscription banner */}
        <div
          onClick={() => navigate('/tech/subscription')}
          className="cursor-pointer group relative overflow-hidden flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-accent-500/25 hover:border-accent-500/50 transition-all"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(15,23,42,0.8) 100%)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-400/40 to-transparent" />
          <div className="w-9 h-9 rounded-xl bg-accent-500/15 flex items-center justify-center flex-shrink-0">
            <Crown size={17} className="text-accent-400" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-bold text-sm">{subTier.name} Plan Active</span>
            <span className="text-surface-400 text-xs ml-2">· {(subTier.platformFee * 100).toFixed(0)}% fee · Priority dispatch enabled</span>
          </div>
          <span className="text-accent-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Manage <ChevronRight size={13} />
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Today's Earnings", value: '$466', sub: '+2 jobs today', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
            { label: 'Jobs This Week',   value: '6',    sub: '247 all time',  icon: Briefcase,   color: 'text-brand-400',   bg: 'bg-brand-500/10',   border: 'border-brand-500/15' },
            { label: 'Rating',           value: '4.9',  sub: '247 reviews',   icon: Star,        color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/15' },
            { label: 'YTD Earnings',     value: '$42.8k', sub: 'Net after fees', icon: TrendingUp, color: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/15' },
          ].map(s => (
            <div key={s.label} className={`relative overflow-hidden bg-surface-900 border ${s.border} rounded-2xl p-4`}>
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-30" style={{ background: 'currentColor' }} />
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon size={17} className={s.color} />
              </div>
              <p className={`text-2xl font-black text-white tracking-tight`}>{s.value}</p>
              <p className="text-surface-500 text-xs mt-0.5">{s.label}</p>
              <p className="text-surface-600 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Earnings chart */}
        <div className="relative overflow-hidden bg-surface-900 border border-white/[0.07] rounded-2xl p-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-bold">This Week's Earnings</h3>
              <p className="text-surface-500 text-xs mt-0.5">Net after platform fees</p>
            </div>
            <span className="badge badge-green text-xs">+12% vs last week</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#334155" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#334155" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `$${v}`} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                  formatter={v => [`$${v}`, 'Net Earnings']}
                  cursor={{ stroke: 'rgba(14,165,233,0.2)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#0ea5e9" fill="url(#earningsGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Available jobs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-bold">Available Jobs Nearby</h3>
              <p className="text-surface-500 text-xs mt-0.5">{availableJobs.length} jobs waiting · claim first</p>
            </div>
            <button onClick={() => navigate('/tech/jobs')} className="text-brand-400 hover:text-brand-300 text-xs font-semibold flex items-center gap-1 transition-colors">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-2">
            {availableJobs.slice(0, 3).map(job => (
              <div
                key={job.id}
                className={`group flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all hover:-translate-y-px hover:shadow-lg cursor-pointer ${
                  job.urgent
                    ? 'border-rose-500/25 bg-rose-500/5 hover:border-rose-500/40 hover:shadow-rose-500/10'
                    : 'border-white/[0.07] bg-surface-900 hover:border-brand-500/30 hover:shadow-brand-500/5'
                }`}
                onClick={() => navigate('/tech/jobs')}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${job.urgent ? 'bg-rose-500/15' : 'bg-brand-500/10'}`}>
                  {job.urgent ? <AlertTriangle size={17} className="text-rose-400" /> : <Briefcase size={17} className="text-brand-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">{job.service}</p>
                    {job.urgent && <span className="badge badge-red text-xs">URGENT</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-surface-600" />
                    <p className="text-surface-500 text-xs truncate">{job.address}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 mr-1">
                  <p className="text-emerald-400 font-black text-base">${job.netPay}</p>
                  <p className="text-surface-600 text-xs">net</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); navigate('/tech/jobs') }}
                  className="btn-primary py-2 text-xs px-3.5 flex-shrink-0 glow-brand"
                >
                  <Zap size={12} /> Claim
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active job */}
        <div className="relative overflow-hidden rounded-2xl border border-brand-500/25 p-5" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(15,23,42,0.9) 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
            <span className="text-brand-400 text-xs font-bold uppercase tracking-widest">Active Job</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white font-bold text-base">Thermostat Installation</p>
              <p className="text-surface-500 text-sm mt-0.5">3310 Birch Ave, Costa Mesa, CA</p>
              <div className="flex items-center gap-2 mt-2.5">
                <span className="badge badge-blue text-xs"><Clock size={10} /> In Progress</span>
                <span className="text-surface-600 text-xs">Standard · $149</span>
              </div>
            </div>
            <button onClick={() => navigate('/tech/myjobs')} className="btn-primary py-2 px-4 text-sm flex-shrink-0">
              View Job <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
