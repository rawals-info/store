// @ts-ignore
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

export default async function customerWelcomeEmail({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerId = event.data.id
  const customerService = container.resolve("customer") as any
  const customer = await customerService.retrieve(customerId)

  if (!customer) return

  const customerName = customer.first_name || customer.email?.split("@")[0] || "Valued Connoisseur"

  const body = `
    ${buildHeroStatusCard({
      icon: "👑",
      title: "Welcome to the Taj Petha Family",
      subtitle: `Dear ${customerName}, your account is now ready. Discover the authentic royal heritage of Agra sweets.`,
      badgeText: "🏛️ Agra Master Confectionery",
    })}

    <div style="background: #FFFDF9; border: 1px solid #FDE68A; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
      <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 8px 0;">
        Handcrafted with 70+ Years of Tradition
      </h3>
      <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 12px 0;">
        For generations, our master halwais in Agra have prepared daily batches using zero preservatives, pure ingredients, and sealed vacuum freshness.
      </p>
      ${buildList([
        "<strong>Fresh Air Dispatch:</strong> Orders express-shipped directly from our Agra master kitchens.",
        "<strong>Exclusive Member Perks:</strong> Early access to festival batches & royal gift boxes.",
        "<strong>100% Transit Safe:</strong> Guaranteed safe, damage-free delivery to your doorstep.",
      ])}
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://tajpetha.in/in/products" class="cta-button">
        Explore Fresh Sweets Collection ➔
      </a>
    </div>

    ${buildSignOff()}
  `

  await sendLuxuryEmail({
    to: customer.email,
    name: customerName,
    subject: "Welcome to Taj Petha - Authentic Agra Sweets",
    html: buildLuxuryTemplate("Welcome to Taj Petha", body),
  })
}

export const config: SubscriberConfig = {
  event: "customer.created",
  context: { subscriberId: "customer-welcome-email" },
}