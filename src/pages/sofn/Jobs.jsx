import { useState, useEffect } from 'react'
import { Wrench, Thermometer, Droplets, AlertTriangle, MapPin, Clock, DollarSign, ChevronRight, X, Check, Camera, FileText } from 'lucide-react'

const CATEGORY_ICONS = {
  'Tune-up': Wrench, 'Repair': Thermometer, 'Emergency': AlertTriangle,
  'Plumbing': Droplets, 'Cooling': Thermometer, 'Heating': Thermometer,
}

export default function SofnJobs({ availableJobs = [], myJobs = [], onAccept, onStart, onComplete, showMyJobsOnly = false }) {
  useEffect(() => { document.body.classList.add('sofn-body'); return () => document.body.classList.remove('sofn-body') }, [])
  const [filter, setFilter] = useState('All')
  const [detailJob, setDetailJob] = useState(null)
  const [workModal, setWorkModal] = useState(null)
  const [completeModal, setCompleteModal] = useState(null)
  const [workSummary, setWorkSummary] = useState('')
  const [photos, setPhotos] = useState([])
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const timeSince = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const filteredJobs = filter === 'All' ? availableJobs : availableJobs.filter(j => j.category === filter || j.service_name?.toLowerCase().includes(filter.toLowerCase()))

  const handleAccept = async (job) => {
    setLoading(true)
    await onAccept(job.id)
    setLoading(false)
  }

  const handleStartWork = async (job) => {
    if (!agreed) return
    setLoading(true)
    await onStart(job.id)
    setWorkModal(null)
    setAgreed(false)
    setLoading(false)
  }

  const handleCompleteWork = async (job) => {
    setLoading(true)
    await onComplete(job.id, workSummary, photos)
    setCompleteModal(null)
    setWorkSummary('')
    setPhotos([])
    setLoading(false)
  }

  const getStatusBadge = (status) => {
    const config = {
      assigned: { label: 'Assigned', cls: 'bg-[#0C6B5E]/10 text-[#0C6B5E]' },
      in_progress: { label: 'In Progress', cls: 'bg-[#C9852A]/10 text-[#C9852A]' },
      tech_complete: { label: 'Complete - Pending Confirmation', cls: 'bg-[#33485C]/10 text-[#33485C]' },
    }
    return config[status] || { label: status, cls: 'bg-[#DAD8D2] text-[#33485C]' }
  }

  return (
    <div className="space-y-8">
      {/* ── Available Dispatches ── */}
      {!showMyJobsOnly && (
        <section>
          <h2 className="text-lg font-display font-bold text-[#16202B] mb-4">Available Dispatches</h2>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['All', 'Tune-up', 'Repair', 'Emergency'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? 'bg-[#0C6B5E] text-white' : 'bg-white text-[#33485C] border border-[#DAD8D2] hover:border-[#0C6B5E]/40'
              }`}>{f}</button>
            ))}
          </div>
          {/* Job Cards */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#DAD8D2]">
              <p className="text-[#33485C] font-medium">No dispatches available right now</p>
              <p className="text-xs text-[#33485C]/60 mt-1">Check back soon</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map(job => {
                const Icon = CATEGORY_ICONS[job.category] || Wrench
                return (
                  <div key={job.id} className="bg-white rounded-xl border border-[#DAD8D2] p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0C6B5E]/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-[#0C6B5E]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#16202B] text-sm">{job.service_name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-[#33485C]/70">
                          <span className="flex items-center gap-1"><MapPin size={11} />{job.address_street}, {job.address_zip}</span>
                          <span className="flex items-center gap-1"><Clock size={11} />{job.estimated_time || '~45 min'}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} />{job.distance || '~2 mi'}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-[#0C6B5E] font-mono">${job.price}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => setDetailJob(job)} className="text-xs text-[#33485C] underline hover:text-[#0C6B5E]">Details</button>
                          <button onClick={() => handleAccept(job)} disabled={loading} className="px-4 py-1.5 bg-[#0C6B5E] hover:bg-[#094A40] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50">Accept</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* ── My Jobs ── */}
      <section>
        <h2 className="text-lg font-display font-bold text-[#16202B] mb-4">My Jobs</h2>
        {myJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#DAD8D2]">
            <p className="text-[#33485C] font-medium">No active jobs</p>
            <p className="text-xs text-[#33485C]/60 mt-1">Accept a dispatch to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myJobs.map(job => {
              const badge = getStatusBadge(job.status)
              return (
                <div key={job.id} className="bg-white rounded-xl border border-[#DAD8D2] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#16202B] text-sm">{job.service_name}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                      </div>
                      <p className="text-xs text-[#33485C]/70">{job.customer_name ? `${job.customer_name} · ` : ''}{job.address_street}, {job.address_city}</p>
                      <p className="text-xs text-[#33485C]/50 mt-0.5">
                        {job.status === 'assigned' && `Assigned ${timeSince(job.assigned_at)}`}
                        {job.status === 'in_progress' && `Started ${timeSince(job.started_at)}`}
                        {job.status === 'tech_complete' && `Completed ${timeSince(job.completed_at)}`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-[#0C6B5E] font-mono">${job.price}</p>
                      <div className="mt-2">
                        {job.status === 'assigned' && <button onClick={() => setWorkModal(job)} className="px-4 py-1.5 bg-[#0C6B5E] hover:bg-[#094A40] text-white text-xs font-semibold rounded-lg transition-colors">Start Work</button>}
                        {job.status === 'in_progress' && <button onClick={() => { setCompleteModal(job); setWorkSummary(''); setPhotos([]) }} className="px-4 py-1.5 bg-[#C9852A] hover:bg-[#A86B22] text-white text-xs font-semibold rounded-lg transition-colors">Complete Work</button>}
                        {job.status === 'tech_complete' && <span className="text-[10px] text-[#33485C]/50">Awaiting confirmation</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Detail Modal ── */}
      {detailJob && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setDetailJob(null)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-[#16202B]">{detailJob.service_name}</h3>
              <button onClick={() => setDetailJob(null)} className="p-1 hover:bg-[#F4F3EF] rounded"><X size={18} /></button>
            </div>
            <div className="space-y-2 text-sm text-[#33485C]">
              <p><span className="font-medium">Address:</span> {detailJob.address_street}, {detailJob.address_city} {detailJob.address_zip}</p>
              <p><span className="font-medium">Tier:</span> {detailJob.tier}</p>
              <p><span className="font-medium">Price:</span> <span className="font-mono font-bold text-[#0C6B5E]">${detailJob.price}</span></p>
              <p><span className="font-medium">Est. time:</span> {detailJob.estimated_time || '~45 min'}</p>
              <p><span className="font-medium">Distance:</span> {detailJob.distance || '~2 mi'}</p>
            </div>
            <button onClick={() => { handleAccept(detailJob); setDetailJob(null) }} disabled={loading} className="w-full mt-6 h-10 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors disabled:opacity-50">Accept Dispatch</button>
          </div>
        </div>
      )}

      {/* ── Start Work Modal ── */}
      {workModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => { setWorkModal(null); setAgreed(false) }}>
          <div className="bg-white rounded-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display font-bold text-[#16202B] mb-2">Ready to start?</h3>
            <p className="text-sm text-[#33485C] mb-4">{workModal.service_name} at {workModal.address_street}</p>
            <label className="flex items-start gap-2 cursor-pointer mb-6">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-[#DAD8D2] text-[#0C6B5E] focus:ring-[#0C6B5E]" />
              <span className="text-xs text-[#33485C]">I agree to follow SOFN service standards</span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => { setWorkModal(null); setAgreed(false) }} className="flex-1 h-10 border border-[#DAD8D2] rounded-lg text-[#33485C] font-medium text-sm">Cancel</button>
              <button onClick={() => handleStartWork(workModal)} disabled={!agreed || loading} className="flex-1 h-10 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-sm">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Confirm Start'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Complete Work Modal ── */}
      {completeModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setCompleteModal(null)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display font-bold text-[#16202B] mb-2">Complete Work</h3>
            <p className="text-sm text-[#33485C] mb-4">{completeModal.service_name} at {completeModal.address_street}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#33485C] mb-1">Work Summary (optional)</label>
              <textarea className="w-full h-24 px-4 py-2 rounded-lg border border-[#DAD8D2] text-sm text-[#16202B] focus:outline-none focus:border-[#0C6B5E] resize-none" value={workSummary} onChange={e => setWorkSummary(e.target.value)} placeholder="e.g. Tune-up completed, all coils cleaned, refrigerant checked" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#33485C] mb-1">Upload Photos (2-3 of completed work)</label>
              <div className="border-2 border-dashed border-[#DAD8D2] rounded-lg p-4 text-center cursor-pointer hover:border-[#0C6B5E] transition-colors" onClick={() => document.getElementById('photoUpload').click()}>
                <Camera size={20} className="mx-auto mb-1 text-[#33485C]" />
                <p className="text-xs text-[#33485C]">Tap to add photos</p>
                <input id="photoUpload" type="file" accept="image/*" multiple className="hidden" onChange={e => setPhotos([...photos, ...Array.from(e.target.files).slice(0, 3 - photos.length)])} />
              </div>
              {photos.length > 0 && <div className="flex gap-2 mt-2">{photos.map((p, i) => <div key={i} className="w-12 h-12 rounded-lg bg-[#F4F3EF] border border-[#DAD8D2] flex items-center justify-center text-[10px] text-[#33485C] font-medium">{i + 1}</div>)}</div>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCompleteModal(null)} className="flex-1 h-10 border border-[#DAD8D2] rounded-lg text-[#33485C] font-medium text-sm">Cancel</button>
              <button onClick={() => handleCompleteWork(completeModal)} disabled={loading} className="flex-1 h-10 bg-[#C9852A] hover:bg-[#A86B22] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-sm">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}