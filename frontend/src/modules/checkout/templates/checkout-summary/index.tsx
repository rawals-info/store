import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  // Determine if we're still on the address step based on cart data
  const atAddressStep = !cart?.shipping_address?.address_1 || !cart.email
  const shippingPlaceholder = atAddressStep ? "Enter your shipping address" : undefined
  
  return (
    <div className="sticky top-4 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0">
      <div className="w-full bg-luxury-ivory flex flex-col p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30 checkout-section transition-shadow duration-200 hover:shadow-luxury-md">
        <div className="h-0.5 w-full gold-gradient mb-6"></div>
        
        <h2 className="font-display text-2xl text-luxury-charcoal mb-6">
          Your Order
        </h2>
        <CartTotals 
          totals={cart} 
          shippingPlaceholder={shippingPlaceholder}
          taxPlaceholder="No upfront tax; duties paid by buyer at customs clearance" 
        />
        <div className="h-px bg-luxury-gold/20 my-6"></div>
        <ItemsPreviewTemplate cart={cart} />
        <div className="h-px bg-luxury-gold/20 my-6"></div>
        <div className="mt-2">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
