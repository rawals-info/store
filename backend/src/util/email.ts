// @ts-ignore  Types for Brevo may not resolve in project yet
import * as BrevoSDK from "@getbrevo/brevo"

// Handle both CommonJS and ESM default exports gracefully
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Brevo: any = (BrevoSDK as any).default ?? (BrevoSDK as any)

/**
 * Initialize Brevo TransactionalEmailsApi and inject API key.
 * The newer Brevo SDK doesn't expose a global `ApiClient` singleton; instead each
 * API class maintains its own `authentications` map. We therefore need to set the
 * key on the specific instance we create.
 */
const transactionalApi = new Brevo.TransactionalEmailsApi()

// Set API key for header "api-key"
if (process.env.BREVO_API_KEY) {
  // Brevo's generated SDK names the authentication scheme `apiKey` (camelCase)
  // See: https://github.com/getbrevo/brevo-node/blob/main/docs/transactionalEmailsApi.md#setApiKey
  ; (transactionalApi as any).authentications["apiKey"].apiKey = process.env.BREVO_API_KEY
}

/**
 * Premium luxury email template for Taj Petha
 * Elegant, refined design with muted gold accents and sophisticated typography
 */
export function buildLuxuryTemplate(title: string, body: string) {
  return `
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Georgia', 'Times New Roman', serif; background: #F5F5F3; color: #2C2C2C; margin: 0; padding: 0; line-height: 1.7;">
      
      <!-- Email Wrapper -->
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E8E4DC;">
        
        <!-- Header -->
        <div style="background: #1A1A1A; padding: 40px 48px; text-align: center;">
          <div style="font-family: 'Georgia', serif; font-size: 28px; font-weight: 400; letter-spacing: 6px; color: #C9A962; margin: 0;">TAJ PETHA</div>
          <div style="font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 3px; color: #A0A0A0; margin-top: 8px; text-transform: uppercase;">Artisanal Sweets from Agra</div>
        </div>
        
        <!-- Gold Accent Line -->
        <div style="height: 3px; background: linear-gradient(90deg, #C9A962, #E8D5A3, #C9A962);"></div>
        
        <!-- Content -->
        <div style="padding: 48px;">
          
          <!-- Title -->
          <h1 style="font-family: 'Georgia', serif; font-size: 24px; font-weight: 400; color: #1A1A1A; text-align: center; margin: 0 0 8px 0; letter-spacing: 1px;">${title}</h1>
          <div style="width: 40px; height: 1px; background: #C9A962; margin: 0 auto 32px auto;"></div>
          
          ${body}
          
        </div>
        
        <!-- Footer -->
        <div style="background: #1A1A1A; padding: 32px 48px; text-align: center;">
          <div style="font-family: 'Georgia', serif; font-size: 16px; letter-spacing: 4px; color: #C9A962; margin-bottom: 8px;">TAJ PETHA</div>
          <div style="font-size: 12px; color: #808080; margin-bottom: 16px;">Agra, India</div>
          <div style="font-size: 11px; color: #606060; letter-spacing: 1px;">Where tradition meets taste</div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
            <div style="font-size: 11px; color: #505050;">© ${new Date().getFullYear()} Taj Petha. All rights reserved.</div>
          </div>
        </div>
        
      </div>
      
    </body>
  </html>`
}

/**
 * Helper: Build order details box for emails
 */
export function buildOrderDetailsBox(content: string) {
  return `
    <div style="background: #FAFAF8; border: 1px solid #E8E4DC; padding: 32px; margin: 32px 0;">
      ${content}
    </div>
  `
}

/**
 * Helper: Build info box with gold left border
 */
export function buildInfoBox(title: string, content: string) {
  return `
    <div style="background: #FAFAF8; border-left: 3px solid #C9A962; padding: 24px; margin: 32px 0;">
      <h3 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 0 0 12px 0; letter-spacing: 1px;">${title}</h3>
      ${content}
    </div>
  `
}

/**
 * Helper: Section heading
 */
export function buildSectionHeading(text: string) {
  return `<h2 style="font-family: 'Georgia', serif; font-size: 14px; font-weight: 400; color: #1A1A1A; margin: 32px 0 16px 0; letter-spacing: 2px; text-transform: uppercase;">${text}</h2>`
}

/**
 * Helper: Paragraph text
 */
export function buildParagraph(text: string) {
  return `<p style="font-size: 15px; color: #4A4A4A; margin: 0 0 24px 0;">${text}</p>`
}

/**
 * Helper: Strong/emphasis text
 */
export function buildStrong(text: string) {
  return `<strong style="color: #1A1A1A;">${text}</strong>`
}

/**
 * Helper: Link
 */
export function buildLink(href: string, text: string) {
  return `<a href="${href}" style="color: #C9A962; text-decoration: none;">${text}</a>`
}

/**
 * Helper: Button
 */
export function buildButton(href: string, text: string) {
  return `
    <div style="text-align: center; margin: 32px 0;">
      <a href="${href}" style="display: inline-block; background: #1A1A1A; color: #C9A962; padding: 14px 32px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid #C9A962;">${text}</a>
    </div>
  `
}

/**
 * Helper: List items
 */
export function buildList(items: string[]) {
  const listItems = items.map(item =>
    `<li style="margin: 6px 0; font-size: 14px; color: #4A4A4A;">${item}</li>`
  ).join('')
  return `<ul style="margin: 16px 0; padding-left: 18px; line-height: 2;">${listItems}</ul>`
}

/**
 * Helper: Sign off
 */
export function buildSignOff(name: string = "The Taj Petha Family") {
  return `
    <p style="font-size: 14px; color: #4A4A4A; margin: 32px 0 0 0;">
      With warm regards,<br>
      <span style="font-family: 'Georgia', serif; color: #1A1A1A; font-style: italic;">${name}</span>
    </p>
  `
}

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
  await transactionalApi.sendTransacEmail(email)
}