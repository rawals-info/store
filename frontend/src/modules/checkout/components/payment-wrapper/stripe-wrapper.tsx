"use client"

import { Stripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { HttpTypes } from "@medusajs/types"
import { createContext, useEffect, useState } from "react"

type StripeWrapperProps = {
  paymentSession: HttpTypes.StorePaymentSession
  stripeKey?: string
  stripePromise: Promise<Stripe | null> | null
  children: React.ReactNode
}

export const StripeContext = createContext(false)

const StripeWrapper: React.FC<StripeWrapperProps> = ({
  paymentSession,
  stripeKey,
  stripePromise,
  children,
}) => {
  const [stripeLoaded, setStripeLoaded] = useState(false)
  
  // Pre-load Stripe elements as soon as component mounts
  useEffect(() => {
    if (stripePromise) {
      // Touch the promise to start loading
      stripePromise.then(() => {
        setStripeLoaded(true)
      }).catch(error => {
        console.error("Failed to load Stripe:", error)
      })
    }
  }, [stripePromise])

  const options: StripeElementsOptions = {
    clientSecret: paymentSession!.data?.client_secret as string | undefined,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#C6A97C', // Luxury gold
        colorBackground: '#FFFDF8', // Ivory
        colorText: '#43372F', // Luxury charcoal
        borderRadius: '4px',
      },
    },
    loader: 'auto', // Use auto for better performance
  }

  if (!stripeKey) {
    throw new Error(
      "Stripe key is missing. Set NEXT_PUBLIC_STRIPE_KEY environment variable."
    )
  }

  if (!stripePromise) {
    throw new Error(
      "Stripe promise is missing. Make sure you have provided a valid Stripe key."
    )
  }

  if (!paymentSession?.data?.client_secret) {
    throw new Error(
      "Stripe client secret is missing. Cannot initialize Stripe."
    )
  }

  return (
    <StripeContext.Provider value={stripeLoaded}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  )
}

export default StripeWrapper
