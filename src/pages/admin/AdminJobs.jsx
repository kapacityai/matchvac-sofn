import React, { useState } from 'react'
import Header from '../../components/Header'
import { MOCK_JOBS } from '../../data/mockData'
import { AlertTriangle, CheckCircle, Clock, Wrench, Filter } from 'lucide-react'

export default function AdminJobs() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? MOCK_JOBS : MOCK_JOBS.filter(j => j.status === filter || (filter === 'urgent' && j.urgent))

  const statusMap = {
    completed: { label: 'Completed', badge: 'badge-green', icon: CheckCircle },
    in_progress: { label: 'In Progress', badge: 'badge-blue', icon: Wrench },
    available: { label: 'Open', badge: 'badge-yellow', icon: Clock },
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Jobs" subtitle="All platform jobs — oversight & dispatch" />
      <div className="flex-1 p-6 max-w-5xl space-y-5">
        <div className="flex gap-2 flex-wrap">
          {['all', 'in_progress', 'available', 'completed', 'urgent'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? 'bg-brand-500 text-surface-900' : 'bg-surface-150 text-surface-400 border border-surface-200 hover:text-white'}`}>
              {f === 'all' ? 'All Jobs' : f === 'in_progress' ? 'Active' : f === 'available' ? 'Open' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left px-5 py-3 text-surface-400 font-medium">Service</th>
                <th className="text-left px-5 py-3 text-surface-400 font-medium hidden md:table-cell">Customer</th>
                <th className="text-left px-5 py-3 text-surface-400 font-medium hidden lg:table-cell">Tech</th>
                <th className="text-right px-5 py-3 text-surface-400 font-medium">Total</th>
                <th className="text-right px-5 py-3 text-surface-400 font-medium">Fee</th>
                <th className="text-right px-5 py-3 text-surface-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job, i) => {
                const sm = statusMap[job.status] || statusMap.available
                return (
                  <tr key={job.id} className={`${i < filtered.length - 1 ? 'border-b border-surface-150' : ''} hover:bg-white/5 transition-colors`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{job.service}</span>
                        {job.urgent && <span className="badge badge-red">!</span>}
                      </div>
                      <p className="text-surface-500 text-xs mt-0.5">{job.date} · {job.tier}</p>
                    </td>
                    <td className="px-5 py-3 text-surface-400 hidden md:table-cell">{job.customer || '—'}</td>
                    <td className="px-5 py-3 text-surface-400 hidden lg:table-cell">{job.tech || '—'}</td>
                    <td className="px-5 py-3 text-right text-surface-900 font-semibold">${job.price}</td>
                    <td className="px-5 py-3 text-right text-brand-400">${job.techFee || '—'}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`badge ${sm.badge}`}>{sm.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
