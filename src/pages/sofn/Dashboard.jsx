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

// ── Demo data fallbacks ──
const DEMO_USER = {
  id: 'tech-1', name: 'Marcus Johnson', email: 'marcus@example.com',
  phone: '(703) 555-0123', role: 'tech', avatar: 'MJ',
  earnings_week: 340,
}

const DEMO_JOBS_AVAILABLE = [
  { id: 'j1', service_name: 'Spring Tune-Up', address_street: '123 Oak St', address_city: 'Arlington', address_zip: '22202', tier: 'basic', price: 75, estimated_time: '45 min', distance: '2.3 mi', status: 'available', category: 'Tune-up' },
  { id: 'j2', service_name: 'Filter Swap', address_street: '456 Elm Ave', address_city: 'Alexandria', address_zip: '22301', tier: 'basic', price: 40, estimated_time: '20 min', distance: '4.1 mi', status: 'available', category: 'Tune-up' },
  { id: 'j3', service_name: 'Furnace Repair', address_street: '789 Pine Rd', address_city: 'Falls Church', address_zip: '22042', tier: 'standard', price: 150, estimated_time: '2 hrs', distance: '1.8 mi', status: 'available', category: 'Repair' },
  { id: 'j4', service_name: 'Emergency No Heat', address_street: '321 Maple Dr', address_city: 'McLean', address_zip: '22102', tier: 'premium', price: 299, estimated_time: '30 min', distance: '0.9 mi', status: 'available', category: 'Emergency' },
  { id: 'j5', service_name: 'A/C Tune-Up', address_street: '555 Birch Ln', address_city: 'Arlington', address_zip: '22204', tier: 'standard', price: 110, estimated_time: '1 hr', distance: '3.5 mi', status: 'available', category: 'Tune-up' },
]

const DEMO_MY_JOBS = [
  { id: 'm1', service_name: 'Thermostat Install', address_street: '111 Cedar Ct', address_city: 'Alexandria', address_zip: '22302', price: 125, status: 'assigned', customer_name: 'Sarah', assigned_at: new Date().toISOString() },
  { id: 'm2', service_name: 'Water Heater Repair', address_street: '222 Walnut Way', address_city: 'Arlington', address_zip: '22205', price: 175, status: 'in_progress', customer_name: 'David', started_at: new Date().toISOString() },
  { id: 'm3', service_name: 'Spring Tune-Up', address_street: '333 Cherry St', address_city: 'Falls Church', address_zip: '22044', price: 75, status: 'tech_complete', customer_name: 'Lisa', completed_at: new Date(Date.now() - 2*60*60*1000).toISOString() },
]

const DEMO_EARNINGS = {
  week: 340, month: 1280, total: 4850, pending: 200,
  nextPayout: '2026-06-30',
  history: [
    { date: '2026-06-23', job: 'Spring Tune-Up', amount: 75, status: 'paid' },
    { date: '2026-06-22', job: 'Filter Swap', amount: 40, status: 'paid' },
    { date: '2026-06-21', job: 'System Repair', amount: 125, status: 'paid' },
    { date: '2026-06-20', job: 'Furnace Repair', amount: 150, status: 'pending' },
    { date: '2026-06-19', job: 'Thermostat Install', amount: 125, status: 'pending' },
  ]
}

const DEMO_PROFILE = {
  name: 'Marcus Johnson', email: 'marcus@example.com', phone: '(703) 555-0123',
  serviceZips: ['20109', '22153', '22301'], paymentMethod: 'flat_fee',
  licenseExp: '2027-06-30', insuranceExp: '2026-12-31',
  subscriptionTier: 'pro', subscriptionPrice: 49,
}

