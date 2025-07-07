import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Text className="text-[var(--color-luxury-charcoal)] font-medium">
        We have sent the order confirmation details to{" "}
        <span
          className="text-[var(--color-luxury-charcoal)] font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <div className="flex flex-col md:flex-row md:justify-between gap-y-2 md:gap-y-0">
        <Text className="text-[var(--color-luxury-charcoal)]/70 font-medium">
          Order date:{" "}
          <span className="text-[var(--color-luxury-charcoal)]" data-testid="order-date">
            {new Date(order.created_at).toDateString()}
          </span>
        </Text>
        <Text className="text-[var(--color-luxury-charcoal)]/70 font-medium">
          Order number:{" "}
          <span className="text-[var(--color-luxury-charcoal)]" data-testid="order-id">
            {order.display_id}
          </span>
        </Text>
      </div>

      {showStatus && (
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-2 mt-2">
          <Text className="text-[var(--color-luxury-charcoal)]/70 font-medium">
            Order status:{" "}
            <span className="text-[var(--color-luxury-charcoal)]" data-testid="order-status">
              {formatStatus(order.fulfillment_status)}
            </span>
          </Text>
          <Text className="text-[var(--color-luxury-charcoal)]/70 font-medium">
            Payment status:{" "}
            <span
              className="text-[var(--color-luxury-charcoal)]"
              data-testid="order-payment-status"
            >
              {formatStatus(order.payment_status)}
            </span>
          </Text>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
