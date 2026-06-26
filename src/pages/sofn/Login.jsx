import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SofnLogo } from '../../components/sofn/Logo'
import { Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react'

export default function SofnLogin() {
  useEffect(() => { document.body.classList.add('sofn-body'); return () => document.body.classList.remove('sofn-body') }, [])
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    const tok = localStorage.getItem('sofn_token')
    if (tok) navigate('/sofn/dashboard', { replace: true })
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Email and password required')
    setLoading(true)

    const baseUrl = import.meta.env.VITE_API_URL || ''
    if (!baseUrl) {
      // Demo mode — auto-login
      localStorage.setItem('sofn_token', 'demo-token')
      localStorage.setItem('sofn_user', JSON.stringify({
        name: 'Marcus Johnson', email, role: 'tech',
        earnings_week: 340
      }))
      navigate('/sofn/dashboard', { replace: true })
      return
    }

    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('sofn_token', data.token)
      localStorage.setItem('sofn_user', JSON.stringify(data.user))
      navigate('/sofn/dashboard', { replace: true })
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF]">
      <header className="bg-white border-b border-[#DAD8D2] px-6 py-4 flex items-center justify-between">
        <SofnLogo size="sm" />
        <button onClick={() => navigate('/sofn')} className="text-[#0C6B5E] text-sm font-medium hover:underline">
          ← Back
        </button>
      </header>

      <div className="max-w-md mx-auto px-4 pt-16">
        <div className="bg-white rounded-xl border border-[#DAD8D2] p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[#0C6B5E]/10 flex items-center justify-center mx-auto mb-4">
              <LogIn size={24} className="text-[#0C6B5E]" />
            </div>
            <h1 className="text-xl font-display font-bold text-[#16202B]">Tech Dashboard</h1>
            <p className="text-sm text-[#33485C] mt-1">Sign in to accept dispatches and manage jobs</p>
          </div>

          {error && <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#33485C] mb-1">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20"
                placeholder="tech@example.com"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-[#33485C] mb-1">Password</label>
              <input
                type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-lg border border-[#DAD8D2] bg-white text-[#16202B] focus:outline-none focus:border-[#0C6B5E] focus:ring-2 focus:ring-[#0C6B5E]/20"
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-[#33485C]/50">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-11 bg-[#0C6B5E] hover:bg-[#094A40] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Sign In <ArrowRight size={18} /></>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#DAD8D2] text-center">
            <p className="text-sm text-[#33485C] mb-2">Don't have an account?</p>
            <button onClick={() => navigate('/sofn/register')}
              className="text-[#0C6B5E] font-semibold text-sm hover:underline">
              Register as a Technician
            </button>
          </div>

          {/* Demo mode hint */}
          <p className="mt-4 text-[10px] text-[#33485C]/40 text-center">
            No backend? Enter any email + password to preview in demo mode
          </p>
        </div>
      </div>
    </div>
  )
}