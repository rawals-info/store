"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { addToCart, applyPromotions } from "@lib/data/cart"
import { trackProductView, trackAddToCart } from "@lib/analytics/google-analytics"
import { X, ShoppingBag, Check, Minus, Plus, Sparkles, Truck, ShieldCheck } from "lucide-react"
import Image from "next/image"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { formatIndianPrice } from "@lib/util/money"
import { usePromotion } from "@lib/context/promotion-context"
import { useParams, useRouter } from "next/navigation"

import AddedToCartModal, { AddedItemDetails } from "./AddedToCartModal"
import { triggerPackingSweetBox } from "./PackingSweetBoxOverlay"

interface QuickBuyModalProps {
  product: HttpTypes.StoreProduct
  region?: HttpTypes.StoreRegion
  isOpen: boolean
  onClose: () => void
}

export default function QuickBuyModal({ product, region, isOpen, onClose }: QuickBuyModalProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAddedModal, setShowAddedModal] = useState(false)
  const [addedItemDetails, setAddedItemDetails] = useState<AddedItemDetails | null>(null)
  const [pairings, setPairings] = useState<any[]>([])
  const [addedUpsell, setAddedUpsell] = useState<Record<string, boolean>>({})
  const [addingUpsell, setAddingUpsell] = useState<Record<string, boolean>>({})

  const params = useParams()
  const router = useRouter()
  const countryCode = (params?.countryCode as string) || "in"

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch live pairings from Medusa database on modal open
  useEffect(() => {
    if (isOpen && pairings.length === 0) {
      fetch(`/api/products/popular?limit=6&countryCode=${countryCode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.products) {
            setPairings(data.products)
          }
        })
        .catch((err) => console.error("Error loading pairings:", err))
    }
  }, [isOpen, countryCode, pairings.length])

  // Lock background body scroll & add escape key listener when open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = "hidden"
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose()
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => {
        document.body.style.overflow = originalStyle
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [isOpen, onClose])

  // Set default variant to the bigger size / highest-price pack first
  useEffect(() => {
    if (isOpen && product?.variants && product.variants.length > 0) {
      const highestVariant = product.variants.reduce((highest: any, current: any) => {
        const getAmt = (v: any) => Number(v.calculated_price?.calculated_amount || (v as any).prices?.[0]?.amount || 0)
        return getAmt(current) > getAmt(highest) ? current : highest
      }, product.variants[0])

      setSelectedVariant(highestVariant?.id || product.variants[0].id!)
    }
  }, [isOpen, product])

  // Calculate price based on selected variant
  const { calculatePrice } = usePromotion()
  const activeVariant = product?.variants?.find((v) => v.id === selectedVariant) || product?.variants?.[0]
  const rawPrice = Number(activeVariant?.calculated_price?.calculated_amount || (activeVariant as any)?.prices?.[0]?.amount || 0)
  const { discountedPrice, isDiscounted, savings, discountPercent, promoCode } = calculatePrice(rawPrice)

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
  }, [isOpen, product?.id, discountedPrice])

  const handleAddToCart = async () => {
    if (!selectedVariant) return

    setIsAdding(true)

    // Fire analytics add_to_cart event
    trackAddToCart({
      id: selectedVariant,
      title: product.title || "Agra Petha",
      price: discountedPrice,
      quantity,
    })

    try {
      const res = await addToCart({
        variantId: selectedVariant,
        quantity,
        countryCode,
      })

      if (!res?.success) {
        throw new Error(res?.error || "Could not add sweet to box")
      }

      // Close quick buy modal and show AddedToCart luxury modal
      onClose()
      setAddedItemDetails({
        title: product.title || "Agra Petha",
        variantTitle: activeVariant?.title || "Standard Box",
        thumbnail: product.thumbnail || "",
        price: discountedPrice,
        quantity,
        subtotal: res.cart?.subtotal || undefined,
      })
      setShowAddedModal(true)
      setQuantity(1)

      // Open dropdown WITH the populated cart payload
      if (typeof window !== 'undefined' && res?.cart) {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { cart: res.cart, quantity, forceOpen: false }
        }))
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
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

      // Fire analytics add_to_cart event
      trackAddToCart({
        id: selectedVariant,
        title: product.title || "Agra Petha",
        price: discountedPrice,
        quantity,
      })

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { cart: res.cart || null, quantity, forceOpen: false }
        }))
      }

      router.push(`/${countryCode}/checkout`)
    } catch (error) {
      console.error("Failed to add to cart:", error)
      alert("Could not proceed to checkout. Please try again.")
      setIsAdding(false)
    }
  }

  const handleAddUpsell = async (pair: any) => {
    if (!pair?.variantId) return
    setAddingUpsell(prev => ({ ...prev, [pair.id]: true }))
    triggerPackingSweetBox(true, `Adding ${pair.title} to box ✨`)
    try {
      const addRes = await addToCart({
        variantId: pair.variantId,
        quantity: 1,
        countryCode,
      })
      setAddedUpsell(prev => ({ ...prev, [pair.id]: true }))
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { cart: addRes?.cart || null, quantity: 1, forceOpen: false }
        }))
      }
    } catch (e) {
      console.error("Failed to add upsell sweet:", e)
    } finally {
      setAddingUpsell(prev => ({ ...prev, [pair.id]: false }))
      triggerPackingSweetBox(false)
    }
  }

  if (!mounted || !product) return null

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              {/* Backdrop with smooth blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="fixed inset-0 bg-slate-950/65 backdrop-blur-md"
                onClick={onClose}
              />

              {/* Modal Card with smooth scale & position transition */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ type: "spring", damping: 26, stiffness: 360, mass: 0.8 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-100/90 flex flex-col max-h-[90vh] overflow-hidden my-auto z-10"
              >
                {/* COMPACT SLEEK FLOATING LOADING CARD */}
                <AnimatePresence>
                  {isAdding && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        className="bg-[#FFFDF9] rounded-2xl border border-amber-200/90 shadow-2xl px-5 py-4 flex items-center gap-3.5 max-w-xs w-auto text-left"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 rounded-full border-2 border-amber-200 border-t-petha-amber animate-spin" />
                          <span className="absolute inset-0 flex items-center justify-center text-sm">
                            🍬
                          </span>
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-jakarta text-xs font-bold text-slate-900 leading-tight">
                            Packing Sweet Box...
                          </h4>
                          <p className="font-jakarta text-[10px] text-slate-500 truncate mt-0.5">
                            Securing fresh batch guarantee ✨
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Header Bar */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-slate-100 px-5 py-4 flex items-center justify-between z-30 shadow-xs rounded-t-3xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="font-cormorant text-xl sm:text-2xl font-bold text-slate-900">
                      Fresh Agra Dispatch Order
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
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
                      {isDiscounted && (
                        <div className="absolute top-3 left-3 z-[2] px-2.5 py-1 rounded-full bg-emerald-600 text-white font-jakarta text-[11px] font-bold shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {discountPercent}% OFF {promoCode ? `(${promoCode})` : ""}
                        </div>
                      )}

                      {/* Veg Symbol */}
                      <div className="absolute top-3 right-3 z-[2] w-5 h-5 rounded-md bg-white border border-emerald-600 flex items-center justify-center shadow-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    {/* Product Details & Selection */}
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                          {product.title}
                        </h3>

                        {/* Price Row */}
                        <div className="flex items-baseline gap-2.5 mt-2 mb-3 flex-wrap">
                          <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">
                            ₹{formatIndianPrice(discountedPrice)}
                          </span>
                          {isDiscounted && (
                            <>
                              <span className="font-mono text-base text-slate-400 line-through">
                                ₹{formatIndianPrice(rawPrice)}
                              </span>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-jakarta">
                                Save ₹{formatIndianPrice(savings)} ({discountPercent}% OFF)
                              </span>
                            </>
                          )}
                        </div>

                        {/* Urgency Strip */}
                        <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-2.5 mb-4 flex items-center justify-between text-xs font-jakarta">
                          <span className="text-amber-900 font-semibold flex items-center gap-1.5">
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
                                const { discountedPrice: variantDisc } = calculatePrice(rawAmt)
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
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold font-jakarta transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${selectedVariant === variant.id
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
                              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono text-sm font-bold w-10 text-center text-slate-900">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(Math.min(10, quantity + 1))}
                              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
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
                            Added to Sweet Box {discountPercent > 0 ? `with ${discountPercent}% Discount!` : "Successfully!"}
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
                              + Add to Sweet Box
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

                    {pairings.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {pairings.filter((u: any) => u.title !== product.title).slice(0, 3).map((item: any) => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-2xl bg-amber-50/40 border border-amber-100 hover:border-amber-200 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-amber-200/60 flex-shrink-0">
                                <Image
                                  src={item.thumbnail || "/hero_image.webp"}
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
                                  {item.priceFormatted || `₹${item.price}`}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={addingUpsell[item.id] || addedUpsell[item.id]}
                              onClick={() => handleAddUpsell(item)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold font-jakarta transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${addedUpsell[item.id]
                                  ? "bg-emerald-100 text-emerald-800"
                                  : addingUpsell[item.id]
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-white border border-amber-300 hover:bg-petha-amber hover:text-white text-slate-800"
                                }`}
                            >
                              {addingUpsell[item.id] ? (
                                <>
                                  <div className="w-3 h-3 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
                                  <span>Packing...</span>
                                </>
                              ) : addedUpsell[item.id] ? (
                                "✓ Added"
                              ) : (
                                "+ Add"
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trust Footer */}
                  <div className="flex flex-wrap items-center justify-center gap-6 pt-3 border-t border-slate-100 text-[11px] font-jakarta font-semibold text-slate-500">
                    <span className="flex items-center gap-1">🌱 100% Pure Vegetarian</span>
                    <span className="flex items-center gap-1">🛡️ FSSAI Certified</span>
                    <span className="flex items-center gap-1">✈️ Express Shipping</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <AddedToCartModal
        isOpen={showAddedModal}
        isAdding={isAdding}
        item={addedItemDetails}
        countryCode={countryCode}
        onClose={() => setShowAddedModal(false)}
      />
    </>
  )
}

