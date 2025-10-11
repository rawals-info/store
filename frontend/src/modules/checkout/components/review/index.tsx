"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  // Show review section when all previous steps are completed
  const isOpen = cart.shipping_address && 
                cart.shipping_methods.length > 0 && 
                (cart.payment_collection || paidByGiftcard)

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-8">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row font-serif text-[#43372f] text-2xl gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review & Place Order
        </Heading>
      </div>
      
      {isOpen && (
        <>
          {/* Order Summary */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-[#43372f] mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{(cart.total || 0) / 100}</span>
              </div>
              {cart.shipping_methods?.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Shipping ({cart.shipping_methods[0]?.name}):</span>
                  <span>₹{(cart.shipping_methods[0]?.amount || 0) / 100}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total:</span>
                <span>₹{(cart.total || 0) / 100}</span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-x-1 w-full mb-8">
            <div className="w-full">
              <Text className="text-[#8a7f72] mb-1">
                By placing your order, you confirm that you have read, understand, and agree to our <a href="/terms" className="underline hover:text-luxury-gold transition-colors">Terms & Conditions</a>, <a href="/returns" className="underline hover:text-luxury-gold transition-colors">Terms of Sale & Returns Policy</a>, and <a href="/privacy" className="underline hover:text-luxury-gold transition-colors">Privacy Policy</a> of <strong>Taj Petha</strong>.
              </Text>
            </div>
          </div>
        </>
      )}
      
      {isOpen && (
        <div className="w-full">
          <PaymentButton 
            cart={cart} 
            data-testid="submit-order-button" 
            className="w-full bg-[var(--color-luxury-gold)] hover:bg-[var(--color-luxury-darkgold)] text-white border-none px-8 py-3 rounded-md luxury-btn text-lg font-semibold"
          />
        </div>
      )}
    </div>
  )
}

export default Review
