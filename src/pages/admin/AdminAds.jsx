import React, { useState } from 'react'
import Header from '../../components/Header'
import { Plus, Eye, MousePointer, ToggleLeft, ToggleRight, Upload, X } from 'lucide-react'

export default function AdminAds() {
  const [ads, setAds] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newAd, setNewAd] = useState({ partner: '', type: 'homepage_banner' })

  const toggle = (id) => setAds(a => a.map(ad => ad.id === id ? { ...ad, active: !ad.active } : ad))

  const PLACEMENTS = ['homepage_banner', 'service_page', 'post_job', 'store_sidebar']

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Advertising" subtitle="Partner ad slots & campaign management" />

      <div className="flex-1 p-6 max-w-5xl space-y-6">
        {/* Empty state */}
        {ads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-surface-200 flex items-center justify-center mb-4">
              <Eye size={24} className="text-surface-400" />
            </div>
            <h2 className="text-lg font-bold text-surface-900 mb-1">No ad campaigns</h2>
            <p className="text-surface-500 text-sm mb-4">Ad slots will appear here when partners are onboarded.</p>
          </div>
        )}

        {/* Ad list */}
        {ads.map(ad => (
          <div key={ad.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold">{ad.partner}</h3>
                  <span className={`badge ${ad.active ? 'badge-green' : 'badge-yellow'}`}>{ad.active ? 'Live' : 'Paused'}</span>
                </div>
                <p className="text-surface-400 text-sm capitalize">{ad.type.replace('_', ' ')}</p>
              </div>
              <div className="flex items-center gap-4">
                {ad.active !== undefined && (
                  <button onClick={() => toggle(ad.id)} className="text-surface-400 hover:text-white transition-colors">
                    {ad.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                )}
              </div>
            </div>
            {ad.impressions !== undefined && (
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-surface-200">
                <div><p className="text-surface-400 text-xs">Impressions</p><p className="text-white font-bold">{(ad.impressions / 1000).toFixed(1)}k</p></div>
                <div><p className="text-surface-400 text-xs">Clicks</p><p className="text-white font-bold">{ad.clicks}</p></div>
                <div><p className="text-surface-400 text-xs">CTR</p><p className="text-white font-bold">{ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : 0}%</p></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}