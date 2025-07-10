import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-16 bg-[var(--color-luxury-ivory)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-5xl h-full w-full mx-auto px-4 sm:px-6 lg:px-8">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-8 max-w-5xl h-full w-full py-12 px-8 bg-white luxury-shadow-md rounded-md fade-in order-section"
          data-testid="order-complete-container"
        >
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-20 h-20 rounded-full order-success-icon flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-luxury-darkgold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <Heading
              level="h1"
              className="font-display text-3xl text-[var(--color-luxury-charcoal)] mb-2"
            >
              Thank you for your order!
            </Heading>
            <p className="text-[var(--color-luxury-charcoal)]/70 text-lg">
              Your order was placed successfully and is being processed.
            </p>
          </div>
          
          <div className="p-8 bg-[var(--color-luxury-ivory)] rounded-md luxury-shadow-sm order-section">
            <div className="h-0.5 w-full gold-gradient mb-6"></div>
            <OrderDetails order={order} />
          </div>
          
          <div className="mt-4">
            <div className="flex items-center mb-6">
              <div className="h-0.5 w-24 gold-gradient mr-4"></div>
              <Heading level="h2" className="font-display text-2xl text-[var(--color-luxury-charcoal)]">
                Order Summary
              </Heading>
              <div className="h-0.5 flex-grow gold-gradient ml-4"></div>
            </div>
            
            <div className="bg-white rounded-md luxury-shadow-sm p-6 order-section">
              <Items order={order} />
            </div>
          </div>
          
          <div className="bg-[var(--color-luxury-ivory)] rounded-md p-8 luxury-shadow-sm order-section">
            <div className="h-0.5 w-full gold-gradient mb-6"></div>
            <CartTotals 
              totals={order} 
              taxPlaceholder="Enjoy tax‑free shopping" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="bg-white rounded-md p-8 luxury-shadow-sm order-section">
              <div className="h-0.5 w-full gold-gradient mb-6"></div>
              <ShippingDetails order={order} />
            </div>
            
            <div className="bg-white rounded-md p-8 luxury-shadow-sm order-section">
              <div className="h-0.5 w-full gold-gradient mb-6"></div>
              <PaymentDetails order={order} />
            </div>
          </div>
          
          <div className="mt-8 p-8 bg-[var(--color-luxury-ivory)] rounded-md luxury-shadow-sm order-section">
            <div className="h-0.5 w-full gold-gradient mb-6"></div>
            <Help />
          </div>
        </div>
      </div>
    </div>
  )
}
