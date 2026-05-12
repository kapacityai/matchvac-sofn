import React, { useState } from 'react'
import Header from '../../components/Header'
import { Star, ChevronRight, CheckCircle, Clock, Wrench } from 'lucide-react'

const COMPLETED_JOBS = [
  { id: 'j1', service: 'Furnace Repair', tech: 'Marcus Rivera', techAvatar: 'MR', date: '2026-05-05', price: 249, tier: 'Standard', rating: 5, review: 'Incredibly professional. Fixed our furnace in under an hour and explained everything clearly.' },
  { id: 'j2', service: 'A/C Tune-Up', tech: 'Marcus Rivera', techAvatar: 'MR', date: '2026-05-04', price: 89, tier: 'Basic', rating: 5, review: 'On time, efficient, and very knowledgeable. Pointed out a minor issue before it became a big problem.' },
  { id: 'j3', service: '🚨 No Heat Emergency', tech: 'Marcus Rivera', techAvatar: 'MR', date: '2026-05-03', price: 699, tier: 'Premium', rating: 4, review: 'Arrived within 30 minutes on a freezing night. Did a great job overall.' },
]

const PENDING_REVIEW_JOB = {
  id: 'j4', service: 'Thermostat Installation', tech: 'Marcus Rivera', techAvatar: 'MR', date: '2026-05-07', price: 149, tier: 'Standard',
}

export default function CustomerReviews() {
  const [submitted, setSubmitted] = useState({})
  const [active, setActive] = useState(null)       // job being reviewed
  const [draft, setDraft] = useState({ rating: 0, hover: 0, text: '' })

  const openReview = (job) => {
    setActive(job)
    setDraft({ rating: 0, hover: 0, text: '' })
  }

  const submitReview = () => {
    if (draft.rating === 0) return
    setSubmitted(s => ({ ...s, [active.id]: { rating: draft.rating, text: draft.text } }))
    setActive(null)
  }

  const avgRating = COMPLETED_JOBS.reduce((s, j) => s + j.rating, 0) / COMPLETED_JOBS.length

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="My Reviews" subtitle="Rate your service experiences" />

      <div className="flex-1 p-6 max-w-3xl space-y-6">

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="stat-card text-center">
            <p className="text-3xl font-extrabold text-white">{avgRating.toFixed(1)}</p>
            <div className="flex justify-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} className={i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-surface-700'} />
              ))}
            </div>
            <p className="text-surface-400 text-xs mt-1">Avg Rating Given</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-3xl font-extrabold text-white">{COMPLETED_JOBS.length}</p>
            <p className="text-surface-400 text-xs mt-1.5">Reviews Written</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-3xl font-extrabold text-brand-400">1</p>
            <p className="text-surface-400 text-xs mt-1.5">Awaiting Review</p>
          </div>
        </div>

        {/* Pending review callout */}
        {!submitted[PENDING_REVIEW_JOB.id] && (
          <div
            onClick={() => openReview(PENDING_REVIEW_JOB)}
            className="cursor-pointer rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-900/20 to-surface-900 hover:border-amber-400/60 transition-all p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
              <Star size={18} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">Rate your recent service</p>
              <p className="text-surface-400 text-xs">{PENDING_REVIEW_JOB.service} · {PENDING_REVIEW_JOB.tech} · {PENDING_REVIEW_JOB.date}</p>
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-sm font-bold whitespace-nowrap">
              Leave a Review <ChevronRight size={15} />
            </div>
          </div>
        )}

        {submitted[PENDING_REVIEW_JOB.id] && (
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400 text-sm font-semibold">
              Thanks for rating {PENDING_REVIEW_JOB.service}! Your {submitted[PENDING_REVIEW_JOB.id].rating}-star review has been submitted.
            </p>
          </div>
        )}

        {/* Past reviews */}
        <div>
          <h3 className="section-title mb-4">Your Past Reviews</h3>
          <div className="space-y-3">
            {COMPLETED_JOBS.map(job => (
              <div key={job.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {job.techAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-white font-semibold text-sm">{job.service}</p>
                      <span className="badge badge-purple">{job.tech}</span>
                      <span className="text-surface-500 text-xs">{job.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} className={i < job.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-700'} />
                      ))}
                      <span className="text-surface-500 text-xs ml-1.5">{job.rating}.0</span>
                    </div>
                    {job.review && (
                      <p className="text-surface-300 text-sm leading-relaxed">{job.review}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-surface-500">
                      <span>${job.price} · {job.tier}</span>
                      <span className="badge badge-green">Verified Purchase</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Review modal */}
      {active && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xl font-bold text-white mx-auto">
              {active.techAvatar}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Rate Your Experience</h3>
              <p className="text-surface-400 text-sm">{active.service} · {active.tech}</p>
              <p className="text-surface-500 text-xs mt-0.5">${active.price} · {active.date}</p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map(r => (
                <button
                  key={r}
                  onClick={() => setDraft(d => ({ ...d, rating: r }))}
                  onMouseEnter={() => setDraft(d => ({ ...d, hover: r }))}
                  onMouseLeave={() => setDraft(d => ({ ...d, hover: 0 }))}
                >
                  <Star size={36} className={r <= (draft.hover || draft.rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-700'} />
                </button>
              ))}
            </div>

            {draft.rating > 0 && (
              <p className="text-amber-400 font-semibold text-sm -mt-1">
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][draft.rating]}
              </p>
            )}

            <textarea
              value={draft.text}
              onChange={e => setDraft(d => ({ ...d, text: e.target.value }))}
              placeholder="Tell others about your experience (optional)…"
              rows={3}
              className="input resize-none text-sm"
            />

            <div className="flex gap-2">
              <button onClick={() => setActive(null)} className="btn-ghost flex-1 py-2.5 text-sm border border-white/10">
                Cancel
              </button>
              <button
                disabled={draft.rating === 0}
                onClick={submitReview}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${draft.rating > 0 ? 'btn-primary' : 'bg-surface-800 text-surface-500 cursor-not-allowed'}`}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
