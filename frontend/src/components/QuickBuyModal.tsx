"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { addToCart, applyPromotions } from "@lib/data/cart"
import { trackProductView, trackAddToCart } from "@lib/analytics/google-analytics"
import { X, ShoppingBag, Check, Minus, Plus, Sparkles } from "lucide-react"
import Image from "next/image"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { formatIndianPrice } from "@lib/util/money"
import { useParams, useRouter } from "next/navigation"

interface QuickBuyModalProps {
  product: HttpTypes.StoreProduct
  region?: HttpTypes.StoreRegion
  isOpen: boolean
  onClose: () => void
}

// Popular pairing recommendations for upsell
const UPSELL_SNACKS = [
  {
    title: "Special Agra Dalmoth",
    handle: "dalmoth",
    price: "₹220",
    image: "/images/dalmoth.webp",
    tag: "Authentic Dalmoth",
  },
  {
    title: "Special Masala Peanuts",
    handle: "masala-peanuts",
    price: "₹140",
    image: "/images/namkeen.webp",
    tag: "Crispy Namkeen",
  },
  {
    title: "Kesar Dry Petha",
    handle: "kesar-dry-petha",
    price: "₹240",
    image: "/hero_petha_square.webp",
    tag: "Royal Sweet",
  },
]

export default function QuickBuyModal({ product, region, isOpen, onClose }: QuickBuyModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [addedUpsell, setAddedUpsell] = useState<Record<string, boolean>>({})
  const countryCode = useParams().countryCode as string
  const router = useRouter()

  // Set default variant to the bigger size / highest-price pack first
  useEffect(() => {
    if (isOpen && product?.variants && product.variants.length > 0) {
      const highestVariant = product.variants.reduce((highest: any, current: any) => {
        const getAmt = (v: any) => Number(v.calculated_price?.calculated_amount || v.prices?.[0]?.amount || 0)
        return getAmt(current) > getAmt(highest) ? current : highest
      }, product.variants[0])

      setSelectedVariant(highestVariant?.id || product.variants[0].id!)
    }
  }, [isOpen, product])

  // Track product view when modal opens
  useEffect(() => {
    if (isOpen && product) {
      trackProductView({
        id: product.id,
        title: product.title || "Agra Petha",
        handle: product.handle,
        price: discountedPrice,
      })
    }
  }, [isOpen, product?.id])

  if (!isOpen || !product) return null

  // Calculate price based on selected variant
  const { cheapestPrice, variantPrice } = getProductPrice({ 
    product, 
    variantId: selectedVariant 
  })
  
  const displayPrice = variantPrice || cheapestPrice
  const rawPrice = displayPrice?.calculated_price_number || 249
  const discountedPrice = Math.round(rawPrice * 0.8 * 100) / 100 // SWEET20 applied (20% off)

  const handleAddToCart = async () => {
    if (!selectedVariant) return

    setIsAdding(true)
    try {
      const res = await addToCart({
        variantId: selectedVariant,
        quantity,
        countryCode,
      })

      if (!res?.success) {
        throw new Error(res?.error || "Could not add sweet to box")
      }

      try {
        await applyPromotions(["SWEET20"])
      } catch (promoError) {
        console.warn("Coupon note:", promoError)
      }

      // Fire analytics add_to_cart event
      trackAddToCart({
        id: selectedVariant,
        title: product.title || "Agra Petha",
        price: discountedPrice,
        quantity,
      })

      setShowSuccess(true)
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { quantity, forceOpen: true }
        }))
      }

      setTimeout(() => {
        onClose()
        setShowSuccess(false)
        setQuantity(1)
      }, 1200)
    } catch (error) {
      console.error("Failed to add to cart:", error)
      alert("Could not add item to cart. Please try again.")
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedVariant) return

    setIsAdding(true)
    try {
      const res = await addToCart({
        variantId: selectedVariant,
        quantity,
        countryCode,
      })

      if (!res?.success) {
        throw new Error(res?.error || "Could not add sweet to box")
      }

      try {
        await applyPromotions(["SWEET20"])
      } catch (promoError) {}

      // Fire analytics add_to_cart event
      trackAddToCart({
        id: selectedVariant,
        title: product.title || "Agra Petha",
        price: discountedPrice,
        quantity,
      })

      router.push(`/${countryCode}/checkout`)
    } catch (error) {
      console.error("Failed to add to cart:", error)
      alert("Could not proceed to checkout. Please try again.")
      setIsAdding(false)
    }
  }

  const handleAddUpsell = async (upsellTitle: string) => {
    try {
      const res = await fetch(`/api/search-suggest?q=${encodeURIComponent(upsellTitle)}&countryCode=${countryCode}`)
      const data = await res.json()
      const matchedProd = data.products?.[0]
      const variantId = matchedProd?.variants?.[0]?.id

      if (variantId) {
        await addToCart({
          variantId,
          quantity: 1,
          countryCode,
        })
        setAddedUpsell(prev => ({ ...prev, [upsellTitle]: true }))
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { quantity: 1, forceOpen: false }
          }))
        }
      }
    } catch (e) {
      console.error("Failed to add upsell sweet:", e)
    }
  }

  return (
    <>
      {/* Backdrop with smooth blur */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="fixed inset-x-3 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-[101] animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto border border-amber-100 flex flex-col">
          
          {/* Header Bar - Solid white & high z-index so nothing leaks when scrolling */}
          <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-3.5 flex items-center justify-between z-30 shadow-xs rounded-t-3xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-cormorant text-xl font-bold text-slate-900">
                Fresh Agra Dispatch Order
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-7 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              
              {/* Product Visual */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-amber-50/50 border border-amber-100/80 shadow-sm">
                <Thumbnail
                  thumbnail={product.thumbnail}
                  images={product.images}
                  size="full"
                  className="object-cover w-full h-full"
                />
                
                {/* Discount Tag */}
                <div className="absolute top-3 left-3 z-[2] px-2.5 py-1 rounded-full bg-emerald-600 text-white font-jakarta text-[11px] font-bold shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  20% OFF (SWEET20)
                </div>

                {/* Veg Symbol */}
                <div className="absolute top-3 right-3 z-[2] w-5 h-5 rounded-md bg-white border border-emerald-600 flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                </div>
              </div>

              {/* Product Details & Selection */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                    {product.title}
                  </h3>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-2.5 mt-2 mb-3">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">
                      ₹{formatIndianPrice(discountedPrice)}
                    </span>
                    <span className="font-mono text-base text-slate-400 line-through">
                      ₹{formatIndianPrice(rawPrice)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-jakarta">
                      Save ₹{formatIndianPrice(rawPrice - discountedPrice)} (20% OFF)
                    </span>
                  </div>

                  {/* Urgency Strip */}
                  <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-2.5 mb-4 flex items-center justify-between text-xs font-jakarta">
                    <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                      <span>⚡</span> Fresh Batch Made Today
                    </span>
                    <span className="text-emerald-700 font-bold">
                      ✈️ Ships in 24h
                    </span>
                  </div>

                  {/* Size / Variant Options */}
                  {product.variants && product.variants.length > 1 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-jakarta">
                          Select Pack Size:
                        </label>
                        <span className="text-[11px] font-semibold text-emerald-700 font-jakarta">
                          💡 Bigger pack = Extra Savings
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant) => {
                          const vAny = variant as any
                          const rawAmt = Number(vAny?.calculated_price?.calculated_amount || vAny?.prices?.[0]?.amount || 0)
                          const variantDisc = Math.round(rawAmt * 0.8 * 100) / 100
                          const isLargest = product.variants && product.variants.length > 1 && variant.id === product.variants.reduce((max: any, cur: any) => {
                            const curAmt = Number((cur as any)?.calculated_price?.calculated_amount || (cur as any)?.prices?.[0]?.amount || 0)
                            const maxAmt = Number((max as any)?.calculated_price?.calculated_amount || (max as any)?.prices?.[0]?.amount || 0)
                            return curAmt > maxAmt ? cur : max
                          }, product.variants[0])?.id

                          return (
                            <button
                              key={variant.id}
                              type="button"
                              onClick={() => setSelectedVariant(variant.id!)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-jakarta transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                                selectedVariant === variant.id
                                  ? 'bg-amber-50 border-2 border-petha-amber text-amber-950 shadow-sm'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <span>{variant.title}</span>
                              {variantDisc > 0 && (
                                <span className={`text-[11px] font-mono font-medium ${selectedVariant === variant.id ? 'text-amber-800' : 'text-slate-500'}`}>
                                  ₹{formatIndianPrice(variantDisc)}
                                </span>
                              )}
                              {isLargest && (
                                <span className="bg-amber-200/90 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-tight">
                                  Best Value
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Stepper */}
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-jakarta">
                      Quantity:
                    </label>
                    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50/50 p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-sm font-bold w-10 text-center text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="space-y-2.5">
                  {showSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-center gap-2 text-emerald-800 font-jakarta font-bold text-sm">
                      <Check className="w-5 h-5 text-emerald-600" />
                      Added to Cart with 20% Discount!
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={isAdding}
                        className="w-full bg-petha-amber hover:bg-petha-saffron text-white py-3.5 px-6 rounded-2xl font-jakarta font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        {isAdding ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            Buy Now · Instant Checkout
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="w-full bg-white hover:bg-amber-50 text-slate-900 border-2 border-slate-200 hover:border-petha-amber py-3 px-6 rounded-2xl font-jakarta font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        + Add to Cart
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* UPSELL: Frequently Paired Agra Sweets & Snacks */}
            <div className="pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="font-jakarta text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>🎁</span> Frequently Added Together:
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold font-jakarta">
                  Eligible for Free Shipping
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {UPSELL_SNACKS.filter(u => u.title !== product.title).slice(0, 3).map((item) => (
                  <div
                    key={item.title}
                    className="p-2.5 rounded-2xl bg-amber-50/40 border border-amber-100 hover:border-amber-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-amber-200/60 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-jakarta text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </p>
                        <p className="font-mono text-[11px] font-semibold text-petha-amber">
                          {item.price}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddUpsell(item.title)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-jakarta transition-colors flex-shrink-0 cursor-pointer ${
                        addedUpsell[item.title]
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-white border border-amber-300 hover:bg-petha-amber hover:text-white text-slate-800"
                      }`}
                    >
                      {addedUpsell[item.title] ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Footer */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-3 border-t border-slate-100 text-[11px] font-jakarta font-semibold text-slate-500">
              <span className="flex items-center gap-1">🌱 100% Pure Vegetarian</span>
              <span className="flex items-center gap-1">🛡️ FSSAI Certified</span>
              <span className="flex items-center gap-1">✈️ Express Air Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
