import { RadioGroup } from "@headlessui/react"
import { isManual } from "@lib/constants"
import { Container, Text, clx } from "@medusajs/ui"
import React, { useContext, useMemo, type JSX } from "react"

import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"
import MedusaRadio from "@modules/common/components/radio"

const RadioGroupOption = ({ children, ...props }: any) => {
  return (
    <RadioGroup.Option {...props}>
      {({ checked }) => {
        return children
      }}
    </RadioGroup.Option>
  )
}

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  disabled?: boolean
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-md px-8 mb-4 hover:border-[#43372f] transition-all duration-150 ease-in-out",
        {
          "border-[#43372f] shadow-sm": selectedPaymentOptionId === paymentProviderId,
          "border-[#e2d9cf]": selectedPaymentOptionId !== paymentProviderId,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <MedusaRadio
            checked={selectedPaymentOptionId === paymentProviderId}
            className={selectedPaymentOptionId === paymentProviderId ? "text-[#43372f] border-[#43372f]" : "border-[#9b8b7e]"}
          />
          <span className="text-base font-medium text-[#43372f]">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </span>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )}
        </div>
        <span className="justify-self-end text-[#8a7f72]">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}
      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripeCardContainer: React.FC<
  {
    setCardBrand: (brand: string | null) => void
    setCardComplete: (complete: boolean) => void
    setError: (error: string | null) => void
  } & PaymentContainerProps
> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  setCardBrand,
  setError,
  setCardComplete,
  disabled = false,
}) => {
  const stripeReady = useContext(StripeContext)

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 transition-all duration-150 ease-in-out">
            <Text className="font-medium text-[#43372f] mb-2">
              Enter your card details:
            </Text>
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={(e) => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}
