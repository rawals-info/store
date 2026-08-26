"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { addToCart, applyPromotions } from "@lib/data/cart"
import { trackProductView, trackAddToCart } from "@lib/analytics/google-analytics"
import { isEqual } from "@lib/utils/object-utils"
import { Minus, Plus, ShoppingBag, Zap, Check, ShieldCheck, Truck, Sparkles } from "lucide-react"

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
    if (product) {
      const defaultOptions: Record<string, string | undefined> = {}
      if (productOptions.length > 0) {
        productOptions.forEach(option => {
          if (option.values?.length) {
            defaultOptions[option.id] = option.values[0].value || undefined
          }
        })
        if (product.variants?.length === 1 && product.variants[0].options) {
          const variantOptions = optionsAsKeymap(product.variants[0].options)
          Object.assign(defaultOptions, variantOptions)
        }
        if (Object.keys(defaultOptions).length > 0) {
          setOptions(defaultOptions)
        }
      } else {
        if (product.variants && product.variants.length > 0) {
          setManuallySelectedVariant(product.variants[0])
        }
      }
    }
  }, [product, productOptions])

  const selectedVariant = useMemo(() => {
    if (manuallySelectedVariant) return manuallySelectedVariant
    if (!product.variants || product.variants.length === 0) return

    if (product.options && product.options.length > 0) {
      const variant = product.variants.find((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, options)
      })
      return variant || product.variants[0]
    }
    return product.variants[0]
  }, [product, options, manuallySelectedVariant])

  // Track product view on mount
  useEffect(() => {
    if (product) {
      const price = selectedVariant?.calculated_price?.calculated_amount || 249
      trackProductView({
        id: product.id,
        title: product.title || "Agra Petha",
        handle: product.handle,
        price,
      })
    }
  }, [product?.id])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return
    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })

      try {
        await applyPromotions(["SWEET20"])
      } catch (e) {}

      // Fire analytics add_to_cart event
      const itemPrice = selectedVariant.calculated_price?.calculated_amount || 249
      trackAddToCart({
        id: selectedVariant.id,
        title: product.title || "Agra Petha",
        price: itemPrice,
        quantity,
      })

      setAddedToCart(true)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { quantity, forceOpen: true } }))
      }
      setTimeout(() => setAddedToCart(false), 2500)
    } catch (error) {
      console.error("Cart error:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) return
    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })

      try {
        await applyPromotions(["SWEET20"])
      } catch (e) {}

      // Fire analytics add_to_cart event
      const itemPrice = selectedVariant.calculated_price?.calculated_amount || 249
      trackAddToCart({
        id: selectedVariant.id,
        title: product.title || "Agra Petha",
        price: itemPrice,
        quantity,
      })

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
    </div>
  )
}
