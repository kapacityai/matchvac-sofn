import React, { useState } from 'react'
import Header from '../../components/Header'
import { Star, ThumbsUp, MessageCircle, TrendingUp, Award, ChevronDown, ChevronUp } from 'lucide-react'

const REVIEWS = [
  { id: 'r1', customer: 'Sarah K.', avatar: 'SK', service: 'Furnace Repair', date: '2026-05-05', rating: 5, text: 'Marcus was incredibly professional and fixed our furnace in under an hour. He explained everything clearly and the price was exactly what was quoted. Will definitely use again!', helpful: 4 },
  { id: 'r2', customer: 'Robert M.', avatar: 'RM', service: 'A/C Tune-Up', date: '2026-05-04', rating: 5, text: 'Great service! On time, efficient, and very knowledgeable. Pointed out a minor issue before it became a big problem. Really appreciate the thoroughness.', helpful: 2 },
  { id: 'r3', customer: 'Diana P.', avatar: 'DP', service: '🚨 No Heat Emergency', date: '2026-05-03', rating: 4, text: 'Arrived within 30 minutes on a freezing night — absolute lifesaver. Did a great job. Only reason for 4 stars is there was a small mess left behind.', helpful: 1 },
  { id: 'r4', customer: 'Priya S.', avatar: 'PS', service: 'Water Heater Repair', date: '2026-04-28', rating: 5, text: 'Marcus was super polite and knowledgeable. Had our water heater running perfectly in no time. Would highly recommend to anyone.', helpful: 6 },
  { id: 'r5', customer: 'Tom W.', avatar: 'TW', service: 'Thermostat Installation', date: '2026-04-22', rating: 5, text: 'Clean, fast, and no surprises. Installed our Nest thermostat perfectly and even walked us through the app setup. 10/10.', helpful: 3 },
  { id: 'r6', customer: 'Linda G.', avatar: 'LG', service: 'Annual HVAC Inspection', date: '2026-04-15', rating: 5, text: 'Very thorough inspection. Marcus caught two issues that could have become expensive repairs down the line. So glad we booked!', helpful: 8 },
]

const ratingDist = { 5: 210, 4: 28, 3: 6, 2: 2, 1: 1 }
const totalReviews = Object.values(ratingDist).reduce((s, n) => s + n, 0)
const avgRating = (
  Object.entries(ratingDist).reduce((s, [r, n]) => s + Number(r) * n, 0) / totalReviews
).toFixed(1)

function StarRow({ count, total, value }) {
  const pct = Math.round((count / total) * 100)
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-surface-400 text-xs w-4 text-right">{value}</span>
      <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />
      <div className="flex-1 h-2 bg-surface-150 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-surface-500 text-xs w-8 text-right">{pct}%</span>
    </div>
  )
}

export default function TechReviews() {
  const [expanded, setExpanded] = useState(null)
  const [helpfulClicked, setHelpfulClicked] = useState({})

  const markHelpful = (id) => {
    setHelpfulClicked(h => ({ ...h, [id]: true }))
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="My Reviews" subtitle="Customer feedback and ratings" />

      <div className="flex-1 p-6 space-y-6 max-w-4xl">

        {/* Rating summary */}
        <div className="card">
          <div className="flex items-start gap-8 flex-wrap">
            {/* Big number */}
            <div className="text-center flex-shrink-0">
              <p className="text-6xl font-extrabold text-surface-900 leading-none">{avgRating}</p>
              <div className="flex items-center justify-center gap-0.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-surface-700'} />
                ))}
              </div>
              <p className="text-surface-400 text-xs mt-1">{totalReviews} reviews</p>
            </div>

            {/* Distribution bars */}
            <div className="flex-1 min-w-52 space-y-2">
              {[5, 4, 3, 2, 1].map(v => (
                <StarRow key={v} value={v} count={ratingDist[v] || 0} total={totalReviews} />
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              {[
                { label: 'Completion Rate', value: '100%', icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { label: 'On-Time Arrival', value: '97%', icon: TrendingUp, color: 'text-brand-500', bg: 'bg-brand-400/10' },
                { label: 'Total Reviews', value: `${totalReviews}`, icon: MessageCircle, color: 'text-brand-500', bg: 'bg-brand-50' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <s.icon size={15} className={s.color} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold leading-tight">{s.value}</p>
                    <p className="text-surface-500 text-xs">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badge callout */}
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-900/30 to-navy-900 border border-amber-500/30">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
            <Award size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="text-white font-bold">Top Rated Pro</p>
            <p className="text-surface-400 text-sm">You're in the top 5% of all technicians on MatcHvac. Keep it up!</p>
          </div>
        </div>

        {/* Review list */}
        <div>
          <h3 className="section-title mb-4">Recent Reviews</h3>
          <div className="space-y-3">
            {REVIEWS.map(review => (
              <div key={review.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-navy-700 flex items-center justify-center text-xs font-bold text-surface-900 flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <p className="text-white font-semibold">{review.customer}</p>
                      <span className="badge badge-purple">{review.service}</span>
                      <span className="text-surface-500 text-xs">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-700'} />
                      ))}
                    </div>
                    <p className="text-surface-300 text-sm leading-relaxed">{review.text}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => markHelpful(review.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${helpfulClicked[review.id] ? 'text-emerald-400' : 'text-surface-500 hover:text-white'}`}
                      >
                        <ThumbsUp size={13} />
                        <span>Helpful ({review.helpful + (helpfulClicked[review.id] ? 1 : 0)})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
