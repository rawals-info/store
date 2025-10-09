"use server"

import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { parallelFetch } from "@lib/util/parallel-fetch"
import { HttpTypes } from "@medusajs/types"

export interface CheckoutInitialData {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: HttpTypes.StoreCartShippingOption[]
  paymentProviders: HttpTypes.StorePaymentProvider[]
}

/**
 * Fetch cart, customer, shipping options and payment providers in one consolidated server action.
 * Returns empty arrays for shipping/payment if cart is missing.
 * Always fetches fresh data to ensure checkout has latest cart state.
 */
export async function getCheckoutInitialData(): Promise<CheckoutInitialData> {
  const [cart, customer] = await parallelFetch<[
    HttpTypes.StoreCart | null,
    HttpTypes.StoreCustomer | null
  ]>([
    () => retrieveCart(undefined, undefined as any, { fresh: true }),
    () => retrieveCustomer(),
  ], { suppressErrors: true })

  if (!cart) {
    return {
      cart: null,
      customer,
      shippingMethods: [],
      paymentProviders: [],
    }
  }

  const [shippingMethods, paymentProviders] = await parallelFetch<[
    HttpTypes.StoreCartShippingOption[],
    HttpTypes.StorePaymentProvider[]
  ]>([
    () => listCartShippingMethods(cart.id),
    () => listCartPaymentMethods(cart.region?.id ?? ""),
  ])

  return {
    cart,
    customer,
    shippingMethods: shippingMethods ?? [],
    paymentProviders: paymentProviders ?? [],
  }
} 