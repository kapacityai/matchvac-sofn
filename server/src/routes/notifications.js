import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { notifyTechNewJob } from '../lib/twilio.js'

const router = Router()

// ── GET /api/notifications — get unread notifications ────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    const unread = data.filter(n => !n.read).length
    res.json({ notifications: data || [], unread })
  } catch (err) {
    console.error('GET /notifications error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── PUT /api/notifications/read — mark notifications as read ─
router.put('/read', requireAuth, async (req, res) => {
  try {
    const { ids } = req.body
    if (ids && Array.isArray(ids)) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', req.user.id)
        .in('id', ids)
    } else {
      // Mark all as read
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', req.user.id)
        .eq('read', false)
    }
    res.json({ success: true })
  } catch (err) {
    console.error('PUT /notifications/read error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/notifications/scan — scan for new available jobs
//     matching this tech's service ZIPs and create notifications
router.post('/scan', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'tech') {
      return res.status(403).json({ error: 'Only techs can scan for jobs' })
    }

    // Get tech profile with service ZIPs
    const { data: profile } = await supabase
      .from('tech_profiles')
      .select('service_zips, phone')
      .eq('user_id', req.user.id)
      .single()

    const zips = profile?.service_zips || []
    if (zips.length === 0) {
      return res.json({ newJobs: 0, message: 'No service zones set' })
    }

    // Find available jobs in those ZIPs
    const { data: newJobs } = await supabase
      .from('jobs')
      .select('id, service_name, address_city, address_zip, tier, price, created_at')
      .eq('status', 'available')
      .in('address_zip', zips)
      .order('created_at', { ascending: false })

    if (!newJobs || newJobs.length === 0) {
      return res.json({ newJobs: 0, message: 'No new jobs in your zones' })
    }

    // Check which ones we already notified about (via notification data->job_id)
    const { data: existingNotifs } = await supabase
      .from('notifications')
      .select('data')
      .eq('user_id', req.user.id)
      .eq('type', 'new_job_available')
      .not('data', 'is', null)

    const notifiedJobIds = new Set(
      (existingNotifs || [])
        .map(n => n.data?.job_id)
        .filter(Boolean)
    )

    // Create notifications for genuinely new jobs
    const toNotify = newJobs.filter(j => !notifiedJobIds.has(j.id))
    let created = 0

    for (const job of toNotify) {
      const { error } = await supabase.from('notifications').insert({
        user_id: req.user.id,
        type: 'new_job_available',
        title: `New Job in ${job.address_zip}`,
        message: `${job.service_name} — ${job.address_city} • $${job.price}`,
        data: { job_id: job.id },
      })
      if (!error) created++

      // Also send SMS if phone is available
      try {
        if (profile?.phone) {
          await notifyTechNewJob(
            { phone: profile.phone },
            { service: job.service_name, city: job.address_city, tier: job.tier, net_pay: job.price }
          )
        }
      } catch { /* SMS optional */ }
    }

    res.json({
      newJobs: created,
      message: created > 0
        ? `${created} new job${created !== 1 ? 's' : ''} found in your zones`
        : 'No new jobs',
    })
  } catch (err) {
    console.error('POST /notifications/scan error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router