import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { z } from "zod"
import { sendAbandonedCartRecoveryEmail } from "../../../../util/abandoned-cart-email"

export const PostAdminAbandonedCartNotifySchema = z.object({
  // Cart IDs to notify
  cart_ids: z.array(z.string()).min(1, "At least one cart ID must be provided"),
  // Optional custom subject line
  custom_subject: z.string().optional(),
  // Optional promotional discount code to embed in the email
  discount_code: z.string().optional(),
})

export type PostAdminAbandonedCartNotifyBody = z.infer<
  typeof PostAdminAbandonedCartNotifySchema
>

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  const cartModuleService = req.scope.resolve(Modules.CART)
  const logger = req.scope.resolve("logger")

  const { cart_ids, custom_subject, discount_code } =
    (req as any).validatedBody as PostAdminAbandonedCartNotifyBody

  const results: Array<{
    cart_id: string
    email?: string
    success: boolean
    message?: string
  }> = []

  let notifiedCount = 0

  for (const cartId of cart_ids) {
    try {
      // 1. Fetch the cart with line items, customer, and shipping address
      const { data: carts } = await query.graph({
        entity: "cart",
        fields: [
          "id",
          "email",
          "currency_code",
          "completed_at",
          "metadata",
          "customer.first_name",
          "customer.last_name",
          "shipping_address.first_name",
          "shipping_address.last_name",
          "items.id",
          "items.title",
          "items.subtitle",
          "items.thumbnail",
          "items.quantity",
          "items.unit_price",
          "items.variant_title",
        ],
        filters: { id: cartId },
      })

      const cart = carts?.[0]

      if (!cart) {
        results.push({
          cart_id: cartId,
          success: false,
          message: "Cart not found",
        })
        continue
      }

      if (cart.completed_at) {
        results.push({
          cart_id: cartId,
          email: cart.email || undefined,
          success: false,
          message: "Cart has already been completed as an order",
        })
        continue
      }

      if (!cart.email) {
        results.push({
          cart_id: cartId,
          success: false,
          message: "Cart does not have a customer email address",
        })
        continue
      }

      if (!cart.items || cart.items.length === 0) {
        results.push({
          cart_id: cartId,
          email: cart.email,
          success: false,
          message: "Cart has no line items",
        })
        continue
      }

      const customerName =
        cart.customer?.first_name || cart.shipping_address?.first_name
          ? `${cart.customer?.first_name || cart.shipping_address?.first_name || ""} ${cart.customer?.last_name || cart.shipping_address?.last_name || ""}`.trim()
          : undefined

      // 2. Dispatch the branded luxury recovery email
      await sendAbandonedCartRecoveryEmail({
        to: cart.email,
        customerName,
        cartId: cart.id,
        items: cart.items.map((item: any) => ({
          title: item.title,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          unit_price: item.unit_price,
          variant_title: item.variant_title,
        })),
        currencyCode: cart.currency_code || "inr",
        customSubject: custom_subject,
        discountCode: discount_code,
      })

      // 3. Update cart metadata to record notification audit log
      const nowIso = new Date().toISOString()
      const currentCount = Number(cart.metadata?.abandoned_notification_count || 0)
      const existingHistory = Array.isArray(cart.metadata?.abandoned_notifications)
        ? cart.metadata.abandoned_notifications
        : []

      const updatedHistory = [
        ...existingHistory,
        {
          sent_at: nowIso,
          recipient: cart.email,
          subject: custom_subject || "Did you leave something sweet behind? 🍯 - Taj Petha",
          discount_code: discount_code || null,
          success: true,
        },
      ]

      await cartModuleService.updateCarts(cart.id, {
        metadata: {
          ...(cart.metadata || {}),
          abandoned_notified_at: nowIso,
          abandoned_notification_count: currentCount + 1,
          abandoned_notifications: updatedHistory,
        },
      })

      notifiedCount++
      results.push({
        cart_id: cart.id,
        email: cart.email,
        success: true,
        message: "Notification sent successfully",
      })
    } catch (err: any) {
      logger.error(`[AbandonedCartNotify] Error sending notification for cart ${cartId}: ${err.message}`)
      results.push({
        cart_id: cartId,
        success: false,
        message: err.message || "Failed to send recovery email",
      })
    }
  }

  res.json({
    success: notifiedCount > 0,
    notified_count: notifiedCount,
    total_requested: cart_ids.length,
    results,
  })
}
