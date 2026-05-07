import React, { useState } from 'react'
import Header from '../../components/Header'
import { AD_SLOTS } from '../../data/mockData'
import { Plus, Eye, MousePointer, ToggleLeft, ToggleRight, Upload, X } from 'lucide-react'

export default function AdminAds() {
  const [ads, setAds] = useState(AD_SLOTS)
  const [showModal, setShowModal] = useState(false)
  const [newAd, setNewAd] = useState({ partner: '', type: 'homepage_banner' })

  const toggle = (id) => setAds(a => a.map(ad => ad.id === id ? { ...ad, active: !ad.active } : ad))

  const PLACEMENTS = ['homepage_banner', 'service_page', 'post_job', 'store_sidebar']

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Advertising" subtitle="Partner ad slots & campaign management" />

      <div className="flex-1 p-6 max-w-5xl space-y-6">
        {/* Comfort Connect featured */}
        <div className="card bg-gradient-to-r from-brand-900/40 to-accent-900/30 border-brand-500/30">
          <div className="flex items-start gap-4">
            <div className="text-4xl">❄️</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-bold text-lg">Comfort Connect Premier Program</h3>
                <span className="badge badge-blue">Featured Sponsor</span>
              </div>
              <p className="text-surface-400 text-sm mb-2">Permanent featured placement — homepage, service flow, and job completion screen.</p>
              <div className="flex gap-6 text-sm">
                <div><p className="text-surface-500 text-xs">Monthly Impressions</p><p className="text-white font-bold">142,000</p></div>
                <div><p className="text-surface-500 text-xs">Monthly Clicks</p><p className="text-brand-400 font-bold">8,921</p></div>
                <div><p className="text-surface-500 text-xs">CTR</p><p className="text-emerald-400 font-bold">6.3%</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Header action */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="section-title">Ad Campaigns</h3>
            <p className="section-sub">{ads.filter(a => a.active).length} active, {ads.length} total</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
            <Plus size={16} /> New Campaign
          </button>
        </div>

        {/* Ad slots */}
        <div className="space-y-3">
          {PLACEMENTS.map(placement => {
            const placementAds = ads.filter(a => a.type === placement)
            return (
              <div key={placement} className="card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-surface-300 font-semibold text-sm capitalize">{placement.replace(/_/g, ' ')} Slot</p>
                  <span className={`badge ${placementAds.some(a => a.active) ? 'badge-green' : 'badge-yellow'}`}>
                    {placementAds.some(a => a.active) ? 'Occupied' : 'Available'}
                  </span>
                </div>

                {placementAds.length === 0 ? (
                  <div className="border border-dashed border-white/10 rounded-xl py-6 text-center">
                    <p className="text-surface-500 text-sm">No campaigns — slot available</p>
                    <button onClick={() => setShowModal(true)} className="text-brand-400 text-sm mt-1 hover:text-brand-300">+ Add partner</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {placementAds.map(ad => (
                      <div key={ad.id} className="flex items-center gap-4 px-4 py-3 bg-surface-800/50 rounded-xl">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ad.active ? 'bg-emerald-400' : 'bg-surface-600'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{ad.partner}</p>
                        </div>
                        <div className="flex gap-5 text-xs hidden sm:flex">
                          <div className="flex items-center gap-1 text-surface-400">
                            <Eye size={12} /> {ad.impressions.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-surface-400">
                            <MousePointer size={12} /> {ad.clicks}
                          </div>
                        </div>
                        <button onClick={() => toggle(ad.id)} className="flex-shrink-0">
                          {ad.active
                            ? <ToggleRight size={22} className="text-brand-400" />
                            : <ToggleLeft size={22} className="text-surface-500" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* New campaign modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">New Ad Campaign</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center">
                <X size={16} className="text-white" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Partner Name</label>
                <input className="input" placeholder="e.g. GreenLeaf Financing" value={newAd.partner} onChange={e => setNewAd({...newAd, partner: e.target.value})} />
              </div>
              <div>
                <label className="label">Placement</label>
                <select className="input" value={newAd.type} onChange={e => setNewAd({...newAd, type: e.target.value})}>
                  {PLACEMENTS.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Ad Creative</label>
                <div className="border border-dashed border-white/15 rounded-xl p-5 text-center cursor-pointer hover:border-brand-500/40 transition-colors">
                  <Upload size={18} className="text-surface-500 mx-auto mb-1" />
                  <p className="text-surface-400 text-sm">Upload banner image</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button
                  onClick={() => {
                    if (newAd.partner) {
                      setAds(a => [...a, { id: `ad${Date.now()}`, partner: newAd.partner, type: newAd.type, active: true, impressions: 0, clicks: 0 }])
                      setShowModal(false)
                      setNewAd({ partner: '', type: 'homepage_banner' })
                    }
                  }}
                  className="btn-primary flex-1"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
