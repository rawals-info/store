type CartEventDetail = {
  variantId?: string
  quantity?: number
  forceOpen?: boolean
  cartId?: string
}

const channel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("cart")
    : null

export const announceCart = (detail: CartEventDetail = {}) => {
  if (channel) {
    channel.postMessage(detail)
  }
  // legacy custom event for existing listeners
  window.dispatchEvent(
    new CustomEvent<CartEventDetail>("cartUpdated", { detail })
  )
}

export const addCartListener = (
  callback: (detail: CartEventDetail) => void
): (() => void) => {
  const handler = (e: MessageEvent | CustomEvent<CartEventDetail>) => {
    const detail = (e as any).data || (e as CustomEvent<CartEventDetail>).detail
    callback(detail)
  }

  if (channel) {
    channel.addEventListener("message", handler as any)
  }
  window.addEventListener("cartUpdated", handler as any)

  return () => {
    if (channel) {
      channel.removeEventListener("message", handler as any)
    }
    window.removeEventListener("cartUpdated", handler as any)
  }
} 