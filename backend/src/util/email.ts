// @ts-ignore  Types for Brevo may not resolve in project yet
import * as BrevoSDK from "@getbrevo/brevo"

// Handle both CommonJS and ESM default exports gracefully
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Brevo: any = (BrevoSDK as any).default ?? (BrevoSDK as any)

/**
 * Initialize Brevo TransactionalEmailsApi and inject API key.
 */
const transactionalApi = new Brevo.TransactionalEmailsApi()

if (process.env.BREVO_API_KEY) {
  ;(transactionalApi as any).authentications["apiKey"].apiKey = process.env.BREVO_API_KEY
}

/**
 * High-end commercial luxury email template for Taj Petha
 * Perfectly responsive, cross-client tested (Gmail, Apple Mail, Outlook, Mobile)
 */
export function buildLuxuryTemplate(title: string, body: string, subtitle?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Taj Petha</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      background-color: #F4EFEA;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: none;
    }
    
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    .cta-button {
      background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 15px 32px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      display: inline-block;
      box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);
    }
    
    .whatsapp-button {
      background-color: #F0FDF4;
      border: 1px solid #BBF7D0;
      color: #166534 !important;
      text-decoration: none;
      padding: 12px 22px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 12px;
      display: inline-block;
    }

    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .content-padding {
        padding: 20px 16px !important;
      }
      .two-col {
        display: block !important;
        width: 100% !important;
        padding: 0 0 14px 0 !important;
      }
      .header-title {
        font-size: 28px !important;
      }
    }
  </style>
</head>
<body style="background-color: #F4EFEA; margin: 0; padding: 24px 12px;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#F4EFEA">
    <tr>
      <td align="center">
        
        <!-- Main Container -->
        <table class="container" width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #EAE3D9;">
          
          <!-- Top Royal Bar -->
          <tr>
            <td height="6" style="background: linear-gradient(90deg, #F59E0B, #D97706, #78350F, #D97706, #F59E0B);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" style="padding: 34px 32px 26px 32px; background-color: #0F172A; background-image: radial-gradient(circle at 50% 0%, #1E293B 0%, #0F172A 100%);">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    
                    <div style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); margin-bottom: 12px;">
                      <span style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 700; color: #FCD34D; letter-spacing: 2px; text-transform: uppercase;">
                        🏛️ Authentic Agra Master Kitchen
                      </span>
                    </div>

                    <h1 class="header-title" style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 34px; font-weight: 700; color: #FFFFFF; letter-spacing: 3px; line-height: 1.1;">
                      TAJ PETHA
                    </h1>
                    <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 13px; font-style: italic; color: #FCD34D; letter-spacing: 1.5px; margin-top: 4px;">
                      ${subtitle || "Royal Confectionery Since 1952"}
                    </div>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold Line -->
          <tr>
            <td height="1" style="background-color: #FDE68A;"></td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 24px 32px 32px 32px;" class="content-padding">
              ${body}
            </td>
          </tr>

          <!-- Royal Trust Footer -->
          <tr>
            <td style="padding: 28px 32px; background-color: #0F172A; text-align: center;">
              <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 700; color: #FCD34D; letter-spacing: 2px;">
                TAJ PETHA
              </div>
              <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">
                Handcrafted in Agra, Uttar Pradesh, India &bull; Delivered Fresh Pan-India
              </div>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #1E293B; font-size: 11px; color: #64748B; line-height: 1.8;">
                Have questions? Email us at <a href="mailto:support@tajpetha.in" style="color: #F59E0B; text-decoration: none;">support@tajpetha.in</a><br>
                &copy; ${new Date().getFullYear()} Taj Petha. All rights reserved.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}

/**
 * Helper: Hero status announcement card
 */
export function buildHeroStatusCard({
  icon = "✨",
  title,
  subtitle,
  orderId,
  badgeText = "⚡ 24–48h Air Express",
}: {
  icon?: string
  title: string
  subtitle: string
  orderId?: string
  badgeText?: string
}) {
  return `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 22px; background: #FFFDF9; border: 1px solid #FDE68A; border-radius: 20px; box-shadow: 0 4px 16px rgba(217, 119, 6, 0.06);">
      <tr>
        <td style="padding: 24px 24px; text-align: center;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background-color: #ECFDF5; border: 2px solid #6EE7B7; text-align: center; line-height: 50px; margin: 0 auto 12px auto; font-size: 24px;">
            ${icon}
          </div>
          <h2 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 700; color: #1E293B; line-height: 1.2;">
            ${title}
          </h2>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #64748B; font-weight: 500; line-height: 1.6;">
            ${subtitle}
          </p>

          ${
            orderId || badgeText
              ? `
            <div style="margin-top: 18px; padding-top: 14px; border-top: 1px dashed #E2E8F0;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  ${
                    orderId
                      ? `<td align="left" style="font-size: 12px; color: #64748B;">
                          Order ID: <strong style="font-family: monospace; font-size: 14px; color: #D97706;">#${orderId}</strong>
                        </td>`
                      : ""
                  }
                  ${
                    badgeText
                      ? `<td align="right">
                          <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background-color: #ECFDF5; color: #065F46; font-size: 11px; font-weight: 700;">
                            ${badgeText}
                          </span>
                        </td>`
                      : ""
                  }
                </tr>
              </table>
            </div>`
              : ""
          }
        </td>
      </tr>
    </table>
  `
}

