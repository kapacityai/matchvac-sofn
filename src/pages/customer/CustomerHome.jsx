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
        {/* Active job alert */}
        {activeJob && (
          <div
            onClick={() => navigate('/customer/track')}
            className="card-hover border-brand-500/40 bg-brand-500/5 cursor-pointer animate-fade-in"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Wrench size={22} className="text-brand-400 animate-pulse-slow" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="badge badge-blue">Active Job</span>
                  <span className="text-surface-500 text-xs">•</span>
                  <span className="text-surface-400 text-xs">In Progress</span>
                </div>
                <p className="text-white font-semibold">{activeJob.service}</p>
                <p className="text-surface-400 text-sm">Tech {activeJob.tech} is working on your system</p>
              </div>
              <div className="flex items-center gap-1 text-brand-400 text-sm font-medium">
                Track <ChevronRight size={16} />
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

        {/* Comfort Connect promo */}
        <div className="card bg-gradient-to-r from-brand-900/40 to-accent-900/40 border-brand-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center flex-shrink-0 text-2xl">
              ❄️
            </div>
            <div className="flex-1">
              <div className="badge badge-blue mb-2">Featured Partner</div>
              <h3 className="text-white font-bold mb-1">Comfort Connect Premier Program</h3>
              <p className="text-surface-400 text-sm mb-3">Get exclusive financing on HVAC equipment. 0% APR for 18 months on approved credit.</p>
              <button className="btn-primary py-2 text-sm">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
