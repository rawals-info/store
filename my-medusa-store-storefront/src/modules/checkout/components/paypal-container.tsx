import PaymentContainer from "@modules/checkout/components/payment-container"
import dynamic from "next/dynamic"

interface Props {
  cart: any
  paymentProviderId: string
  selectedPaymentOptionId: string
  paymentInfoMap: Record<string, any>
}

// Lazy-load the PayPal button (and thus the PayPal JS SDK) only when the
// PayPal option is actively selected by the shopper.
const PayPalButton = dynamic(() => import("./paypal-button"), { ssr: false })

const PayPalContainer: React.FC<Props> = ({
  cart,
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
}) => {
  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
    >
      {selectedPaymentOptionId === paymentProviderId && (
        <PayPalButton cart={cart} />
      )}
    </PaymentContainer>
  )
}

export default PayPalContainer 