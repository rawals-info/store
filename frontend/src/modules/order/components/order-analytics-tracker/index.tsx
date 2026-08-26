"use client"

import { useEffect, useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import { trackPurchase } from "@lib/analytics/google-analytics"

interface OrderAnalyticsTrackerProps {
  order: HttpTypes.StoreOrder
}

export default function OrderAnalyticsTracker({ order }: OrderAnalyticsTrackerProps) {
  const trackedRef = useRef(false)

  useEffect(() => {
    if (!order || trackedRef.current) return
    trackedRef.current = true

    const city = order.shipping_address?.city || ""
    const state = order.shipping_address?.province || ""
    const items = (order.items || []).map((item) => ({
      item_id: item.variant_id || item.id,
      item_name: item.title || item.product_title || "Agra Petha",
      category: "Agra Sweets",
      quantity: item.quantity,
      price: item.unit_price || 0,
    }))

    trackPurchase({
      transaction_id: order.display_id ? `#${order.display_id}` : order.id,
      value: order.total || 0,
      currency: order.currency_code || "INR",
      shipping: order.shipping_total || 0,
      coupon: (order as any).promotions?.[0]?.code || (order as any).discounts?.[0]?.code || undefined,
      items,
      city,
      state,
    })
  }, [order])

  return null
}
