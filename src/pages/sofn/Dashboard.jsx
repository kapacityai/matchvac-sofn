import { useState, useEffect } from 'react'
import { SofnHeader } from '../../components/sofn/Header'
import { SofnLogo } from '../../components/sofn/Logo'
import SofnJobs from './Jobs'
import SofnEarnings from './Earnings'
import SofnProfile from './Profile'
import { LayoutDashboard, Briefcase, DollarSign, User } from 'lucide-react'

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

export default function SofnDashboard() {
  const [activeTab, setActiveTab] = useState('dispatches')
  const [user, setUser] = useState(DEMO_USER)
  const [availableJobs, setAvailableJobs] = useState(DEMO_JOBS_AVAILABLE)
  const [myJobs, setMyJobs] = useState(DEMO_MY_JOBS)
  const [earnings, setEarnings] = useState(DEMO_EARNINGS)
  const [profile, setProfile] = useState(DEMO_PROFILE)
  const [loading, setLoading] = useState(true)

  useEffect(() => { document.body.classList.add('sofn-body'); return () => document.body.classList.remove('sofn-body') }, [])

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
        ])
        if (meRes?.user) setUser({ ...meRes.user, earnings_week: earnRes?.summary?.totalNet || 0 })
        if (availRes?.jobs) setAvailableJobs(availRes.jobs)
        if (jobsRes?.jobs) setMyJobs(jobsRes.jobs)
        if (earnRes?.summary) setEarnings(prev => ({ ...prev, ...earnRes.summary, history: earnRes.payments || prev.history }))
      } catch {}
      setLoading(false)
    }
    fetchData()
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
      <SofnHeader user={user} onLogout={handleLogout} />

      {/* Tabs */}
      <div className="bg-white border-b border-[#DAD8D2] px-6">
        <div className="max-w-6xl mx-auto flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'border-[#0C6B5E] text-[#0C6B5E]' : 'border-transparent text-[#33485C] hover:text-[#0C6B5E]'
            }`}>
              <tab.icon size={16} />
              {tab.label}
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