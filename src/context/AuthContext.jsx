import React, { createContext, useContext, useState } from 'react'
import { auth as apiAuth } from '../lib/api.js'

const AuthContext = createContext(null)

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
    setError('Server not configured. Set VITE_API_URL to enable login.')
    return null
  }

  // ── REGISTER ─────────────────────────────────────────────────
  const register = async (name, email, role, password, phone, source) => {
    setError('')

    // Live API mode
    if (apiAuth.isLive) {
      const { user: u } = await apiAuth.register({ name, email, password, role, phone, source })
      persistUser(u)
      return u
    }

    setError('Server not configured. Set VITE_API_URL to enable registration.')
    return null
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
    return user
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
