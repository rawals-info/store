"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    if (updating || quantity < 1) return
    
    setError(null)
    setUpdating(true)

    try {
      await updateLineItem({
        lineId: item.id,
        quantity,
      })
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update quantity"
      setError(errorMessage)
      setTimeout(() => setError(null), 4000)
    } finally {
      setUpdating(false)
    }
  }

  // Tailored compact preview layout for checkout summary sidebar & mini-cart
  if (type === "preview") {
    return (
      <div
        className="py-3.5 flex items-start gap-3 border-b border-slate-100 last:border-0 group"
        data-testid="product-row"
      >
        {/* Product Image */}
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="relative w-16 h-16 rounded-xl overflow-hidden bg-amber-50/50 border border-amber-200/60 flex-shrink-0 shadow-xs group-hover:border-petha-amber transition-colors"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="full"
            className="object-cover w-full h-full"
          />
          <div className="absolute top-1 right-1 w-3 h-3 rounded-xs bg-white border border-emerald-600 flex items-center justify-center shadow-xs">
            <div className="w-1 h-1 rounded-full bg-emerald-600" />
          </div>
        </LocalizedClientLink>

        {/* Product Info & Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <LocalizedClientLink
              href={`/products/${item.product_handle}`}
              className="font-cormorant text-base sm:text-lg font-bold text-slate-900 hover:text-petha-amber transition-colors line-clamp-2 leading-snug"
              data-testid="product-title"
            >
              {item.product_title}
            </LocalizedClientLink>

            <DeleteButton
              id={item.id}
              data-testid="product-delete-button"
              className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </DeleteButton>
          </div>

          <p className="font-jakarta text-[11px] text-slate-500 mt-0.5">
            {item.variant?.title ? `${item.variant.title} · ` : ""}Authentic Agra Sweet
          </p>

          {/* Stepper and Price Row */}
          <div className="flex items-center justify-between mt-2.5 pt-1">
            {/* Quantity Stepper */}
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => changeQuantity(item.quantity - 1)}
                disabled={updating || item.quantity <= 1}
                className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              
              <span className="font-mono text-xs font-bold w-7 text-center text-slate-900">
                {updating ? "..." : item.quantity}
              </span>

              <button
                type="button"
                onClick={() => changeQuantity(item.quantity + 1)}
                disabled={updating || item.quantity >= 10}
                className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Full layout for the cart page
  return (
    <div
      className="py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group border-b border-slate-100 last:border-0"
      data-testid="product-row"
    >
      {/* Left: Image & Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-amber-50/50 border border-amber-200/60 flex-shrink-0 shadow-sm group-hover:border-petha-amber transition-colors"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="full"
            className="object-cover w-full h-full"
          />
          <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-sm bg-white border border-emerald-600 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </div>
        </LocalizedClientLink>

        <div className="min-w-0 flex-1">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="font-cormorant text-lg sm:text-2xl font-bold text-slate-900 hover:text-petha-amber transition-colors line-clamp-2 leading-snug"
            data-testid="product-title"
          >
            {item.product_title}
          </LocalizedClientLink>

          <p className="font-jakarta text-xs text-slate-500 mt-0.5">
            {item.variant?.title ? `${item.variant.title} · ` : ""}Authentic Agra Sweet
          </p>

          {/* Unit price on mobile */}
          <div className="mt-1 sm:hidden">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>
      </div>

      {/* Right: Quantity Stepper & Price & Delete */}
      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
        
        {/* Quantity Stepper */}
        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => changeQuantity(item.quantity - 1)}
            disabled={updating || item.quantity <= 1}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          
          <span className="font-mono text-xs sm:text-sm font-bold w-9 text-center text-slate-900">
            {updating ? "..." : item.quantity}
          </span>

          <button
            type="button"
            onClick={() => changeQuantity(item.quantity + 1)}
            disabled={updating || item.quantity >= 10}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Total Price (Desktop) */}
        <div className="hidden sm:block text-right min-w-[90px]">
          <div className="font-mono text-lg font-bold text-slate-900">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>

        {/* Delete Button */}
        <DeleteButton
          id={item.id}
          data-testid="product-delete-button"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </DeleteButton>
      </div>
    </div>
  )
}

export default Item
