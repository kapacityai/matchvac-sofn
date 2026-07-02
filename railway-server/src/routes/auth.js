import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { sendEmail, resetPasswordEmail, sofnResetPasswordEmail, verificationEmail, sofnVerificationEmail } from '../lib/email.js'

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
    const { email, password, name, phone, role = 'customer', source } = req.body
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
      .insert({ email: email.toLowerCase(), password_hash, name, phone, role, avatar, source: source || null })
      .select('id, email, name, role, phone, avatar, source')
      .single()

    if (error) return res.status(500).json({ error: error.message || 'User creation failed' })

    // Create profile
    if (role === 'customer') {
      await supabase.from('customer_profiles').insert({ user_id: user.id })
    } else if (role === 'tech') {
      const { error: tpErr } = await supabase.from('tech_profiles').insert({ user_id: user.id, phone: phone || null })
      if (tpErr) return res.status(500).json({ error: 'Tech profile: ' + tpErr.message })
      const { error: tsErr } = await supabase.from('tech_subscriptions').insert({
        tech_id: user.id,
        tier: 'free',
        platform_fee_rate: 0.15,
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      })
      if (tsErr) return res.status(500).json({ error: 'Tech sub: ' + tsErr.message })
    }

    const token = generateToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    // Send verification email (fire-and-forget — don't block registration)
    const isSofn = source === 'sofn_tech'
    const verifToken = crypto.randomBytes(32).toString('hex')
    await supabase.from('password_resets').insert({
      user_id: user.id,
      token: verifToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }).catch(() => {})
    const { subject, html } = isSofn
      ? sofnVerificationEmail(user.name, verifToken)
      : verificationEmail(user.name, verifToken)
    sendEmail(user.email, subject, html).catch(() => {})

    res.status(201).json({ user, token, refreshToken })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: err.message || 'Registration failed' })
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

// ── Forgot Password ─────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, source')
      .eq('email', email.toLowerCase())
      .single()

    // Always return success to prevent email enumeration
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' })

    // Generate reset token (valid 1 hour)
    const token = crypto.randomBytes(32).toString('hex')
    const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    await supabase.from('password_resets').insert({
      user_id: user.id,
      token,
      expires_at,
    })

    // Send branded email based on user source
    const isSofn = user.source === 'sofn_tech'
    const { subject, html } = isSofn
      ? sofnResetPasswordEmail(user.name, token)
      : resetPasswordEmail(user.name, token)

    await sendEmail(user.email, subject, html)

    res.json({ message: 'If that email exists, a reset link has been sent.' })
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ error: 'Failed to process request' })
  }
})

// ── Reset Password ──────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ error: 'Token and new password required' })
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })

    // Find valid token
    const { data: reset } = await supabase
      .from('password_resets')
      .select('id, user_id, expires_at, used')
      .eq('token', token)
      .single()

    if (!reset) return res.status(400).json({ error: 'Invalid or expired reset token' })
    if (reset.used) return res.status(400).json({ error: 'Reset token has already been used' })
    if (new Date(reset.expires_at) < new Date()) return res.status(400).json({ error: 'Reset token has expired' })

    // Update password
    const password_hash = await bcrypt.hash(password, 12)
    await supabase.from('users').update({ password_hash }).eq('id', reset.user_id)

    // Mark token as used
    await supabase.from('password_resets').update({ used: true }).eq('id', reset.id)

    res.json({ message: 'Password has been reset successfully' })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ error: 'Failed to reset password' })
  }
})

// ── Verify Email ─────────────────────────────────────────
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body
    if (!token) return res.status(400).json({ error: 'Verification token required' })

    const { data: verif } = await supabase
      .from('password_resets')
      .select('id, user_id, expires_at, used')
      .eq('token', token)
      .single()

    if (!verif) return res.status(400).json({ error: 'Invalid verification token' })
    if (verif.used) return res.status(400).json({ error: 'Email already verified' })
    if (new Date(verif.expires_at) < new Date()) return res.status(400).json({ error: 'Verification link expired — request a new one' })

    await supabase.from('users').update({ email_verified: true }).eq('id', verif.user_id)
    await supabase.from('password_resets').update({ used: true }).eq('id', verif.id)

    res.json({ message: 'Email verified successfully' })
  } catch (err) {
    console.error('Verify email error:', err)
    res.status(500).json({ error: 'Verification failed' })
  }
})
