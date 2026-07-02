import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth, requireRole, wrapAsync } from '../middleware/auth.js'

const router = Router()

// GET /api/tech/profile
router.get('/profile', requireAuth, requireRole('tech'), wrapAsync(async (req, res) => {
  const { data, error } = await supabase
    .from('tech_profiles').select('*').eq('user_id', req.user.id).maybeSingle()
  if (error) return res.status(500).json({ error: 'Fetch tech profile: ' + error.message })
  res.json({ profile: data })
}))

// PUT /api/tech/profile
router.put('/profile', requireAuth, requireRole('tech'), wrapAsync(async (req, res) => {
  const allowed = [
    'license_number', 'license_state', 'license_expiry',
    'epa608_certified', 'epa608_number',
    'insurance_company', 'insurance_policy_number', 'insurance_expiry', 'insurance_file',
    'service_zips', 'phone',
    'preferred_payment_method',
    'bank_account_holder', 'bank_routing', 'bank_account', 'bank_account_type', 'bank_account_confirmed',
  ]
  const updates = {}
  allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k] })

  const { data, error } = await supabase
    .from('tech_profiles').update(updates).eq('user_id', req.user.id).select()
  if (error) return res.status(500).json({ error: 'Update tech profile: ' + error.message })
  if (!data || data.length === 0) return res.status(500).json({ error: 'Update returned no rows' })
  res.json({ profile: data[0] })
}))

// PUT /api/tech/location — update GPS location
router.put('/location', requireAuth, requireRole('tech'), async (req, res) => {
  try {
    const { lat, lng } = req.body
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' })

    await supabase.from('tech_profiles').update({
      gps_lat: lat, gps_lng: lng,
      last_location_update: new Date().toISOString(),
    }).eq('user_id', req.user.id)

    // Check for GPS flags — visits to known job addresses without active job
    const { data: completedJobs } = await supabase
      .from('jobs')
      .select('id, address_street, address_city, customer_id')
      .eq('tech_id', req.user.id)
      .eq('status', 'completed')
      .gte('completed_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())

    const { data: activeJob } = await supabase
      .from('jobs')
      .select('id')
      .eq('tech_id', req.user.id)
      .in('status', ['assigned', 'in_progress'])
      .single()

    if (!activeJob && completedJobs?.length) {
      // Simple proximity check — in production use real geocoding
      const recentFlag = await supabase.from('gps_flags')
        .select('id').eq('tech_id', req.user.id)
        .eq('status', 'pending')
        .gte('flagged_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .single()

      if (!recentFlag.data) {
        // Flag for admin review if tech is in known service area with no active job
        // In production, compare lat/lng against job addresses using geocoding
      }
    }

    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to update location' })
  }
})

// GET /api/tech/earnings
router.get('/earnings', requireAuth, requireRole('tech'), async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*, jobs(service_name, tier, address_city, completed_at)')
      .eq('tech_id', req.user.id)
      .eq('status', 'released')
      .order('created_at', { ascending: false })
    if (error) throw error

    const totalGross = payments.reduce((s, p) => s + Number(p.amount), 0)
    const totalFees = payments.reduce((s, p) => s + Number(p.platform_fee), 0)
    const totalNet = payments.reduce((s, p) => s + Number(p.tech_payout), 0)

    res.json({ payments, summary: { totalGross, totalFees, totalNet, jobCount: payments.length } })
  } catch {
    res.status(500).json({ error: 'Failed to fetch earnings' })
  }
})

// GET /api/tech/subscription
router.get('/subscription', requireAuth, requireRole('tech'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tech_subscriptions').select('*').eq('tech_id', req.user.id)
      .order('created_at', { ascending: false }).limit(1).single()
    if (error) throw error
    res.json({ subscription: data })
  } catch {
    res.status(500).json({ error: 'Failed to fetch subscription' })
  }
})

// POST /api/tech/subscription/upgrade
router.post('/subscription/upgrade', requireAuth, requireRole('tech'), async (req, res) => {
  try {
    const { tier } = req.body
    if (!['free', 'pro', 'elite'].includes(tier)) return res.status(400).json({ error: 'Invalid tier' })

    const tiers = { free: { price: 0, fee: 0.15 }, pro: { price: 49, fee: 0.11 }, elite: { price: 99, fee: 0.08 } }
    const t = tiers[tier]

    // Cancel existing subscription in Stripe if downgrading/changing
    const { data: existing } = await supabase
      .from('tech_subscriptions').select('stripe_subscription_id').eq('tech_id', req.user.id).single()
    if (existing?.stripe_subscription_id) {
      await supabase.from('tech_subscriptions')
        .update({ status: 'cancelled' }).eq('tech_id', req.user.id)
    }

    // Create new subscription record
    const { data, error } = await supabase.from('tech_subscriptions').insert({
      tech_id: req.user.id, tier,
      price_monthly: t.price,
      platform_fee_rate: t.fee,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).select().single()
    if (error) throw error

    // Update tech profile fee rate
    await supabase.from('tech_profiles')
      .update({ subscription_tier: tier, platform_fee_rate: t.fee })
      .eq('user_id', req.user.id)

    res.json({ subscription: data })
  } catch {
    res.status(500).json({ error: 'Failed to upgrade subscription' })
  }
})

export default router
