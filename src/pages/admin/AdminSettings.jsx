import React, { useState } from 'react'
import Header from '../../components/Header'
import { Settings, Bell, Shield, DollarSign, Percent, Globe, Sliders, ToggleLeft, ToggleRight, ChevronRight, Save, Check, AlertCircle, Key, Mail, Smartphone } from 'lucide-react'

function Toggle({ value, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!value)}
      className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${value ? 'bg-brand-500' : 'bg-surface-700'} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-surface-200 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">{label}</p>
        {description && <p className="text-surface-400 text-xs mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card space-y-0">
      <div className="flex items-center gap-3 pb-4 border-b border-surface-200 mb-0">
        <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
          <Icon size={17} className="text-brand-400" />
        </div>
        <h3 className="text-white font-bold">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)

  // Platform settings
  const [platformFee, setPlatformFee] = useState(15)
  const [surgePricing, setSurgePricing] = useState(true)
  const [autoDispatch, setAutoDispatch] = useState(true)
  const [escrowDays, setEscrowDays] = useState(3)
  const [maxJobRadius, setMaxJobRadius] = useState(25)

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [newTechAlert, setNewTechAlert] = useState(true)
  const [emergencyAlert, setEmergencyAlert] = useState(true)
  const [revenueAlert, setRevenueAlert] = useState(false)

  // Security
  const [twoFactor, setTwoFactor] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(60)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Platform Settings" subtitle="Configure MatcHvac operations" />

      <div className="flex-1 p-6 max-w-3xl space-y-6">

        {/* Save banner */}
        {saved && (
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm animate-fade-in">
            <Check size={16} />
            <span className="font-semibold">Settings saved successfully.</span>
          </div>
        )}

        {/* Fee & Dispatch */}
        <Section icon={Percent} title="Fees & Dispatch">
          <SettingRow
            label="Default Platform Fee"
            description="Percentage deducted from each job. Techs on Pro/Elite plans have reduced rates."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={30}
                value={platformFee}
                onChange={e => setPlatformFee(Number(e.target.value))}
                className="w-16 bg-surface-150 border border-surface-200 rounded-lg px-2 py-1.5 text-surface-900 text-sm text-center focus:outline-none focus:border-brand-500"
              />
              <span className="text-surface-400 text-sm">%</span>
            </div>
          </SettingRow>
          <SettingRow
            label="Surge Pricing"
            description="Automatically increase job prices during high-demand periods (evenings, weekends, weather events)."
          >
            <Toggle value={surgePricing} onChange={setSurgePricing} />
          </SettingRow>
          <SettingRow
            label="Auto-Dispatch"
            description="Automatically assign available jobs to eligible nearby techs based on rating and subscription tier."
          >
            <Toggle value={autoDispatch} onChange={setAutoDispatch} />
          </SettingRow>
          <SettingRow
            label="Max Job Radius"
            description="Default search radius for matching techs to jobs."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={100}
                value={maxJobRadius}
                onChange={e => setMaxJobRadius(Number(e.target.value))}
                className="w-16 bg-surface-150 border border-surface-200 rounded-lg px-2 py-1.5 text-surface-900 text-sm text-center focus:outline-none focus:border-brand-500"
              />
              <span className="text-surface-400 text-sm">mi</span>
            </div>
          </SettingRow>
          <SettingRow
            label="Escrow Release Window"
            description="Number of business days after job completion before auto-releasing payment if customer doesn't confirm."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={7}
                value={escrowDays}
                onChange={e => setEscrowDays(Number(e.target.value))}
                className="w-16 bg-surface-150 border border-surface-200 rounded-lg px-2 py-1.5 text-surface-900 text-sm text-center focus:outline-none focus:border-brand-500"
              />
              <span className="text-surface-400 text-sm">days</span>
            </div>
          </SettingRow>
        </Section>

        {/* Notification Preferences */}
        <Section icon={Bell} title="Notification Preferences">
          <SettingRow label="Email Alerts" description="Receive platform alerts via email.">
            <Toggle value={emailAlerts} onChange={setEmailAlerts} />
          </SettingRow>
          <SettingRow label="SMS / Text Alerts" description="Receive high-priority alerts via SMS.">
            <Toggle value={smsAlerts} onChange={setSmsAlerts} />
          </SettingRow>
          <SettingRow label="New Tech Registration" description="Alert when a new tech submits their application.">
            <Toggle value={newTechAlert} onChange={setNewTechAlert} />
          </SettingRow>
          <SettingRow label="Emergency Job Unassigned" description="Alert when an emergency job has no tech after 15 minutes.">
            <Toggle value={emergencyAlert} onChange={setEmergencyAlert} />
          </SettingRow>
          <SettingRow label="Daily Revenue Report" description="Receive a daily revenue summary every morning.">
            <Toggle value={revenueAlert} onChange={setRevenueAlert} />
          </SettingRow>
        </Section>

        {/* Security */}
        <Section icon={Shield} title="Security">
          <SettingRow label="Two-Factor Authentication" description="Require 2FA for all admin logins.">
            <Toggle value={twoFactor} onChange={setTwoFactor} />
          </SettingRow>
          <SettingRow
            label="Admin Session Timeout"
            description="Automatically log out after inactivity."
          >
            <div className="flex items-center gap-2">
              <select
                value={sessionTimeout}
                onChange={e => setSessionTimeout(Number(e.target.value))}
                className="bg-surface-150 border border-surface-200 rounded-lg px-3 py-1.5 text-surface-900 text-sm focus:outline-none focus:border-brand-500"
              >
                {[15, 30, 60, 120, 240].map(v => (
                  <option key={v} value={v}>{v} min</option>
                ))}
              </select>
            </div>
          </SettingRow>
          <SettingRow label="Rotate API Keys" description="Generate new API credentials for all connected services.">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 border border-rose-500/20 transition-colors">
              <Key size={12} /> Rotate Keys
            </button>
          </SettingRow>
        </Section>

        {/* Integrations */}
        <Section icon={Globe} title="Integrations">
          {[
            { label: 'Stripe Connect', description: 'Payment processing & payouts', status: 'connected', color: 'badge-green' },
            { label: 'Twilio SMS', description: 'Job & dispatch notifications', status: 'connected', color: 'badge-green' },
            { label: 'Supabase', description: 'Database & authentication', status: 'connected', color: 'badge-green' },
            { label: 'Google Maps API', description: 'Job location & tech routing', status: 'connected', color: 'badge-green' },
            { label: 'Comfort Connect API', description: 'Financing origination partner', status: 'connected', color: 'badge-green' },
            { label: 'QuickBooks Online', description: 'Accounting & 1099 generation', status: 'not connected', color: 'badge-yellow' },
          ].map(item => (
            <SettingRow key={item.label} label={item.label} description={item.description}>
              <div className="flex items-center gap-2">
                <span className={`badge ${item.color}`}>{item.status}</span>
                <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Settings size={12} className="text-surface-400" />
                </button>
              </div>
            </SettingRow>
          ))}
        </Section>

        {/* Save button */}
        <button onClick={handleSave} className="btn-primary w-full py-3 text-sm">
          <Save size={16} /> Save Settings
        </button>

      </div>
    </div>
  )
}
