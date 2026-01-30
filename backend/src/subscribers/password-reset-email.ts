import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import {
  sendLuxuryEmail,
  buildLuxuryTemplate,
  buildInfoBox,
  buildParagraph,
  buildStrong,
  buildLink,
  buildList,
  buildButton,
  buildSignOff
} from "../util/email"

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
    subject = "Reset Your Taj Petha Account Password"
  } else if (actor_type === "user") {
    // Admin UI lives under /app by default when served from the same backend domain
    const adminBase = process.env.ADMIN_URL ?? process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
    resetUrl = `${adminBase.replace(/\/$/, "")}/app/reset-password?token=${token}&email=${encodeURIComponent(email)}`
    subject = "Reset Your Taj Petha Admin Password"
  } else {
    return // ignore other actor types (e.g. external providers)
  }

  const body = `
    ${buildParagraph("Dear Valued Customer,")}
    
    ${buildParagraph(`We received a request to reset your ${actor_type === "customer" ? "Taj Petha account" : "admin"} password.`)}
    
    ${buildInfoBox("Secure Password Reset", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">Click the button below to create a new, secure password for your ${actor_type === "customer" ? "account" : "admin account"}. This link is valid for 24 hours for your security.</p>
    `)}
    
    ${buildButton(resetUrl, "Reset Password")}
    
    <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 32px 0 16px 0; letter-spacing: 2px; text-transform: uppercase;">Security Recommendations</h2>
    
    ${buildList([
    "Choose a strong password with at least 8 characters",
    "Include a mix of letters, numbers, and special characters",
    "Avoid reusing passwords from other websites",
    "Consider using a password manager for better security"
  ])}
    
    ${buildInfoBox("Did Not Request This?", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged and your account stays secure.</p>
    `)}
    
    ${buildParagraph(`If you continue to have trouble accessing your account, please contact our support team at ${buildLink("mailto:support@tajpetha.in", "support@tajpetha.in")}.`)}
    
    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: email,
    subject,
    html: buildLuxuryTemplate("Password Reset Request", body),
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
  context: { subscriberId: "password-reset-email" },
}