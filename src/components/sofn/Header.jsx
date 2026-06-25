import { Link } from 'react-router-dom'
import { SofnLogo } from './Logo'
import { LogOut, User, Settings, DollarSign, Bell } from 'lucide-react'

export function SofnHeader({ user, onLogout }) {
  return (
    <header className="bg-white border-b border-[#DAD8D2] px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to="/sofn/dashboard"><SofnLogo size="sm" /></Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-[#0C6B5E] font-semibold text-sm font-mono">
              ${(user.earnings_week || 0).toFixed(0)} earned this week
            </span>
            <div className="flex items-center gap-1 text-[#33485C] text-sm font-medium">
              <div className="w-7 h-7 rounded-full bg-[#0C6B5E] text-white flex items-center justify-center text-xs font-bold">
                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'U'}
              </div>
              <span className="hidden sm:inline">{user.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Link to="/sofn/profile" className="p-2 rounded-lg hover:bg-[#F4F3EF] text-[#33485C] transition-colors">
                <Settings size={16} />
              </Link>
              <button onClick={onLogout} className="p-2 rounded-lg hover:bg-[#F4F3EF] text-[#33485C] transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}