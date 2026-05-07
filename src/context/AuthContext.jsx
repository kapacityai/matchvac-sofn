import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = {
  'admin@demo.com': { id: 'admin-1', role: 'admin', name: 'Alex Admin', email: 'admin@demo.com', avatar: 'AA' },
  'customer@demo.com': { id: 'cust-1', role: 'customer', name: 'Jordan Smith', email: 'customer@demo.com', avatar: 'JS', address: '1420 Harbor Blvd, Costa Mesa, CA 92627' },
  'tech@demo.com': { id: 'tech-1', role: 'tech', name: 'Marcus Rivera', email: 'tech@demo.com', avatar: 'MR', rating: 4.9, jobs: 247, status: 'active' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  const login = (email, password) => {
    if (password !== 'demo1234') { setError('Invalid credentials'); return false }
    const u = DEMO_USERS[email]
    if (!u) { setError('No account found'); return false }
    setUser(u)
    setError('')
    return true
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
