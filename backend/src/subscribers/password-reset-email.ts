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
    subject = "Reset Your Taj Petha Account Password 🔒"
  } else if (actor_type === "user") {
    // Admin UI lives under /app by default when served from the same backend domain
    const adminBase = process.env.ADMIN_URL ?? process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
    resetUrl = `${adminBase.replace(/\/$/, "")}/app/reset-password?token=${token}&email=${encodeURIComponent(email)}`
    subject = "Reset Your Taj Petha Admin Password 🔒"
  } else {
    return // ignore other actor types (e.g. external providers)
  }

  const body = `
    <p>Hello there,</p>
    <p>We received a request to reset your ${actor_type === "customer" ? "Taj Petha account" : "admin"} password. No worries – it happens to the best of us! 🍯</p>
    
    <div class="highlight-box">
      <p><strong>🔐 Secure Password Reset</strong></p>
      <p>Click the button below to create a new, secure password for your ${actor_type === "customer" ? "account" : "admin account"}. This link is valid for 24 hours for your security.</p>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="
        background: linear-gradient(135deg, #E8944A, #D2691E);
        color: #ffffff;
        padding: 14px 28px;
        text-decoration: none;
        font-weight: 600;
        border-radius: 8px;
        font-size: 16px;
        display: inline-block;
        box-shadow: 0 4px 12px rgba(232, 148, 74, 0.3);
        transition: all 0.3s ease;
      ">🔒 Reset My Password</a>
    </div>
    
    <p><strong>🛡️ Security Tips:</strong></p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li style="margin: 6px 0;">Choose a strong password with at least 8 characters</li>
      <li style="margin: 6px 0;">Include a mix of letters, numbers, and special characters</li>
      <li style="margin: 6px 0;">Don't reuse passwords from other websites</li>
      <li style="margin: 6px 0;">Consider using a password manager for better security</li>
    </ul>
    
    <div class="highlight-box">
      <p><strong>🤔 Didn't Request This?</strong></p>
      <p>If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged and your account stays secure.</p>
    </div>
    
    <p>If you continue to have trouble accessing your account, please contact our support team at <strong>support@tajpetha.in</strong>. We're here to help!</p>
    
    <p style="margin-top: 32px; font-style: italic;">Stay sweet and secure,<br/>The Taj Petha Family 🍯</p>
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