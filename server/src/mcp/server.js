/**
 * ServiceConnect MCP Server
 * Model Context Protocol — lets AI agents (Claude, GPT, etc.)
 * book jobs, check status, and manage the platform programmatically
 */
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── MCP Manifest — tells AI agents what tools are available ──
router.get('/manifest', (req, res) => {
  res.json({
    schema_version: '1.0',
    name: 'ServiceConnect',
    description: 'On-demand HVAC and home services marketplace for the DMV area. Book service professionals, track jobs, manage payments.',
    contact: { url: 'https://servicetechconnect.netlify.app' },
    tools: [
      {
        name: 'list_services',
        description: 'Get all available HVAC and home services with pricing tiers',
        parameters: {},
      },
      {
        name: 'create_job',
        description: 'Book a service job for a customer',
        parameters: {
          service_name: { type: 'string', description: 'Name of the service (e.g. "Furnace Repair")' },
          tier: { type: 'string', enum: ['basic', 'standard', 'premium'], description: 'Service quality tier' },
          address_street: { type: 'string', description: 'Street address for the job' },
          address_city: { type: 'string', description: 'City for the job' },
          address_zip: { type: 'string', description: 'ZIP code' },
          notes: { type: 'string', description: 'Any special instructions' },
          urgent: { type: 'boolean', description: 'Whether this is an emergency/urgent job' },
        },
        required: ['service_name', 'tier', 'address_street', 'address_city'],
      },
      {
        name: 'get_job_status',
        description: 'Check the current status of a job',
        parameters: {
          job_id: { type: 'string', description: 'The job UUID' },
        },
        required: ['job_id'],
      },
      {
        name: 'list_jobs',
        description: 'List jobs for the authenticated user',
        parameters: {
          status: { type: 'string', description: 'Filter by status (available, assigned, in_progress, completed, etc.)' },
          limit: { type: 'number', description: 'Max results to return (default 20)' },
        },
      },
      {
        name: 'confirm_job',
        description: 'Customer confirms job completion and releases payment to tech',
        parameters: {
          job_id: { type: 'string', description: 'The job UUID' },
          rating: { type: 'number', description: 'Rating 1-5 for the technician' },
          review: { type: 'string', description: 'Optional review text' },
        },
        required: ['job_id'],
      },
      {
        name: 'get_earnings',
        description: 'Get earnings summary for authenticated tech',
        parameters: {},
      },
      {
        name: 'get_available_jobs',
        description: 'List available jobs a tech can accept',
        parameters: {
          limit: { type: 'number', description: 'Max results (default 20)' },
        },
      },
      {
        name: 'assign_job',
        description: 'Tech accepts and assigns themselves to an available job',
        parameters: {
          job_id: { type: 'string', description: 'The job UUID to accept' },
        },
        required: ['job_id'],
      },
    ],
  })
})

