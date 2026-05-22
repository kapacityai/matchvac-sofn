import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { useAuth } from '../../context/AuthContext'
import { MOCK_JOBS, SERVICES } from '../../data/mockData'
import { Wrench, ShoppingBag, MapPin, ChevronRight, AlertTriangle, CheckCircle, Clock, Star, Zap, ArrowRight, Shield, DollarSign, Lock } from 'lucide-react'

const customerJobs = MOCK_JOBS.filter(j => ['j1','j2','j3','j4'].includes(j.id))

export default function CustomerHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.name?.split(' ')[0]

  const activeJob = customerJobs.find(j => j.status === 'in_progress')
  const recentJobs = customerJobs.filter(j => j.status === 'completed').slice(0, 2)

  return (
    <div className="flex flex-col h-full overflow-auto bg-surface-950">
      <Header title={`Hey, ${firstName} 👋`} subtitle="What can we fix for you today?" />

      <div className="flex-1 p-6 space-y-6 max-w-4xl">

        {/* Active job alert */}
        {activeJob && (
          <div
            onClick={() => navigate('/customer/track')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-900/30 via-surface-900 to-surface-900 hover:border-emerald-400/60 transition-all animate-fade-in"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/60 via-emerald-400/40 to-transparent" />
            <div className="px-4 py-2 flex items-center gap-2 border-b border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Action Required — Awaiting Your Confirmation</span>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Lock size={20} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold">{activeJob.service} — Marked Complete</p>
                <p className="text-surface-400 text-sm mt-0.5">Marcus Rivera finished the job. Confirm to release <span className="text-emerald-400 font-semibold">$149.00</span> from escrow.</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold whitespace-nowrap group-hover:gap-2 transition-all">
                Approve &amp; Pay <ArrowRight size={15} />
              </div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-widest mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: Wrench, label: 'Request Service', sub: 'Book a technician now',
                path: '/customer/request',
                gradient: 'from-brand-500/20 to-brand-600/5',
                border: 'border-brand-500/25 hover:border-brand-500/50',
                iconBg: 'bg-brand-500/15', iconColor: 'text-brand-400',
                glow: 'hover:shadow-brand-500/10',
              },
              {
                icon: AlertTriangle, label: 'Emergency', sub: 'No heat / no A/C — 24/7',
                path: '/customer/request?emergency=true',
                gradient: 'from-rose-500/20 to-rose-600/5',
                border: 'border-rose-500/25 hover:border-rose-500/50',
                iconBg: 'bg-rose-500/15', iconColor: 'text-rose-400',
                glow: 'hover:shadow-rose-500/10',
              },
              {
                icon: ShoppingBag, label: 'Shop Products', sub: 'Filters, thermostats & more',
                path: '/customer/store',
                gradient: 'from-accent-500/20 to-accent-600/5',
                border: 'border-accent-500/25 hover:border-accent-500/50',
                iconBg: 'bg-accent-500/15', iconColor: 'text-accent-400',
                glow: 'hover:shadow-accent-500/10',
              },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`group relative overflow-hidden bg-gradient-to-br ${item.gradient} border ${item.border} rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${item.glow}`}
              >
                <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                  <item.icon size={19} className={item.iconColor} />
                </div>
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-surface-500 text-xs mt-0.5">{item.sub}</p>
                <ChevronRight size={14} className="absolute top-5 right-4 text-surface-600 group-hover:text-surface-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Popular services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-widest">Popular Services</h2>
            <button onClick={() => navigate('/customer/request')} className="text-brand-400 hover:text-brand-300 text-xs font-semibold flex items-center gap-1 transition-colors">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SERVICES.slice(0, 4).map(s => (
              <button
                key={s.id}
                onClick={() => navigate('/customer/request')}
                className="group relative overflow-hidden bg-surface-900 border border-white/8 rounded-2xl p-4 text-center hover:border-brand-500/40 hover:bg-surface-800 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="text-3xl mb-2.5">{s.icon}</div>
                <p className="text-white text-xs font-semibold leading-tight">{s.name}</p>
                <p className="text-brand-400 text-xs mt-1.5 font-bold">from ${s.tiers.basic}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: 'Escrow Protected', sub: 'Pay only after approval', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Zap, label: '< 15 Min Response', sub: 'Avg. acceptance time', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: CheckCircle, label: 'Background Checked', sub: 'All techs verified', color: 'text-brand-400', bg: 'bg-brand-500/10' },
          ].map(t => (
            <div key={t.label} className="bg-surface-900/60 border border-white/[0.06] rounded-2xl p-4 text-center">
              <div className={`w-9 h-9 rounded-xl ${t.bg} flex items-center justify-center mx-auto mb-2`}>
                <t.icon size={16} className={t.color} />
              </div>
              <p className="text-white text-xs font-bold">{t.label}</p>
              <p className="text-surface-600 text-xs mt-0.5">{t.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent jobs */}
        {recentJobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-widest">Recent Jobs</h2>
              <button onClick={() => navigate('/customer/jobs')} className="text-brand-400 hover:text-brand-300 text-xs font-semibold flex items-center gap-1 transition-colors">
                View all <ChevronRight size={13} />
              </button>
            </div>
            <div className="space-y-2">
              {recentJobs.map(job => (
                <div key={job.id} className="flex items-center gap-4 bg-surface-900 border border-white/[0.06] rounded-2xl px-4 py-3 hover:border-white/12 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{job.service}</p>
                    <p className="text-surface-500 text-xs">{job.date} · {job.tier} tier</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-semibold text-sm">${job.price}</p>
                    <div className="flex items-center gap-0.5 justify-end mt-0.5">
                      {job.rating && Array.from({ length: job.rating }).map((_, i) => (
                        <Star key={i} size={9} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ads */}
        <div className="space-y-3">
          <div
            onClick={() => navigate('/comfort-connect')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-[#4da6ff]/25 hover:border-[#4da6ff]/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#003478]/70 via-[#00449e]/40 to-[#001a3d]/60" />
            <div className="absolute top-0 right-0 w-32 h-full bg-[#4da6ff]/5 blur-2xl" />
            <div className="relative flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">❄️</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[#4da6ff] text-xs font-bold">Comfort Connect Premier</span>
                  <span className="badge bg-[#4da6ff]/15 text-[#4da6ff] border-0 text-xs">#1 Partner</span>
                </div>
                <p className="text-white font-bold text-sm">Equipment Included — Zero Up-Front Cost</p>
              </div>
              <ArrowRight size={15} className="text-[#4da6ff] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-surface-900/60 border border-emerald-500/15 rounded-2xl px-4 py-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-lg">🌿</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="badge badge-purple text-xs">Sponsored</span>
                <span className="text-surface-500 text-xs">GreenLeaf Financing</span>
              </div>
              <p className="text-white font-semibold text-sm">HVAC Loans from 5.9% APR — Fast decisions, flexible terms</p>
            </div>
            <button className="btn-secondary py-1.5 text-xs px-3 flex-shrink-0">Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}
