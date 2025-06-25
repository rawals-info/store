import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import Medusa from "@medusajs/js-sdk"
import { useState } from "react"

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

    const authorization = await actions.order!.authorize()

    try {
      await medusa.carts.setPaymentSession(cart.id, { provider_id: "paypal" })
      await medusa.carts.updatePaymentSession(cart.id, "paypal", {
        data: { data: authorization },
      })
      await medusa.carts.complete(cart.id)
    } catch (e) {
      console.error(e)
      setError("Payment failed")
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