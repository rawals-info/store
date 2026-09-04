import {
  buildLuxuryTemplate,
  buildSignOff,
  buildButton,
  buildParagraph,
  buildSectionHeading,
  sendLuxuryEmail,
} from "./email"

export interface AbandonedCartItem {
  title: string
  thumbnail?: string | null
  quantity: number
  unit_price: number | string
  variant_title?: string | null
}

export interface SendAbandonedCartEmailOptions {
  to: string
  customerName?: string
  cartId: string
  items: AbandonedCartItem[]
  currencyCode?: string
  customSubject?: string
  discountCode?: string
  storefrontUrl?: string
}

/**
 * Formats a unit price to standard INR / currency string
 */
function formatCurrency(amount: number | string, currencyCode: string = "inr"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  const symbol = currencyCode.toLowerCase() === "inr" ? "₹" : `${currencyCode.toUpperCase()} `
  return `${symbol}${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Builds and sends a luxury abandoned cart recovery email via Brevo
 */
export async function sendAbandonedCartRecoveryEmail(options: SendAbandonedCartEmailOptions) {
  const {
    to,
    customerName,
    cartId,
    items,
    currencyCode = "inr",
    customSubject,
    discountCode,
    storefrontUrl = process.env.STOREFRONT_URL?.split(",")[0] || "https://tajpetha.in",
  } = options

  const cleanStorefrontUrl = storefrontUrl.replace(/\/$/, "")
  const recoveryUrl = `${cleanStorefrontUrl}/cart?cart_id=${cartId}`

  const greetingName = customerName && customerName.trim() ? customerName.trim() : "Valued Customer"

  // Calculate cart total from items
  const totalAmount = items.reduce((sum, item) => {
    const price = typeof item.unit_price === "string" ? parseFloat(item.unit_price) : item.unit_price
    return sum + (price * item.quantity)
  }, 0)

  // Build items HTML table
  const itemsHtml = items
    .map((item) => {
      const price = typeof item.unit_price === "string" ? parseFloat(item.unit_price) : item.unit_price
      const itemTotal = price * item.quantity
      const thumbnailSrc = item.thumbnail || "https://res.cloudinary.com/dyh4ssbkt/image/upload/v1/placeholder-petha.png"

      return `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #EFE8DE; vertical-align: middle;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="64" style="vertical-align: middle; padding-right: 14px;">
                  <img src="${thumbnailSrc}" alt="${item.title}" width="56" height="56" style="border-radius: 8px; object-fit: cover; border: 1px solid #E2D9CF; display: block;" />
                </td>
                <td style="vertical-align: middle;">
                  <p style="margin: 0; font-weight: 700; font-size: 15px; color: #1E293B; line-height: 1.3;">
                    ${item.title}
                  </p>
                  ${item.variant_title ? `<p style="margin: 2px 0 0; font-size: 13px; color: #64748B;">Variant: ${item.variant_title}</p>` : ""}
                  <p style="margin: 3px 0 0; font-size: 13px; color: #8C7355; font-weight: 600;">
                    Qty: ${item.quantity} &times; ${formatCurrency(price, currencyCode)}
                  </p>
                </td>
                <td width="90" style="vertical-align: middle; text-align: right;">
                  <p style="margin: 0; font-weight: 800; font-size: 15px; color: #0F172A;">
                    ${formatCurrency(itemTotal, currencyCode)}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
    })
    .join("")

  // Optional discount box
  const discountHtml = discountCode
    ? `
      <div style="background-color: #FBF7F2; border: 1.5px dashed #8C7355; border-radius: 8px; padding: 14px 18px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
          Special Sweet Courtesy
        </p>
        <p style="margin: 6px 0 2px; font-size: 18px; font-weight: 800; color: #8C7355; font-family: 'JetBrains Mono', monospace, sans-serif; letter-spacing: 0.08em;">
          ${discountCode}
        </p>
        <p style="margin: 0; font-size: 12px; color: #718096;">Apply this code during checkout for an exclusive courtesy on your order.</p>
      </div>
    `
    : ""

  const emailBody = `
    ${buildParagraph(`Dear ${greetingName},`)}
    ${buildParagraph(`We noticed you left something wonderful in your cart. Your fresh batch of authentic Agra delicacies is safely reserved for you, handcrafted with traditional purity.`)}

    <div style="background-color: #FFFFFF; border: 1px solid #EFE8DE; border-radius: 12px; padding: 18px 22px; margin: 22px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
      ${buildSectionHeading("Items in Your Selection")}
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 8px;">
        ${itemsHtml}
        <tr>
          <td style="padding-top: 16px; text-align: right;" colspan="3">
            <span style="font-size: 14px; color: #64748B; margin-right: 12px;">Subtotal:</span>
            <strong style="font-size: 18px; color: #0F172A; font-family: 'Plus Jakarta Sans', sans-serif;">
              ${formatCurrency(totalAmount, currencyCode)}
            </strong>
          </td>
        </tr>
      </table>
    </div>

    ${discountHtml}

    <div style="text-align: center; margin: 30px 0 16px;">
      ${buildButton(recoveryUrl, "Complete Your Order &rarr;")}
      <p style="margin: 12px 0 0; font-size: 12px; color: #94A3B8;">
        Your selection has been saved for a limited time.
      </p>
    </div>

    <div style="margin: 24px 0; padding: 14px 18px; background-color: #F8FAFC; border-radius: 8px; border-left: 3px solid #8C7355;">
      <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
        <strong>Need any assistance?</strong> If you experienced any issues during checkout or have questions about fresh delivery, simply reply directly to this email and our team in Agra will be delighted to assist you.
      </p>
    </div>

    ${buildSignOff("Taj Petha")}
  `

  const title = "Your Saved Cart"
  const subject = customSubject || `Your saved items at Taj Petha`

  const fullHtml = buildLuxuryTemplate(title, emailBody, "Order assistance & details")

  return await sendLuxuryEmail({
    to,
    name: customerName,
    subject,
    html: fullHtml,
  })
}
