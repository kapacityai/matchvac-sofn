import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SofnLogo } from '../../components/sofn/Logo'
import { Mail, ArrowLeft, ChevronRight, CheckCircle } from 'lucide-react'

export default function SofnForgotPassword() {
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
      <div className="min-h-screen bg-[#F4F3EF]">
        <header className="bg-white border-b border-[#DAD8D2] px-6 py-4">
          <SofnLogo size="sm" />
        </header>
        <div className="max-w-md mx-auto px-4 pt-16">
          <div className="bg-white rounded-xl border border-[#DAD8D2] p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#0C6B5E]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-[#0C6B5E]" />
            </div>
            <h1 className="text-xl font-display font-bold text-[#16202B] mb-2">Check your email</h1>
            <p className="text-[#33485C] text-sm mb-6">
              If an account exists for <strong className="text-[#16202B]">{email}</strong>, we've sent a password reset link.
            </p>
            <button onClick={() => navigate('/sofn/login')} className="text-[#0C6B5E] font-semibold text-sm hover:underline">
              Back to Sign In
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

      <div className="max-w-md mx-auto px-4 pt-16">
        <div className="bg-white rounded-xl border border-[#DAD8D2] p-8">
          <div className="w-14 h-14 rounded-full bg-[#0C6B5E]/10 flex items-center justify-center mb-4">
            <Mail size={24} className="text-[#0C6B5E]" />
          </div>
          <h1 className="text-xl font-display font-bold text-[#16202B] mb-1">Forgot password?</h1>
          <p className="text-[#33485C] text-sm mb-6">Enter your email and we'll send you a reset link.</p>

          {error && <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#33485C] mb-1">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20"
                placeholder="tech@example.com"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-11 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Reset Link <ChevronRight size={18} /></>}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <button onClick={() => navigate('/sofn/register')} className="text-[#0C6B5E] text-sm font-semibold hover:underline">
            Don't have an account? Register
          </button>
        </p>
      </div>
    </div>
  )
}