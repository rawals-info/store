import { createWorkflow } from "@medusajs/framework/workflows-sdk";
import { sendNotificationsStep, useQueryGraphStep } from "@medusajs/medusa/core-flows";

// The workflow expects to receive the ID of the order that was placed.
interface WorkflowInput {
  id: string;
}

export const orderPlacedNotificationWorkflow = createWorkflow(
  "order-placed-notification",
  ({ id }: WorkflowInput) => {
    // ✅ FIX: Fetch the order with all the details we need
    // Note: useQueryGraphStep should handle timing, but if issues persist,
    // consider adding a delay step before this query
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "shipping_address.*",
        "subtotal",
        "shipping_total",
        "currency_code",
        "discount_total",
        "tax_total",
        "total",
        "items.*",
        "original_total",
        "billing_address.*",
        "payment_collections.payments.*",
      ],
      filters: { id },
    });

    // ✅ FIX: Only send notification if order was found
    // Send a Slack notification using the Notification module.
    const order = orders?.[0]
    
    if (order) {
      sendNotificationsStep([
        {
          to: "slack", // matches provider id/channel id configured
          channel: "slack",
          template: "order-created",
          data: {
            order: order,
            // Include essential fields explicitly
            order_id: order.id,
            display_id: order.display_id,
            email: order.email,
            total: order.total,
            currency_code: order.currency_code,
          },
        },
      ]);
    }
  }
); 