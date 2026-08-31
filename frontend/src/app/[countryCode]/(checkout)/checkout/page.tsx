import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import CheckoutSkeleton from "@modules/skeletons/templates/checkout-skeleton"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import "./checkout.css"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: "Secure Checkout | Authentic Agra Petha & Sweets | Taj Petha",
}

export default async function Checkout() {
  const [cart, customer] = await Promise.all([
    retrieveCart(undefined, undefined as any, { fresh: true }).catch((err) => {
      console.error("[Checkout Page] Error retrieving cart:", err)
      return null
    }),
    retrieveCustomer().catch((err) => {
      console.error("[Checkout Page] Error retrieving customer:", err)
      return null
    }),
  ])

  if (!cart || !cart.items || cart.items.length === 0) {
    return notFound()
  }

  const [shippingMethods, paymentProviders] = await Promise.all([
    listCartShippingMethods(cart.id).catch(() => []),
    listCartPaymentMethods(cart.region?.id ?? cart.region_id ?? "").catch(() => []),
  ])

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-6 pb-28 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <LocalizedClientLink
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-jakarta font-bold text-slate-500 hover:text-petha-amber transition-colors mb-6 uppercase tracking-wider"
          data-testid="back-to-cart-link"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sweet Box</span>
        </LocalizedClientLink>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 lg:gap-12 items-start">
          <Suspense fallback={<CheckoutSkeleton />}>
            <PaymentWrapper cart={cart}>
              <CheckoutForm
                cart={cart}
                customer={customer}
                shippingMethods={shippingMethods}
                paymentProviders={paymentProviders}
              />
            </PaymentWrapper>
          </Suspense>
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
