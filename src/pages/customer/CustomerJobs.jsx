import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { customer as customerApi } from '../../lib/api'
import { CheckCircle, Clock, Wrench, Star, ChevronRight, ArrowRight } from 'lucide-react'

const statusConfig = {
  completed: { label: 'Completed', badge: 'badge-green', icon: CheckCircle },
  in_progress: { label: 'In Progress', badge: 'badge-blue', icon: Wrench },
  pending: { label: 'Pending', badge: 'badge-yellow', icon: Clock },
}

export default function CustomerJobs() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    customerApi.jobs().then(data => {
      setJobs(Array.isArray(data) ? data : data?.jobs || [])
    }).catch(() => setJobs([])).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="My Jobs" subtitle="Your service history and active requests" />
      <div className="flex-1 p-6 max-w-3xl space-y-5">
        <div className="flex gap-2">
          {['all', 'in_progress', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-brand-500 text-surface-900' : 'bg-surface-150 text-surface-400 border border-surface-200 hover:text-white'}`}>
              {f === 'all' ? 'All Jobs' : f === 'in_progress' ? 'Active' : 'Completed'}
            </button>
          ))}
        </div>
        {loading && <div className="text-center text-surface-400 py-12">Loading jobs...</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-surface-150 flex items-center justify-center mx-auto mb-4">
              <Wrench size={28} className="text-surface-400" />
            </div>
            <p className="text-surface-900 font-semibold mb-1">No jobs yet</p>
            <p className="text-surface-400 text-sm mb-5">Book your first service to get started</p>
            <button onClick={() => navigate('/customer/request')} className="btn-primary px-6">Book a Technician</button>
          </div>
        )}
        <div className="space-y-3">
          {filtered.map(job => {
            const sc = statusConfig[job.status] || statusConfig.pending
            return (
              <div key={job.id} className="card-hover">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${job.status === 'completed' ? 'bg-emerald-500/10' : 'bg-brand-500/10'}`}>
                    <sc.icon size={18} className={job.status === 'completed' ? 'text-emerald-400' : 'text-brand-400'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-white font-semibold">{job.service}</p>
                      <span className={`badge ${sc.badge}`}>{sc.label}</span>
                    </div>
                    <p className="text-surface-400 text-sm">{job.date} · {job.tier} tier</p>
                    {job.tech && <p className="text-surface-500 text-xs mt-0.5">Tech: {job.tech}</p>}
                    {job.rating && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({length: job.rating}).map((_, i) => (
                          <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-bold">${job.price}</p>
                    {job.status === 'in_progress' ? (
                      <button
                        onClick={() => navigate('/customer/track')}
                        className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
                      >
                        Approve &amp; Pay <ArrowRight size={12} />
                      </button>
                    ) : (
                      <ChevronRight size={16} className="text-surface-500 ml-auto mt-1" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
