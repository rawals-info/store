"use client"

import { convertToLocale } from "@lib/util/money"
import { STORE_PROMOTION } from "@lib/config/promotions"
import React from "react"

interface CartTotalsProps {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    shipping_subtotal?: number | null
    promotions?: any[]
  },
  placeholder?: string,
  shippingPlaceholder?: string,
  taxPlaceholder?: string
}

const CartTotals: React.FC<CartTotalsProps> = ({
  totals,
  placeholder = "Continue for price",
  shippingPlaceholder,
  taxPlaceholder
}) => {
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal,
    promotions,
  } = totals

  // Calculate the itemsSubtotal (products only, excluding shipping)
  const itemsSubtotal = (subtotal ?? 0) - (shipping_subtotal ?? 0)

  // Use specific placeholders if provided, otherwise fall back to the general placeholder
  const finalShippingPlaceholder = shippingPlaceholder || placeholder
  const finalTaxPlaceholder = taxPlaceholder || placeholder

  const promoCodeName = promotions?.[0]?.code

  return (
    <div>
      <div className="flex flex-col gap-y-2.5 text-xs font-jakarta text-slate-600">
        <div className="flex items-center justify-between">
          <span>Subtotal (Items)</span>
          <span className="font-mono text-sm font-bold text-slate-800" data-testid="cart-subtotal" data-value={itemsSubtotal || 0}>
            {convertToLocale({ amount: itemsSubtotal ?? 0, currency_code })}
          </span>
        </div>

        {!!discount_total && (
          <div className="flex items-center justify-between text-emerald-700 font-semibold">
            <span>Special Discount {promoCodeName ? `(${promoCodeName})` : ""}</span>
            <span
              className="font-mono text-sm font-bold"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              - {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <span>Shipping &amp; Handling</span>
          {shipping_subtotal && shipping_subtotal > 0 ? (
            <span className="font-mono text-xs font-semibold text-slate-800" data-testid="cart-shipping" data-value={shipping_subtotal}>
              {convertToLocale({ amount: shipping_subtotal, currency_code })}
            </span>
          ) : (
            <span className="font-jakarta text-xs font-medium text-slate-500" data-testid="cart-shipping" data-value={0}>
              {finalShippingPlaceholder}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span>GST / Taxes</span>
          <span
            className="text-xs font-semibold text-emerald-700"
            data-testid="cart-taxes"
            data-value={tax_total || 0}
          >
            {tax_total && tax_total > 0
              ? convertToLocale({ amount: tax_total, currency_code })
              : finalTaxPlaceholder}
          </span>
        </div>

        {!!gift_card_total && (
          <div className="flex items-center justify-between text-emerald-700 font-semibold">
            <span>Gift card</span>
            <span
              className="font-mono text-sm font-bold"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              - {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </span>
          </div>
        )}
      </div>

      <div className="h-px w-full bg-slate-100 my-3.5" />

      <div className="flex items-center justify-between text-slate-900">
        <span className="font-jakarta text-sm font-bold">Estimated Total</span>
        <span
          className="font-mono text-2xl font-bold text-slate-900"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
