import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { parallelFetch } from "@lib/util/parallel-fetch"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { Suspense } from "react"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  // Fetch shipping and payment methods in parallel
  const [shippingMethods, paymentMethods] = await parallelFetch([
    () => listCartShippingMethods(cart.id),
    () => listCartPaymentMethods(cart.region?.id ?? ""),
  ])

  // Ensure we have arrays to work with
  const safeShipping = shippingMethods ?? []
  const safePayments = paymentMethods ?? []

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <div className="bg-luxury-ivory p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30 checkout-section transition-shadow duration-200 hover:shadow-luxury-md">
        {/* Gold line at top */}
        <div className="h-0.5 w-full gold-gradient mb-6"></div>
        <Addresses cart={cart} customer={customer} />
      </div>

      <div className="bg-luxury-ivory p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30 checkout-section transition-shadow duration-200 hover:shadow-luxury-md">
        {/* Gold line at top */}
        <div className="h-0.5 w-full gold-gradient mb-6"></div>
        <Shipping cart={cart} availableShippingMethods={safeShipping} />
      </div>

      <div className="bg-luxury-ivory p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30 checkout-section transition-shadow duration-200 hover:shadow-luxury-md">
        {/* Gold line at top */}
        <div className="h-0.5 w-full gold-gradient mb-6"></div>
        <Payment cart={cart} availablePaymentMethods={safePayments} />
      </div>

      <div className="bg-luxury-ivory p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30 checkout-section transition-shadow duration-200 hover:shadow-luxury-md">
        {/* Gold line at top */}
        <div className="h-0.5 w-full gold-gradient mb-6"></div>
        <Review cart={cart} />
      </div>
    </div>
  )
}
