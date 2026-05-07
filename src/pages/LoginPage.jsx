import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import { Eye, EyeOff, Zap, Shield, MapPin } from 'lucide-react'

const DEMO_CREDS = [
  { role: 'Admin', email: 'admin@demo.com', color: 'from-purple-500 to-accent-600' },
  { role: 'Customer', email: 'customer@demo.com', color: 'from-brand-400 to-brand-600' },
  { role: 'HVAC Tech', email: 'tech@demo.com', color: 'from-emerald-400 to-emerald-600' },
]

export default function LoginPage() {
  const { login, error } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const ok = login(email, password)
      if (ok) {
        const role = email.includes('admin') ? 'admin' : email.includes('tech') ? 'tech' : 'customer'
        navigate(`/${role}`)
      }
      setLoading(false)
    }, 800)
  }

  const quickLogin = (demoEmail) => {
    setEmail(demoEmail)
    setPassword('demo1234')
  }

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left — hero */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-gradient-to-br from-surface-900 to-surface-950 border-r border-white/10">
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          <Logo size="md" />

          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-md">
              <div className="badge badge-blue mb-4">🔧 HVAC On-Demand Marketplace</div>
              <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                Fast, Verified HVAC<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                  Service On Demand
                </span>
              </h2>
              <p className="text-surface-400 text-lg leading-relaxed mb-8">
                Connect with certified HVAC technicians in minutes. Real-time tracking, escrow payments, and guaranteed quality work.
              </p>

              <div className="space-y-3">
                {[
                  { icon: Zap, text: 'Instant dispatch to nearby techs', color: 'text-amber-400' },
                  { icon: MapPin, text: 'Live GPS tracking of your technician', color: 'text-brand-400' },
                  { icon: Shield, text: 'Secure escrow — pay only when done', color: 'text-emerald-400' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className={color} />
                    </div>
                    <span className="text-surface-300 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-surface-600 text-xs">
            © 2026 ServiceConnect. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-surface-400 text-sm mb-8">Sign in to your account to continue</p>

          {/* Demo quick access */}
          <div className="mb-6">
            <p className="text-surface-500 text-xs font-semibold uppercase tracking-wider mb-2">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDS.map(c => (
                <button
                  key={c.role}
                  onClick={() => quickLogin(c.email)}
                  className={`py-2 px-3 rounded-xl bg-gradient-to-br ${c.color} text-white text-xs font-semibold text-center opacity-90 hover:opacity-100 transition-opacity active:scale-95`}
                >
                  {c.role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-11"
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-white">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-surface-500 text-sm mt-6">
            Don't have an account?{' '}
            <span className="text-brand-400 hover:text-brand-300 cursor-pointer font-medium">Create one</span>
          </p>

          <p className="text-center text-surface-600 text-xs mt-6">
            Demo password for all accounts: <span className="text-surface-400 font-mono">demo1234</span>
          </p>
        </div>
      </div>
    </div>
  )
}
