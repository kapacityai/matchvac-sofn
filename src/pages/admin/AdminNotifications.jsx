import React, { useState } from 'react'
import Header from '../../components/Header'
import { Bell, CheckCircle, AlertTriangle, Info, User, Briefcase, DollarSign, Shield, X, Check, Settings } from 'lucide-react'

const TYPE_CONFIG = {
  alert:   { icon: AlertTriangle, color: 'text-rose-400',    bg: 'bg-rose-400/10',    badge: 'badge-red',    dot: 'bg-rose-400' },
  info:    { icon: Info,          color: 'text-brand-400',   bg: 'bg-brand-400/10',   badge: 'badge-blue',   dot: 'bg-brand-400' },
  success: { icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-400/10', badge: 'badge-green',  dot: 'bg-emerald-400' },
  warning: { icon: AlertTriangle, color: 'text-amber-400',   bg: 'bg-amber-400/10',   badge: 'badge-yellow', dot: 'bg-amber-400' },
}

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'alert',   category: 'techs',    title: 'New Tech Awaiting Approval', body: 'Jordan Lee has submitted all documents and is awaiting background check clearance.', time: '2 min ago', read: false },
  { id: 'n2', type: 'alert',   category: 'jobs',     title: 'Emergency Job Unassigned', body: 'A "No A/C Emergency" job in Hyattsville, MD has been open for 22 minutes with no tech assigned.', time: '18 min ago', read: false },
  { id: 'n3', type: 'warning', category: 'revenue',  title: 'Daily Revenue Below Target', body: "Today's revenue of $847 is 32% below the daily average. Consider activating surge pricing.", time: '1 hr ago', read: false },
  { id: 'n4', type: 'success', category: 'techs',    title: 'Tech Document Verified', body: 'Deja Williams has completed all required document uploads. Account is now fully active.', time: '2 hr ago', read: false },
  { id: 'n5', type: 'info',    category: 'jobs',     title: 'Job Completed — Payout Queued', body: 'Furnace Repair (Jordan Smith / Marcus Rivera) completed. $211.65 payout queued for ACH.', time: '3 hr ago', read: true },
  { id: 'n6', type: 'info',    category: 'store',    title: 'Low Stock Alert', body: 'Filtrete 1" MERV 11 Air Filter (6-pack) has only 3 units remaining in inventory.', time: '5 hr ago', read: true },
  { id: 'n7', type: 'alert',   category: 'platform', title: 'Payout Failure', body: 'ACH payout for Marcus Rivera ($466.65) failed — bank account info needs to be updated.', time: 'Yesterday', read: true },
  { id: 'n8', type: 'success', category: 'revenue',  title: 'New Financing Partner Referral', body: 'GreenLeaf Financing confirmed a $12,500 loan origination. Referral fee: $375 credited.', time: 'Yesterday', read: true },
  { id: 'n9', type: 'info',    category: 'techs',    title: 'New Subscription Upgrade', body: 'Marcus Rivera upgraded from Pro to Elite ($99/mo). Monthly recurring revenue increased by $50.', time: '2 days ago', read: true },
  { id: 'n10', type: 'warning', category: 'platform', title: 'Ad Campaign Expiring', body: "GreenLeaf Financing's banner campaign expires in 3 days. Notify partner to renew.", time: '2 days ago', read: true },
]

const CATEGORY_LABELS = {
  all:      'All',
  techs:    'Techs',
  jobs:     'Jobs',
  revenue:  'Revenue',
  platform: 'Platform',
  store:    'Store',
}

export default function AdminNotifications() {
  const [notes, setNotes] = useState(INITIAL_NOTIFICATIONS)
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const markRead = (id) => setNotes(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  const markAllRead = () => setNotes(n => n.map(x => ({ ...x, read: true })))
  const dismiss = (id) => setNotes(n => n.filter(x => x.id !== id))

  const filtered = notes
    .filter(n => filter === 'all' || n.category === filter)
    .filter(n => typeFilter === 'all' || n.type === typeFilter)

  const unread = notes.filter(n => !n.read).length

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Notifications" subtitle={`${unread} unread alerts`} />

      <div className="flex-1 p-6 max-w-4xl space-y-5">

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === k ? 'bg-brand-500 text-surface-900' : 'bg-surface-150 text-surface-400 border border-surface-200 hover:text-white'}`}
              >
                {v}
              </button>
            ))}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
              <Check size={12} /> Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <Bell size={32} className="text-surface-600 mx-auto mb-3" />
            <p className="text-surface-400 font-semibold">No notifications</p>
            <p className="text-surface-600 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(note => {
              const tc = TYPE_CONFIG[note.type]
              const Icon = tc.icon
              return (
                <div
                  key={note.id}
                  onClick={() => markRead(note.id)}
                  className={`card cursor-pointer transition-all hover:border-brand-500/30 ${!note.read ? 'border-surface-300 bg-white/[0.04]' : 'opacity-70'}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Unread dot */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                      <div className={`w-8 h-8 rounded-xl ${tc.bg} flex items-center justify-center`}>
                        <Icon size={15} className={tc.color} />
                      </div>
                      {!note.read && <div className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className={`text-sm font-bold ${!note.read ? 'text-white' : 'text-surface-300'}`}>{note.title}</p>
                        <span className={`badge ${tc.badge} capitalize`}>{note.type}</span>
                        <span className="badge badge-purple capitalize">{note.category}</span>
                      </div>
                      <p className="text-surface-400 text-xs leading-relaxed">{note.body}</p>
                      <p className="text-surface-600 text-xs mt-1.5">{note.time}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); dismiss(note.id) }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0 mt-0.5"
                    >
                      <X size={13} className="text-surface-500" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Notification prefs teaser */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-150/50 border border-surface-200">
          <Settings size={15} className="text-surface-500 flex-shrink-0" />
          <p className="text-surface-400 text-xs flex-1">Manage notification preferences in <span className="text-brand-400 cursor-pointer hover:underline">Platform Settings</span></p>
        </div>
      </div>
    </div>
  )
}
