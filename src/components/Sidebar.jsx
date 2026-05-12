import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import {
  LayoutDashboard, Wrench, MapPin, ShoppingBag, Star, CreditCard,
  Users, Briefcase, BarChart3, Megaphone, Package, Settings,
  Bell, LogOut, ChevronRight, DollarSign, FileText, Map, ClipboardList, Crown, UserCircle, FolderOpen
} from 'lucide-react'

const navConfig = {
  customer: [
    { icon: LayoutDashboard, label: 'Home',            path: '/customer' },
    { icon: Wrench,          label: 'Request Service', path: '/customer/request' },
    { icon: MapPin,          label: 'Track Job',       path: '/customer/track' },
    { icon: ShoppingBag,     label: 'Store',           path: '/customer/store' },
    { icon: ClipboardList,   label: 'My Jobs',         path: '/customer/jobs' },
    { icon: Star,            label: 'Reviews',         path: '/customer/reviews' },
    { icon: CreditCard,      label: 'Billing',         path: '/customer/billing' },
  ],
  tech: [
    { icon: LayoutDashboard, label: 'Dashboard',     path: '/tech' },
    { icon: Map,             label: 'Available Jobs', path: '/tech/jobs' },
    { icon: Briefcase,       label: 'My Jobs',        path: '/tech/myjobs' },
    { icon: DollarSign,      label: 'Earnings',       path: '/tech/earnings' },
    { icon: Crown,           label: 'Subscription',   path: '/tech/subscription' },
    { icon: FileText,        label: 'Tax Center',     path: '/tech/tax' },
    { icon: Star,            label: 'Reviews',        path: '/tech/reviews' },
    { icon: FolderOpen,      label: 'Documents',      path: '/tech/docs' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Overview',       path: '/admin' },
    { icon: Users,           label: 'Users',          path: '/admin/users' },
    { icon: Briefcase,       label: 'Jobs',           path: '/admin/jobs' },
    { icon: BarChart3,       label: 'Reports',        path: '/admin/reports' },
    { icon: Megaphone,       label: 'Advertising',    path: '/admin/ads' },
    { icon: Package,         label: 'Inventory',      path: '/admin/inventory' },
    { icon: Bell,            label: 'Notifications',  path: '/admin/notifications' },
    { icon: Settings,        label: 'Settings',       path: '/admin/settings' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) return null
  const nav = navConfig[user.role] || []

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} h-screen flex flex-col bg-surface-900 border-r border-white/10 flex-shrink-0 transition-all duration-300 relative`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-3' : 'px-5'} py-5 border-b border-white/10`}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">SC</span>
          </div>
        ) : (
          <Logo size="sm" />
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div
          onClick={() => user.role === 'customer' ? navigate('/customer/billing') : undefined}
          className={`mx-3 mt-4 mb-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10 ${user.role === 'customer' ? 'cursor-pointer hover:bg-white/10 hover:border-brand-500/40 transition-all group' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <p className="text-surface-500 text-xs capitalize">{user.role === 'customer' ? 'View Profile' : user.role}</p>
            </div>
            {user.role === 'customer' && (
              <UserCircle size={14} className="text-surface-600 group-hover:text-brand-400 transition-colors flex-shrink-0" />
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
        {nav.map(item => {
          const active =
            location.pathname === item.path ||
            (item.path !== '/customer' && item.path !== '/tech' && item.path !== '/admin' &&
             location.pathname.startsWith(item.path))
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full ${collapsed ? 'justify-center px-2' : ''} ${active ? 'sidebar-item-active' : 'sidebar-item'}`}
              title={collapsed ? item.label : ''}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </button>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-0.5">
        <button
          onClick={() => { logout(); navigate('/') }}
          className={`w-full sidebar-item ${collapsed ? 'justify-center' : ''} text-rose-400 hover:text-rose-300 hover:bg-rose-500/10`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 w-6 h-6 bg-surface-800 border border-white/10 rounded-full flex items-center justify-center hover:bg-surface-700 transition-colors z-10"
      >
        <ChevronRight size={12} className={`text-surface-400 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
    </aside>
  )
}
