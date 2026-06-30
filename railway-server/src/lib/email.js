import nodemailer from 'nodemailer'

// SMTP config from environment
const HOST    = process.env.EMAIL_HOST || ''
const PORT    = parseInt(process.env.EMAIL_PORT || '587', 10)
const USER    = process.env.EMAIL_USER || ''
const PASS    = process.env.EMAIL_PASS || ''
const FROM    = process.env.EMAIL_FROM || 'noreply@matchvac.com'
const APP_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

let transporter = null

function getTransporter() {
  if (!HOST || !USER || !PASS) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465,
      auth: { user: USER, pass: PASS },
    })
  }
  return transporter
}

/**
 * Send an email. Falls back to console.log if no SMTP configured.
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - HTML body
 */
export async function sendEmail(to, subject, html) {
  const t = getTransporter()
  if (!t) {
    console.log(`\n📧 [EMAIL] To: ${to}`)
    console.log(`   Subject: ${subject}`)
    console.log(`   Body preview: ${html.slice(0, 200).replace(/\n/g, ' ')}…`)
    console.log(`   📌 SMTP not configured — set EMAIL_HOST, EMAIL_USER, EMAIL_PASS env vars\n`)
    return { sent: false, logged: true }
  }

  try {
    const info = await t.sendMail({ from: FROM, to, subject, html })
    console.log(`📧 Email sent to ${to}: ${info.messageId}`)
    return { sent: true, messageId: info.messageId }
  } catch (err) {
    console.error(`📧 Email FAILED to ${to}:`, err.message)
    // Fallback: log to console
    console.log(`   Subject: ${subject}`)
    console.log(`   Body: ${html.slice(0, 500)}`)
    return { sent: false, error: err.message }
  }
}

// ── Email Templates ───────────────────────────────────────────

export function resetPasswordEmail(name, token) {
  const link = `${APP_URL}/reset-password?token=${token}`
  return {
    subject: 'Reset Your Password - MatcHvac',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 22px; font-weight: 700; color: #1a3770;">MatcHvac</span>
        </div>
        <h1 style="font-size: 20px; color: #1a3770; margin-bottom: 12px;">Reset your password</h1>
        <p style="color: #4a5568; line-height: 1.6;">Hi ${name},</p>
        <p style="color: #4a5568; line-height: 1.6;">
          We received a request to reset the password for your MatcHvac account.
          Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${link}" style="display: inline-block; padding: 12px 28px; background: #2abfbf; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
            Reset Password
          </a>
        </div>
        <p style="color: #4a5568; line-height: 1.6; font-size: 13px;">
          Or copy this link into your browser:<br/>
          <a href="${link}" style="color: #2abfbf;">${link}</a>
        </p>
        <p style="color: #a0aec0; font-size: 12px; margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          If you didn't request a password reset, you can ignore this email.<br/>
          &copy; 2026 MatcHvac. All rights reserved.
        </p>
      </div>
    `,
  }
}

export function sofnResetPasswordEmail(name, token) {
  const link = `${APP_URL}/sofn/reset-password?token=${token}`
  return {
    subject: 'Reset Your Password - SOFN',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 700; color: #0C6B5E;">SOFN</span>
          <span style="font-size: 13px; color: #33485C; display: block;">Service Operations Field Network</span>
        </div>
        <h1 style="font-size: 20px; color: #16202B; margin-bottom: 12px;">Reset your password</h1>
        <p style="color: #33485C; line-height: 1.6;">Hi ${name},</p>
        <p style="color: #33485C; line-height: 1.6;">
          We received a request to reset the password for your SOFN account.
          Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${link}" style="display: inline-block; padding: 12px 28px; background: #0C6B5E; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
            Reset Password
          </a>
        </div>
        <p style="color: #33485C; line-height: 1.6; font-size: 13px;">
          Or copy this link into your browser:<br/>
          <a href="${link}" style="color: #0C6B5E;">${link}</a>
        </p>
        <p style="color: #a0aec0; font-size: 12px; margin-top: 28px; border-top: 1px solid #DAD8D2; padding-top: 16px;">
          If you didn't request a password reset, you can ignore this email.<br/>
          &copy; 2026 SOFN. All rights reserved.
        </p>
      </div>
    `,
  }
}

export function verificationEmail(name, token) {
  const link = `${APP_URL}/verify-email?token=${token}`
  return {
    subject: 'Confirm Your Email - MatcHvac',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 22px; font-weight: 700; color: #1a3770;">MatcHvac</span>
        </div>
        <h1 style="font-size: 20px; color: #1a3770; margin-bottom: 12px;">Welcome to MatcHvac!</h1>
        <p style="color: #4a5568; line-height: 1.6;">Hi ${name},</p>
        <p style="color: #4a5568; line-height: 1.6;">
          Thanks for creating an account. Please confirm your email address by clicking the button below.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${link}" style="display: inline-block; padding: 12px 28px; background: #2abfbf; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
            Confirm Email
          </a>
        </div>
        <p style="color: #a0aec0; font-size: 12px; margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          &copy; 2026 MatcHvac. All rights reserved.
        </p>
      </div>
    `,
  }
}

export function sofnVerificationEmail(name, token) {
  const link = `${APP_URL}/sofn/verify-email?token=${token}`
  return {
    subject: 'Confirm Your Email - SOFN',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 700; color: #0C6B5E;">SOFN</span>
          <span style="font-size: 13px; color: #33485C; display: block;">Service Operations Field Network</span>
        </div>
        <h1 style="font-size: 20px; color: #16202B; margin-bottom: 12px;">Welcome to the SOFN network!</h1>
        <p style="color: #33485C; line-height: 1.6;">Hi ${name},</p>
        <p style="color: #33485C; line-height: 1.6;">
          Thanks for joining the SOFN network. Please confirm your email address by clicking the button below.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${link}" style="display: inline-block; padding: 12px 28px; background: #0C6B5E; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
            Confirm Email
          </a>
        </div>
        <p style="color: #a0aec0; font-size: 12px; margin-top: 28px; border-top: 1px solid #DAD8D2; padding-top: 16px;">
          &copy; 2026 SOFN. All rights reserved.
        </p>
      </div>
    `,
  }
}