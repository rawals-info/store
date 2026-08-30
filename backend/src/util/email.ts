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
 * Commercial luxury email wrapper for Taj Petha
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
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      background-color: #F5EFEB;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: none;
      color: #1E293B;
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
      display: inline-block;
      background: #D97706;
      color: #FFFFFF !important;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 15px 32px;
      border-radius: 12px;
      text-align: center;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(217, 119, 6, 0.28);
    }
    
    .whatsapp-button {
      display: inline-block;
      background-color: #22C55E;
      color: #FFFFFF !important;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px;
      font-weight: 700;
      padding: 9px 20px;
      border-radius: 9999px;
      text-decoration: none;
    }

    @media only screen and (max-width: 620px) {
      .container {
        width: 100% !important;
        border-radius: 0 !important;
        border: none !important;
      }
      .content-padding {
        padding: 24px 18px !important;
      }
      .two-col {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin-bottom: 12px !important;
      }
      .two-col-gap {
        display: none !important;
      }
      .header-title {
        font-size: 28px !important;
      }
    }
  </style>
</head>
<body style="background-color: #F5EFEB; margin: 0; padding: 32px 0;">

  <center>
    <table class="container" width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px -15px rgba(45, 24, 7, 0.08); border: 1px solid #EAE1D5; text-align: left;">
      
      <!-- Brand Header -->
      <tr>
        <td style="background-color: #FAF8F5; padding: 28px 32px 24px 32px; text-align: center; border-bottom: 1px solid #EFE8DE;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 700; color: #0F172A; letter-spacing: 3px; text-transform: uppercase; line-height: 1;">
                  TAJ PETHA
                </div>
                <div style="font-size: 10px; font-weight: 700; color: #B45309; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px;">
                  ${subtitle || "Original Agra Sweet Kitchen • Direct Fresh Dispatch"}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Content Body -->
      <tr>
        <td style="padding: 36px 32px;" class="content-padding">
          ${body}
        </td>
      </tr>

      <!-- Luxury Brand Footer -->
      <tr>
        <td style="background-color: #FAF8F5; padding: 28px 32px; text-align: center; border-top: 1px solid #EFE8DE;">
          <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
            Taj Petha
          </div>
          <div style="font-size: 11px; color: #64748B; line-height: 1.6;">
            Handcrafted with pride in Agra 282001, Uttar Pradesh, India<br>
            Official Store: <a href="https://tajpetha.in" style="color: #D97706; font-weight: 600; text-decoration: none;">https://tajpetha.in</a> &bull; Email: <a href="mailto:support@tajpetha.in" style="color: #D97706; font-weight: 600; text-decoration: none;">support@tajpetha.in</a>
          </div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 12px;">
            &copy; ${new Date().getFullYear()} Taj Petha. All rights reserved. 100% Vegetarian Authentic Sweets.
          </div>
        </td>
      </tr>

    </table>
  </center>

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
    <div style="text-align: center; margin-bottom: 28px;">
      <div style="display: inline-block; background-color: #FEF3C7; border: 1px solid #FDE68A; color: #92400E; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 9999px; margin-bottom: 12px;">
        ${badgeText} ${orderId ? `&bull; Order #${orderId}` : ""}
      </div>
      <h1 style="margin: 0 0 10px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 34px; font-weight: 700; color: #0F172A; line-height: 1.15;">
        ${title}
      </h1>
      <p style="margin: 0 auto; font-size: 14px; color: #64748B; line-height: 1.6; max-width: 460px;">
        ${subtitle}
      </p>
    </div>
  `
}

/**
 * Helper: Build order details / table container
 */
export function buildOrderDetailsBox(content: string) {
  return `
    <div style="background-color: #FAF8F5; border: 1px solid #EFE8DE; border-radius: 16px; padding: 20px; margin: 20px 0;">
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
    slate: { bg: "#FAF8F5", border: "#EFE8DE", title: "#1E293B" },
  }[type]

  return `
    <div style="background: ${styles.bg}; border: 1px solid ${styles.border}; border-radius: 16px; padding: 18px 20px; margin: 18px 0;">
      <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; color: ${styles.title}; margin: 0 0 8px 0; letter-spacing: 1px; text-transform: uppercase;">
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
  return `<h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 700; color: #0F172A; margin: 24px 0 12px 0; letter-spacing: 0.5px;">${text}</h2>`
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
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px 20px; text-align: center; margin: 24px 0;">
        <div style="font-size: 12.5px; color: #475569; font-weight: 600; margin-bottom: 10px;">
          Have questions or need assistance with your order?
        </div>
        <a href="${href}" class="whatsapp-button">
          💬 ${text}
        </a>
      </div>
    `
  }

  return `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${href}" class="cta-button">
        ${text} &rarr;
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
    <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #EFE8DE;">
      <p style="font-size: 13px; color: #64748B; margin: 0; line-height: 1.6;">
        With warm regards,<br>
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