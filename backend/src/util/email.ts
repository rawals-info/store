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
 * Traditional Indian sweet shop email layout for Taj Petha
 */
export function buildLuxuryTemplate(title: string, body: string) {
  return `
  <html>
    <head>
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400;500;700&display=swap");
        body {
          font-family: 'Lato', Arial, sans-serif;
          background: linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%);
          color: #4A4A4A;
          margin: 0;
          padding: 0;
          line-height: 1.6;
        }
        .wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 3px solid #E8944A;
        }
        .header {
          background: linear-gradient(135deg, #E8944A 0%, #D2691E 100%);
          color: #FFFFFF;
          padding: 30px 32px;
          text-align: center;
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #FFD700, #FFA500, #FF6347, #FFD700);
        }
        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        .brand-tagline {
          font-size: 13px;
          opacity: 0.9;
          margin: 0;
          font-style: italic;
        }
        .content {
          padding: 40px 32px;
        }
        h1 {
          font-family: 'Cormorant Garamond', serif;
          color: #B8860B;
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 24px 0;
          text-align: center;
        }
        .decorative-divider {
          height: 3px;
          width: 80px;
          background: linear-gradient(90deg, #E8944A, #D2691E);
          margin: 24px auto;
          border-radius: 2px;
          position: relative;
        }
        .decorative-divider::before,
        .decorative-divider::after {
          content: '◆';
          position: absolute;
          top: -8px;
          color: #E8944A;
          font-size: 14px;
        }
        .decorative-divider::before {
          left: -20px;
        }
        .decorative-divider::after {
          right: -20px;
        }
        p {
          line-height: 1.7;
          font-size: 15px;
          margin: 16px 0;
          color: #5A5A5A;
        }
        strong {
          color: #B8860B;
          font-weight: 600;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: #FFFEF7;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #F0E68C;
        }
        th {
          background: linear-gradient(135deg, #E8944A, #D2691E);
          color: #FFFFFF;
          padding: 12px 8px;
          font-weight: 600;
          font-size: 14px;
        }
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #F0E68C;
          font-size: 14px;
        }
        tr:nth-child(even) {
          background-color: #FFF8E7;
        }
        .footer {
          background: linear-gradient(135deg, #4A4A4A 0%, #2C2C2C 100%);
          color: #FFFFFF;
          padding: 30px 32px;
          text-align: center;
          font-size: 13px;
        }
        .footer-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #E8944A;
        }
        .footer-contact {
          margin: 8px 0;
          opacity: 0.8;
        }
        .footer-tagline {
          margin-top: 16px;
          font-style: italic;
          opacity: 0.7;
          font-size: 12px;
        }
        .highlight-box {
          background: linear-gradient(135deg, #FFF8E7, #F0E68C);
          border-left: 4px solid #E8944A;
          padding: 16px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .address-section {
          background: #FFFEF7;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #F0E68C;
          margin: 16px 0;
        }
        .address-section h3 {
          color: #B8860B;
          margin: 0 0 8px 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="brand-name">TAJ PETHA</div>
          <div class="brand-tagline">Authentic Agra Sweets Since Generations</div>
        </div>
        <div class="content">
          <h1>${title}</h1>
          <div class="decorative-divider"></div>
          ${body}
        </div>
        <div class="footer">
          <div class="footer-brand">Taj Petha</div>
          <div class="footer-contact">Email: support@tajpetha.in | Visit: Agra, India</div>
          <div class="footer-tagline">"Where tradition meets taste, and every bite tells a story"</div>
          <div style="margin-top: 12px; font-size: 11px;">© ${new Date().getFullYear()} Taj Petha. All rights reserved.</div>
        </div>
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