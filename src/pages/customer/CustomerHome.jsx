import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { useAuth } from '../../context/AuthContext'
import { MOCK_JOBS, SERVICES } from '../../data/mockData'
import { Wrench, ShoppingBag, MapPin, ChevronRight, AlertTriangle, CheckCircle, Clock, Star } from 'lucide-react'

const customerJobs = MOCK_JOBS.filter(j => ['j1','j2','j3','j4'].includes(j.id))

export default function CustomerHome() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const activeJob = customerJobs.find(j => j.status === 'in_progress')
  const recentJobs = customerJobs.filter(j => j.status === 'completed').slice(0, 2)

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title={`Hey, ${user?.name?.split(' ')[0]} 👋`} subtitle="What can we fix for you today?" />

      <div className="flex-1 p-6 space-y-6 max-w-4xl">
        {/* Active job alert — ACTION REQUIRED */}
        {activeJob && (
          <div
            onClick={() => navigate('/customer/track')}
            className="cursor-pointer animate-fade-in rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-r from-emerald-900/30 to-surface-900 hover:border-emerald-400 transition-all"
          >
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center gap-2 rounded-t-2xl">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Action Required — Payment Pending</span>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={22} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold">{activeJob.service} — Complete!</p>
                <p className="text-surface-400 text-sm">Marcus Rivera has marked the job done. Confirm to release $149.00 from escrow.</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold whitespace-nowrap">
                Approve &amp; Pay <ChevronRight size={16} />
              </div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <h2 className="section-title mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Wrench, label: 'Request Service', sub: 'Book a technician now', path: '/customer/request', color: 'from-brand-500/20 to-brand-600/10 border-brand-500/30', iconColor: 'text-brand-400' },
              { icon: AlertTriangle, label: 'Emergency', sub: 'No heat / no A/C', path: '/customer/request?emergency=true', color: 'from-rose-500/20 to-rose-600/10 border-rose-500/30', iconColor: 'text-rose-400' },
              { icon: ShoppingBag, label: 'Shop Products', sub: 'Filters, thermostats & more', path: '/customer/store', color: 'from-accent-500/20 to-accent-600/10 border-accent-500/30', iconColor: 'text-accent-400' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`card-hover text-left bg-gradient-to-br ${item.color} p-4`}
              >
                <item.icon size={22} className={`${item.iconColor} mb-3`} />
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-surface-400 text-xs mt-0.5">{item.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Popular services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Popular Services</h2>
            <button onClick={() => navigate('/customer/request')} className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SERVICES.slice(0, 4).map(s => (
              <button
                key={s.id}
                onClick={() => navigate('/customer/request')}
                className="card-hover text-center p-4"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-white text-xs font-semibold leading-tight">{s.name}</p>
                <p className="text-brand-400 text-xs mt-1 font-medium">from ${s.tiers.basic}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent jobs */}
        {recentJobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Recent Jobs</h2>
              <button onClick={() => navigate('/customer/jobs')} className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1">
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {recentJobs.map(job => (
                <div key={job.id} className="card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={18} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{job.service}</p>
                    <p className="text-surface-400 text-xs">{job.date} · {job.tier} tier</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm">${job.price}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {job.rating && Array.from({ length: job.rating }).map((_, i) => (
                        <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ad slots */}
        <div className="space-y-3">
          {/* Comfort Connect — permanent featured placement */}
          <div
            onClick={() => navigate('/comfort-connect')}
            className="cursor-pointer rounded-2xl border-2 border-[#003478] bg-gradient-to-r from-[#003478]/40 to-[#001a3d]/60 hover:border-[#4da6ff] transition-all group"
          >
            <div className="bg-[#003478] px-4 py-1.5 rounded-t-xl flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><path d="M20 4L4 16v20h10V24h12v12h10V16L20 4z" fill="white" opacity="0.9"/></svg>
              <span className="text-white font-bold text-xs tracking-wide">Comfort Connect</span>
              <span className="ml-auto text-[#4da6ff] text-xs font-semibold">#1 Recommended Partner</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="text-3xl flex-shrink-0">❄️</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">Premier Program® — Equipment Included, No Up-Front Cost</p>
                <p className="text-surface-400 text-xs mt-0.5">All repairs + maintenance + consumables included in one low monthly payment.</p>
              </div>
              <button className="bg-[#003478] group-hover:bg-[#00449e] border border-[#4da6ff]/40 text-white font-bold py-2 px-3 rounded-xl text-xs flex-shrink-0 transition-all whitespace-nowrap">
                See If I Qualify
              </button>
            </div>
          </div>
          {/* GreenLeaf Financing — service page ad slot */}
          <div className="card bg-gradient-to-r from-emerald-900/20 to-surface-900 border-emerald-500/20 flex items-center gap-4">
            <div className="text-3xl flex-shrink-0">🌿</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-purple text-xs">Sponsored</span>
                <span className="text-surface-500 text-xs">GreenLeaf Financing</span>
              </div>
              <p className="text-white font-semibold text-sm">HVAC Loans from 5.9% APR</p>
              <p className="text-surface-400 text-xs mt-0.5">For qualified customers. Fast decisions, flexible terms.</p>
            </div>
            <button className="btn-secondary py-2 text-xs px-3 flex-shrink-0">Apply Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}
