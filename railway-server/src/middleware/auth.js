import jwt from 'jsonwebtoken'
import { supabase } from '../lib/supabase.js'

// Express 5 catches async handler rejections automatically and sends them
// to the error middleware. wrapAsync wraps an express handler so errors
// thrown inside it are caught and forwarded properly.
export function wrapAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, phone, avatar, source')
      .eq('id', decoded.userId)
      .single()
    if (error || !user) return res.status(401).json({ error: 'Invalid token' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
