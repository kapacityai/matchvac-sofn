import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, ChevronRight, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) return setError('Enter your email address')
    setLoading(true)

    try {
      const baseUrl = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setSent(true)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-surface-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-surface-200 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-brand-500" />
          </div>
          <h1 className="text-xl font-bold text-navy-700 mb-2">Check your email</h1>
          <p className="text-surface-500 text-sm mb-6">
            If an account exists for <strong className="text-surface-900">{email}</strong>, we've sent a password reset link.
          </p>
          <button onClick={() => navigate('/login')} className="text-brand-500 font-semibold text-sm hover:underline">
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button onClick={() => navigate('/login')} className="flex items-center gap-1.5 text-surface-500 hover:text-surface-900 text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Sign In
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-8">
          <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center mb-4">
            <Mail size={24} className="text-brand-500" />
          </div>
          <h1 className="text-xl font-bold text-navy-700 mb-1">Forgot password?</h1>
          <p className="text-surface-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

          {error && <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-600 mb-1">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-surface-200 bg-white text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-11 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Reset Link <ChevronRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}