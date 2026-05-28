import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { SERVICES } from '../../data/mockData'
import { customer as customerApi } from '../../lib/api'
import {
  Wrench, ShoppingBag, ChevronRight, AlertTriangle, CheckCircle,
  Clock, Star, Zap, ArrowRight, Shield, Wind, Flame, Droplets,
  Thermometer, Search, Bell
} from 'lucide-react'

const CATEGORY_CONFIG = {
  'Heating':     { bg: 'bg-orange-50',  border: 'border-orange-200', iconBg: 'bg-orange-100', text: 'text-orange-600', icon: Flame },
  'Cooling':     { bg: 'bg-blue-50',    border: 'border-blue-200',   iconBg: 'bg-blue-100',   text: 'text-blue-600',   icon: Wind },
  'Plumbing':    { bg: 'bg-cyan-50',    border: 'border-cyan-200',   iconBg: 'bg-cyan-100',   text: 'text-cyan-600',   icon: Droplets },
  'Air Quality': { bg: 'bg-green-50',   border: 'border-green-200',  iconBg: 'bg-green-100',  text: 'text-green-600',  icon: Wind },
  'Controls':    { bg: 'bg-purple-50',  border: 'border-purple-200', iconBg: 'bg-purple-100', text: 'text-purple-600', icon: Thermometer },
  'Maintenance': { bg: 'bg-amber-50',   border: 'border-amber-200',  iconBg: 'bg-amber-100',  text: 'text-amber-600',  icon: Wrench },
}

const SHOWCASE = ['Heating','Cooling','Plumbing','Air Quality','Controls','Maintenance'].map(cat => {
  const service = SERVICES.find(s => s.category === cat)
  return service ? { ...service, cfg: CATEGORY_CONFIG[cat] } : null
}).filter(Boolean)

