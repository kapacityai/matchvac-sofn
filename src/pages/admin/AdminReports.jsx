import React from 'react'
import Header from '../../components/Header'
import { Download, FileText, DollarSign, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { MOCK_TECHS } from '../../data/mockData'

const revenueData = [
  { month: 'Jan', platform: 630, tech: 2570, total: 3200 },
  { month: 'Feb', platform: 915, tech: 3185, total: 4100 },
  { month: 'Mar', platform: 1335, tech: 4565, total: 5900 },
  { month: 'Apr', platform: 1680, tech: 4520, total: 6200 },
  { month: 'May', platform: 720, tech: 1930, total: 2650 },
]

export default function AdminReports() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="Reports" subtitle="Platform financials & tax exports" />
      <div className="flex-1 p-6 max-w-5xl space-y-6">
        {/* Revenue breakdown */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Revenue Breakdown (2026)</h3>
            <button className="btn-secondary text-sm py-2"><Download size={14} /> Export</button>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="platform" fill="#8b5cf6" radius={[4,4,0,0]} name="Platform Fee" />
                <Bar dataKey="tech" fill="#0ea5e9" radius={[4,4,0,0]} name="Tech Payout" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-accent-500" /><span className="text-surface-400">Platform Fee</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-brand-500" /><span className="text-surface-400">Tech Payout</span></div>
          </div>
        </div>

        {/* YTD totals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total GMV', value: '$22,050', color: 'text-white' },
            { label: 'Platform Revenue', value: '$3,280', color: 'text-accent-400' },
            { label: 'Tech Payouts', value: '$18,770', color: 'text-emerald-400' },
            { label: 'Total Jobs', value: '148', color: 'text-brand-400' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-surface-400 text-xs">{s.label}</p>
              <p className="text-surface-600 text-xs">YTD 2026</p>
            </div>
          ))}
        </div>

        {/* 1099 exports */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">1099-NEC Generation</h3>
              <p className="section-sub">Year-end tax documents for all active techs</p>
            </div>
          </div>
          <div className="space-y-2">
            {MOCK_TECHS.filter(t => t.status === 'active').map(tech => (
              <div key={tech.id} className="flex items-center gap-4 px-4 py-3 bg-surface-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {tech.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{tech.name}</p>
                  <p className="text-surface-500 text-xs">YTD Net: ${tech.earnings.toLocaleString()}</p>
                </div>
                <span className={`badge ${tech.earnings >= 600 ? 'badge-green' : 'badge-yellow'}`}>
                  {tech.earnings >= 600 ? '1099 Required' : 'Below $600'}
                </span>
                {tech.earnings >= 600 && (
                  <button className="btn-secondary py-1.5 text-xs">
                    <Download size={13} /> PDF
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="btn-primary text-sm">
              <Download size={16} /> Export All 1099s (ZIP)
            </button>
          </div>
        </div>

        {/* Promo codes */}
        <div className="card">
          <h3 className="section-title mb-3">Promo Codes</h3>
          <div className="space-y-2 mb-4">
            {[
              { code: 'HVAC20', discount: '20% off', uses: 47, active: true },
              { code: 'NEWTECH', discount: '$25 off first service', uses: 12, active: true },
              { code: 'SUMMER10', discount: '10% off A/C', uses: 0, active: false },
            ].map(p => (
              <div key={p.code} className="flex items-center gap-3 px-4 py-3 bg-surface-800/50 rounded-xl text-sm">
                <code className="font-mono font-bold text-brand-400 text-sm">{p.code}</code>
                <span className="text-surface-300 flex-1">{p.discount}</span>
                <span className="text-surface-500">{p.uses} uses</span>
                <span className={`badge ${p.active ? 'badge-green' : 'badge-yellow'}`}>{p.active ? 'Active' : 'Inactive'}</span>
              </div>
            ))}
          </div>
          <button className="btn-secondary text-sm"><FileText size={14} /> Create Promo Code</button>
        </div>
      </div>
    </div>
  )
}
