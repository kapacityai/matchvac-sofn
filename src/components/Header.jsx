import React from 'react'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header({ title, subtitle }) {
  const { user } = useAuth()
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-surface-950/50 backdrop-blur-sm flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-surface-400 text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input className="bg-surface-800 border border-white/8 text-white text-sm rounded-xl pl-9 pr-4 py-2 w-52 focus:outline-none focus:border-brand-500/50 placeholder-surface-500" placeholder="Search…" />
        </div>
        <button className="relative w-9 h-9 rounded-xl bg-surface-800 border border-white/8 flex items-center justify-center hover:bg-surface-700 transition-colors">
          <Bell size={16} className="text-surface-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-400 rounded-full"></span>
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
          {user?.avatar}
        </div>
      </div>
    </header>
  )
}
