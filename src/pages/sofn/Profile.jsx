import { useState } from 'react'
import { User, Shield, MapPin, CreditCard, Crown, AlertTriangle, Edit3, Upload, Check } from 'lucide-react'

export default function SofnProfile({ profile }) {
  const p = profile || { name: '', email: '', phone: '', serviceZips: [], paymentMethod: '', licenseExp: '', insuranceExp: '', subscriptionTier: '', subscriptionPrice: 0 }
  const [editModal, setEditModal] = useState(false)
  const [editName, setEditName] = useState(p.name)
  const [editPhone, setEditPhone] = useState(p.phone)

  const isExpiring = (dateStr) => {
    if (!dateStr) return false
    const exp = new Date(dateStr)
    const threeMonths = new Date()
    threeMonths.setMonth(threeMonths.getMonth() + 3)
    return exp <= threeMonths
  }

  const insExpiring = isExpiring(p.insuranceExp)
  const licExpiring = isExpiring(p.licenseExp)

  const subLabel = p.subscriptionTier === 'free' ? 'Free' : p.subscriptionTier === 'pro' ? 'Pro' : 'Elite'
  const payMethodLabel = p.paymentMethod === 'hourly' ? 'Hourly' : p.paymentMethod === 'flat_fee' ? 'Flat Fee' : 'Commission'

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-display font-bold text-[#16202B]">Profile & Settings</h2>

      {/* Expiry warnings */}
      {licExpiring && (
        <div className="flex items-start gap-3 p-4 bg-[#C9852A]/5 border border-[#C9852A]/20 rounded-xl">
          <AlertTriangle size={18} className="text-[#C9852A] mt-0.5 flex-shrink-0" />
          <div><p className="text-sm font-medium text-[#16202B]">License expiring soon</p><p className="text-xs text-[#33485C]">Renew before {p.licenseExp}</p></div>
        </div>
      )}
      {insExpiring && (
        <div className="flex items-start gap-3 p-4 bg-[#C9852A]/5 border border-[#C9852A]/20 rounded-xl">
          <AlertTriangle size={18} className="text-[#C9852A] mt-0.5 flex-shrink-0" />
          <div><p className="text-sm font-medium text-[#16202B]">Insurance expiring soon</p><p className="text-xs text-[#33485C]">Upload new certificate before {p.insuranceExp}</p></div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Personal Info */}
        <div className="bg-white rounded-xl border border-[#DAD8D2] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-[#16202B] flex items-center gap-2"><User size={16} className="text-[#0C6B5E]" /> Personal Info</h3>
            <button onClick={() => { setEditModal(true); setEditName(p.name); setEditPhone(p.phone) }} className="text-[#0C6B5E] text-xs font-medium hover:underline flex items-center gap-1"><Edit3 size={12} /> Edit</button>
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="text-[#33485C]/60">Name:</span> <span className="text-[#16202B] font-medium">{p.name}</span></div>
            <div><span className="text-[#33485C]/60">Email:</span> <span className="text-[#16202B]">{p.email}</span></div>
            <div><span className="text-[#33485C]/60">Phone:</span> <span className="text-[#16202B]">{p.phone}</span></div>
            <div><span className="text-[#33485C]/60">Plan:</span> <span className="text-[#0C6B5E] font-medium capitalize">{subLabel}{p.subscriptionPrice > 0 ? ` ($${p.subscriptionPrice}/mo)` : ''}</span></div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="bg-white rounded-xl border border-[#DAD8D2] p-5">
          <h3 className="font-semibold text-sm text-[#16202B] mb-4 flex items-center gap-2"><MapPin size={16} className="text-[#0C6B5E]" /> Service Areas</h3>
          <div className="flex flex-wrap gap-2">
            {p.serviceZips?.map(z => <span key={z} className="px-3 py-1 bg-[#0C6B5E]/5 text-[#0C6B5E] text-xs font-medium rounded-lg">{z}</span>)}
          </div>
        </div>

        {/* Credentials */}
        <div className="bg-white rounded-xl border border-[#DAD8D2] p-5">
          <h3 className="font-semibold text-sm text-[#16202B] mb-4 flex items-center gap-2"><Shield size={16} className="text-[#0C6B5E]" /> Credentials</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-[#33485C]/60">License expires:</span> <span className={`font-medium ${licExpiring ? 'text-[#C9852A]' : 'text-[#16202B]'}`}>{p.licenseExp || '—'}</span></div>
            <div><span className="text-[#33485C]/60">Insurance expires:</span> <span className={`font-medium ${insExpiring ? 'text-[#C9852A]' : 'text-[#16202B]'}`}>{p.insuranceExp || '—'}</span></div>
            <button className="text-[#0C6B5E] text-xs font-medium hover:underline flex items-center gap-1 mt-2"><Upload size={12} /> Upload new insurance</button>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-[#DAD8D2] p-5">
          <h3 className="font-semibold text-sm text-[#16202B] mb-4 flex items-center gap-2"><CreditCard size={16} className="text-[#0C6B5E]" /> Payment</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-[#33485C]/60">Method:</span> <span className="text-[#16202B] font-medium">{payMethodLabel}</span></div>
            <button className="text-[#0C6B5E] text-xs font-medium hover:underline flex items-center gap-1 mt-2"><Edit3 size={12} /> Change payment method</button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setEditModal(false)}>
          <div className="bg-white rounded-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display font-bold text-[#16202B] mb-4">Edit Profile</h3>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium text-[#33485C] mb-1">Name</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] text-[#16202B] focus:outline-none focus:border-[#0C6B5E]" value={editName} onChange={e => setEditName(e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-[#33485C] mb-1">Phone</label><input className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] text-[#16202B] focus:outline-none focus:border-[#0C6B5E]" value={editPhone} onChange={e => setEditPhone(e.target.value)} /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditModal(false)} className="flex-1 h-10 border border-[#DAD8D2] rounded-lg text-[#33485C] font-medium text-sm">Cancel</button>
              <button onClick={() => setEditModal(false)} className="flex-1 h-10 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}