// ── MCP Tool Execution ────────────────────────────────────────
router.post('/execute', requireAuth, async (req, res) => {
  const { tool, parameters = {} } = req.body
  if (!tool) return res.status(400).json({ error: 'tool is required' })

  try {
    switch (tool) {

      case 'list_services': {
        const { data, error } = await supabase.from('services').select('*').eq('active', true)
        if (error) throw error
        return res.json({
          result: data.map(s => ({
            id: s.id, name: s.name, category: s.category, emergency: s.emergency,
            pricing: { basic: s.price_basic, standard: s.price_standard, premium: s.price_premium },
            description: s.description,
          }))
        })
      }

      case 'create_job': {
        if (req.user.role !== 'customer') return res.status(403).json({ error: 'Only customers can create jobs' })
        const { service_name, tier, address_street, address_city, address_zip, notes, urgent } = parameters
        if (!service_name || !tier || !address_street || !address_city) {
          return res.status(400).json({ error: 'service_name, tier, address_street, and address_city are required' })
        }
        const { data: service } = await supabase.from('services').select('*').ilike('name', `%${service_name}%`).single()
        const price = service ? service[`price_${tier}`] : 249
        const { data: job, error } = await supabase.from('jobs').insert({
          customer_id: req.user.id, service_name, tier, price,
          address_street, address_city, address_state: 'MD', address_zip,
          notes, urgent: urgent || false, status: 'available',
          payment_status: 'unpaid',
        }).select().single()
        if (error) throw error
        return res.json({ result: { job_id: job.id, service: job.service_name, price: job.price, status: job.status, message: `Job created successfully. $${price} will be held until completion.` } })
      }

      case 'get_job_status': {
        const { job_id } = parameters
        if (!job_id) return res.status(400).json({ error: 'job_id required' })
        const { data: job, error } = await supabase.from('jobs').select('*').eq('id', job_id).single()
        if (error || !job) return res.status(404).json({ error: 'Job not found' })
        return res.json({ result: { job_id: job.id, service: job.service_name, status: job.status, payment_status: job.payment_status, price: job.price, address: `${job.address_street}, ${job.address_city}, ${job.address_state}` } })
      }

      case 'list_jobs': {
        const { status, limit = 20 } = parameters
        let query = supabase.from('jobs').select('id, service_name, status, price, address_city, created_at').order('created_at', { ascending: false }).limit(limit)
        if (req.user.role === 'customer') query = query.eq('customer_id', req.user.id)
        else if (req.user.role === 'tech') query = query.eq('tech_id', req.user.id)
        if (status) query = query.eq('status', status)
        const { data, error } = await query
        if (error) throw error
        return res.json({ result: data })
      }

      case 'confirm_job': {
        if (req.user.role !== 'customer') return res.status(403).json({ error: 'Only customers can confirm jobs' })
        const { job_id, rating, review } = parameters
        if (!job_id) return res.status(400).json({ error: 'job_id required' })
        const { data: job } = await supabase.from('jobs').select('*').eq('id', job_id).single()
        if (!job) return res.status(404).json({ error: 'Job not found' })
        if (job.customer_id !== req.user.id) return res.status(403).json({ error: 'Not your job' })
        await supabase.from('jobs').update({ status: 'completed', payment_status: 'released', customer_rating: rating, customer_review: review }).eq('id', job_id)
        return res.json({ result: { message: `Payment of $${job.price} released. Tech payout of $${job.tech_payout} initiated.`, job_id } })
      }

      case 'get_earnings': {
        if (req.user.role !== 'tech') return res.status(403).json({ error: 'Only techs can view earnings' })
        const { data: payments } = await supabase.from('payments').select('amount, platform_fee, tech_payout').eq('tech_id', req.user.id).eq('status', 'released')
        const totalNet = (payments || []).reduce((s, p) => s + Number(p.tech_payout), 0)
        const totalGross = (payments || []).reduce((s, p) => s + Number(p.amount), 0)
        const totalFees = (payments || []).reduce((s, p) => s + Number(p.platform_fee), 0)
        return res.json({ result: { totalGross, totalFees, totalNet, jobCount: payments?.length || 0 } })
      }

      case 'get_available_jobs': {
        if (req.user.role !== 'tech') return res.status(403).json({ error: 'Only techs can view available jobs' })
        const { limit = 20 } = parameters
        const { data, error } = await supabase.from('jobs').select('id, service_name, tier, price, address_city, urgent, created_at').eq('status', 'available').order('urgent', { ascending: false }).order('created_at', { ascending: true }).limit(limit)
        if (error) throw error
        return res.json({ result: data })
      }

      case 'assign_job': {
        if (req.user.role !== 'tech') return res.status(403).json({ error: 'Only techs can accept jobs' })
        const { job_id } = parameters
        if (!job_id) return res.status(400).json({ error: 'job_id required' })
        const { data: job } = await supabase.from('jobs').select('*').eq('id', job_id).single()
        if (!job) return res.status(404).json({ error: 'Job not found' })
        if (job.status !== 'available') return res.status(409).json({ error: 'Job no longer available' })
        const { data: tp } = await supabase.from('tech_profiles').select('platform_fee_rate').eq('user_id', req.user.id).single()
        const fee = parseFloat((job.price * (tp?.platform_fee_rate || 0.15)).toFixed(2))
        await supabase.from('jobs').update({ tech_id: req.user.id, status: 'assigned', platform_fee: fee, tech_payout: job.price - fee, assigned_at: new Date().toISOString() }).eq('id', job_id)
        return res.json({ result: { message: `Job accepted! You'll earn $${(job.price - fee).toFixed(2)} upon completion.`, job_id, payout: job.price - fee } })
      }

      default:
        return res.status(400).json({ error: `Unknown tool: ${tool}` })
    }
  } catch (err) {
    console.error(`MCP tool ${tool} error:`, err)
    res.status(500).json({ error: `Tool execution failed: ${err.message}` })
  }
})

export default router
