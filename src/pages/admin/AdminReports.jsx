import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { admin } from '../../lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function AdminReports() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        await admin.reportsOverview().catch(() => null)
      } catch {}
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="flex flex-col h-full overflow-auto bg-surface-100">
      <Header title="Reports" subtitle="Platform financial reporting" />

      <div className="flex-1 p-6 max-w-6xl space-y-5">
        {/* Empty state */}
        {!loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-200 flex items-center justify-center mb-4">
              <BarChart width={32} height={32}>
                <Bar dataKey="v" fill="#d0cfc9" />
              </BarChart>
            </div>
            <h2 className="text-xl font-bold text-surface-900 mb-2">No report data yet</h2>
            <p className="text-surface-500 text-sm max-w-md">
              Financial reports will populate once jobs are completed and revenue starts flowing through the platform.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}