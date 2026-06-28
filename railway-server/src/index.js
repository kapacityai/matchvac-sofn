import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import jobRoutes from './routes/jobs.js'
import paymentRoutes from './routes/payments.js'
import techRoutes from './routes/tech.js'
import customerRoutes from './routes/customer.js'
import adminRoutes from './routes/admin.js'
import notificationRoutes from './routes/notifications.js'
import mcpRoutes from './mcp/server.js'
import { supabase } from './lib/supabase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

// ── Security & Middleware ─────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://servicetechconnect.netlify.app',
  ],
  credentials: true,
}))

// Raw body for Stripe webhooks
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(morgan('dev'))

// Rate limiting
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many requests' } }))
app.use('/api', rateLimit({ windowMs: 1 * 60 * 1000, max: 200, message: { error: 'Too many requests' } }))

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/tech', techRoutes)
app.use('/api/customer', customerRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/mcp', mcpRoutes)


// ── Health Check ──────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1)
    res.json({
      status: 'ok',
      database: error ? 'error' : 'connected',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    })
  } catch {
    res.status(500).json({ status: 'error' })
  }
})

// ── OpenAPI Spec ──────────────────────────────────────────────
app.get('/api/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'ServiceConnect API',
      version: '1.0.0',
      description: 'On-demand HVAC and home services marketplace API — Maryland/DMV',
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Local' }],
    paths: {
      '/api/auth/register': { post: { summary: 'Register a new user', tags: ['Auth'] } },
      '/api/auth/login': { post: { summary: 'Login and get JWT token', tags: ['Auth'] } },
      '/api/auth/me': { get: { summary: 'Get current user', tags: ['Auth'] } },
      '/api/jobs': {
        get: { summary: 'List jobs', tags: ['Jobs'] },
        post: { summary: 'Create a new job', tags: ['Jobs'] },
      },
      '/api/jobs/{id}/assign': { post: { summary: 'Tech accepts a job', tags: ['Jobs'] } },
      '/api/jobs/{id}/complete': { post: { summary: 'Tech marks job complete', tags: ['Jobs'] } },
      '/api/jobs/{id}/confirm': { post: { summary: 'Customer confirms and releases payment', tags: ['Jobs'] } },
      '/api/payments/connect/onboard': { post: { summary: 'Start Stripe Connect onboarding for tech', tags: ['Payments'] } },
      '/api/payments/history': { get: { summary: 'Get payment history', tags: ['Payments'] } },
      '/api/tech/earnings': { get: { summary: 'Get tech earnings summary', tags: ['Tech'] } },
      '/api/tech/subscription': { get: { summary: 'Get tech subscription tier', tags: ['Tech'] } },
      '/api/tech/subscription/upgrade': { post: { summary: 'Upgrade/change subscription tier', tags: ['Tech'] } },
      '/api/mcp/manifest': { get: { summary: 'Get MCP tool manifest for AI agents', tags: ['MCP'] } },
      '/api/mcp/execute': { post: { summary: 'Execute an MCP tool', tags: ['MCP'] } },
    },
  })
})

// ── Serve the React SPA at root — domain detection is handled by the app ──
const distPath = path.resolve(__dirname, '../../dist')
app.get('/', (req, res) => res.sendFile(path.join(distPath, 'index.html')))

// ── Serve Built Frontend ──────────────────────────────────────
app.use(express.static(distPath))
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) return next()
  res.sendFile(path.join(distPath, 'index.html'))
})

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ServiceConnect API running on port ${PORT}`)
  console.log(`   Health:   http://localhost:${PORT}/health`)
  console.log(`   OpenAPI:  http://localhost:${PORT}/api/openapi.json`)
  console.log(`   MCP:      http://localhost:${PORT}/api/mcp/manifest`)
  console.log(`   Database: ${process.env.SUPABASE_URL}\n`)
})

export default app
