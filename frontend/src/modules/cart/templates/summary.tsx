"use client"

import { Button } from "@medusajs/ui"
import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { trackBeginCheckout } from "@lib/analytics/google-analytics"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const handleProceedToCheckout = () => {
    trackBeginCheckout({
      total: cart.total || 0,
      coupon: cart.promotions?.[0]?.code || undefined,
      items: (cart.items || []).map((item) => ({
        id: item.id,
        title: item.product_title || item.title || "Agra Petha",
        quantity: item.quantity,
        price: item.unit_price || 0,
      })),
    })
  }

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h2 className="font-cormorant text-2xl font-bold text-slate-900">Order Summary</h2>
        {cart.promotions && cart.promotions.length > 0 && (
          <span className="font-jakarta text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            🎉 {cart.promotions[0]?.code || "Discount"} Applied
          </span>
        )}
      </div>
      <DiscountCode cart={cart} />
      <div className="h-px bg-slate-100 my-1"></div>
      <CartTotals 
        totals={cart}
        shippingPlaceholder={(cart.shipping_methods?.length ?? 0) > 0 ? "Free shipping" : "Calculated at checkout"}
        taxPlaceholder="Enjoy tax‑free shopping"
      />
      <LocalizedClientLink
        href="/checkout"
        data-testid="checkout-button"
        className="w-full"
        onClick={handleProceedToCheckout}
      >
        <Button className="w-full h-12 rounded-2xl font-jakarta font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-petha-amber hover:bg-petha-saffron text-white shadow-lg hover:shadow-xl cursor-pointer">
          Proceed to Secure Checkout →
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
