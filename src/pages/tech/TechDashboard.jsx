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
    <div className="flex flex-col h-full overflow-auto bg-surface-100">
      <Header title="Dashboard" subtitle="Thursday, May 7, 2026" />

      <div className="flex-1 p-6 space-y-5 max-w-5xl">

        {/* Subscription banner */}
        <div
          onClick={() => navigate('/tech/subscription')}
          className="cursor-pointer group relative overflow-hidden flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-accent-400 bg-white hover:border-accent-500 hover:shadow-md transition-all"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-500 to-transparent" />
          <div className="w-9 h-9 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0">
            <Crown size={17} className="text-accent-500" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-surface-900 font-bold text-sm">{subTier.name} Plan Active</span>
            <span className="text-surface-500 text-xs ml-2">· {(subTier.platformFee * 100).toFixed(0)}% fee · Priority dispatch enabled</span>
          </div>
          <span className="text-accent-500 text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Manage <ChevronRight size={13} />
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Today's Earnings", value: '$466', sub: '+2 jobs today', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
            { label: 'Jobs This Week',   value: '6',    sub: '247 all time',  icon: Briefcase,   color: 'text-brand-500',   bg: 'bg-brand-100',   border: 'border-brand-200' },
            { label: 'Rating',           value: '4.9',  sub: '247 reviews',   icon: Star,        color: 'text-amber-600',   bg: 'bg-amber-100',   border: 'border-amber-200' },
            { label: 'YTD Earnings',     value: '$42.8k', sub: 'Net after fees', icon: TrendingUp, color: 'text-accent-500', bg: 'bg-accent-500/10', border: 'border-accent-400/30' },
          ].map(s => (
            <div key={s.label} className={`relative overflow-hidden bg-white border ${s.border} rounded-2xl p-4 shadow-sm`}>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon size={17} className={s.color} />
              </div>
              <p className="text-2xl font-black text-surface-900 tracking-tight">{s.value}</p>
              <p className="text-surface-500 text-xs mt-0.5">{s.label}</p>
              <p className="text-surface-400 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Earnings chart */}
        <div className="relative overflow-hidden bg-white border border-surface-200 rounded-2xl p-5 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-surface-900 font-bold">This Week's Earnings</h3>
              <p className="text-surface-500 text-xs mt-0.5">Net after platform fees</p>
            </div>
            <span className="inline-flex items-center bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">+12% vs last week</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97316" stopOpacity={0.20} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#d0cfc9" tick={{ fontSize: 11, fill: '#6e6c67' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#d0cfc9" tick={{ fontSize: 11, fill: '#6e6c67' }} tickFormatter={v => `$${v}`} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e4e4e1', borderRadius: 12, color: '#111110', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                  formatter={v => [`$${v}`, 'Net Earnings']}
                  cursor={{ stroke: 'rgba(249,115,22,0.2)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#f97316" fill="url(#earningsGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#f97316', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Available jobs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-surface-900 font-bold">Available Jobs Nearby</h3>
              <p className="text-surface-500 text-xs mt-0.5">{availableJobs.length} jobs waiting · claim first</p>
            </div>
            <button onClick={() => navigate('/tech/jobs')} className="text-brand-500 hover:text-brand-600 text-xs font-semibold flex items-center gap-1 transition-colors">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-2">
            {availableJobs.slice(0, 3).map(job => (
              <div
                key={job.id}
                className={`group flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all hover:-translate-y-px hover:shadow-md cursor-pointer ${
                  job.urgent
                    ? 'border-rose-200 bg-rose-50 hover:border-rose-400'
                    : 'border-surface-200 bg-white hover:border-brand-400'
                }`}
                onClick={() => navigate('/tech/jobs')}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${job.urgent ? 'bg-rose-100' : 'bg-brand-100'}`}>
                  {job.urgent ? <AlertTriangle size={17} className="text-rose-500" /> : <Briefcase size={17} className="text-brand-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-surface-900 font-semibold text-sm">{job.service}</p>
                    {job.urgent && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">URGENT</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-surface-400" />
                    <p className="text-surface-500 text-xs truncate">{job.address}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 mr-1">
                  <p className="text-emerald-600 font-black text-base">${job.netPay}</p>
                  <p className="text-surface-400 text-xs">net</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); navigate('/tech/jobs') }}
                  className="btn-primary py-2 text-xs px-3.5 flex-shrink-0"
                >
                  <Zap size={12} /> Claim
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active job */}
        <div className="relative overflow-hidden rounded-2xl border border-brand-300 bg-brand-50 p-5">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-brand-400 to-transparent" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            <span className="text-brand-600 text-xs font-bold uppercase tracking-widest">Active Job</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-surface-900 font-bold text-base">Thermostat Installation</p>
              <p className="text-surface-500 text-sm mt-0.5">3310 Birch Ave, Costa Mesa, CA</p>
              <div className="flex items-center gap-2 mt-2.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700"><Clock size={10} /> In Progress</span>
                <span className="text-surface-400 text-xs">Standard · $149</span>
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
