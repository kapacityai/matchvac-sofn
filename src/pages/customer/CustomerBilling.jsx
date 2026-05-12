import React, { useState } from 'react'
import Header from '../../components/Header'
import { CreditCard, Plus, Shield, CheckCircle, ChevronRight, Trash2, X, Check, DollarSign, Download, Clock } from 'lucide-react'

const PAYMENT_METHODS = [
  { id: 'pm1', brand: 'Visa', last4: '4242', expiry: '09/28', isDefault: true },
  { id: 'pm2', brand: 'Mastercard', last4: '5555', expiry: '03/27', isDefault: false },
]

const TRANSACTIONS = [
  { id: 'tx1', description: 'Furnace Repair — Standard', tech: 'Marcus Rivera', date: '2026-05-05', amount: 249.00, status: 'paid', method: '•••• 4242' },
  { id: 'tx2', description: 'A/C Tune-Up — Basic', tech: 'Marcus Rivera', date: '2026-05-04', amount: 89.00, status: 'paid', method: '•••• 4242' },
  { id: 'tx3', description: '🚨 No Heat Emergency — Premium', tech: 'Marcus Rivera', date: '2026-05-03', amount: 699.00, status: 'paid', method: '•••• 5555' },
  { id: 'tx4', description: 'Thermostat Installation — Standard', tech: 'Marcus Rivera', date: '2026-05-07', amount: 149.00, status: 'escrow', method: '•••• 4242' },
]

const BRAND_STYLES = {
  Visa: { bg: 'bg-blue-600', label: 'VISA', font: 'font-black italic text-white' },
  Mastercard: { bg: 'bg-orange-500', label: 'MC', font: 'font-black text-white' },
}

function CardChip() {
  return (
    <div className="w-8 h-6 rounded bg-amber-400/80 border border-amber-300/30 flex items-center justify-center">
      <div className="w-5 h-4 rounded-sm border border-amber-300/40 grid grid-cols-2 gap-px p-0.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-amber-300/40 rounded-sm" />
        ))}
      </div>
    </div>
  )
}

