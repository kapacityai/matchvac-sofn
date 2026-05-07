import React, { useState } from 'react'
import Header from '../../components/Header'
import { FileText, Download, AlertCircle, CheckCircle, TrendingUp, Car } from 'lucide-react'

export default function TaxCenter() {
  const [mileage, setMileage] = useState([
    { date: '2026-05-05', miles: 28, note: 'Costa Mesa → Newport Beach and back' },
    { date: '2026-05-04', miles: 14, note: 'Irvine job' },
    { date: '2026-05-03', miles: 41, note: 'Laguna Beach emergency' },
  ])
  const [newMiles, setNewMiles] = useState('')
  const [newNote, setNewNote] = useState('')

  const ytdGross = 50462
  const ytdFees = 7569
  const ytdNet = ytdGross - ytdFees
  const totalMiles = mileage.reduce((s, m) => s + m.miles, 0)
  const mileageDeduction = (totalMiles * 0.67).toFixed(2)

  // Estimated quarterly tax (simplified)
  const estTax = (ytdNet * 0.25 * (5 / 12)).toFixed(2)

  const addMileage = () => {
    if (!newMiles) return
    setMileage(m => [{ date: new Date().toISOString().split('T')[0], miles: parseInt(newMiles), note: newNote }, ...m])
    setNewMiles(''); setNewNote('')
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Tax Center" subtitle="1099-NEC tracking & quarterly estimates" />

      <div className="flex-1 p-6 space-y-6 max-w-3xl">
        {/* Notice */}
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <AlertCircle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-400 text-sm font-semibold">Independent Contractor Reminder</p>
            <p className="text-amber-300/70 text-xs mt-0.5">You will receive a 1099-NEC at year-end. Quarterly estimated taxes are due April, June, September, and January.</p>
          </div>
        </div>

        {/* YTD Summary */}
        <div className="card">
          <h3 className="section-title mb-4">Year-to-Date Summary (2026)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {[
              { label: 'Gross Earnings', value: `$${ytdGross.toLocaleString()}`, color: 'text-white' },
              { label: 'Platform Fees Paid', value: `-$${ytdFees.toLocaleString()}`, color: 'text-rose-400' },
              { label: 'Net Income', value: `$${ytdNet.toLocaleString()}`, color: 'text-emerald-400' },
              { label: 'Business Miles', value: `${totalMiles} mi`, color: 'text-brand-400' },
              { label: 'Mileage Deduction', value: `-$${mileageDeduction}`, color: 'text-emerald-400' },
              { label: 'Est. Taxable Income', value: `$${(ytdNet - parseFloat(mileageDeduction)).toLocaleString()}`, color: 'text-white' },
            ].map(s => (
              <div key={s.label} className="bg-surface-800/50 rounded-xl p-3">
                <p className="text-surface-400 text-xs mb-1">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quarterly estimate */}
        <div className="card bg-gradient-to-r from-rose-900/20 to-surface-900 border-rose-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={18} className="text-rose-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">Q2 2026 Estimated Tax Due</p>
              <p className="text-surface-400 text-sm">Due June 15, 2026</p>
              <p className="text-rose-400 text-2xl font-extrabold mt-1">${estTax}</p>
              <p className="text-surface-500 text-xs mt-1">~25% effective rate on YTD net income (federal estimate only)</p>
            </div>
          </div>
        </div>

        {/* 1099 Document */}
        <div className="card">
          <h3 className="section-title mb-3">Tax Documents</h3>
          <div className="space-y-2">
            {[
              { label: '1099-NEC 2025', status: 'available', note: 'Available for download' },
              { label: '1099-NEC 2026', status: 'pending', note: 'Available January 31, 2027' },
            ].map(doc => (
              <div key={doc.label} className="flex items-center gap-3 px-4 py-3 bg-surface-800/50 rounded-xl">
                <FileText size={18} className={doc.status === 'available' ? 'text-brand-400' : 'text-surface-600'} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${doc.status === 'available' ? 'text-white' : 'text-surface-500'}`}>{doc.label}</p>
                  <p className="text-surface-500 text-xs">{doc.note}</p>
                </div>
                {doc.status === 'available' ? (
                  <button className="btn-secondary py-1.5 text-xs">
                    <Download size={13} /> Download
                  </button>
                ) : (
                  <span className="badge badge-yellow">Pending</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mileage log */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Mileage Log</h3>
              <p className="section-sub">IRS standard rate: $0.67/mile for 2026</p>
            </div>
          </div>

          {/* Add entry */}
          <div className="flex gap-2 mb-4">
            <input className="input w-24 flex-shrink-0" placeholder="Miles" type="number" value={newMiles} onChange={e => setNewMiles(e.target.value)} />
            <input className="input flex-1" placeholder="Note / route" value={newNote} onChange={e => setNewNote(e.target.value)} />
            <button onClick={addMileage} className="btn-primary py-2 text-sm flex-shrink-0">Add</button>
          </div>

          <div className="space-y-2">
            {mileage.map((m, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Car size={15} className="text-surface-500 flex-shrink-0" />
                <span className="text-surface-400 flex-shrink-0">{m.date}</span>
                <span className="text-white font-medium flex-shrink-0">{m.miles} mi</span>
                <span className="text-surface-500 truncate">{m.note}</span>
                <span className="text-emerald-400 text-xs flex-shrink-0 ml-auto">${(m.miles * 0.67).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/8 flex justify-between text-sm">
            <span className="text-surface-400">Total deduction</span>
            <span className="text-emerald-400 font-bold">${mileageDeduction}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
