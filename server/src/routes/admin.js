import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/admin/users
router.get('/users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { role, limit = 100 } = req.query
    let query = supabase.from('users').select('id, email, name, role, phone, avatar, created_at').order('created_at', { ascending: false }).limit(limit)
    if (role) query = query.eq('role', role)
    const { data, error } = await query
    if (error) throw error
    res.json({ users: data })
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET /api/admin/jobs
router.get('/jobs', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { status, limit = 200 } = req.query
    let query = supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(limit)
    if (status) query = query.eq('status', status)
    const { data, error } = await query
    if (error) throw error
    res.json({ jobs: data })
  } catch {
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

// GET /api/admin/reports/overview
router.get('/reports/overview', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [jobsResult, paymentsResult, usersResult, subsResult] = await Promise.all([
      supabase.from('jobs').select('id, price, platform_fee, status, created_at'),
      supabase.from('payments').select('amount, platform_fee, tech_payout, status, created_at'),
      supabase.from('users').select('id, role, created_at'),
      supabase.from('tech_subscriptions').select('tier, price_monthly, status'),
    ])

    const jobs = jobsResult.data || []
    const payments = paymentsResult.data || []
    const users = usersResult.data || []
    const subs = subsResult.data || []

    const completedPayments = payments.filter(p => p.status === 'released')
    const totalGMV = completedPayments.reduce((s, p) => s + Number(p.amount), 0)
    const totalPlatformFees = completedPayments.reduce((s, p) => s + Number(p.platform_fee), 0)
    const totalTechPayouts = completedPayments.reduce((s, p) => s + Number(p.tech_payout), 0)
    const techSubRevenue = subs.filter(s => s.status === 'active').reduce((s, sub) => s + Number(sub.price_monthly), 0)

    res.json({
      summary: {
        totalGMV, totalPlatformFees, totalTechPayouts, techSubRevenue,
        totalJobs: jobs.length,
        completedJobs: jobs.filter(j => j.status === 'completed').length,
        totalCustomers: users.filter(u => u.role === 'customer').length,
        totalTechs: users.filter(u => u.role === 'tech').length,
      },
      jobs, payments, users,
    })
  } catch (err) {
    console.error('Admin reports error:', err)
    res.status(500).json({ error: 'Failed to fetch reports' })
  }
})

// GET /api/admin/reports/payouts
router.get('/reports/payouts', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*, jobs(service_name, tier, address_city), users!payments_tech_id_fkey(name, email)')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ payouts: data })
  } catch {
    res.status(500).json({ error: 'Failed to fetch payouts' })
  }
})

// GET /api/admin/gps-flags
router.get('/gps-flags', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gps_flags')
      .select('*, users!gps_flags_tech_id_fkey(name, email, phone)')
      .eq('status', 'pending')
      .order('flagged_at', { ascending: false })
    if (error) throw error
    res.json({ flags: data })
  } catch {
    res.status(500).json({ error: 'Failed to fetch GPS flags' })
  }
})

// PUT /api/admin/gps-flags/:id
router.put('/gps-flags/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { status, admin_notes } = req.body
    const { data, error } = await supabase
      .from('gps_flags')
      .update({ status, admin_notes, reviewed_at: new Date().toISOString(), reviewed_by: req.user.id })
      .eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ flag: data })
  } catch {
    res.status(500).json({ error: 'Failed to update flag' })
  }
})

// GET /api/admin/contractors
router.get('/contractors', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase.from('contractor_applications').select('*').order('created_at', { ascending: false })
    if (error) throw error
    res.json({ contractors: data })
  } catch {
    res.status(500).json({ error: 'Failed to fetch contractors' })
  }
})

export default router
