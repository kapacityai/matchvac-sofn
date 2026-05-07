import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { MOCK_JOBS, MOCK_TECHS, TECH_SUBSCRIPTION_TIERS } from '../../data/mockData'
import { DollarSign, Briefcase, Star, TrendingUp, ChevronRight, AlertTriangle, Clock, Zap, Crown } from 'lucide-react'
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
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Tech Dashboard" subtitle="Thursday, May 7, 2026" />

      <div className="flex-1 p-6 space-y-6 max-w-5xl">
        {/* Subscription status pill */}
        <div
          onClick={() => navigate('/tech/subscription')}
          className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-accent-900/30 to-surface-900 border border-accent-500/30 hover:border-accent-400 transition-all"
        >
          <Crown size={18} className="text-accent-400 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-white font-bold text-sm">{subTier.name} Plan</span>
            <span className="text-surface-400 text-xs ml-2">· {(subTier.platformFee * 100).toFixed(0)}% platform fee · Priority dispatch active</span>
          </div>
          <span className="text-accent-400 text-xs font-medium flex items-center gap-1">Manage <ChevronRight size={13} /></span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Today's Earnings", value: '$466', sub: '+2 jobs', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { label: 'Jobs This Week', value: '6', sub: '247 all time', icon: Briefcase, color: 'text-brand-400', bg: 'bg-brand-400/10' },
            { label: 'Rating', value: '4.9', sub: '247 reviews', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { label: 'YTD Earnings', value: '$42.8k', sub: 'Net after fees', icon: TrendingUp, color: 'text-accent-400', bg: 'bg-accent-400/10' },
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

        {/* Earnings chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">This Week's Earnings</h3>
              <p className="section-sub">Net after platform fees</p>
            </div>
            <span className="badge badge-green">+12% vs last week</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} formatter={v => [`$${v}`, 'Earnings']} />
                <Area type="monotone" dataKey="earnings" stroke="#0ea5e9" fill="url(#earningsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Available jobs near you */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="section-title">Available Jobs Nearby</h3>
              <p className="section-sub">{availableJobs.length} jobs waiting for a tech</p>
            </div>
            <button onClick={() => navigate('/tech/jobs')} className="text-brand-400 text-sm font-medium flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {availableJobs.slice(0, 3).map(job => (
              <div key={job.id} className={`card-hover flex items-center gap-4 ${job.urgent ? 'border-rose-500/30 bg-rose-500/5' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${job.urgent ? 'bg-rose-500/20' : 'bg-brand-500/10'}`}>
                  {job.urgent ? <AlertTriangle size={18} className="text-rose-400" /> : <Briefcase size={18} className="text-brand-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">{job.service}</p>
                    {job.urgent && <span className="badge badge-red">URGENT</span>}
                  </div>
                  <p className="text-surface-400 text-xs truncate">{job.address}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-emerald-400 font-bold">${job.netPay}</p>
                  <p className="text-surface-500 text-xs">net payout</p>
                </div>
                <button onClick={() => navigate('/tech/jobs')} className="btn-primary py-2 text-xs px-3 flex-shrink-0">
                  <Zap size={13} /> Claim
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active job */}
        <div className="card bg-gradient-to-r from-brand-900/30 to-accent-900/20 border-brand-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
            <span className="text-brand-400 text-sm font-semibold">Active Job</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white font-bold">Thermostat Installation</p>
              <p className="text-surface-400 text-sm">3310 Birch Ave, Costa Mesa, CA</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge badge-blue"><Clock size={11} /> In Progress</span>
                <span className="text-surface-400 text-xs">Standard tier · $149</span>
              </div>
            </div>
            <button onClick={() => navigate('/tech/myjobs')} className="btn-primary py-2 text-sm flex-shrink-0">
              View Job
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
