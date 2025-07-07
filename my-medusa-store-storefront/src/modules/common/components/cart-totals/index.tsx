"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    shipping_subtotal?: number | null
  },
  placeholder?: string
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals, placeholder = "Contact for price" }) => {
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal,
  } = totals

  return (
    <div>
      <div className="flex flex-col gap-y-2 text-[#8a7f72]">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            Subtotal (excl. shipping and taxes)
          </span>
          <span data-testid="cart-subtotal" data-value={subtotal || 0}>
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span
              className="text-[#43372f]"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {shipping_subtotal && shipping_subtotal > 0
              ? convertToLocale({ amount: shipping_subtotal, currency_code })
              : placeholder}
          </span>
        </div>
        <div className="flex justify-between items-start">
          <span className="flex gap-x-1 items-center mt-[2px]">Taxes</span>
          <span
            className={`${!(tax_total && tax_total > 0) ? "text-sm text-right max-w-[220px] text-[#8a7f72]" : ""}`}
            data-testid="cart-taxes"
            data-value={tax_total || 0}
          >
            {tax_total && tax_total > 0
              ? convertToLocale({ amount: tax_total, currency_code })
              : placeholder}
          </span>
        </div>
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span>Gift card</span>
            <span
              className="text-[#43372f]"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </span>
          </div>
        )}
      </div>
      <div className="h-px w-full border-b border-[#e2d9cf] my-4" />
      <div className="flex items-center justify-between text-[#43372f] mb-2 font-medium">
        <span>Total</span>
        <span
          className="text-xl font-bold"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
      <div className="h-px w-full border-b border-[#e2d9cf] mt-4" />
    </div>
  )
}

export default CartTotals
