import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import {
  LayoutDashboard, Wrench, MapPin, ShoppingBag, Star, CreditCard,
  Users, Briefcase, BarChart3, Megaphone, Package, Settings,
  Bell, LogOut, ChevronRight, DollarSign, FileText, Map,
  ClipboardList, Crown, UserCircle, FolderOpen
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
    { icon: LayoutDashboard, label: 'Dashboard',      path: '/tech' },
    { icon: Map,             label: 'Available Jobs', path: '/tech/jobs' },
    { icon: Briefcase,       label: 'My Jobs',        path: '/tech/myjobs' },
    { icon: DollarSign,      label: 'Earnings',       path: '/tech/earnings' },
    { icon: Crown,           label: 'Subscription',   path: '/tech/subscription' },
    { icon: FileText,        label: 'Tax Center',     path: '/tech/tax' },
    { icon: Star,            label: 'Reviews',        path: '/tech/reviews' },
    { icon: FolderOpen,      label: 'Documents',      path: '/tech/docs' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Overview',      path: '/admin' },
    { icon: Users,           label: 'Users',         path: '/admin/users' },
    { icon: Briefcase,       label: 'Jobs',          path: '/admin/jobs' },
    { icon: BarChart3,       label: 'Reports',       path: '/admin/reports' },
    { icon: Megaphone,       label: 'Advertising',   path: '/admin/ads' },
    { icon: Package,         label: 'Inventory',     path: '/admin/inventory' },
    { icon: Bell,            label: 'Notifications', path: '/admin/notifications' },
    { icon: Settings,        label: 'Settings',      path: '/admin/settings' },
  ],
}

const roleColors = {
  customer: { from: 'from-brand-400',   to: 'to-accent-500',   badge: 'bg-brand-500/20 text-brand-300',   label: 'Customer' },
  tech:     { from: 'from-emerald-400', to: 'to-brand-500',    badge: 'bg-emerald-500/20 text-emerald-300', label: 'Technician' },
  admin:    { from: 'from-accent-400',  to: 'to-rose-500',     badge: 'bg-accent-500/20 text-accent-300',  label: 'Admin' },
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) return null
  const nav = navConfig[user.role] || []
  const rc = roleColors[user.role] || roleColors.customer

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} h-screen flex flex-col bg-surface-900/95 border-r border-white/[0.07] flex-shrink-0 transition-all duration-300 relative backdrop-blur-xl`}>
      {/* Subtle side glow */}
      <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-brand-500/20 to-transparent" />

      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-3' : 'px-5'} py-[18px] border-b border-white/[0.07]`}>
        {collapsed ? (
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${rc.from} ${rc.to} flex items-center justify-center shadow-lg`}>
            <span className="text-white text-xs font-black">SC</span>
          </div>
        ) : (
          <Logo size="sm" />
        )}
      </div>

      {/* User info pill */}
      {!collapsed && (
        <div
          onClick={() => user.role === 'customer' ? navigate('/customer/profile') : undefined}
          className={`mx-3 mt-4 mb-2 px-3 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] ${user.role === 'customer' ? 'cursor-pointer hover:bg-white/[0.08] hover:border-brand-500/30 transition-all group' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${rc.from} ${rc.to} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-md`}>
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate leading-tight">{user.name}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-0.5 font-medium ${rc.badge}`}>{rc.label}</span>
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
              title={collapsed ? item.label : ''}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                collapsed ? 'justify-center px-2' : ''
              } ${
                active
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                  : 'text-surface-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <item.icon size={17} className={active ? 'text-brand-400' : ''} />
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && active && <ChevronRight size={13} className="text-brand-500 opacity-60" />}
            </button>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4 pt-2 border-t border-white/[0.07]">
        <button
          onClick={() => { logout(); navigate('/') }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/15 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={17} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[22px] w-6 h-6 bg-surface-800 border border-white/15 rounded-full flex items-center justify-center hover:bg-surface-700 hover:border-white/25 transition-all z-10 shadow-md"
      >
        <ChevronRight size={11} className={`text-surface-400 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
    </aside>
  )
}
