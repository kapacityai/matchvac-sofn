import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import {
  LayoutDashboard, Wrench, MapPin, ShoppingBag, Star, CreditCard,
  Users, Briefcase, BarChart3, Megaphone, Package, Settings,
  Bell, LogOut, ChevronRight, DollarSign, FileText, Map, ClipboardList, Crown, UserCircle
} from 'lucide-react'

const navConfig = {
  customer: [
    { icon: LayoutDashboard, label: 'Home',            path: '/customer' },
    { icon: Wrench,          label: 'Request Service', path: '/customer/request' },
    { icon: MapPin,          label: 'Track Job',       path: '/customer/track' },
    { icon: ShoppingBag,     label: 'Store',           path: '/customer/store' },
    { icon: ClipboardList,   label: 'My Jobs',         path: '/customer/jobs' },
    { icon: Star,            label: 'Reviews',         path: '/customer/reviews' },
  ],
  tech: [
    { icon: LayoutDashboard, label: 'Dashboard',    path: '/tech' },
    { icon: Map,             label: 'Available Jobs',path: '/tech/jobs' },
    { icon: Briefcase,       label: 'My Jobs',      path: '/tech/myjobs' },
    { icon: DollarSign,      label: 'Earnings',     path: '/tech/earnings' },
    { icon: Crown,           label: 'Subscription', path: '/tech/subscription' },
    { icon: FileText,        label: 'Tax Center',   path: '/tech/tax' },
    { icon: Star,            label: 'Reviews',      path: '/tech/reviews' },
    { icon: Settings,        label: 'Documents',    path: '/tech/docs' },
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

const roleAccentColor = {
  customer: '#FF5A5F',
  tech:     '#FFB400',
  admin:    '#FF5A5F',
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) return null
  const nav = navConfig[user.role] || []
  const accent = roleAccentColor[user.role] || '#FF5A5F'

  return (
    <aside style={{ background: '#1A1A1A', borderRight: '0.5px solid rgba(255,255,255,0.07)' }}
      className={`${collapsed ? 'w-16' : 'w-60'} h-screen flex flex-col flex-shrink-0 transition-all duration-300 relative`}>

      {/* Logo */}
      <div style={{ borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}
        className={`flex items-center ${collapsed ? 'justify-center px-3' : 'px-5'} py-4`}>
        {collapsed ? (
          <div style={{ background: '#FF5A5F', borderRadius: '8px', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '14px', color: 'white' }}>H</span>
          </div>
        ) : (
          <Logo size="sm" />
        )}
      </div>

      {/* User card — clickable for customers */}
      {!collapsed && (
        <div
          onClick={() => user.role === 'customer' ? navigate('/customer/billing') : undefined}
          style={{
            margin: '12px',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            cursor: user.role === 'customer' ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (user.role === 'customer') { e.currentTarget.style.borderColor = 'rgba(255,90,95,0.35)'; e.currentTarget.style.background = 'rgba(255,90,95,0.06)' }}}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: user.role === 'tech' ? '#FFB400' : '#FF5A5F',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '12px', color: 'white' }}>
                {user.avatar}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '13px', color: 'white' }} className="truncate">{user.name}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                {user.role === 'customer' ? 'View Profile' : user.role}
              </p>
            </div>
            {user.role === 'customer' && <UserCircle size={13} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />}
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-0.5">
        {nav.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== '/customer' && item.path !== '/tech' && item.path !== '/admin' &&
             location.pathname.startsWith(item.path))
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={active ? {
                background: 'rgba(255,90,95,0.12)',
                color: '#FF7A7F',
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : '10px',
                padding: collapsed ? '10px' : '9px 12px',
                borderRadius: '10px',
                width: '100%',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              } : {
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : '10px',
                padding: collapsed ? '10px' : '9px 12px',
                borderRadius: '10px',
                width: '100%',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: '13.5px',
                color: 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                transition: 'all 0.2s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white' }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}}
              title={collapsed ? item.label : ''}
            >
              <item.icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && active && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
            </button>
          )
        })}
      </nav>

      {/* Sign out */}
      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)' }} className="px-2 pb-4 pt-3">
        <button
          onClick={() => { logout(); navigate('/') }}
          style={{
            display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : '10px',
            padding: collapsed ? '10px' : '9px 12px',
            borderRadius: '10px',
            width: '100%',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: '13.5px',
            color: 'rgba(255,100,100,0.7)',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            transition: 'all 0.2s',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,90,95,0.1)'; e.currentTarget.style.color = '#FF7A7F' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,100,100,0.7)' }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute', right: -10, top: 28,
          width: 20, height: 20,
          background: '#2A2A2A',
          border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#3A3A3A'}
        onMouseLeave={e => e.currentTarget.style.background = '#2A2A2A'}
      >
        <ChevronRight size={11} style={{ color: 'rgba(255,255,255,0.4)', transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
      </button>
    </aside>
  )
}
