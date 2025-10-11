"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap, isPaypal as isPaypalFunc } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import PayPalContainer from "@modules/checkout/components/paypal-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Show payment form when shipping is selected, collapse when payment is completed
  const isOpen = cart?.shipping_methods?.length > 0 && !cart?.payment_collection

  const isStripe = isStripeFunc(selectedPaymentMethod)

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeFunc(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate payment method is selected
      if (!paidByGiftcard) {
        if (!isStripe && !selectedPaymentMethod) {
          setError("Please select a payment method")
          setIsLoading(false)
          return
        }
      }

      // Initialize the payment session and wait for response
      if (selectedPaymentMethod) {
        const response = await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })

        // Verify we got a valid payment session back
        if (!response?.payment_collection?.payment_sessions?.length) {
          throw new Error("Failed to initialize payment session")
        }

        // Notify listeners that cart has been updated
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated", {
            detail: { payment_collection: response.payment_collection }
          }))
        }
      }

      // Close the payment form since we're on a single page
      setIsEditing(false)
    } catch (err: any) {
      console.error("Payment initialization error:", err)
      setError(err.message || "Failed to initialize payment. Please try again.")
      setIsLoading(false)
    }
  }

  const [isEditing, setIsEditing] = useState(false)
  
  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-8">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row font-serif text-[#43372f] text-2xl gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid className="text-[#9b8b7e]" />}
        </Heading>
        {!isOpen && !isEditing && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-[#8a7f72] hover:text-[#43372f] transition-colors duration-150 ease-in-out font-medium"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={(isOpen || isEditing) ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : isPaypalFunc(paymentMethod.id) ? (
                      <PayPalContainer
                        cart={cart}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="font-medium text-[#43372f] mb-2">
                Payment method
              </Text>
              <Text
                className="text-[#8a7f72]"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <div className="flex gap-4">
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 border-none px-8 py-3 rounded-md font-medium tracking-wider uppercase transition-all duration-300"
              >
                Cancel
              </button>
            )}
            <Button
              size="large"
              className="bg-[var(--color-luxury-gold)] hover:bg-[var(--color-luxury-darkgold)] text-white border-none px-8 py-3 rounded-md luxury-btn"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={
                (isStripe && !cardComplete) ||
                (!selectedPaymentMethod && !paidByGiftcard)
              }
              data-testid="submit-payment-button"
            >
              {!activeSession && isStripeFunc(selectedPaymentMethod)
                ? " Enter card details"
                : "Save Payment Method"}
            </Button>
          </div>
        </div>

        <div className={(isOpen || isEditing) ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="font-medium text-[#43372f] mb-2">
                  Payment method
                </Text>
                <Text
                  className="text-[#8a7f72]"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="font-medium text-[#43372f] mb-2">
                  Payment method
                </Text>
                <Text
                  className="text-[#8a7f72]"
                  data-testid="payment-method-summary"
                >
                  {paidByGiftcard && "Gift card"}
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Payment
