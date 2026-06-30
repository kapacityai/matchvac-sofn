import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SofnLogo } from '../../components/sofn/Logo'
import { Eye, EyeOff, Lock, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react'

export default function SofnResetPassword() {
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
      <div className="min-h-screen bg-[#F4F3EF]">
        <header className="bg-white border-b border-[#DAD8D2] px-6 py-4">
          <SofnLogo size="sm" />
        </header>
        <div className="max-w-md mx-auto px-4 pt-16">
          <div className="bg-white rounded-xl border border-[#DAD8D2] p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <h1 className="text-xl font-display font-bold text-[#16202B] mb-2">Invalid reset link</h1>
            <p className="text-[#33485C] text-sm mb-6">This link is missing a reset token. Request a new password reset.</p>
            <button onClick={() => navigate('/sofn/forgot-password')} className="text-[#0C6B5E] font-semibold text-sm hover:underline">
              Request Reset Link
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#F4F3EF]">
        <header className="bg-white border-b border-[#DAD8D2] px-6 py-4">
          <SofnLogo size="sm" />
        </header>
        <div className="max-w-md mx-auto px-4 pt-16">
          <div className="bg-white rounded-xl border border-[#DAD8D2] p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-emerald-600" />
            </div>
            <h1 className="text-xl font-display font-bold text-[#16202B] mb-2">Password reset!</h1>
            <p className="text-[#33485C] text-sm mb-6">Your password has been updated. Sign in with your new password.</p>
            <button onClick={() => navigate('/sofn/login')} className="w-full h-11 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF]">
      <header className="bg-white border-b border-[#DAD8D2] px-6 py-4 flex items-center justify-between">
        <SofnLogo size="sm" />
        <button onClick={() => navigate('/sofn/login')} className="text-[#0C6B5E] text-sm font-medium hover:underline">← Back</button>
      </header>

      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="bg-white rounded-xl border border-[#DAD8D2] p-8">
          <div className="w-14 h-14 rounded-full bg-[#0C6B5E]/10 flex items-center justify-center mb-4">
            <Lock size={24} className="text-[#0C6B5E]" />
          </div>
          <h1 className="text-xl font-display font-bold text-[#16202B] mb-1">Set new password</h1>
          <p className="text-[#33485C] text-sm mb-6">Must be at least 8 characters.</p>

          {error && <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-[#33485C] mb-1">New Password</label>
              <input
                type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20"
                placeholder="Min. 8 characters"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-[#33485C]/50">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#33485C] mb-1">Confirm Password</label>
              <input
                type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20"
                placeholder="Re-enter password"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-11 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Reset Password <ChevronRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}