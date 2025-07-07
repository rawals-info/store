"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-[var(--color-luxury-lightgold)]/20 pb-6 last:pb-0 last:border-none"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-8 py-12 account-card"
      data-testid="no-orders-container"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[var(--color-luxury-ivory)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-luxury-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </div>
      <div className="text-center">
        <h2 className="font-display text-xl text-[var(--color-luxury-charcoal)] mb-2">Nothing to see here</h2>
        <p className="text-[var(--color-luxury-charcoal)]/70 mb-6">
          You don&apos;t have any orders yet, let us change that {":)"}
        </p>
      </div>
      <LocalizedClientLink href="/products" passHref>
        <button className="luxury-btn px-8 py-3 tracking-wider">
          CONTINUE SHOPPING
        </button>
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
