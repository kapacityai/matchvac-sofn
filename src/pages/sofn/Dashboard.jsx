import { useState, useEffect, useRef, useCallback } from 'react'
import { SofnHeader } from '../../components/sofn/Header'
import { SofnLogo } from '../../components/sofn/Logo'
import SofnJobs from './Jobs'
import SofnEarnings from './Earnings'
import SofnProfile from './Profile'
import { LayoutDashboard, Briefcase, DollarSign, User, Bell } from 'lucide-react'

const TABS = [
  { id: 'dispatches', label: 'Available Dispatches', icon: LayoutDashboard },
  { id: 'jobs', label: 'My Jobs', icon: Briefcase },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'profile', label: 'Profile', icon: User },
]

// Simple notification sound using Web Audio API
function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  } catch {}
}

export default function SofnDashboard() {
  const [activeTab, setActiveTab] = useState('dispatches')
  const [user, setUser] = useState(null)
  const [availableJobs, setAvailableJobs] = useState([])
  const [myJobs, setMyJobs] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const prevJobCountRef = useRef(0)
  const pollingRef = useRef(null)
  const notifPollingRef = useRef(null)

  useEffect(() => { document.body.classList.add('sofn-body'); return () => document.body.classList.remove('sofn-body') }, [])

  // ── Initial data fetch ──
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const token = localStorage.getItem('sofn_token')
        if (!token) { setLoading(false); return }
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        const apiUrl = import.meta.env.VITE_API_URL || ''

        const [meRes, availRes, jobsRes, earnRes, notifRes] = await Promise.all([
          fetch(`${apiUrl}/api/auth/me`, { headers }).then(r => r.json()).catch(() => null),
          fetch(`${apiUrl}/api/jobs?status=available&limit=10`, { headers }).then(r => r.json()).catch(() => null),
          fetch(`${apiUrl}/api/jobs?limit=50`, { headers }).then(r => r.json()).catch(() => null),
          fetch(`${apiUrl}/api/tech/earnings`, { headers }).then(r => r.json()).catch(() => null),
          fetch(`${apiUrl}/api/notifications`, { headers }).then(r => r.json()).catch(() => null),
        ])
        if (meRes?.user) setUser(meRes.user)
        if (availRes?.jobs) {
          setAvailableJobs(availRes.jobs)
          prevJobCountRef.current = availRes.jobs.length
        }
        if (jobsRes?.jobs) setMyJobs(jobsRes.jobs)
        if (earnRes) setEarnings(earnRes)
        if (notifRes?.notifications) {
          setNotifications(notifRes.notifications)
          setUnreadCount(notifRes.unread || 0)
        }
      } catch {}
      setLoading(false)
    }
    fetchData()
  }, [])

  // ── Job polling (every 15s) ──
  useEffect(() => {
    const pollJobs = async () => {
      try {
        const token = localStorage.getItem('sofn_token')
        const apiUrl = import.meta.env.VITE_API_URL || ''
        if (!apiUrl || !token) return

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        const res = await fetch(`${apiUrl}/api/jobs?status=available&limit=10`, { headers })
        const data = await res.json()
        if (data?.jobs) {
          const prevCount = prevJobCountRef.current
          const newCount = data.jobs.length
          if (newCount > prevCount) {
            playAlertSound()
            document.title = `(${newCount - prevCount}) SOFN Dashboard`
            setTimeout(() => { document.title = 'SOFN Dashboard' }, 5000)
          }
          prevJobCountRef.current = newCount
          setAvailableJobs(data.jobs)
        }
      } catch {}
    }

    pollingRef.current = setInterval(pollJobs, 15000)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  // ── Notification polling (every 30s) ──
  useEffect(() => {
    const pollNotifications = async () => {
      try {
        const token = localStorage.getItem('sofn_token')
        const apiUrl = import.meta.env.VITE_API_URL || ''
        if (!apiUrl || !token) return

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

        await fetch(`${apiUrl}/api/notifications/scan`, { method: 'POST', headers }).catch(() => {})

        const notifRes = await fetch(`${apiUrl}/api/notifications`, { headers }).then(r => r.json()).catch(() => null)
        if (notifRes?.notifications) {
          setNotifications(notifRes.notifications)
          setUnreadCount(notifRes.unread || 0)
        }
      } catch {}
    }

    notifPollingRef.current = setInterval(pollNotifications, 30000)

    const unreadRef = { current: unreadCount }
    const soundCheckId = setInterval(async () => {
      try {
        const token = localStorage.getItem('sofn_token')
        const apiUrl = import.meta.env.VITE_API_URL || ''
        if (!apiUrl || !token) return
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        const res = await fetch(`${apiUrl}/api/notifications`, { headers }).then(r => r.json()).catch(() => null)
        if (res?.unread !== undefined && res.unread > unreadRef.current) {
          playAlertSound()
          document.title = `(${res.unread - unreadRef.current}) SOFN Dashboard`
          setTimeout(() => { document.title = 'SOFN Dashboard' }, 5000)
        }
        if (res?.unread !== undefined) unreadRef.current = res.unread
      } catch {}
    }, 15000)

    return () => {
      if (notifPollingRef.current) clearInterval(notifPollingRef.current)
      clearInterval(soundCheckId)
    }
  }, [])

  // ── Mark single notification as read ──
  const markRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    const apiUrl = import.meta.env.VITE_API_URL || ''
    if (apiUrl) {
      const token = localStorage.getItem('sofn_token')
      await fetch(`${apiUrl}/api/notifications/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] })
      }).catch(() => {})
    }
  }, [])

  // ── Mark all notifications as read ──
  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    const apiUrl = import.meta.env.VITE_API_URL || ''
    if (apiUrl) {
      const token = localStorage.getItem('sofn_token')
      await fetch(`${apiUrl}/api/notifications/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      }).catch(() => {})
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('sofn_token')
    localStorage.removeItem('sofn_user')
    window.location.href = '/sofn/login'
  }

  const handleAcceptJob = async (jobId) => {
    const token = localStorage.getItem('sofn_token')
    if (!token) { alert('Not logged in'); return }
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      await fetch(`${apiUrl}/api/jobs/${jobId}/assign`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const job = availableJobs.find(j => j.id === jobId)
      if (job) {
        setMyJobs(prev => [{ ...job, status: 'assigned', customer_name: 'Customer', assigned_at: new Date().toISOString() }, ...prev])
        setAvailableJobs(prev => prev.filter(j => j.id !== jobId))
      }
    } catch (e) { console.error('Accept failed:', e) }
  }

  const handleStartJob = async (jobId) => {
    const token = localStorage.getItem('sofn_token')
    if (!token) return
    const apiUrl = import.meta.env.VITE_API_URL || ''
    await fetch(`${apiUrl}/api/jobs/${jobId}/start`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
    setMyJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'in_progress', started_at: new Date().toISOString() } : j))
  }

  const handleCompleteJob = async (jobId, summary, photos) => {
    const token = localStorage.getItem('sofn_token')
    if (!token) return
    const apiUrl = import.meta.env.VITE_API_URL || ''
    await fetch(`${apiUrl}/api/jobs/${jobId}/complete`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: summary })
    })
    setMyJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'tech_complete', completed_at: new Date().toISOString() } : j))
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF]">
      <SofnHeader
        user={user}
        onLogout={handleLogout}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />

      {/* Alert banner when unread notifications */}
      {unreadCount > 0 && activeTab !== 'dispatches' && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <Bell size={12} />
              {unreadCount} new job{unreadCount !== 1 ? 's' : ''} available in your service zones
            </p>
            <button
              onClick={() => setActiveTab('dispatches')}
              className="text-xs text-emerald-700 font-semibold underline hover:no-underline"
            >
              View Dispatches
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-[#DAD8D2] px-6">
        <div className="max-w-6xl mx-auto flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'border-[#0C6B5E] text-[#0C6B5E]' : 'border-transparent text-[#33485C] hover:text-[#0C6B5E]'
            }`}>
              <tab.icon size={16} />
              {tab.label}
              {tab.id === 'dispatches' && unreadCount > 0 && (
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#0C6B5E]/30 border-t-[#0C6B5E] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'dispatches' && (
              <SofnJobs
                availableJobs={availableJobs}
                myJobs={myJobs}
                onAccept={handleAcceptJob}
                onStart={handleStartJob}
                onComplete={handleCompleteJob}
              />
            )}
            {activeTab === 'jobs' && (
              <SofnJobs
                availableJobs={availableJobs}
                myJobs={myJobs}
                onAccept={handleAcceptJob}
                onStart={handleStartJob}
                onComplete={handleCompleteJob}
                showMyJobsOnly
              />
            )}
            {activeTab === 'earnings' && <SofnEarnings earnings={earnings} />}
            {activeTab === 'profile' && <SofnProfile profile={profile} />}
          </>
        )}
      </div>
    </div>
  )
}