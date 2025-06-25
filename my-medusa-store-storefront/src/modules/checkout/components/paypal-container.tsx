import PaymentContainer from "@modules/checkout/components/payment-container"
import PayPalButton from "./paypal-button"

interface Props {
  cart: any
  paymentProviderId: string
  selectedPaymentOptionId: string
  paymentInfoMap: Record<string, any>
}

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