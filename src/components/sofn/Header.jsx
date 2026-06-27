import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SofnLogo } from './Logo'
import { LogOut, User, Settings, DollarSign, Bell, X, Check, ExternalLink } from 'lucide-react'

export function SofnHeader({ user, onLogout, notifications = [], unreadCount = 0, onMarkRead, onMarkAllRead }) {
  const [showNotifs, setShowNotifs] = useState(false)
  const bellRef = useRef(null)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        bellRef.current && !bellRef.current.contains(e.target)
      ) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const formatTime = (ts) => {
    const d = new Date(ts)
    const now = new Date()
    const diff = (now - d) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <header className="bg-white border-b border-[#DAD8D2] px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to="/sofn/dashboard"><SofnLogo size="sm" /></Link>
      <div className="flex items-center gap-3">
        {user && (
          <>
            {/* Notification Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg hover:bg-[#F4F3EF] text-[#33485C] transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showNotifs && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-[#DAD8D2] shadow-lg overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#DAD8D2]">
                    <span className="text-sm font-bold text-[#16202B]">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={onMarkAllRead} className="text-xs text-[#0C6B5E] font-medium hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-[#33485C]/50">
                        <Bell size={24} className="mx-auto mb-2 opacity-30" />
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 20).map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-[#DAD8D2]/50 hover:bg-[#F4F3EF] transition-colors ${
                            !n.read ? 'bg-[#0C6B5E]/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              n.type === 'new_job_available' ? 'bg-emerald-500' : 'bg-[#0C6B5E]'
                            } ${n.read ? 'opacity-30' : ''}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#16202B] truncate">{n.title}</p>
                              <p className="text-xs text-[#33485C] mt-0.5">{n.message}</p>
                              <p className="text-[10px] text-[#33485C]/40 mt-1">{formatTime(n.created_at)}</p>
                            </div>
                            {!n.read && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onMarkRead?.(n.id) }}
                                className="p-1 hover:bg-[#DAD8D2] rounded text-[#33485C]/50 hover:text-[#33485C]"
                              >
                                <Check size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="text-[#0C6B5E] font-semibold text-sm font-mono hidden sm:inline">
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