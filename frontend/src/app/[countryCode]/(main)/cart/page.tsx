import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { parallelFetch } from "@lib/util/parallel-fetch"
import CartTemplate from "@modules/cart/templates"
import CartSkeleton from "@modules/skeletons/templates/cart-skeleton"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

// Cart reads cookies for cart id and auth, so mark route dynamic to avoid static prerender errors
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Cart | Taj Petha",
  description: "View your cart and proceed to checkout",
}

export default async function Cart() {
  // Fetch cart and customer in parallel
  const [cart, customer] = await parallelFetch([
    async () => {
      try {
        return await retrieveCart(undefined, undefined as any, { fresh: true })
      } catch (error) {
        console.error(error)
        return null
      }
    },
    async () => {
      try {
        return await retrieveCustomer()
      } catch (error) {
        console.error(error)
        return null
      }
    }
  ])

  // Prefetch shipping and payment options in the background to speed-up checkout
  if (cart) {
    // Fire and forget – we don't await the result
    parallelFetch([
      () => import("@lib/data/fulfillment").then(({ listCartShippingMethods }) => listCartShippingMethods(cart.id)),
      () => import("@lib/data/payment").then(({ listCartPaymentMethods }) => listCartPaymentMethods(cart.region?.id ?? "")),
    ], { suppressErrors: true })
  }
  
  // Even if cart is null, we'll render the cart template which will show an empty cart state
  // instead of showing a 404 error page

  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartTemplate cart={cart} customer={customer} />
    </Suspense>
  )
}
