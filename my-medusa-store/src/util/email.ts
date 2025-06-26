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
  ;(transactionalApi as any).authentications["apiKey"].apiKey = process.env.BREVO_API_KEY
}

/**
 * Simple luxury email layout
 */
export function buildLuxuryTemplate(title: string, body: string) {
  return `
  <html>
    <head>
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Montserrat:wght@300;400;500;700&display=swap");
        body {
          font-family: 'Montserrat', Arial, sans-serif;
          background:#FFFFF5;
          color:#333333;
          margin:0;
          padding:0;
        }
        .wrapper{
          max-width:600px;
          margin:0 auto;
          background:#ffffff;
          padding:40px 32px;
          border:1px solid #E5C767;
        }
        h1{
          font-family:'Playfair Display', serif;
          color:#D4AF37;
          font-size:28px;
          margin-bottom:24px;
          text-align:center;
        }
        .gold-divider{height:2px;width:60px;background:#D4AF37;margin:24px auto;}
        p{line-height:1.6;font-size:15px;margin:12px 0;}
        .footer{margin-top:40px;font-size:13px;text-align:center;color:#666666;}
      </style>
    </head>
    <body>
      <div class="wrapper">
        <h1>${title}</h1>
        <div class="gold-divider"></div>
        ${body}
        <div class="footer">© ${new Date().getFullYear()} Marble Luxe</div>
      </div>
    </body>
  </html>`
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
    email: process.env.EMAIL_FROM ?? "store@example.com",
    name: "Marble Luxe",
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