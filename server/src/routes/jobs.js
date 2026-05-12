import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { stripe } from '../lib/stripe.js'
import {
  notifyTechNewJob,
  notifyCustomerTechEnRoute,
  notifyCustomerJobComplete,
  notifyTechPaymentReleased,
} from '../lib/twilio.js'

const router = Router()

// ── GET /api/jobs — list jobs (filtered by role) ──────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query
    let query = supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(limit)

    if (req.user.role === 'customer') {
      query = query.eq('customer_id', req.user.id)
    } else if (req.user.role === 'tech') {
      if (status === 'available') {
        query = query.eq('status', 'available')
      } else {
        query = query.eq('tech_id', req.user.id)
      }
    }
    if (status && status !== 'available') query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error
    res.json({ jobs: data })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

// ── POST /api/jobs — customer creates a new job ───────────────
router.post('/', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const { service_id, service_name, tier, address_street, address_city, address_state, address_zip, scheduled_at, notes, urgent } = req.body
    if (!service_name || !tier || !address_street || !address_city) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get service pricing
    const { data: service } = await supabase.from('services').select('*').eq('id', service_id).single()
    const price = service ? service[`price_${tier.toLowerCase()}`] : req.body.price
    if (!price) return res.status(400).json({ error: 'Invalid service or tier' })

    // Create Stripe PaymentIntent (hold funds)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100),
      currency: 'usd',
      capture_method: 'manual', // authorize only — capture on completion
      metadata: { customer_id: req.user.id, service_name, tier },
    })

    const { data: job, error } = await supabase
      .from('jobs')
      .insert({
        customer_id: req.user.id,
        service_id,
        service_name,
        tier,
        price,
        address_street,
        address_city,
        address_state: address_state || 'MD',
        address_zip,
        scheduled_at,
        notes,
        urgent: urgent || false,
        status: 'available',
        payment_intent_id: paymentIntent.id,
        payment_status: 'unpaid',
      })
      .select()
      .single()

    if (error) throw error

    // Notify available techs via SMS
    const { data: techs } = await supabase
      .from('tech_profiles')
      .select('user_id, users(name, phone)')
      .eq('active', true)
      .eq('license_verified', true)
    if (techs?.length) {
      for (const t of techs.slice(0, 5)) {
        if (t.users?.phone) {
          await notifyTechNewJob({ name: t.users.name, phone: t.users.phone }, {
            service: service_name, city: address_city, tier, net_pay: (price * 0.85).toFixed(2),
          })
        }
      }
    }

    res.status(201).json({ job, clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Create job error:', err)
    res.status(500).json({ error: 'Failed to create job' })
  }
})

// ── GET /api/jobs/:id ─────────────────────────────────────────
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { data: job, error } = await supabase.from('jobs').select('*').eq('id', req.params.id).single()
    if (error || !job) return res.status(404).json({ error: 'Job not found' })
    res.json({ job })
  } catch {
    res.status(500).json({ error: 'Failed to fetch job' })
  }
})

