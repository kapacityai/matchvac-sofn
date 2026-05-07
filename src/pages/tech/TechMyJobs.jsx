import React, { useState } from 'react'
import Header from '../../components/Header'
import { MOCK_JOBS } from '../../data/mockData'
import { CheckCircle, Clock, Wrench, Camera, MapPin, Upload, Check } from 'lucide-react'

const techJobs = MOCK_JOBS.filter(j => ['j1','j2','j3','j4'].includes(j.id))

export default function TechMyJobs() {
  const [uploadedJob, setUploadedJob] = useState(null)
  const [completedJob, setCompletedJob] = useState(null)

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="My Jobs" subtitle="Active & completed job history" />
      <div className="flex-1 p-6 max-w-3xl space-y-4">
        {techJobs.map(job => {
          const isActive = job.status === 'in_progress'
          const isDone = job.status === 'completed' || completedJob === job.id
          return (
            <div key={job.id} className={`card ${isActive ? 'border-brand-500/40 bg-brand-500/5' : ''}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-bold">{job.service}</h3>
                    {isActive && <span className="badge badge-blue">Active</span>}
                    {(isDone) && <span className="badge badge-green">Completed</span>}
                  </div>
                  <div className="flex items-center gap-2 text-surface-400 text-sm">
                    <MapPin size={13} />
                    <span>{job.address || '3310 Birch Ave, Costa Mesa, CA'}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-emerald-400 font-bold">${job.netPay}</p>
                  <p className="text-surface-500 text-xs">net payout</p>
                </div>
              </div>

              {isActive && !completedJob && (
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setUploadedJob(job.id)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${uploadedJob === job.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-surface-800 text-surface-300 hover:bg-surface-700 border border-white/10'}`}
                  >
                    {uploadedJob === job.id ? <><Check size={15} /> Photos Uploaded</> : <><Camera size={15} /> Upload Completion Photos</>}
                  </button>
                  <button
                    disabled={!uploadedJob}
                    onClick={() => setCompletedJob(job.id)}
                    className={`w-full btn-primary py-2.5 ${!uploadedJob ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <CheckCircle size={16} /> Mark Job Complete
                  </button>
                  {!uploadedJob && <p className="text-surface-500 text-xs text-center">Upload completion photos first</p>}
                </div>
              )}

              {completedJob === job.id && (
                <div className="mt-3 pt-3 border-t border-white/10 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <CheckCircle size={18} />
                    <span className="font-semibold">Job marked complete. Awaiting customer confirmation.</span>
                  </div>
                  <p className="text-surface-500 text-xs mt-1">Payout of ${job.netPay} will process within 2–3 business days</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
