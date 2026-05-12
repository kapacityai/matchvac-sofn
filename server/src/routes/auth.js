import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, role = 'customer' } = req.body
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }
    if (!['customer', 'tech'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    // Check existing
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const password_hash = await bcrypt.hash(password, 12)
    const avatar = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    const { data: user, error } = await supabase
      .from('users')
      .insert({ email: email.toLowerCase(), password_hash, name, phone, role, avatar })
      .select('id, email, name, role, phone, avatar')
      .single()

    if (error) throw error

    // Create profile
    if (role === 'customer') {
      await supabase.from('customer_profiles').insert({ user_id: user.id })
    } else if (role === 'tech') {
      await supabase.from('tech_profiles').insert({ user_id: user.id })
      await supabase.from('tech_subscriptions').insert({
        tech_id: user.id,
        tier: 'free',
        platform_fee_rate: 0.15,
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      })
    }

    const token = generateToken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    res.status(201).json({ user, token, refreshToken })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, phone, avatar, password_hash')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !user) return res.status(401).json({ error: 'Invalid email or password' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

    const { password_hash, ...safeUser } = user
    const token = generateToken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    res.json({ user: safeUser, token, refreshToken })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' })
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
    const token = generateToken(decoded.userId)
    res.json({ token })
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user })
})

// PUT /api/auth/me
router.put('/me', requireAuth, async (req, res) => {
  try {
    const { name, phone } = req.body
    const updates = {}
    if (name) {
      updates.name = name
      updates.avatar = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (phone) updates.phone = phone
    updates.updated_at = new Date().toISOString()

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, email, name, role, phone, avatar')
      .single()

    if (error) throw error
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Update failed' })
  }
})

// PUT /api/auth/password
router.put('/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' })
    if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' })

    const { data: user } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', req.user.id)
      .single()

    const valid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' })

    const password_hash = await bcrypt.hash(newPassword, 12)
    await supabase.from('users').update({ password_hash }).eq('id', req.user.id)
    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Password update failed' })
  }
})

export default router
