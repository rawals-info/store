"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { addToCart, applyPromotions } from "@lib/data/cart"
import { usePromotion } from "@lib/context/promotion-context"
import { trackProductView, trackAddToCart } from "@lib/analytics/google-analytics"
import { isEqual } from "@lib/utils/object-utils"
import { Minus, Plus, ShoppingBag, Zap, Check, ShieldCheck, Truck, Sparkles } from "lucide-react"

import AddedToCartModal, { AddedItemDetails } from "@components/AddedToCartModal"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return (variantOptions || []).reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [addedModalOpen, setAddedModalOpen] = useState(false)
  const [addedItemDetails, setAddedItemDetails] = useState<AddedItemDetails | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [manuallySelectedVariant, setManuallySelectedVariant] = useState<HttpTypes.StoreProductVariant | undefined>()
  
  const countryCode = useParams().countryCode as string
  const router = useRouter()
  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const productOptions = useMemo(() => {
    if (product.options && product.options.length > 0) {
      return product.options
    }
    return []
  }, [product])

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      // Find highest priced variant (e.g. 1kg / Family Pack) so bigger size is selected by default
      const highestVariant = product.variants.reduce((highest: any, current: any) => {
        const getAmt = (v: any) => Number(v.calculated_price?.calculated_amount || v.prices?.[0]?.amount || 0)
        return getAmt(current) > getAmt(highest) ? current : highest
      }, product.variants[0])

      const initialOptions = optionsAsKeymap(highestVariant.options)
      setOptions(initialOptions)
      setManuallySelectedVariant(highestVariant)
    }
  }, [product])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return undefined
    }

    if (manuallySelectedVariant) {
      return manuallySelectedVariant
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options, manuallySelectedVariant])

  const { calculatePrice } = usePromotion()

  // Track product view on mount
  useEffect(() => {
    if (product && selectedVariant) {
      const rawPrice = Number(selectedVariant.calculated_price?.calculated_amount || (selectedVariant as any)?.prices?.[0]?.amount || 0)
      const { discountedPrice } = calculatePrice(rawPrice)
      trackProductView({
        id: product.id,
        title: product.title || "Agra Petha",
        handle: product.handle,
        price: discountedPrice,
      })
    }
  }, [product?.id, selectedVariant?.id, calculatePrice])

  const setOptionValue = (optionId: string, value: string) => {
    setManuallySelectedVariant(undefined)
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return

    const rawPrice = Number(selectedVariant.calculated_price?.calculated_amount || (selectedVariant as any)?.prices?.[0]?.amount || 0)
    const { discountedPrice: itemPrice } = calculatePrice(rawPrice)

    // Open Adding Modal
    setAddedItemDetails({
      title: product.title || "Agra Petha",
      variantTitle: selectedVariant.title || "Standard Box",
      thumbnail: product.thumbnail || selectedVariant.product?.thumbnail || "",
      price: rawPrice,
      quantity,
    })
    setAddedModalOpen(true)
    setIsAdding(true)

    // Fire analytics add_to_cart event
    trackAddToCart({
      id: selectedVariant.id,
      title: product.title || "Agra Petha",
      price: itemPrice,
      quantity,
    })

    try {
      const res = await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })

      if (!res?.success) {
        throw new Error(res?.error || "Could not add sweet to box")
      }

      // Update Added Modal with populated cart data
      setAddedItemDetails(prev => prev ? {
        ...prev,
        subtotal: res.cart?.subtotal || undefined,
      } : null)

      // Sync mini-cart state
      if (typeof window !== "undefined" && res?.cart) {
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: {
              cart: res.cart,
              quantity,
              forceOpen: false,
            },
          })
        )
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
      setAddedModalOpen(false)
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) return

    setIsAdding(true)
    try {
      const res = await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })

      if (!res?.success) {
        throw new Error(res?.error || "Failed to proceed to checkout")
      }

      // Fire analytics add_to_cart event
      const rawPrice = Number(selectedVariant.calculated_price?.calculated_amount || (selectedVariant as any)?.prices?.[0]?.amount || 0)
      const { discountedPrice: itemPrice } = calculatePrice(rawPrice)
      trackAddToCart({
        id: selectedVariant.id,
        title: product.title || "Agra Petha",
        price: itemPrice,
        quantity,
      })

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: {
              cart: res.cart || null,
              quantity,
              forceOpen: false,
            },
          })
        )
      }

      router.push(`/${countryCode}/checkout`)
    } catch (error) {
      console.error("Buy now error:", error)
      setIsAdding(false)
    }
  }

  const inStock = selectedVariant ? typeof selectedVariant.inventory_quantity !== 'number' || selectedVariant.inventory_quantity > 0 : true

  return (
    <div ref={actionsRef} className="space-y-6">
      {/* Price Component */}
      <ProductPrice product={product} variantId={selectedVariant?.id} />

      {/* Fresh Batch Urgency Strip */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs font-jakarta">
        <span className="text-amber-900 font-bold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-petha-amber" />
          Fresh Batch Made Today in Agra
        </span>
        <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
          ✈️ Dispatches in 24h
        </span>
      </div>

      {/* Variant / Size Selection */}
      {product.variants && product.variants.length > 1 && (
        <div className="space-y-3">
          {productOptions.length > 0 ? (
            productOptions.map((option) => (
              <OptionSelect
                key={option.id}
                option={option}
                current={options[option.id]}
                updateOption={setOptionValue}
                title={option.title}
                disabled={disabled || false}
                product={product}
              />
            ))
          ) : (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-jakarta block mb-2">
                Select Pack Size:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setManuallySelectedVariant(variant)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-jakarta font-bold transition-all duration-200 cursor-pointer shadow-sm ${
                      selectedVariant?.id === variant.id
                        ? "bg-amber-100/90 border-2 border-petha-amber text-slate-900 ring-2 ring-petha-amber/20"
                        : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-jakarta block mb-2">
          Quantity:
        </span>
        <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 p-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isAdding}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-sm font-bold w-12 text-center text-slate-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            disabled={quantity >= 10 || isAdding}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* High-Converting CTA Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!inStock || isAdding}
          className="w-full bg-petha-amber hover:bg-petha-saffron text-white py-4 px-6 rounded-2xl font-jakarta font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>Buy Now · Instant Checkout</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
          className="w-full bg-white hover:bg-amber-50 text-slate-900 border-2 border-slate-200 hover:border-petha-amber py-3.5 px-6 rounded-2xl font-jakarta font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {addedToCart ? (
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <Check className="w-4 h-4" /> Added to Your Box!
            </div>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-petha-amber" />
              <span>+ Add to Box</span>
            </>
          )}
        </button>
      </div>

      {/* Authenticity Badges */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs font-jakarta text-slate-600">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-petha-amber flex-shrink-0" />
          <span>Same Day Dispatch</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>30-Day Freshness</span>
        </div>
      </div>

      {/* Sticky Mobile Actions */}
      <MobileActions
        product={product}
        options={options}
        variant={selectedVariant}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={disabled || false}
      />

      {/* Added to Box Luxury Modal */}
      <AddedToCartModal
        isOpen={addedModalOpen}
        isAdding={isAdding}
        item={addedItemDetails}
        countryCode={countryCode}
        onClose={() => setAddedModalOpen(false)}
      />
    </div>
  )
}
