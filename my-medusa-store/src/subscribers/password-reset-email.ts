// @ts-ignore
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"

/**
 * Sends password-reset link when `auth.password_reset` event fires.
 */
export default async function passwordResetEmail({
  event,
}: SubscriberArgs<{ entity_id: string; actor_type: string; token: string }>) {
  if (event.data.actor_type !== "customer") {
    return // only handle customer resets
  }

  const email = event.data.entity_id // for emailpass provider this is the customer's email
  const token = event.data.token
  const resetUrl = `${process.env.STOREFRONT_URL ?? "http://localhost:3000"}/reset-password?token=${token}`

  const body = `
    <p>Dear Valued Client,</p>
    <p>We received a request to reset your Marble Luxe account password. Simply click the button below and choose a new, secure password.</p>
    <p style="text-align:center;margin:32px 0;">
      <a href="${resetUrl}" style="background:#D4AF37;color:#ffffff;padding:12px 24px;text-decoration:none;font-weight:600;border-radius:3px;">Reset Password</a>
    </p>
    <p>If you did not request this, you can safely ignore this email—your current password will remain unchanged.</p>
    <p style="margin-top:32px">With care,<br/>The Marble Luxe Team</p>
  `

  await sendLuxuryEmail({
    to: email,
    subject: "Reset Your Marble Luxe Password",
    html: buildLuxuryTemplate("Password Reset", body),
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
  context: { subscriberId: "password-reset-email" },
} 