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
 * Sends an invitation email when an admin user is invited
 * Event: invite.created
 */
export default async function adminInviteEmail({
  event,
}: SubscriberArgs<{ id: string; email: string; token: string }>) {
  const { email, token } = event.data

  console.log(`[AdminInvite] Sending invite email to: ${email}`)

  const adminBase = process.env.ADMIN_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const inviteUrl = `${adminBase.replace(/\/$/, "")}/app/invite?token=${token}`

  const body = `
    ${buildParagraph("Dear Colleague,")}
    
    ${buildParagraph(`You have been invited to join the ${buildStrong("Taj Petha Admin Team")}.`)}
    
    ${buildInfoBox("You Are Invited", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">Someone from the Taj Petha team has invited you to become an administrator. As an admin, you will be able to manage products, orders, customers, and more.</p>
    `)}
    
    ${buildButton(inviteUrl, "Accept Invitation")}
    
    <h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 32px 0 16px 0; letter-spacing: 2px; text-transform: uppercase;">Your Responsibilities</h2>
    
    ${buildList([
    "Manage products and inventory",
    "View and process customer orders",
    "Handle customer enquiries and support",
    "Access sales analytics and reports",
    "Manage promotions and discounts"
  ])}
    
    ${buildInfoBox("Next Steps", `
      <p style="font-size: 14px; color: #4A4A4A; margin: 0;">
        1. Click the "Accept Invitation" button above<br/>
        2. Create your secure admin password<br/>
        3. Complete your profile setup<br/>
        4. Start managing Taj Petha's online store
      </p>
    `)}
    
    ${buildParagraph(`${buildStrong("Important:")} This invitation link will expire in 7 days for security reasons. Please accept it soon.`)}
    
    ${buildParagraph(`If you have any questions or did not expect this invitation, please contact us at ${buildLink("mailto:support@tajpetha.in", "support@tajpetha.in")}.`)}
    
    ${buildSignOff("The Taj Petha Team")}
  `

  await sendLuxuryEmail({
    to: email,
    subject: "You Are Invited to Join Taj Petha Admin",
    html: buildLuxuryTemplate("Admin Invitation", body),
  })

  console.log(`[AdminInvite] Invitation email sent successfully to ${email}`)
}

export const config: SubscriberConfig = {
  event: "invite.created",
  context: { subscriberId: "admin-invite-email" },
}