// ── Demo notifications ──
const DEMO_NOTIFICATIONS = [
  { id: 'n1', type: 'new_job_available', title: 'New Job in 22202', message: 'Spring Tune-Up — Arlington • $75', read: false, created_at: new Date().toISOString() },
  { id: 'n2', type: 'new_job_available', title: 'New Job in 22301', message: 'Filter Swap — Alexandria • $40', read: false, created_at: new Date(Date.now() - 60000).toISOString() },
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
  const [user, setUser] = useState(DEMO_USER)
  const [availableJobs, setAvailableJobs] = useState(DEMO_JOBS_AVAILABLE)
  const [myJobs, setMyJobs] = useState(DEMO_MY_JOBS)
  const [earnings, setEarnings] = useState(DEMO_EARNINGS)
  const [profile, setProfile] = useState(DEMO_PROFILE)
  const [loading, setLoading] = useState(true)

  // Notification state
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS)
  const [unreadCount, setUnreadCount] = useState(2)
  const prevJobCountRef = useRef(DEMO_JOBS_AVAILABLE.length)
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

        const [meRes, availRes, jobsRes, earnRes] = await Promise.all([
          fetch(`${apiUrl}/api/auth/me`, { headers }).then(r => r.json()).catch(() => null),
          fetch(`${apiUrl}/api/jobs?status=available&limit=10`, { headers }).then(r => r.json()).catch(() => null),
          fetch(`${apiUrl}/api/jobs?limit=50`, { headers }).then(r => r.json()).catch(() => null),
          fetch(`${apiUrl}/api/tech/earnings`, { headers }).then(r => r.json()).catch(() => null),
          fetch(`${apiUrl}/api/notifications`, { headers }).then(r => r.json()).catch(() => null),
        ])
        if (meRes?.user) setUser({ ...meRes.user, earnings_week: earnRes?.summary?.totalNet || 0 })
        if (availRes?.jobs) {
          setAvailableJobs(availRes.jobs)
          prevJobCountRef.current = availRes.jobs.length
        }
        if (jobsRes?.jobs) setMyJobs(jobsRes.jobs)
        if (earnRes?.summary) setEarnings(prev => ({ ...prev, ...earnRes.summary, history: earnRes.payments || prev.history }))
        if (meRes?.notifications) {
          setNotifications(meRes.notifications)
          setUnreadCount(meRes.unread)
        }
      } catch {}
      setLoading(false)
    }
    fetchData()
  }, [])

  // ── Job polling (every 15s) — checks for new available jobs ──
  useEffect(() => {
    const pollJobs = async () => {
      try {
        const token = localStorage.getItem('sofn_token')
        const apiUrl = import.meta.env.VITE_API_URL || ''
        if (!apiUrl) {
          // Demo mode: simulate new jobs appearing
          return
        }

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        const res = await fetch(`${apiUrl}/api/jobs?status=available&limit=10`, { headers })
        const data = await res.json()
        if (data?.jobs) {
          const prevCount = prevJobCountRef.current
          const newCount = data.jobs.length
          if (newCount > prevCount) {
            playAlertSound()
            // Update page title with badge
            document.title = `(${newCount - prevCount}) SOFN Dashboard`
            setTimeout(() => { document.title = 'SOFN Dashboard' }, 5000)
          }
          prevJobCountRef.current = newCount
          setAvailableJobs(data.jobs)
        }
      } catch {}
    }

    // Start polling
    pollingRef.current = setInterval(pollJobs, 15000)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  // ── Notification polling (every 30s) — scan for ZIP-matched jobs ──
  useEffect(() => {
    const pollNotifications = async () => {
      try {
        const token = localStorage.getItem('sofn_token')
        const apiUrl = import.meta.env.VITE_API_URL || ''
        if (!apiUrl) return // demo mode — use static data

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

        // 1. Scan for new ZIP-matched jobs
        await fetch(`${apiUrl}/api/notifications/scan`, { method: 'POST', headers }).catch(() => {})

        // 2. Fetch updated notifications
        const notifRes = await fetch(`${apiUrl}/api/notifications`, { headers }).then(r => r.json()).catch(() => null)
        if (notifRes?.notifications) {
          setNotifications(notifRes.notifications)
          setUnreadCount(notifRes.unread)
        }
      } catch {}
    }

    notifPollingRef.current = setInterval(pollNotifications, 30000)

    // Keep unread count ref for sound comparison without re-creating interval
    const unreadRef = { current: unreadCount }
    const soundCheckId = setInterval(async () => {
      try {
        const token = localStorage.getItem('sofn_token')
        const apiUrl = import.meta.env.VITE_API_URL || ''
        if (!apiUrl) return
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