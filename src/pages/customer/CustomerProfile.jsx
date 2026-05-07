import React, { useState } from 'react'
import Header from '../../components/Header'
import { useAuth } from '../../context/AuthContext'
import { User, Mail, Phone, MapPin, Home, Building2, Hash, Check, Lock, ChevronRight, Camera, Shield } from 'lucide-react'

const INPUT = 'w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm'
const LABEL = 'block text-surface-400 text-xs font-semibold uppercase tracking-wider mb-1.5'

export default function CustomerProfile() {
  const { user, updateProfile } = useAuth()

  const [form, setForm] = useState({
    name:     user?.name     || '',
    email:    user?.email    || '',
    phone:    user?.phone    || '',
    address1: user?.address1 || '',
    address2: user?.address2 || '',
    city:     user?.city     || '',
    state:    user?.state    || '',
    zip:      user?.zip      || '',
  })

  const [saved, setSaved]       = useState(false)
  const [editing, setEditing]   = useState(false)
  const [pwForm, setPwForm]     = useState({ current: '', next: '', confirm: '' })
  const [pwSaved, setPwSaved]   = useState(false)
  const [pwError, setPwError]   = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setSaved(false)
    setEditing(true)
  }

  const handleSave = e => {
    e.preventDefault()
    updateProfile(form)
    setSaved(true)
    setEditing(false)
  }

  const handlePwChange = e => {
    setPwForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setPwError('')
  }

  const handlePwSave = e => {
    e.preventDefault()
    if (pwForm.current !== 'demo1234') { setPwError('Current password is incorrect.'); return }
    if (pwForm.next.length < 8)        { setPwError('New password must be at least 8 characters.'); return }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match.'); return }
    setPwSaved(true)
    setPwForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwSaved(false), 3000)
  }

  const initials = form.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'JS'

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="My Profile" subtitle="Manage your account information" />

      <div className="flex-1 p-6 max-w-2xl space-y-6">

        {/* Avatar + name hero */}
        <div className="card flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-2xl font-extrabold text-white">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-surface-700 border border-white/20 flex items-center justify-center hover:bg-surface-600 transition-colors">
              <Camera size={13} className="text-surface-300" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-extrabold text-xl truncate">{form.name || 'Your Name'}</p>
            <p className="text-surface-400 text-sm">{form.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="badge badge-green">Active</span>
              <span className="text-surface-500 text-xs">Member since Nov 2025</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-surface-500 text-xs">
            <Shield size={13} className="text-emerald-400" />
            <span className="text-emerald-400">Verified</span>
          </div>
        </div>

        {/* Save success banner */}
        {saved && (
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 px-5 py-3 flex items-center gap-3">
            <Check size={18} className="text-emerald-400 flex-shrink-0" />
            <p className="text-white font-semibold text-sm">Profile saved successfully.</p>
          </div>
        )}

        {/* Personal info form */}
        <form onSubmit={handleSave} className="card space-y-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="section-title">Personal Information</h3>
            {editing && <span className="text-amber-400 text-xs font-semibold">Unsaved changes</span>}
          </div>

          {/* Full name */}
          <div>
            <label className={LABEL}>Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jordan Smith"
                className={`${INPUT} pl-10`}
              />
            </div>
          </div>

          {/* Email — read only */}
          <div>
            <label className={LABEL}>Email Address <span className="text-surface-600 normal-case font-normal">(contact support to change)</span></label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                value={form.email}
                readOnly
                className={`${INPUT} pl-10 opacity-50 cursor-not-allowed`}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={LABEL}>Phone Number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="(301) 555-0100"
                type="tel"
                className={`${INPUT} pl-10`}
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <MapPin size={15} className="text-brand-400" /> Service Address
            </h4>

            {/* Street */}
            <div className="mb-4">
              <label className={LABEL}>Street Address</label>
              <div className="relative">
                <Home size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  name="address1"
                  value={form.address1}
                  onChange={handleChange}
                  placeholder="1234 Main St"
                  className={`${INPUT} pl-10`}
                />
              </div>
            </div>

            {/* Apt */}
            <div className="mb-4">
              <label className={LABEL}>Apt / Suite / Unit <span className="text-surface-600 normal-case font-normal">(optional)</span></label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  name="address2"
                  value={form.address2}
                  onChange={handleChange}
                  placeholder="Apt 2B"
                  className={`${INPUT} pl-10`}
                />
              </div>
            </div>

            {/* City / State / ZIP row */}
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-2">
                <label className={LABEL}>City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Washington"
                  className={INPUT}
                />
              </div>
              <div className="col-span-1">
                <label className={LABEL}>State</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={INPUT}
                >
                  <option value="">—</option>
                  {['DC','MD','VA','AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','WA','WV','WI','WY'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className={LABEL}>ZIP Code</label>
                <div className="relative">
                  <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                  <input
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    placeholder="20001"
                    maxLength={10}
                    className={`${INPUT} pl-10`}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <Check size={16} /> Save Changes
          </button>
        </form>

        {/* Password change */}
        <form onSubmit={handlePwSave} className="card space-y-4">
          <h3 className="section-title flex items-center gap-2">
            <Lock size={15} className="text-brand-400" /> Change Password
          </h3>

          {pwSaved && (
            <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-4 py-2.5 flex items-center gap-2 text-sm">
              <Check size={15} className="text-emerald-400 flex-shrink-0" />
              <span className="text-white font-medium">Password updated successfully.</span>
            </div>
          )}
          {pwError && (
            <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 px-4 py-2.5 text-rose-400 text-sm">{pwError}</div>
          )}

          <div>
            <label className={LABEL}>Current Password</label>
            <input
              name="current"
              type="password"
              value={pwForm.current}
              onChange={handlePwChange}
              placeholder="••••••••"
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>New Password</label>
            <input
              name="next"
              type="password"
              value={pwForm.next}
              onChange={handlePwChange}
              placeholder="Min. 8 characters"
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Confirm New Password</label>
            <input
              name="confirm"
              type="password"
              value={pwForm.confirm}
              onChange={handlePwChange}
              placeholder="Re-enter new password"
              className={INPUT}
            />
          </div>

          <button type="submit" className="btn-secondary w-full py-3">
            Update Password
          </button>
        </form>

        {/* Notification prefs */}
        <div className="card space-y-4">
          <h3 className="section-title">Notification Preferences</h3>
          {[
            { label: 'Job status updates (SMS)', sub: 'Tech en route, arrived, complete', defaultOn: true },
            { label: 'Payment receipts (Email)', sub: 'Sent after each completed job', defaultOn: true },
            { label: 'Promotions & offers (Email)', sub: 'Seasonal deals and discounts', defaultOn: false },
            { label: 'Comfort Connect updates', sub: 'Program news and eligibility', defaultOn: true },
          ].map(pref => (
            <NotifRow key={pref.label} {...pref} />
          ))}
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
          <h3 className="text-white font-bold text-sm mb-1">Danger Zone</h3>
          <p className="text-surface-400 text-xs mb-4">These actions are permanent and cannot be undone.</p>
          <button className="btn-ghost text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 text-sm py-2 px-4">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  )
}

function NotifRow({ label, sub, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-surface-500 text-xs">{sub}</p>
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-brand-500' : 'bg-surface-700'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}