/**
 * Helper: Build order details / table container
 */
export function buildOrderDetailsBox(content: string) {
  return `
    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
      ${content}
    </div>
  `
}

/**
 * Helper: Build info box with soft background and border
 */
export function buildInfoBox(
  title: string,
  content: string,
  type: "amber" | "emerald" | "slate" = "amber"
) {
  const styles = {
    amber: { bg: "#FFFBEB", border: "#FDE68A", title: "#92400E" },
    emerald: { bg: "#ECFDF5", border: "#A7F3D0", title: "#065F46" },
    slate: { bg: "#F8FAFC", border: "#E2E8F0", title: "#1E293B" },
  }[type]

  return `
    <div style="background: ${styles.bg}; border: 1px solid ${styles.border}; border-radius: 16px; padding: 18px 20px; margin: 18px 0;">
      <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 800; color: ${styles.title}; margin: 0 0 8px 0; letter-spacing: 1px; text-transform: uppercase;">
        ${title}
      </h3>
      <div style="font-size: 13px; color: #334155; line-height: 1.6;">
        ${content}
      </div>
    </div>
  `
}

/**
 * Helper: Section heading
 */
export function buildSectionHeading(text: string) {
  return `<h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 700; color: #0F172A; margin: 24px 0 12px 0; letter-spacing: 1px; text-transform: uppercase;">${text}</h2>`
}

/**
 * Helper: Paragraph text
 */
export function buildParagraph(text: string) {
  return `<p style="font-size: 14px; color: #475569; margin: 0 0 16px 0; line-height: 1.7;">${text}</p>`
}

/**
 * Helper: Strong/emphasis text
 */
export function buildStrong(text: string) {
  return `<strong style="color: #0F172A; font-weight: 700;">${text}</strong>`
}

/**
 * Helper: Link
 */
export function buildLink(href: string, text: string) {
  return `<a href="${href}" style="color: #D97706; font-weight: 600; text-decoration: none;">${text}</a>`
}

/**
 * Helper: High-impact Button
 */
export function buildButton(href: string, text: string, variant: "primary" | "whatsapp" = "primary") {
  if (variant === "whatsapp") {
    return `
      <div style="text-align: center; margin: 20px 0;">
        <a href="${href}" class="whatsapp-button">
          💬 ${text}
        </a>
      </div>
    `
  }

  return `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${href}" class="cta-button">
        ${text}
      </a>
    </div>
  `
}

/**
 * Helper: List items
 */
export function buildList(items: string[]) {
  const listItems = items
    .map(
      (item) =>
        `<li style="margin: 8px 0; font-size: 13px; color: #475569; line-height: 1.6;">${item}</li>`
    )
    .join("")
  return `<ul style="margin: 12px 0; padding-left: 20px;">${listItems}</ul>`
}

/**
 * Helper: Sign off
 */
export function buildSignOff(name: string = "The Taj Petha Family") {
  return `
    <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #E2E8F0;">
      <p style="font-size: 13px; color: #64748B; margin: 0; line-height: 1.6;">
        With royal regards,<br>
        <strong style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; color: #0F172A; font-style: italic;">${name}</strong>
      </p>
    </div>
  `
}

/**
 * Core Brevo Email Sender
 */
export async function sendLuxuryEmail({
  to,
  name,
  subject,
  html,
}: {
  to: string
  name?: string
  subject: string
  html: string
}) {
  const email = new Brevo.SendSmtpEmail()
  email.sender = {
    email: process.env.EMAIL_FROM ?? "support@tajpetha.in",
    name: "Taj Petha",
  }
  email.to = [
    {
      email: to,
      name: name ?? to,
    },
  ]
  email.subject = subject
  email.htmlContent = html

  try {
    const result = await transactionalApi.sendTransacEmail(email)
    return result
  } catch (error) {
    console.error("[sendLuxuryEmail] Error sending email via Brevo:", error)
    throw error
  }
}