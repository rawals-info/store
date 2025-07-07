import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"

/**
 * Sends password-reset email when `auth.password_reset` event fires.
 * – Customers => link to Storefront
 * – Admin users => link to Admin UI
 */
export default async function passwordResetEmail({
  event,
}: SubscriberArgs<{ entity_id: string; actor_type: string; token: string }>) {
  const { entity_id: email, actor_type, token } = event.data

  let resetUrl: string | null = null
  let subject = ""

  if (actor_type === "customer") {
    resetUrl = `${process.env.STOREFRONT_URL ?? "http://localhost:3000"}/reset-password?token=${token}`
    subject = "Reset Your Imperial Craft Of India Password"
  } else if (actor_type === "user") {
    // Admin UI lives under /app by default when served from the same backend domain
    const adminBase = process.env.ADMIN_URL ?? process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
    resetUrl = `${adminBase.replace(/\/$/, "")}/app/reset-password?token=${token}&email=${encodeURIComponent(email)}`
    subject = "Reset Your Imperial Craft Of India Admin Password"
  } else {
    return // ignore other actor types (e.g. external providers)
  }

  const body = `
    <p>Hello,</p>
    <p>We received a request to reset your ${actor_type === "customer" ? "account" : "admin"} password. Click the button below to set a new, secure password.</p>
    <p style="text-align:center;margin:32px 0;">
      <a href="${resetUrl}" style="background:#D4AF37;color:#ffffff;padding:12px 24px;text-decoration:none;font-weight:600;border-radius:3px;">Reset Password</a>
    </p>
    <p>If you did not request this, you can safely ignore this email—your current password will remain unchanged.</p>
    <p style="margin-top:32px">With care,<br/>The Imperial Craft Of India Team</p>
  `

  await sendLuxuryEmail({
    to: email,
    subject,
    html: buildLuxuryTemplate("Password Reset", body),
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
  context: { subscriberId: "password-reset-email" },
} 