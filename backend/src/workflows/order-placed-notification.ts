import { createWorkflow } from "@medusajs/framework/workflows-sdk";
import { sendNotificationsStep, useQueryGraphStep } from "@medusajs/medusa/core-flows";

// The workflow expects to receive the ID of the order that was placed.
interface WorkflowInput {
  id: string;
}

export const orderPlacedNotificationWorkflow = createWorkflow(
  "order-placed-notification",
  ({ id }: WorkflowInput) => {
    // Fetch the order with all the details we need.
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

    // Send a Slack notification using the Notification module.
    sendNotificationsStep([
      {
        to: "slack", // matches provider id/channel id configured
        channel: "slack",
        template: "order-created",
        data: {
          order: orders[0],
        },
      },
    ]);
  }
); 