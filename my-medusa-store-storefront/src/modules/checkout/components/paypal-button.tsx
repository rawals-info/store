import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import Medusa from "@medusajs/js-sdk"
import { useState } from "react"
import { fetchWithAdaptiveTimeout, retryWithBackoff } from "@lib/util/network"

// @ts-ignore - js-sdk currently lacks full typings
const medusa: any = new (Medusa as any)({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND!,
})

interface Props {
  cart: any
}

const PayPalButton: React.FC<Props> = ({ cart }) => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!cart) return null

  const formatAmount = (amount: number, currency: string) => {
    // Amounts from Medusa storefront are already in major currency units
    return amount.toFixed(2)
  }

  const createOrder = async (_data: unknown, actions: any) => {
    const value = formatAmount(cart.total, cart.region.currency_code)

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value,
            currency_code: cart.region.currency_code.toUpperCase(),
          },
        },
      ],
      intent: "AUTHORIZE",
    })
  }

  const onApprove = async (_data: unknown, actions: any) => {
    setProcessing(true)
    setError(null)

    const authorization = await actions.order!.authorize()

    // Helper to capture errors as readable messages
    const mapError = (e: any): string => {
      if (typeof e === "string") return e
      if (e?.message) return e.message
      if (e?.name === "AbortError") return "Network timeout. Please try again."
      return "Payment failed. Please try again."
    }

    try {
      const generateIdempotencyKey = () =>
        (typeof crypto !== "undefined" && (crypto as any).randomUUID)
          ? (crypto as any).randomUUID()
          : Math.random().toString(36).substring(2, 15)
      const commonHeaders = {
        "Idempotency-Key": generateIdempotencyKey(),
      }
      // Wrap each call with retry + adaptive timeout
      await retryWithBackoff(() =>
        fetchWithAdaptiveTimeout(`${medusa.baseUrl}/store/carts/${cart.id}/payment-sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...commonHeaders,
          },
          body: JSON.stringify({ provider_id: "paypal" }),
        }).then((r) => (r.ok ? r : Promise.reject(r)))
      )

      await retryWithBackoff(() =>
        fetchWithAdaptiveTimeout(`${medusa.baseUrl}/store/carts/${cart.id}/payment-sessions/paypal`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...commonHeaders,
          },
          body: JSON.stringify({ data: authorization }),
        }).then((r) => (r.ok ? r : Promise.reject(r)))
      )

      await retryWithBackoff(() =>
        fetchWithAdaptiveTimeout(`${medusa.baseUrl}/store/carts/${cart.id}/complete`, {
          method: "POST",
          headers: commonHeaders,
        }).then((r) => (r.ok ? r : Promise.reject(r)))
      )
    } catch (e: any) {
      console.error(e)
      setError(mapError(e))
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="mt-4">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, // satisfy TS type
          currency: cart.region.currency_code.toUpperCase(),
          intent: "authorize",
        } as any}
      >
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={createOrder}
          onApprove={onApprove}
          disabled={processing}
        />
      </PayPalScriptProvider>
    </div>
  )
}

export default PayPalButton 