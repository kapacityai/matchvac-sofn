import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/customer/profile
router.get('/profile', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customer_profiles').select('*').eq('user_id', req.user.id).single()
    if (error) throw error
    res.json({ profile: data })
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// PUT /api/customer/profile
router.put('/profile', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const allowed = ['street', 'apt', 'city', 'state', 'zip', 'notif_sms', 'notif_email', 'notif_push']
    const updates = {}
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k] })

    const { data, error } = await supabase
      .from('customer_profiles').update(updates).eq('user_id', req.user.id).select().single()
    if (error) throw error
    res.json({ profile: data })
  } catch {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// GET /api/customer/jobs
router.get('/jobs', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jobs').select('*')
      .eq('customer_id', req.user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ jobs: data })
  } catch {
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

// GET /api/customer/premier — check premier membership
router.get('/premier', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const { data } = await supabase
      .from('premier_memberships')
      .select('*').eq('customer_id', req.user.id).eq('status', 'active')
      .order('created_at', { ascending: false }).limit(1).single()
    res.json({ membership: data || null, isMember: !!data })
  } catch {
    res.json({ membership: null, isMember: false })
  }
})

export default router
