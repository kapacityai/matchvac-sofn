import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { admin } from '../../lib/api'
import { UserCheck, User, CheckCircle, Clock, XCircle, Star, ChevronDown, ChevronUp, FileText } from 'lucide-react'

export default function AdminUsers() {
  const [tab, setTab] = useState('techs')
  const [expanded, setExpanded] = useState(null)
  const [techs, setTechs] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [techStatuses, setTechStatuses] = useState({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [techData, custData] = await Promise.all([
          admin.users({ role: 'tech' }).catch(() => null),
          admin.users({ role: 'customer' }).catch(() => null),
        ])
        if (cancelled) return
        if (techData && techData.users) {
          const enriched = techData.users.map(u => ({
            id: u.id,
            name: u.name || u.email,
            email: u.email,
            status: 'active',
            location: '',
            certifications: [],
            rating: 5.0,
            jobs: 0,
          }))
          setTechs(enriched)
          setTechStatuses(Object.fromEntries(enriched.map(t => [t.id, t.status])))
        }
        if (custData && custData.users) {
          setCustomers(custData.users.map(u => ({
            id: u.id,
            name: u.name || u.email,
            email: u.email,
            jobs: 0,
            spent: 0,
            joinDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : '—',
            status: 'active',
          })))
        }
      } catch {
        // fallback to mock
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const displayTechs = techs
  const displayCustomers = customers

  const approve = (id) => setTechStatuses(s => ({ ...s, [id]: 'active' }))
  const reject = (id) => setTechStatuses(s => ({ ...s, [id]: 'rejected' }))

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="User Management" subtitle="Customers, techs & document review" />

      <div className="flex-1 p-6 max-w-5xl space-y-5">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-surface-200 pb-0">
          {['techs', 'customers'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold capitalize -mb-px transition-all ${tab === t ? 'text-brand-400 border-b-2 border-brand-400' : 'text-surface-400 hover:text-white'}`}
            >
              {t === 'techs' ? `HVAC Technicians (${displayTechs.length})` : `Customers (${displayCustomers.length})`}
            </button>
          ))}
        </div>

        {tab === 'techs' && (
          <div className="space-y-3">
            {loading && techs.length === 0 && (
              <div className="card text-center py-8">
                <p className="text-surface-400">Loading technicians...</p>
              </div>
            )}
            {displayTechs.map(tech => {
              const status = techStatuses[tech.id] || tech.status || 'active'
              const isPending = status === 'pending'
              return (
                <div key={tech.id} className={`card ${isPending ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-navy-700 flex items-center justify-center text-sm font-bold text-surface-900 flex-shrink-0">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-white font-bold">{tech.name}</p>
                        <span className={`badge ${status === 'active' ? 'badge-green' : status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                          {status === 'active' ? 'Active' : status === 'pending' ? 'Pending Review' : 'Rejected'}
                        </span>
                      </div>
                      <p className="text-surface-400 text-sm">{tech.email} · {tech.location || '—'}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(tech.certifications || []).map(c => (
                          <span key={c} className="badge badge-purple">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {status !== 'pending' && (
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-1">
                            <Star size={13} className="text-amber-400 fill-amber-400" />
                            <span className="text-white text-sm font-semibold">{tech.rating || '—'}</span>
                          </div>
                          <p className="text-surface-500 text-xs">{tech.jobs || 0} jobs</p>
                        </div>
                      )}
                      {isPending && (
                        <>
                          <button onClick={() => reject(tech.id)} className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center hover:bg-rose-500/20 transition-colors">
                            <XCircle size={18} className="text-rose-400" />
                          </button>
                          <button onClick={() => approve(tech.id)} className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                            <CheckCircle size={18} className="text-emerald-400" />
                          </button>
                        </>
                      )}
                      <button onClick={() => setExpanded(expanded === tech.id ? null : tech.id)} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        {expanded === tech.id ? <ChevronUp size={16} className="text-white" /> : <ChevronDown size={16} className="text-white" />}
                      </button>
                    </div>
                  </div>

                  {expanded === tech.id && (
                    <div className="mt-4 pt-4 border-t border-surface-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm animate-fade-in">
                      {[
                        { label: "Driver's License", icon: FileText, status: 'uploaded' },
                        { label: 'W-9 Form', icon: FileText, status: 'uploaded' },
                        { label: 'HVAC Certs', icon: FileText, status: 'uploaded' },
                        { label: 'Bank Info', icon: FileText, status: status === 'active' ? 'verified' : 'pending' },
                      ].map(doc => (
                        <div key={doc.label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-150/50">
                          <doc.icon size={14} className={doc.status === 'verified' ? 'text-emerald-400' : doc.status === 'uploaded' ? 'text-brand-400' : 'text-surface-500'} />
                          <div>
                            <p className="text-white text-xs font-medium">{doc.label}</p>
                            <p className={`text-xs capitalize ${doc.status === 'verified' ? 'text-emerald-400' : doc.status === 'uploaded' ? 'text-brand-400' : 'text-surface-500'}`}>{doc.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {tab === 'customers' && (
          <div className="card overflow-hidden p-0">
            {loading && customers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-surface-400">Loading customers...</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left px-5 py-3 text-surface-400 font-medium">Customer</th>
                    <th className="text-right px-5 py-3 text-surface-400 font-medium">Jobs</th>
                    <th className="text-right px-5 py-3 text-surface-400 font-medium">Total Spent</th>
                    <th className="text-right px-5 py-3 text-surface-400 font-medium hidden sm:table-cell">Member Since</th>
                    <th className="text-right px-5 py-3 text-surface-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayCustomers.map((c, i) => (
                    <tr key={c.id} className={`${i < displayCustomers.length - 1 ? 'border-b border-surface-150' : ''} hover:bg-white/5 transition-colors`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-navy-700 flex items-center justify-center text-xs font-bold text-surface-900 flex-shrink-0">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-white font-medium">{c.name}</p>
                            <p className="text-surface-500 text-xs">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-surface-900">{c.jobs || 0}</td>
                      <td className="px-5 py-3 text-right text-emerald-400 font-semibold">${(c.spent || 0).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right text-surface-400 hidden sm:table-cell">{c.joinDate || '—'}</td>
                      <td className="px-5 py-3 text-right"><span className="badge badge-green">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}