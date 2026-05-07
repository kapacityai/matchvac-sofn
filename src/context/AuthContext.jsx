import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = {
  'admin@demo.com':    { id: 'admin-1', role: 'admin',    name: 'Alex Admin',    email: 'admin@demo.com',    avatar: 'AA' },
  'customer@demo.com': { id: 'cust-1',  role: 'customer', name: 'Jordan Smith',  email: 'customer@demo.com', avatar: 'JS' },
  'tech@demo.com':     { id: 'tech-1',  role: 'tech',     name: 'Marcus Rivera', email: 'tech@demo.com',     avatar: 'MR' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sc_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [error, setError] = useState('')

  const persistUser = (u) => {
    if (u) localStorage.setItem('sc_user', JSON.stringify(u))
    else localStorage.removeItem('sc_user')
    setUser(u)
  }

  const login = (email, password) => {
    const trimmed = email.toLowerCase().trim()
    if (password !== 'demo1234') {
      setError('Incorrect password. Use: demo1234')
      return null
    }
    const u = DEMO_USERS[trimmed]
    if (!u) {
      setError('No account found for that email.')
      return null
    }
    setError('')
    persistUser(u)
    return u
  }

  const register = (name, email, role) => {
    const avatar = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
    const u = { id: `${role}-${Date.now()}`, role, name, email, avatar }
    setError('')
    persistUser(u)
    return u
  }

  const logout = () => persistUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, register, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
