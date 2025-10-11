import { Button } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import React, { useCallback, useEffect, useState } from "react"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay"
import { HttpTypes } from "@medusajs/types"
import { placeOrder } from "@lib/data/cart"
import { CurrencyCode } from "react-razorpay/dist/constants/currency"
import ErrorMessage from "../error-message"

export const RazorpayPaymentButton = ({
  session,
  notReady,
  cart,
}: {
  session: HttpTypes.StorePaymentSession
  notReady: boolean
  cart: HttpTypes.StoreCart
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  const { Razorpay } = useRazorpay()

  const [orderData, setOrderData] = useState<{ razorpayOrder: { id: string } }>(
    { razorpayOrder: { id: "" } }
  )

  const onPaymentCompleted = async () => {
    await placeOrder().catch(() => {
      setErrorMessage("An error occurred, please try again.")
      setSubmitting(false)
    })
  }

  useEffect(() => {
    // Sync order data whenever session data changes
    if (session?.data) {
      setOrderData(session.data as { razorpayOrder: { id: string } })
    }
  }, [session?.data])

  const handlePayment = useCallback(async () => {
    const orderId = orderData?.razorpayOrder?.id
    if (!orderId) return
    setSubmitting(true)
    setErrorMessage(undefined)

    const options: RazorpayOrderOptions = {
      key:
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ??
        process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID ??
        "", // fallback empty – Razorpay will throw if empty
      callback_url: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/razorpay/hooks`,
      amount: (session.amount || 0), // amount should already be in paise from backend
      order_id: orderId,
      currency: (cart.currency_code || "usd").toUpperCase() as CurrencyCode,
      name: process.env.NEXT_PUBLIC_SHOP_NAME ?? "Checkout",
      description: `Order ${orderId}`,
      remember_customer: true,
      image: "/favicon.ico",
      modal: {
        backdropclose: true,
        escape: true,
        handleback: true,
        confirm_close: true,
        ondismiss: async () => {
          setSubmitting(false)
          setErrorMessage("Payment cancelled")
        },
        animation: true,
      },
      handler: async () => {
        await onPaymentCompleted()
      },
      prefill: {
        name: `${cart.billing_address?.first_name} ${cart.billing_address?.last_name}`.trim(),
        email: cart.email || undefined,
        contact: cart.shipping_address?.phone || undefined,
      },
    }

    try {
      const razorpay = new Razorpay(options)
      razorpay.open()
      razorpay.on("payment.failed", function (response: any) {
        setErrorMessage(JSON.stringify(response.error))
        setSubmitting(false)
      })
      razorpay.on("payment.authorized" as any, async function () {
        await onPaymentCompleted()
      })
    } catch (err: any) {
      setErrorMessage(err.message || "Razorpay initialization error")
      setSubmitting(false)
    }
  }, [Razorpay, cart, session.amount, orderData?.razorpayOrder?.id])

  return (
    <>
      <Button
        disabled={
          submitting ||
          notReady ||
          !orderData?.razorpayOrder?.id ||
          orderData?.razorpayOrder?.id === ""
        }
        onClick={handlePayment}
        isLoading={submitting}
      >
        {submitting ? <Spinner /> : "Checkout"}
      </Button>
      {errorMessage && (
        <ErrorMessage error={errorMessage} data-testid="razorpay-error" />
      )}
    </>
  )
} 