import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    if (password !== 'demo1234') {
      setError('Invalid credentials. Use password: demo1234')
      return null
    }
    const u = DEMO_USERS[email.toLowerCase().trim()]
    if (!u) {
      setError('No account found for that email.')
      return null
    }
    setError('')
    setUser(u)
    return u
  }

  const register = (name, email, role) => {
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const u = { id: `${role}-${Date.now()}`, role, name, email, avatar }
    setUser(u)
    setError('')
    return u
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, register, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
