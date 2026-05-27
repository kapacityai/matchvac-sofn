import React, { createContext, useContext, useState } from 'react'
import { auth as apiAuth } from '../lib/api.js'

const AuthContext = createContext(null)

// ── Demo users (used when VITE_API_URL is not set) ────────────
const DEMO_USERS = {
  'admin@demo.com':    { id: 'admin-1', role: 'admin',    name: 'Alex Admin',    email: 'admin@demo.com',    avatar: 'AA' },
  'customer@demo.com': { id: 'cust-1',  role: 'customer', name: 'Jordan Smith',  email: 'customer@demo.com', avatar: 'JS' },
  'tech@demo.com':     { id: 'tech-1',  role: 'tech',     name: 'Marcus Rivera', email: 'tech@demo.com',     avatar: 'MR' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sc_user')) } catch { return null }
  })
  const [error, setError] = useState('')

  const persistUser = (u) => {
    if (u) localStorage.setItem('sc_user', JSON.stringify(u))
    else localStorage.removeItem('sc_user')
    setUser(u)
  }

  // ── LOGIN ────────────────────────────────────────────────────
  const login = async (email, password) => {
    const trimmed = email.toLowerCase().trim()
    setError('')

    // Live API mode
    if (apiAuth.isLive) {
      try {
        const { user: u } = await apiAuth.login({ email: trimmed, password })
        persistUser(u)
        return u
      } catch (err) {
        setError(err.message || 'Login failed')
        return null
      }
    }

    // Demo mode
    if (password !== 'demo1234') { setError('Incorrect password. Use: demo1234'); return null }
    const u = DEMO_USERS[trimmed]
    if (!u) { setError('No account found for that email.'); return null }
    persistUser(u)
    return u
  }

  // ── REGISTER ─────────────────────────────────────────────────
  const register = async (name, email, role, password, phone) => {
    setError('')

    // Live API mode
    if (apiAuth.isLive) {
      const { user: u } = await apiAuth.register({ name, email, password, role, phone })
      persistUser(u)
      return u
    }

    // Demo mode
    const avatar = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
    const u = { id: `${role}-${Date.now()}`, role, name, email, avatar }
    persistUser(u)
    return u
  }

  // ── LOGOUT ───────────────────────────────────────────────────
  const logout = () => {
    apiAuth.logout()
    persistUser(null)
  }

  // ── UPDATE PROFILE ───────────────────────────────────────────
  const updateProfile = async (fields) => {
    if (apiAuth.isLive) {
      try {
        const { user: u } = await apiAuth.updateMe(fields)
        persistUser(u)
        return u
      } catch (err) {
        setError(err.message)
        return user
      }
    }
    // Demo mode — local only
    const updated = { ...user, ...fields }
    if (fields.name) {
      updated.avatar = fields.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || updated.avatar
    }
    persistUser(updated)
    return updated
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
