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
    <div className="flex flex-col h-full overflow-auto bg-surface-100">
      <Header title={`Hey, ${firstName} 👋`} subtitle="What can we fix for you today?" />

      <div className="flex-1 p-6 space-y-6 max-w-4xl">

        {/* Active job alert */}
        {activeJob && (
          <div
            onClick={() => navigate('/customer/track')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-emerald-300 bg-white hover:border-emerald-400 hover:shadow-md transition-all animate-fade-in"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent" />
            <div className="px-4 py-2 flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/60">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Action Required — Awaiting Your Confirmation</span>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                <Lock size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-surface-900 font-bold">{activeJob.service} — Marked Complete</p>
                <p className="text-surface-500 text-sm mt-0.5">Marcus Rivera finished the job. Confirm to release <span className="text-emerald-600 font-semibold">$149.00</span> from escrow.</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold whitespace-nowrap group-hover:gap-2 transition-all">
                Approve &amp; Pay <ArrowRight size={15} />
              </div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <h2 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: Wrench, label: 'Request Service', sub: 'Book a technician now',
                path: '/customer/request',
                bg: 'bg-white border-surface-200 hover:border-brand-400',
                iconBg: 'bg-brand-100', iconColor: 'text-brand-500',
              },
              {
                icon: AlertTriangle, label: 'Emergency', sub: 'No heat / no A/C — 24/7',
                path: '/customer/request?emergency=true',
                bg: 'bg-white border-surface-200 hover:border-rose-400',
                iconBg: 'bg-rose-100', iconColor: 'text-rose-500',
              },
              {
                icon: ShoppingBag, label: 'Shop Products', sub: 'Filters, thermostats & more',
                path: '/customer/store',
                bg: 'bg-white border-surface-200 hover:border-accent-400',
                iconBg: 'bg-accent-500/10', iconColor: 'text-accent-500',
              },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`group relative overflow-hidden border ${item.bg} rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                  <item.icon size={19} className={item.iconColor} />
                </div>
                <p className="text-surface-900 font-semibold text-sm">{item.label}</p>
                <p className="text-surface-500 text-xs mt-0.5">{item.sub}</p>
                <ChevronRight size={14} className="absolute top-5 right-4 text-surface-300 group-hover:text-surface-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Popular services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-surface-500 uppercase tracking-widest">Popular Services</h2>
            <button onClick={() => navigate('/customer/request')} className="text-brand-500 hover:text-brand-600 text-xs font-semibold flex items-center gap-1 transition-colors">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SERVICES.slice(0, 4).map(s => (
              <button
                key={s.id}
                onClick={() => navigate('/customer/request')}
                className="group relative overflow-hidden bg-white border border-surface-200 rounded-2xl p-4 text-center hover:border-brand-400 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="text-3xl mb-2.5">{s.icon}</div>
                <p className="text-surface-900 text-xs font-semibold leading-tight">{s.name}</p>
                <p className="text-brand-500 text-xs mt-1.5 font-bold">from ${s.tiers.basic}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: 'Escrow Protected', sub: 'Pay only after approval', color: 'text-emerald-600', bg: 'bg-emerald-100' },
            { icon: Zap, label: '< 15 Min Response', sub: 'Avg. acceptance time', color: 'text-amber-600', bg: 'bg-amber-100' },
            { icon: CheckCircle, label: 'Background Checked', sub: 'All techs verified', color: 'text-brand-500', bg: 'bg-brand-100' },
          ].map(t => (
            <div key={t.label} className="bg-white border border-surface-200 rounded-2xl p-4 text-center shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${t.bg} flex items-center justify-center mx-auto mb-2`}>
                <t.icon size={16} className={t.color} />
              </div>
              <p className="text-surface-900 text-xs font-bold">{t.label}</p>
              <p className="text-surface-400 text-xs mt-0.5">{t.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent jobs */}
        {recentJobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-surface-500 uppercase tracking-widest">Recent Jobs</h2>
              <button onClick={() => navigate('/customer/jobs')} className="text-brand-500 hover:text-brand-600 text-xs font-semibold flex items-center gap-1 transition-colors">
                View all <ChevronRight size={13} />
              </button>
            </div>
            <div className="space-y-2">
              {recentJobs.map(job => (
                <div key={job.id} className="flex items-center gap-4 bg-white border border-surface-200 rounded-2xl px-4 py-3 hover:border-surface-300 hover:shadow-sm transition-all">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-surface-900 font-medium text-sm truncate">{job.service}</p>
                    <p className="text-surface-400 text-xs">{job.date} · {job.tier} tier</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-surface-900 font-semibold text-sm">${job.price}</p>
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
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-brand-200 bg-white hover:border-brand-400 hover:shadow-md transition-all"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-accent-400 to-brand-400" />
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-xl flex-shrink-0">❄️</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-brand-600 text-xs font-bold">Comfort Connect Premier</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">#1 Partner</span>
                  <span className="text-xs text-surface-400">· Sponsored</span>
                </div>
                <p className="text-surface-900 font-bold text-sm">Equipment Included — Zero Up-Front Cost</p>
              </div>
              <ArrowRight size={15} className="text-brand-500 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-lg">🌿</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-500/10 text-accent-600">Sponsored</span>
                <span className="text-surface-500 text-xs">GreenLeaf Financing</span>
              </div>
              <p className="text-surface-900 font-semibold text-sm">HVAC Loans from 5.9% APR — Fast decisions, flexible terms</p>
            </div>
            <button className="btn-secondary py-1.5 text-xs px-3 flex-shrink-0">Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}
