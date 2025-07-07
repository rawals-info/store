import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div className="account-card p-6 hover:translate-y-[-2px] transition-all duration-300" data-testid="order-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <div className="text-[var(--color-luxury-charcoal)]/70 text-xs uppercase tracking-wider mb-1">Order Number</div>
          <div className="font-display text-xl text-[var(--color-luxury-charcoal)]">
            #<span data-testid="order-display-id">{order.display_id}</span>
          </div>
        </div>
        <div className="flex flex-col sm:items-end mt-2 sm:mt-0">
          <div className="text-[var(--color-luxury-charcoal)]/70 text-xs uppercase tracking-wider mb-1">Order Date</div>
          <span className="text-[var(--color-luxury-charcoal)]" data-testid="order-created-at">
            {new Date(order.created_at).toDateString()}
          </span>
        </div>
      </div>
      
      <div className="h-px bg-[var(--color-luxury-lightgold)]/20 w-full my-4"></div>
      
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[var(--color-luxury-charcoal)]/70 text-xs uppercase tracking-wider mb-1">Total</div>
            <span className="text-[var(--color-luxury-gold)] font-medium" data-testid="order-amount">
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </span>
          </div>
          <div>
            <div className="text-[var(--color-luxury-charcoal)]/70 text-xs uppercase tracking-wider mb-1">Items</div>
            <span className="text-[var(--color-luxury-charcoal)]">{`${numberOfLines} ${
              numberOfLines > 1 ? "items" : "item"
            }`}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 small:grid-cols-4 gap-4 mb-6">
        {order.items?.slice(0, 3).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-2"
              data-testid="order-item"
            >
              <div className="bg-[var(--color-luxury-ivory)] p-2 rounded">
                <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />
              </div>
              <div className="flex items-center text-small-regular text-[var(--color-luxury-charcoal)]">
                <span
                  className="font-medium"
                  data-testid="item-title"
                >
                  {i.title}
                </span>
                <span className="ml-2 text-[var(--color-luxury-charcoal)]/70">x</span>
                <span className="text-[var(--color-luxury-charcoal)]/70" data-testid="item-quantity">{i.quantity}</span>
              </div>
            </div>
          )
        })}
        {numberOfProducts > 4 && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-small-regular text-[var(--color-luxury-gold)]">
              + {numberOfLines - 4}
            </span>
            <span className="text-small-regular text-[var(--color-luxury-charcoal)]/70">more</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <button className="edit-button hover:bg-[var(--color-luxury-gold)] hover:text-white" data-testid="order-details-link">
            View Details
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
