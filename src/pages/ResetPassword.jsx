import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [noToken, setNoToken] = useState(false)

  useEffect(() => {
    if (!token) setNoToken(true)
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    if (password !== confirm) return setError('Passwords do not match')
    setLoading(true)

    try {
      const baseUrl = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Reset failed')
      setDone(true)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  if (noToken) {
    return (
      <div className="min-h-screen bg-surface-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-surface-200 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-navy-700 mb-2">Invalid reset link</h1>
          <p className="text-surface-500 text-sm mb-6">This link is missing a reset token. Request a new password reset.</p>
          <button onClick={() => navigate('/forgot-password')} className="text-brand-500 font-semibold text-sm hover:underline">
            Request Reset Link
          </button>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-surface-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-surface-200 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold text-navy-700 mb-2">Password reset!</h1>
          <p className="text-surface-500 text-sm mb-6">Your password has been updated. Sign in with your new password.</p>
          <button onClick={() => navigate('/login')} className="w-full h-11 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-surface-200 p-8">
        <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center mb-4">
          <Lock size={24} className="text-brand-500" />
        </div>
        <h1 className="text-xl font-bold text-navy-700 mb-1">Set new password</h1>
        <p className="text-surface-500 text-sm mb-6">Must be at least 8 characters.</p>

        {error && <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-navy-600 mb-1">New Password</label>
            <input
              type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              className="w-full h-11 px-4 pr-10 rounded-xl border border-surface-200 bg-white text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              placeholder="Min. 8 characters"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-surface-400">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-600 mb-1">Confirm Password</label>
            <input
              type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-surface-200 bg-white text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              placeholder="Re-enter password"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full h-11 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Reset Password <ChevronRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  )
}