export default function CustomerBilling() {
  const [methods, setMethods] = useState(PAYMENT_METHODS)
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [saving, setSaving] = useState(false)
  const [cardSaved, setCardSaved] = useState(false)

  const setDefault = (id) => setMethods(m => m.map(x => ({ ...x, isDefault: x.id === id })))
  const removeCard = (id) => setMethods(m => m.filter(x => x.id !== id))

  const handleAddCard = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const last4 = newCard.number.replace(/\s/g, '').slice(-4)
      setMethods(m => [...m, {
        id: `pm${Date.now()}`,
        brand: newCard.number.startsWith('4') ? 'Visa' : 'Mastercard',
        last4,
        expiry: newCard.expiry,
        isDefault: false,
      }])
      setSaving(false)
      setCardSaved(true)
      setShowAddCard(false)
      setNewCard({ number: '', expiry: '', cvv: '', name: '' })
      setTimeout(() => setCardSaved(false), 3000)
    }, 1400)
  }

  const formatCardNumber = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 16)
    return v.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 4)
    return v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v
  }

  const totalSpent = TRANSACTIONS.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0)
  const escrow = TRANSACTIONS.filter(t => t.status === 'escrow').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Billing & Payments" subtitle="Payment methods and transaction history" />

      <div className="flex-1 p-6 max-w-3xl space-y-6">

        {/* Card saved banner */}
        {cardSaved && (
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-fade-in">
            <Check size={16} className="text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400 text-sm font-semibold">Payment method added successfully.</p>
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="stat-card text-center">
            <p className="text-2xl font-extrabold text-white">${totalSpent.toLocaleString()}</p>
            <p className="text-surface-400 text-xs mt-1">Total Spent</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-extrabold text-amber-400">${escrow.toFixed(2)}</p>
            <p className="text-surface-400 text-xs mt-1">In Escrow</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-extrabold text-brand-400">{TRANSACTIONS.filter(t => t.status === 'paid').length}</p>
            <p className="text-surface-400 text-xs mt-1">Paid Jobs</p>
          </div>
        </div>

        {/* Payment methods */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Payment Methods</h3>
            <button onClick={() => setShowAddCard(true)} className="btn-primary text-sm py-2 px-4">
              <Plus size={14} /> Add Card
            </button>
          </div>

          <div className="space-y-3">
            {methods.map(card => {
              const bs = BRAND_STYLES[card.brand] || BRAND_STYLES.Visa
              return (
                <div key={card.id} className={`card flex items-center gap-4 ${card.isDefault ? 'border-brand-500/40 bg-brand-500/5' : ''}`}>
                  {/* Card visual */}
                  <div className={`w-14 h-9 rounded-lg ${bs.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-xs ${bs.font}`}>{bs.label}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold text-sm">{card.brand} •••• {card.last4}</p>
                      {card.isDefault && <span className="badge badge-green">Default</span>}
                    </div>
                    <p className="text-surface-500 text-xs">Expires {card.expiry}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!card.isDefault && (
                      <button
                        onClick={() => setDefault(card.id)}
                        className="text-xs text-brand-400 hover:text-brand-300 font-semibold px-2 py-1 rounded-lg hover:bg-brand-500/10 transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    {methods.length > 1 && (
                      <button
                        onClick={() => removeCard(card.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 size={13} className="text-surface-500 hover:text-rose-400" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 mt-3 px-1">
            <Shield size={13} className="text-emerald-400 flex-shrink-0" />
            <p className="text-surface-500 text-xs">Payments processed securely via Stripe. Card details never stored on our servers.</p>
          </div>
        </div>

        {/* Transaction history */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Transaction History</h3>
            <button className="text-brand-400 hover:text-brand-300 text-xs font-semibold flex items-center gap-1">
              <Download size={12} /> Export
            </button>
          </div>

          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 text-surface-400 font-medium">Service</th>
                  <th className="text-right px-5 py-3 text-surface-400 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-surface-400 font-medium">Amount</th>
                  <th className="text-right px-5 py-3 text-surface-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((tx, i) => (
                  <tr key={tx.id} className={`${i < TRANSACTIONS.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.03] transition-colors`}>
                    <td className="px-5 py-3">
                      <p className="text-white font-medium text-xs leading-tight">{tx.description}</p>
                      <p className="text-surface-500 text-xs">{tx.tech} · {tx.method}</p>
                    </td>
                    <td className="px-5 py-3 text-right text-surface-400 text-xs hidden sm:table-cell">{tx.date}</td>
                    <td className="px-5 py-3 text-right text-white font-bold">${tx.amount.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right">
                      {tx.status === 'paid'
                        ? <span className="badge badge-green"><CheckCircle size={10} /> Paid</span>
                        : <span className="badge badge-yellow"><Clock size={10} /> Escrow</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add card modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">Add Payment Method</h3>
              <button onClick={() => setShowAddCard(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <X size={15} className="text-surface-300" />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-surface-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Cardholder Name</label>
                <input
                  value={newCard.name}
                  onChange={e => setNewCard(c => ({ ...c, name: e.target.value }))}
                  placeholder="Jordan Smith"
                  required
                  className="input text-sm"
                />
              </div>
              <div>
                <label className="block text-surface-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Card Number</label>
                <div className="relative">
                  <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                  <input
                    value={newCard.number}
                    onChange={e => setNewCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    className="input text-sm pl-10 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-surface-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Expiry</label>
                  <input
                    value={newCard.expiry}
                    onChange={e => setNewCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    className="input text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-surface-400 text-xs font-semibold uppercase tracking-wider mb-1.5">CVV</label>
                  <input
                    value={newCard.cvv}
                    onChange={e => setNewCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    placeholder="•••"
                    maxLength={4}
                    required
                    className="input text-sm font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-800/50 rounded-xl border border-white/10">
                <Shield size={13} className="text-emerald-400 flex-shrink-0" />
                <p className="text-surface-500 text-xs">Secured by Stripe · 256-bit SSL encryption</p>
              </div>

              <button type="submit" disabled={saving} className={`btn-primary w-full py-3 text-sm ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                ) : (
                  <><CreditCard size={15} /> Add Card</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
