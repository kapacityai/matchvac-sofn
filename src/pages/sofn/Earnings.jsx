import { DollarSign, TrendingUp, Clock, Wallet, Calendar } from 'lucide-react'

export default function SofnEarnings({ earnings }) {
  const data = earnings || { week: 0, month: 0, total: 0, pending: 0, nextPayout: '', history: [] }

  const cards = [
    { label: 'This Week', value: data.week, icon: DollarSign, color: 'text-[#0C6B5E]', bg: 'bg-[#0C6B5E]/10' },
    { label: 'This Month', value: data.month, icon: TrendingUp, color: 'text-[#0C6B5E]', bg: 'bg-[#0C6B5E]/10' },
    { label: 'Total', value: data.total, icon: Wallet, color: 'text-[#16202B]', bg: 'bg-[#16202B]/5' },
    { label: 'Pending', value: data.pending, icon: Clock, color: 'text-[#C9852A]', bg: 'bg-[#C9852A]/10' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-[#16202B]">Earnings</h2>
        {data.nextPayout && (
          <span className="text-xs text-[#33485C]/60 flex items-center gap-1">
            <Calendar size={12} /> Next payout: {data.nextPayout}
          </span>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-[#DAD8D2] p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                <c.icon size={16} className={c.color} />
              </div>
              <span className="text-xs text-[#33485C]">{c.label}</span>
            </div>
            <p className={`text-2xl font-bold font-mono ${c.color}`}>
              ${typeof c.value === 'number' ? c.value.toFixed(0) : '0'}
            </p>
          </div>
        ))}
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-xl border border-[#DAD8D2] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#DAD8D2]">
          <h3 className="font-semibold text-sm text-[#16202B]">Recent Earnings</h3>
        </div>
        {data.history && data.history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#33485C]/60 border-b border-[#DAD8D2]">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Job</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                  <th className="px-5 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.history.map((h, i) => (
                  <tr key={i} className="border-b border-[#DAD8D2]/50 last:border-0">
                    <td className="px-5 py-3 text-[#33485C] font-mono text-xs">{h.date}</td>
                    <td className="px-5 py-3 text-[#16202B] font-medium">{h.job}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-[#0C6B5E]">${h.amount}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        h.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#C9852A]/10 text-[#C9852A]'
                      }`}>{h.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-[#33485C] text-sm">No earnings yet</p>
            <p className="text-xs text-[#33485C]/60 mt-1">Complete a job to see earnings here</p>
          </div>
        )}
      </div>
    </div>
  )
}