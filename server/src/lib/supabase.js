import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { createRequire } from 'module'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

// Provide ws for Node < 22 which lacks native WebSocket
let wsTransport
try {
  const require = createRequire(import.meta.url)
  wsTransport = require('ws')
} catch {
  // Node 22+ has native WebSocket, no fallback needed
}

// serviceRole bypasses RLS so the backend can read/write all rows
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      ...(process.env.SUPABASE_SERVICE_KEY && {
        'x-supabase-auth-role': 'service_role',
      }),
    },
  },
  realtime: {
    ...(wsTransport && { transport: wsTransport }),
  },
})
