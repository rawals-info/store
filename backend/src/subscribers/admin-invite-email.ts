import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendLuxuryEmail, buildLuxuryTemplate } from "../util/email"

/**
 * Sends an invitation email when an admin user is invited
 * Event: invite.created
 */
export default async function adminInviteEmail({
  event,
}: SubscriberArgs<{ id: string; email: string; token: string }>) {
  const { email, token } = event.data

  console.log(`📧 [AdminInvite] Sending invite email to: ${email}`)

  const adminBase = process.env.ADMIN_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const inviteUrl = `${adminBase.replace(/\/$/, "")}/app/invite?token=${token}`

  const body = `
    <p>Hello!</p>
    <p>You've been invited to join the <strong>Taj Petha Admin Team</strong>! 🎉</p>
    
    <div class="highlight-box">
      <p><strong>🔑 You're Invited!</strong></p>
      <p>Someone from the Taj Petha team has invited you to become an administrator. As an admin, you'll be able to manage products, orders, customers, and more.</p>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${inviteUrl}" style="
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
      ">🎯 Accept Invitation</a>
    </div>
    
    <p><strong>📋 What You Can Do as an Admin:</strong></p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li style="margin: 6px 0;">Manage products and inventory</li>
      <li style="margin: 6px 0;">View and process customer orders</li>
      <li style="margin: 6px 0;">Handle customer inquiries and support</li>
      <li style="margin: 6px 0;">Access sales analytics and reports</li>
      <li style="margin: 6px 0;">Manage promotions and discounts</li>
    </ul>
    
    <div class="highlight-box">
      <p><strong>🔐 Next Steps:</strong></p>
      <p>1. Click the "Accept Invitation" button above<br/>
      2. Create your secure admin password<br/>
      3. Complete your profile setup<br/>
      4. Start managing Taj Petha's online store!</p>
    </div>
    
    <p><strong>⏰ Important:</strong> This invitation link will expire in 7 days for security reasons. Please accept it soon!</p>
    
    <p>If you have any questions or didn't expect this invitation, please contact us at <strong>support@tajpetha.in</strong>.</p>
    
    <p style="margin-top: 32px; font-style: italic;">Welcome to the team!<br/>The Taj Petha Family 🍯</p>
  `

  await sendLuxuryEmail({
    to: email,
    subject: "You're Invited to Join Taj Petha Admin! 🎉",
    html: buildLuxuryTemplate("Admin Invitation", body),
  })

  console.log(`✅ [AdminInvite] Invitation email sent successfully to ${email}`)
}

export const config: SubscriberConfig = {
  event: "invite.created",
  context: { subscriberId: "admin-invite-email" },
}

