/**
 * MatcHvac API Client
 * Connects the React frontend to the real backend API.
 * Falls back to mock data when VITE_API_URL is not set (demo mode).
 */

const API_URL = import.meta.env.VITE_API_URL || null
const IS_LIVE = !!API_URL

// ── Token management ──────────────────────────────────────────
function getToken() { return localStorage.getItem('sc_token') }
function setToken(t) { localStorage.setItem('sc_token', t) }
function clearToken() { localStorage.removeItem('sc_token'); localStorage.removeItem('sc_refresh') }
function getRefresh() { return localStorage.getItem('sc_refresh') }
function setRefresh(t) { localStorage.setItem('sc_refresh', t) }

// ── Base fetch wrapper ────────────────────────────────────────
async function apiFetch(path, options = {}) {
  if (!IS_LIVE) throw new Error('API not configured — running in demo mode')

  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  // Auto-refresh token on 401
  if (res.status === 401 && getRefresh()) {
    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: getRefresh() }),
    })
    if (refreshRes.ok) {
      const { token: newToken } = await refreshRes.json()
      setToken(newToken)
      headers['Authorization'] = `Bearer ${newToken}`
      const retry = await fetch(`${API_URL}${path}`, { ...options, headers })
      return retry.json()
    } else {
      clearToken()
      window.location.href = '/login'
      return
    }
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

// ── Auth ──────────────────────────────────────────────────────
export const auth = {
  async register({ email, password, name, phone, role, source }) {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone, role, source }),
    })
    if (data.token) { setToken(data.token); setRefresh(data.refreshToken) }
    return data
  },

  async login({ email, password }) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (data.token) { setToken(data.token); setRefresh(data.refreshToken) }
    return data
  },

  logout() { clearToken() },

  async me() { return apiFetch('/api/auth/me') },

  async updateMe(fields) {
    return apiFetch('/api/auth/me', { method: 'PUT', body: JSON.stringify(fields) })
  },

  async changePassword({ currentPassword, newPassword }) {
    return apiFetch('/api/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  },

  isLive: IS_LIVE,
}

// ── Jobs ──────────────────────────────────────────────────────
export const jobs = {
  async list(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/api/jobs${qs ? '?' + qs : ''}`)
  },
  async get(id) { return apiFetch(`/api/jobs/${id}`) },
  async create(data) {
    return apiFetch('/api/jobs', { method: 'POST', body: JSON.stringify(data) })
  },
  async assign(id) {
    return apiFetch(`/api/jobs/${id}/assign`, { method: 'POST' })
  },
  async start(id) {
    return apiFetch(`/api/jobs/${id}/start`, { method: 'POST' })
  },
  async complete(id) {
    return apiFetch(`/api/jobs/${id}/complete`, { method: 'POST' })
  },
  async confirm(id, { rating, review } = {}) {
    return apiFetch(`/api/jobs/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    })
  },
}

// ── Payments ──────────────────────────────────────────────────
export const payments = {
  async history() { return apiFetch('/api/payments/history') },
  async onboardStripe() {
    return apiFetch('/api/payments/connect/onboard', { method: 'POST' })
  },
  async stripeStatus() { return apiFetch('/api/payments/connect/status') },
}

// ── Tech ──────────────────────────────────────────────────────
export const tech = {
  async profile() { return apiFetch('/api/tech/profile') },
  async updateProfile(data) {
    return apiFetch('/api/tech/profile', { method: 'PUT', body: JSON.stringify(data) })
  },
  async updateLocation(lat, lng) {
    return apiFetch('/api/tech/location', { method: 'PUT', body: JSON.stringify({ lat, lng }) })
  },
  async earnings() { return apiFetch('/api/tech/earnings') },
  async subscription() { return apiFetch('/api/tech/subscription') },
  async upgradeSubscription(tier) {
    return apiFetch('/api/tech/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({ tier }),
    })
  },
}

// ── Customer ──────────────────────────────────────────────────
export const customer = {
  async profile() { return apiFetch('/api/customer/profile') },
  async updateProfile(data) {
    return apiFetch('/api/customer/profile', { method: 'PUT', body: JSON.stringify(data) })
  },
  async jobs() { return apiFetch('/api/customer/jobs') },
  async premierStatus() { return apiFetch('/api/customer/premier') },
}

// ── Admin ─────────────────────────────────────────────────────
export const admin = {
  async users(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/api/admin/users${qs ? '?' + qs : ''}`)
  },
  async jobs(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/api/admin/jobs${qs ? '?' + qs : ''}`)
  },
  async reportsOverview() { return apiFetch('/api/admin/reports/overview') },
  async reportPayouts() { return apiFetch('/api/admin/reports/payouts') },
  async gpsFlags() { return apiFetch('/api/admin/gps-flags') },
  async resolveFlag(id, data) {
    return apiFetch(`/api/admin/gps-flags/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  async contractors() { return apiFetch('/api/admin/contractors') },
}

// ── MCP ───────────────────────────────────────────────────────
export const mcp = {
  async manifest() { return apiFetch('/api/mcp/manifest') },
  async execute(tool, parameters = {}) {
    return apiFetch('/api/mcp/execute', {
      method: 'POST',
      body: JSON.stringify({ tool, parameters }),
    })
  },
}

export default { auth, jobs, payments, tech, customer, admin, mcp, isLive: IS_LIVE }
