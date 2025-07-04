import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { orderPlacedNotificationWorkflow } from "../workflows/order-placed-notification";

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  console.log("🔔 order.placed subscriber triggered for order", data.id);
  try {
    const { result } = await orderPlacedNotificationWorkflow(container).run({
      input: data,
    });
    console.log("✅ Slack workflow finished", result);
  } catch (err) {
    console.error("❌ Slack workflow failed", err);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}; 