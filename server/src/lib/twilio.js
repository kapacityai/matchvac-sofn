import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER

export async function sendSMS(to, message) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: FROM_NUMBER,
      to,
    })
    return { success: true, sid: result.sid }
  } catch (err) {
    console.error('Twilio SMS error:', err.message)
    return { success: false, error: err.message }
  }
}

// Dispatch alert to tech when new job is available
export async function notifyTechNewJob(tech, job) {
  const msg = `🔧 ServiceConnect: New job available!\n${job.service} in ${job.city}\nTier: ${job.tier} | Pay: $${job.net_pay}\nOpen app to accept: servicetechconnect.netlify.app`
  return sendSMS(tech.phone, msg)
}

// Notify customer when tech is on the way
export async function notifyCustomerTechEnRoute(customer, tech, job) {
  const msg = `✅ ServiceConnect: ${tech.name} is on the way!\nETA: ~30 minutes\nJob: ${job.service}\nTrack in app: servicetechconnect.netlify.app`
  return sendSMS(customer.phone, msg)
}

// Notify customer when job is marked complete
export async function notifyCustomerJobComplete(customer, job) {
  const msg = `🎉 ServiceConnect: Your ${job.service} is complete!\nPlease confirm & release payment in the app: servicetechconnect.netlify.app`
  return sendSMS(customer.phone, msg)
}

// Notify tech when payment is released
export async function notifyTechPaymentReleased(tech, amount) {
  const msg = `💰 ServiceConnect: Payment of $${amount} released to your account!\nACH transfer initiated — arrives in 1-2 business days.\nView earnings: servicetechconnect.netlify.app`
  return sendSMS(tech.phone, msg)
}
