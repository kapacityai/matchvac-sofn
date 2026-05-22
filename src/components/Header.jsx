import React from 'react'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header({ title, subtitle, action }) {
  const { user } = useAuth()
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-white flex-shrink-0 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      <div>
        <h1 className="text-xl font-bold text-surface-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-surface-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2.5">
        {action && action}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input className="bg-surface-100 border border-surface-200 text-surface-900 text-sm rounded-xl pl-8 pr-4 py-2 w-48 focus:outline-none focus:border-brand-400 focus:w-56 focus:bg-white placeholder-surface-400 transition-all duration-200 shadow-sm" placeholder="Search…" />
        </div>
        <button className="relative w-9 h-9 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center hover:bg-surface-200 transition-all">
          <Bell size={15} className="text-surface-500" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-500 rounded-full ring-1 ring-white" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
          {user?.avatar}
        </div>
      </div>
    </header>
  )
}