export default function CustomerHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    customerApi.jobs()
      .then(data => setJobs(Array.isArray(data) ? data : data?.jobs || []))
      .catch(() => setJobs([]))
  }, [])

  const activeJob = jobs.find(j => j.status === 'in_progress')
  const recentJobs = jobs.filter(j => j.status === 'completed').slice(0, 3)

  return (
    <div className="flex flex-col h-full overflow-auto bg-surface-100">

      {/* Top bar */}
      <div className="bg-white border-b border-surface-200 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-surface-400 text-sm">Good to see you,</p>
            <h1 className="text-surface-900 font-black text-2xl leading-tight">{firstName} 👋</h1>
          </div>
          <button className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors">
            <Bell size={20} className="text-surface-600" />
          </button>
        </div>
        <button
          onClick={() => navigate('/customer/request')}
          className="w-full flex items-center gap-3 bg-surface-100 border border-surface-200 rounded-2xl px-4 py-3 hover:border-brand-400 hover:bg-brand-50/30 transition-all text-left"
        >
          <Search size={18} className="text-surface-400" />
          <span className="text-surface-400 text-sm">Search HVAC services…</span>
        </button>
      </div>

      <div className="flex-1 space-y-6 py-5">

        {/* Emergency CTA */}
        <div className="px-4">
          <button
            onClick={() => navigate('/customer/request?emergency=true')}
            className="w-full flex items-center gap-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-[0.98] transition-all rounded-2xl px-5 py-4 shadow-lg shadow-rose-500/20"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-black text-base">No Heat / No A/C?</p>
              <p className="text-rose-100 text-sm">24/7 emergency dispatch · techs in minutes</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronRight size={18} className="text-white" />
            </div>
          </button>
        </div>

        {/* Active job alert */}
        {activeJob && (
          <div className="px-4">
            <button
              onClick={() => navigate('/customer/track')}
              className="w-full flex items-center gap-4 bg-white border-2 border-emerald-400 rounded-2xl px-4 py-3.5 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-emerald-700 text-xs font-bold uppercase tracking-wide">Job in Progress</p>
                <p className="text-surface-900 font-semibold text-sm truncate">{activeJob.service_name || activeJob.service}</p>
              </div>
              <span className="text-emerald-600 text-sm font-bold flex items-center gap-1 whitespace-nowrap">
                Track <ArrowRight size={14} />
              </span>
            </button>
          </div>
        )}

        {/* Quick actions */}
        <div className="px-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Wrench,      label: 'Book Service', path: '/customer/request', bg: 'bg-brand-500'   },
              { icon: ShoppingBag, label: 'Shop Parts',   path: '/customer/store',   bg: 'bg-brand-500'  },
              { icon: Clock,       label: 'My Jobs',      path: '/customer/jobs',    bg: 'bg-surface-700' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-2 bg-white border border-surface-200 rounded-2xl py-4 px-2 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center`}>
                  <item.icon size={20} className="text-white" />
                </div>
                <span className="text-surface-900 text-xs font-semibold text-center leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Service categories grid */}
        <div>
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-surface-900 font-black text-base">Services</h2>
            <button onClick={() => navigate('/customer/request')} className="text-brand-500 text-sm font-semibold flex items-center gap-1">
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="px-4 grid grid-cols-2 gap-3">
            {SHOWCASE.map(service => (
              <button
                key={service.id}
                onClick={() => navigate('/customer/request')}
                className={`${service.cfg.bg} border ${service.cfg.border} rounded-2xl p-4 text-left hover:shadow-md active:scale-[0.97] transition-all`}
              >
                <div className={`w-10 h-10 ${service.cfg.iconBg} rounded-xl flex items-center justify-center text-xl mb-3`}>
                  {service.icon}
                </div>
                <p className="text-surface-900 font-bold text-sm leading-tight">{service.category}</p>
                <p className={`text-xs font-semibold mt-1 ${service.cfg.text}`}>from ${service.tiers.basic}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="px-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield,      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Escrow',    sub: 'Pay after done'   },
              { icon: Zap,         color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   label: '< 15 Min',  sub: 'Avg response'     },
              { icon: CheckCircle, color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',    label: 'Verified',  sub: 'Background check' },
            ].map(t => (
              <div key={t.label} className={`${t.bg} border ${t.border} rounded-2xl p-3 text-center`}>
                <t.icon size={18} className={`${t.color} mx-auto mb-1.5`} />
                <p className="text-surface-900 text-xs font-bold">{t.label}</p>
                <p className="text-surface-500 text-xs mt-0.5 leading-tight">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent jobs */}
        {recentJobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-surface-900 font-black text-base">Recent Jobs</h2>
              <button onClick={() => navigate('/customer/jobs')} className="text-brand-500 text-sm font-semibold flex items-center gap-1">
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="px-4 space-y-2">
              {recentJobs.map(job => (
                <div key={job.id} className="bg-white border border-surface-200 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-surface-900 font-semibold text-sm truncate">{job.service_name || job.service}</p>
                    <p className="text-surface-400 text-xs">{job.created_at ? new Date(job.created_at).toLocaleDateString() : job.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-surface-900 font-bold text-sm">${job.price}</p>
                    {job.rating && (
                      <div className="flex items-center gap-0.5 justify-end mt-0.5">
                        {Array.from({ length: job.rating }).map((_, i) => (
                          <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for new users */}
        {recentJobs.length === 0 && !activeJob && (
          <div className="px-4">
            <div className="bg-white border border-surface-200 rounded-2xl px-6 py-8 text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wrench size={28} className="text-brand-500" />
              </div>
              <p className="text-surface-900 font-bold mb-1">Ready when you are</p>
              <p className="text-surface-400 text-sm mb-5">Book your first service and get a certified tech at your door fast.</p>
              <button onClick={() => navigate('/customer/request')} className="btn-primary px-8 py-3">
                Book a Technician
              </button>
            </div>
          </div>
        )}

        {/* Partner banner */}
        <div className="px-4 pb-4">
          <button
            onClick={() => navigate('/comfort-connect')}
            className="w-full flex items-center gap-3 bg-white border border-surface-200 rounded-2xl px-4 py-3.5 hover:border-brand-400 hover:shadow-sm transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
              <Wind size={20} className="text-brand-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-brand-600 text-xs font-bold">Comfort Connect Premier · Sponsored</p>
              <p className="text-surface-900 font-semibold text-sm">New equipment, zero upfront cost</p>
            </div>
            <ArrowRight size={16} className="text-surface-400 flex-shrink-0" />
          </button>
        </div>

      </div>
    </div>
  )
}
