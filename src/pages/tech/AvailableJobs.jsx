import React, { useState } from 'react'
import Header from '../../components/Header'
import { MOCK_JOBS } from '../../data/mockData'
import { MapPin, Clock, DollarSign, AlertTriangle, Zap, CheckCircle } from 'lucide-react'

export default function AvailableJobs() {
  const [claimed, setClaimed] = useState(null)
  const jobs = MOCK_JOBS.filter(j => j.status === 'available')

  const handleClaim = (id) => {
    setClaimed(id)
    setTimeout(() => setClaimed(null), 2000)
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Available Jobs" subtitle="First come, first served — claim fast" />

      <div className="flex-1 p-6 max-w-3xl space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-surface-150 border border-surface-200 rounded-xl text-sm text-surface-300">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
          <span>{jobs.length} jobs available in your coverage area (Costa Mesa, CA + 25mi radius)</span>
        </div>

        {jobs.map(job => (
          <div
            key={job.id}
            className={`card transition-all ${job.urgent ? 'border-rose-500/30 bg-rose-500/5' : 'hover:border-brand-500/30'} ${claimed === job.id ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}
          >
            {job.urgent && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <AlertTriangle size={16} className="text-rose-400" />
                <span className="text-rose-400 text-sm font-semibold">Emergency — Priority Dispatch</span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-white font-bold">{job.service}</h3>
                  <span className="badge badge-blue">{job.tier}</span>
                  {job.urgent && <span className="badge badge-red">URGENT</span>}
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-surface-400">
                    <MapPin size={14} className="flex-shrink-0" />
                    <span>{job.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Clock size={14} className="flex-shrink-0" />
                    <span>Today, {job.date}</span>
                  </div>
                </div>

                {/* Payout breakdown */}
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-surface-500 text-xs">Service price</span>
                    <p className="text-white font-medium">${job.price}</p>
                  </div>
                  <div className="text-surface-700">−</div>
                  <div>
                    <span className="text-surface-500 text-xs">Platform fee (15%)</span>
                    <p className="text-rose-400 font-medium">-${job.techFee}</p>
                  </div>
                  <div className="text-surface-700">=</div>
                  <div>
                    <span className="text-surface-500 text-xs">Your payout</span>
                    <p className="text-emerald-400 font-bold text-lg">${job.netPay}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                {claimed === job.id ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-semibold text-sm">
                    <CheckCircle size={16} /> Claimed!
                  </div>
                ) : (
                  <button
                    onClick={() => handleClaim(job.id)}
                    className={`btn-primary py-3 px-5 ${job.urgent ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                  >
                    <Zap size={16} /> Accept Job
                  </button>
                )}
                <button className="btn-secondary py-2 text-xs">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
