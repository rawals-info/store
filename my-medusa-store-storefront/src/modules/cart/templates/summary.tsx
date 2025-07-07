"use client"

import { Button } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4 px-6">
      <h2 className="font-display text-2xl text-luxury-charcoal">Summary</h2>
      <DiscountCode cart={cart} />
      <div className="h-px bg-luxury-gold/20 my-2"></div>
      <CartTotals totals={cart} placeholder="No upfront tax; duties paid by buyer at customs clearance" />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="luxury-btn w-full h-12 mt-2 font-medium tracking-wider uppercase transition-all duration-300 bg-luxury-gold hover:bg-luxury-gold/90">
          Proceed to checkout
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
