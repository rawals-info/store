import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { parallelFetch } from "@lib/util/parallel-fetch"
import { HttpTypes } from "@medusajs/types"
import UnifiedCheckoutForm from "@modules/checkout/components/unified-checkout-form"

export default async function CheckoutForm({
  cart,
  customer,
  shippingMethods,
  paymentProviders,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  shippingMethods?: HttpTypes.StoreCartShippingOption[]
  paymentProviders?: HttpTypes.StorePaymentProvider[]
}) {
  if (!cart) {
    return null
  }

  let safeShipping = shippingMethods ?? []
  let safePayments = paymentProviders ?? []

  if (!shippingMethods || !paymentProviders) {
    const [shipping, payments] = await parallelFetch([
      () => listCartShippingMethods(cart.id),
      () => listCartPaymentMethods(cart.region?.id ?? ""),
    ])
    safeShipping = shipping ?? []
    safePayments = payments ?? []
  }

  return (
    <div className="w-full">
      <UnifiedCheckoutForm
        cart={cart}
        customer={customer}
        availableShippingMethods={safeShipping}
        availablePaymentMethods={safePayments}
      />
    </div>
  )
}
