import axios from "axios"
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import { NotificationTypes } from "@medusajs/framework/types"

// The configuration options accepted by the provider.
interface SlackProviderOptions {
  webhook_url: string
  admin_url: string
  channels?: string[]
}

// This provider currently has no injected dependencies but we keep the type for future-proofing.
type InjectedDependencies = {}

/**
 * Slack Notification provider that posts a rich message to a Slack channel
 * whenever an order is placed.
 */
class SlackNotificationProviderService extends AbstractNotificationProviderService {
  /** Unique identifier used in the Medusa module registration. */
  static identifier = "slack"

  private readonly options_: SlackProviderOptions

  constructor(_: InjectedDependencies, options: SlackProviderOptions) {
    super()
    this.options_ = options
  }

  /**
   * Medusa will call this static method on boot to ensure the required
   * configuration is provided. Throwing will abort the application start-up.
   */
  static validateOptions(options: Record<string, any>): void | never {
    if (!options.webhook_url) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Webhook URL is required"
      )
    }
    if (!options.admin_url) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Admin URL is required"
      )
    }
  }

  /** Helper to format prices using Intl API.
   * Medusa already stores monetary amounts in major currency units, so we do not divide by 100.
   */
  private formatAmount(amount: number, currency: string): string {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  /** Formats a postal address into a multiline string compatible with Slack */
  private formatAddress(address: any): string {
    if (!address) {
      return "—"
    }

    const parts = [
      [address.first_name, address.last_name].filter(Boolean).join(" "),
      address.address_1,
      address.address_2,
      `${address.postal_code ?? ""} ${address.city ?? ""}`.trim(),
      address.country_code ? address.country_code.toUpperCase() : undefined,
      address.phone,
    ].filter(Boolean)

    return parts.join("\n")
  }

  /**
   * Builds a Slack Block Kit message for an order payload.
   */
  private buildOrderMessage(order: any) {
    const itemsList = order.items
      .map(
        (item: any) =>
          `• ${item.title} x${item.quantity} – ${this.formatAmount(
            item.total,
            order.currency_code
          )}`
      )
      .join("\n")

    const orderLink = `${this.options_.admin_url}/orders/${order.id}`

    const text = `New order #${order.display_id} was placed`

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*New order* <${orderLink}|#${order.display_id}>`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Total*\n${this.formatAmount(order.total, order.currency_code)}`,
          },
          {
            type: "mrkdwn",
            text: `*Customer*\n${order.email}`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Shipping address*\n${this.formatAddress(order.shipping_address)}`,
          },
          {
            type: "mrkdwn",
            text: `*Payment*\n${this.extractPaymentProvider(order)}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Items*\n${itemsList}`,
        },
      },
    ]

    return { text, blocks }
  }

  /**
   * Returns the payment provider ID in uppercase or "—" if not available.
   */
  private extractPaymentProvider(order: any): string {
    let provider: string | undefined

    // New module structure – payment_collections -> payments
    if (Array.isArray(order.payment_collections) && order.payment_collections.length) {
      const payments = order.payment_collections[0]?.payments
      if (Array.isArray(payments) && payments.length) {
        provider = payments[0]?.provider_id
      }
    }

    // Fallback to legacy `payments` array
    if (!provider && Array.isArray(order.payments) && order.payments.length) {
      provider = order.payments[0]?.provider_id
    }

    return provider ? provider.toUpperCase() : "—"
  }

  /**
   * Called by the Notification module whenever a notification should be sent
   * through Slack.
   */
  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    console.info("[SlackProvider] Sending notification", JSON.stringify(notification));

    if (!notification) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No notification information provided"
      )
    }

    // We currently handle a single template: "order-created".
    if (notification.template !== "order-created") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Unsupported template '${notification.template}'`
      )
    }

    // Expecting the order object under data.order.
    const order = (notification.data as any)?.order
    if (!order) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Order data missing from notification payload"
      )
    }

    // Build Slack payload and post it to the incoming-webhook URL.
    const slackPayload = this.buildOrderMessage(order)

    await axios.post(this.options_.webhook_url, slackPayload)

    return {}
  }
}

export default SlackNotificationProviderService 