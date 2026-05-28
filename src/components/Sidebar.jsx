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
  customer: { from: 'from-brand-400',   to: 'to-brand-600',   badge: 'bg-brand-100 text-brand-700',     label: 'Customer' },
  tech:     { from: 'from-emerald-400', to: 'to-brand-500',   badge: 'bg-emerald-100 text-emerald-700', label: 'Technician' },
  admin:    { from: 'from-navy-500',    to: 'to-navy-800',    badge: 'bg-navy-100 text-navy-700',       label: 'Admin' },
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
    <aside className={`${collapsed ? 'w-16' : 'w-60'} h-screen flex flex-col bg-white border-r border-surface-200 flex-shrink-0 transition-all duration-300 relative`}>
      {/* Top accent line — teal to navy (brand colors) */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-brand-400 to-navy-700" />

      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-3' : 'px-5'} py-[18px] border-b border-surface-200`}>
        {collapsed ? (
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${rc.from} ${rc.to} flex items-center justify-center shadow-sm`}>
            <span className="text-white text-xs font-black">MH</span>
          </div>
        ) : (
          <Logo size="sm" />
        )}
      </div>

      {/* User info pill */}
      {!collapsed && (
        <div
          onClick={() => user.role === 'customer' ? navigate('/customer/profile') : undefined}
          className={`mx-3 mt-4 mb-2 px-3 py-3 rounded-xl bg-surface-100 border border-surface-200 ${user.role === 'customer' ? 'cursor-pointer hover:bg-surface-150 hover:border-brand-300 transition-all group' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${rc.from} ${rc.to} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm`}>
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-surface-900 text-sm font-semibold truncate leading-tight">{user.name}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-0.5 font-medium ${rc.badge}`}>{rc.label}</span>
            </div>
            {user.role === 'customer' && (
              <UserCircle size={14} className="text-surface-400 group-hover:text-brand-500 transition-colors flex-shrink-0" />
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
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 border border-transparent'
              }`}
            >
              <item.icon size={17} className={active ? 'text-brand-500' : 'text-surface-400'} />
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && active && <ChevronRight size={13} className="text-brand-400 opacity-70" />}
            </button>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4 pt-2 border-t border-surface-200">
        <button
          onClick={() => { logout(); navigate('/') }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={17} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[22px] w-6 h-6 bg-white border border-surface-200 rounded-full flex items-center justify-center hover:bg-surface-100 hover:border-surface-300 transition-all z-10 shadow-sm"
      >
        <ChevronRight size={11} className={`text-surface-500 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
    </aside>
  )
}
