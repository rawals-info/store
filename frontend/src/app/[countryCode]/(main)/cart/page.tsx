import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { setCartId } from "@lib/data/cookies"
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

type Props = {
  searchParams?: Promise<{ cart_id?: string }>
}

export default async function Cart({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const queryCartId = resolvedSearchParams?.cart_id

  const [cart, customer] = await Promise.all([
    retrieveCart(queryCartId, undefined, { fresh: true }).catch((err) => {
      console.error("[Cart Page] Error retrieving cart:", err)
      return null
    }),
    retrieveCustomer().catch((err) => {
      console.error("[Cart Page] Error retrieving customer:", err)
      return null
    }),
  ])

  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartTemplate cart={cart} customer={customer} />
    </Suspense>
  )
}