// ── POST /api/jobs/:id/assign — tech accepts job ──────────────
router.post('/:id/assign', requireAuth, requireRole('tech'), async (req, res) => {
  try {
    const { data: job } = await supabase.from('jobs').select('*').eq('id', req.params.id).single()
    if (!job) return res.status(404).json({ error: 'Job not found' })
    if (job.status !== 'available') return res.status(409).json({ error: 'Job no longer available' })

    // Get tech fee rate
    const { data: techProfile } = await supabase
      .from('tech_profiles').select('platform_fee_rate').eq('user_id', req.user.id).single()
    const feeRate = techProfile?.platform_fee_rate || 0.15
    const platform_fee = parseFloat((job.price * feeRate).toFixed(2))
    const tech_payout = parseFloat((job.price - platform_fee).toFixed(2))

    const { data: updated, error } = await supabase
      .from('jobs')
      .update({
        tech_id: req.user.id, status: 'assigned',
        platform_fee, tech_payout, assigned_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error

    // Notify customer
    const { data: customer } = await supabase.from('users').select('name, phone').eq('id', job.customer_id).single()
    if (customer?.phone) await notifyCustomerTechEnRoute(customer, req.user, job)

    res.json({ job: updated })
  } catch (err) {
    console.error('Assign job error:', err)
    res.status(500).json({ error: 'Failed to assign job' })
  }
})

// ── POST /api/jobs/:id/start — tech starts job ────────────────
router.post('/:id/start', requireAuth, requireRole('tech'), async (req, res) => {
  try {
    const { data: updated, error } = await supabase
      .from('jobs')
      .update({ status: 'in_progress', started_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('tech_id', req.user.id)
      .select().single()
    if (error) throw error
    res.json({ job: updated })
  } catch {
    res.status(500).json({ error: 'Failed to start job' })
  }
})

// ── POST /api/jobs/:id/complete — tech marks complete ─────────
router.post('/:id/complete', requireAuth, requireRole('tech'), async (req, res) => {
  try {
    const { data: job } = await supabase.from('jobs').select('*').eq('id', req.params.id).single()
    if (!job) return res.status(404).json({ error: 'Job not found' })
    if (job.tech_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })

    const { data: updated, error } = await supabase
      .from('jobs')
      .update({ status: 'tech_complete', completed_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select().single()
    if (error) throw error

    // Notify customer to confirm and release payment
    const { data: customer } = await supabase.from('users').select('name, phone').eq('id', job.customer_id).single()
    if (customer?.phone) await notifyCustomerJobComplete(customer, job)

    res.json({ job: updated })
  } catch {
    res.status(500).json({ error: 'Failed to complete job' })
  }
})

// ── POST /api/jobs/:id/confirm — customer confirms & releases payment ──
router.post('/:id/confirm', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const { rating, review } = req.body
    const { data: job } = await supabase.from('jobs').select('*').eq('id', req.params.id).single()
    if (!job) return res.status(404).json({ error: 'Job not found' })
    if (job.customer_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
    if (job.status !== 'tech_complete') return res.status(409).json({ error: 'Job not ready for confirmation' })

    // Capture Stripe payment
    if (job.payment_intent_id) {
      await stripe.paymentIntents.capture(job.payment_intent_id)
    }

    // Get tech Stripe account for payout
    const { data: techProfile } = await supabase
      .from('tech_profiles').select('stripe_account_id').eq('user_id', job.tech_id).single()

    let transferId = null
    if (techProfile?.stripe_account_id) {
      const transfer = await stripe.transfers.create({
        amount: Math.round(job.tech_payout * 100),
        currency: 'usd',
        destination: techProfile.stripe_account_id,
        transfer_group: job.id,
      })
      transferId = transfer.id
    }

    // Update job
    const { data: updated, error } = await supabase
      .from('jobs')
      .update({
        status: 'completed',
        payment_status: 'released',
        customer_rating: rating,
        customer_review: review,
      })
      .eq('id', req.params.id)
      .select().single()
    if (error) throw error

    // Record payment
    await supabase.from('payments').insert({
      job_id: job.id,
      customer_id: job.customer_id,
      tech_id: job.tech_id,
      stripe_payment_intent: job.payment_intent_id,
      stripe_transfer_id: transferId,
      amount: job.price,
      platform_fee: job.platform_fee,
      tech_payout: job.tech_payout,
      status: 'released',
      payout_status: techProfile?.stripe_account_id ? 'initiated' : 'pending',
      released_at: new Date().toISOString(),
    })

    // Update tech rating
    if (rating) {
      const { data: tp } = await supabase
        .from('tech_profiles').select('rating, jobs_completed').eq('user_id', job.tech_id).single()
      const newRating = tp ? ((tp.rating * tp.jobs_completed + rating) / (tp.jobs_completed + 1)).toFixed(2) : rating
      await supabase.from('tech_profiles')
        .update({ rating: newRating, jobs_completed: (tp?.jobs_completed || 0) + 1 })
        .eq('user_id', job.tech_id)
    }

    // Notify tech of payment
    const { data: tech } = await supabase.from('users').select('name, phone').eq('id', job.tech_id).single()
    if (tech?.phone) await notifyTechPaymentReleased(tech, job.tech_payout)

    res.json({ job: updated })
  } catch (err) {
    console.error('Confirm job error:', err)
    res.status(500).json({ error: 'Failed to confirm job' })
  }
})

export default router
