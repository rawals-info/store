import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import {
  sendLuxuryEmail,
  buildLuxuryTemplate,
  buildHeroStatusCard,
  buildParagraph,
  buildStrong,
  buildSignOff,
  buildList,
} from "../util/email"

export default async function passwordResetEmail({
  event,
}: SubscriberArgs<{ entity_id: string; actor_type: string; token: string }>) {
  const { entity_id: email, actor_type, token } = event.data

  let resetUrl: string | null = null
  let subject = ""

  if (actor_type === "customer") {
    resetUrl = `${process.env.STOREFRONT_URL ?? "http://localhost:8000"}/in/reset-password?token=${token}`
    subject = "Reset Your Taj Petha Password"
  } else if (actor_type === "user") {
    const adminBase =
      process.env.ADMIN_URL ?? process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
    resetUrl = `${adminBase.replace(/\/$/, "")}/app/reset-password?token=${token}&email=${encodeURIComponent(email)}`
    subject = "Reset Your Taj Petha Admin Password"
  } else {
    return
  }

  const body = `
    ${buildHeroStatusCard({
      icon: "🔒",
      title: "Password Reset Request",
      subtitle: `We received a request to reset your ${actor_type === "customer" ? "Taj Petha account" : "store admin"} password.`,
      badgeText: "⏳ Valid for 24 Hours",
    })}

    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; margin-bottom: 20px; text-align: center;">
      <p style="font-size: 13px; color: #475569; margin: 0 0 16px 0;">
        Click the secure button below to set a new password for your account:
      </p>
      
      <a href="${resetUrl}" class="cta-button" style="display: inline-block;">
        Reset My Password ➔
      </a>

      <p style="font-size: 11px; color: #94A3B8; margin: 16px 0 0 0;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>

    ${buildSignOff()}
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