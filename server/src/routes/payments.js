import { Router } from 'express'
import { stripe } from '../lib/stripe.js'
import { supabase } from '../lib/supabase.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// POST /api/payments/create-intent — create payment intent for a job
router.post('/create-intent', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const { job_id } = req.body
    const { data: job } = await supabase.from('jobs').select('*').eq('id', job_id).single()
    if (!job) return res.status(404).json({ error: 'Job not found' })
    if (job.customer_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(job.price * 100),
      currency: 'usd',
      capture_method: 'manual',
      metadata: { job_id, customer_id: req.user.id },
    })

    await supabase.from('jobs')
      .update({ payment_intent_id: intent.id })
      .eq('id', job_id)

    res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id })
  } catch (err) {
    console.error('Create intent error:', err)
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
})

// POST /api/payments/connect/onboard — start Stripe Connect onboarding for tech
router.post('/connect/onboard', requireAuth, requireRole('tech'), async (req, res) => {
  try {
    const { data: techProfile } = await supabase
      .from('tech_profiles').select('stripe_account_id').eq('user_id', req.user.id).single()

    let accountId = techProfile?.stripe_account_id

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: req.user.email,
        capabilities: { transfers: { requested: true }, card_payments: { requested: true } },
        business_profile: { mcc: '1731', url: 'https://servicetechconnect.netlify.app' },
        metadata: { user_id: req.user.id },
      })
      accountId = account.id
      await supabase.from('tech_profiles')
        .update({ stripe_account_id: accountId })
        .eq('user_id', req.user.id)
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.FRONTEND_URL}/tech/earnings?stripe=refresh`,
      return_url: `${process.env.FRONTEND_URL}/tech/earnings?stripe=success`,
      type: 'account_onboarding',
    })

    res.json({ url: accountLink.url })
  } catch (err) {
    console.error('Stripe Connect onboard error:', err)
    res.status(500).json({ error: 'Failed to start Stripe onboarding' })
  }
})

// GET /api/payments/connect/status — check tech Stripe Connect status
router.get('/connect/status', requireAuth, requireRole('tech'), async (req, res) => {
  try {
    const { data: techProfile } = await supabase
      .from('tech_profiles').select('stripe_account_id, stripe_onboarded').eq('user_id', req.user.id).single()

    if (!techProfile?.stripe_account_id) {
      return res.json({ connected: false, onboarded: false })
    }

    const account = await stripe.accounts.retrieve(techProfile.stripe_account_id)
    const onboarded = account.details_submitted && account.charges_enabled

    if (onboarded && !techProfile.stripe_onboarded) {
      await supabase.from('tech_profiles')
        .update({ stripe_onboarded: true })
        .eq('user_id', req.user.id)
    }

    res.json({ connected: true, onboarded, accountId: techProfile.stripe_account_id })
  } catch (err) {
    res.status(500).json({ error: 'Failed to check Stripe status' })
  }
})

// GET /api/payments/history — payment history for current user
router.get('/history', requireAuth, async (req, res) => {
  try {
    let query = supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(100)
    if (req.user.role === 'customer') query = query.eq('customer_id', req.user.id)
    else if (req.user.role === 'tech') query = query.eq('tech_id', req.user.id)

    const { data, error } = await query
    if (error) throw error
    res.json({ payments: data })
  } catch {
    res.status(500).json({ error: 'Failed to fetch payment history' })
  }
})

// POST /api/webhooks/stripe — Stripe webhook handler
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      await supabase.from('jobs')
        .update({ payment_status: 'held' })
        .eq('payment_intent_id', event.data.object.id)
      break
    case 'payment_intent.payment_failed':
      await supabase.from('jobs')
        .update({ status: 'cancelled', payment_status: 'failed' })
        .eq('payment_intent_id', event.data.object.id)
      break
    case 'transfer.created':
      await supabase.from('payments')
        .update({ payout_status: 'initiated' })
        .eq('stripe_transfer_id', event.data.object.id)
      break
  }
  res.json({ received: true })
})

export default router
