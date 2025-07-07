import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="flex flex-col">
      <Heading level="h2" className="flex flex-row text-xl font-display text-[var(--color-luxury-charcoal)] mb-4 pb-2 border-b border-[var(--color-luxury-lightgold)]/30">
        Delivery
      </Heading>
      <div className="flex flex-col md:flex-row items-start gap-y-6 md:gap-x-8">
        <div
          className="flex flex-col w-full md:w-1/3"
          data-testid="shipping-address-summary"
        >
          <Text className="font-medium text-[var(--color-luxury-charcoal)] mb-2">
            Shipping Address
          </Text>
          <div className="flex flex-col gap-y-1 text-[var(--color-luxury-charcoal)]/70">
            <Text>
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </Text>
            <Text>
              {order.shipping_address?.address_1}{" "}
              {order.shipping_address?.address_2}
            </Text>
            <Text>
              {order.shipping_address?.postal_code},{" "}
              {order.shipping_address?.city}
            </Text>
            <Text>
              {order.shipping_address?.country_code?.toUpperCase()}
            </Text>
          </div>
        </div>

        <div
          className="flex flex-col w-full md:w-1/3"
          data-testid="shipping-contact-summary"
        >
          <Text className="font-medium text-[var(--color-luxury-charcoal)] mb-2">Contact</Text>
          <div className="flex flex-col gap-y-1 text-[var(--color-luxury-charcoal)]/70">
            <Text>{order.shipping_address?.phone}</Text>
            <Text className="break-words">{order.email}</Text>
          </div>
        </div>

        <div
          className="flex flex-col w-full md:w-1/3"
          data-testid="shipping-method-summary"
        >
          <Text className="font-medium text-[var(--color-luxury-charcoal)] mb-2">Method</Text>
          <Text className="text-[var(--color-luxury-charcoal)]/70">
            {(order as any).shipping_methods[0]?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })
              .replace(/,/g, "")
              .replace(/\./g, ",")}
            )
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
