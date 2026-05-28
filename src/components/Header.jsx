import React from 'react'
import { Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header({ title, subtitle, action }) {
  const { user } = useAuth()
  const initials = user?.avatar || user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U'

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-white flex-shrink-0 sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-navy-700 tracking-tight">{title}</h1>
        {subtitle && <p className="text-surface-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2.5">
        {action && action}
        <button className="relative w-9 h-9 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center hover:bg-surface-150 transition-all">
          <Bell size={16} className="text-surface-500" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-500 rounded-full ring-1 ring-white" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-navy-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
          {initials}
        </div>
      </div>
    </header>
  )
}
