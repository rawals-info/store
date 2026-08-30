"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Check, ShoppingBag, X, Sparkles, ArrowRight } from "lucide-react"
import { formatIndianPrice } from "@lib/util/money"
import { addToCart } from "@lib/data/cart"

export type AddedItemDetails = {
  title: string
  variantTitle?: string
  thumbnail?: string | null
  price: number
  quantity: number
  subtotal?: number
}

type AddedToCartModalProps = {
  isOpen: boolean
  isAdding: boolean
  item: AddedItemDetails | null
  countryCode: string
  onClose: () => void
}

import { triggerPackingSweetBox } from "@components/PackingSweetBoxOverlay"
import { usePromotion } from "@lib/context/promotion-context"

export default function AddedToCartModal({
  isOpen,
  isAdding,
  item,
  countryCode,
  onClose,
}: AddedToCartModalProps) {
  const [mounted, setMounted] = useState(false)
  const [pairings, setPairings] = useState<any[]>([])
  const [addingUpsell, setAddingUpsell] = useState<Record<string, boolean>>({})
  const [addedUpsell, setAddedUpsell] = useState<Record<string, boolean>>({})
  const [extraSubtotal, setExtraSubtotal] = useState(0)
  const { calculatePrice } = usePromotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch live pairings from Medusa database on mount/open
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

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

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
      if (addRes?.cart?.subtotal) {
        setExtraSubtotal(addRes.cart.subtotal)
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { cart: addRes?.cart || null, quantity: 1, forceOpen: false }
        }))
      }
    } catch (e) {
      console.error("Failed to add upsell item:", e)
    } finally {
      setAddingUpsell(prev => ({ ...prev, [pair.id]: false }))
      triggerPackingSweetBox(false)
    }
  }

  if (!mounted) return null

  const currentSubtotal = extraSubtotal || item?.subtotal || (item ? item.price * item.quantity : 0)
  const freeShippingThreshold = 500
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal)

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", damping: 26, stiffness: 360 }}
            className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl border border-amber-200/90 shadow-2xl overflow-hidden z-10 p-5 sm:p-6 text-slate-800 my-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/70 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer z-20"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* STATE 1: Adding In Progress (Compact Loading Pill) */}
            {isAdding ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-3 border-amber-200 border-t-petha-amber animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center text-xl">
                    🍬
                  </span>
                </div>
                <div>
                  <h3 className="font-cormorant text-2xl font-bold text-slate-900">
                    Packing Fresh Sweet...
                  </h3>
                  <p className="font-jakarta text-xs text-slate-500 mt-1">
                    Applying fresh batch guarantee &amp; auto-promotions...
                  </p>
                </div>
              </div>
            ) : (
              /* STATE 2: Added Successfully */
              item && (
                <div className="space-y-4">
                  {/* Header Success Tag */}
                  <div className="flex items-center gap-2 text-emerald-700 font-jakarta text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full w-fit">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Added to Your Sweet Box!</span>
                  </div>

                  {/* Product Preview Box */}
                  <div className="p-3.5 rounded-2xl bg-white border border-amber-100 flex items-center gap-3.5 shadow-xs">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-amber-50 border border-amber-200/60 flex-shrink-0">
                      <Image
                        src={item.thumbnail || "/hero_image.webp"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-cormorant text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                        {item.title}
                      </h4>
                      <p className="font-jakarta text-[11px] text-slate-500">
                        {item.variantTitle || "Standard Box"} · Qty: {item.quantity}
                      </p>
                      {(() => {
                        const itemRaw = item.price * item.quantity
                        const itemPromo = calculatePrice(itemRaw)
                        return (
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
                              ₹{formatIndianPrice(itemPromo.discountedPrice)}
                            </span>
                            {itemPromo.isDiscounted && (
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-xs text-slate-400 line-through">
                                  ₹{formatIndianPrice(itemRaw)}
                                </span>
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-jakarta">
                                  {itemPromo.discountPercent}% OFF
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Free Delivery Bar */}
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs font-jakarta">
                    {neededForFreeShipping === 0 ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <span>🎉</span> You qualify for FREE Nationwide Delivery!
                      </div>
                    ) : (
                      <div className="text-slate-700">
                        Add <span className="font-bold text-petha-amber">₹{Math.round(neededForFreeShipping)}</span> more for <span className="font-bold text-emerald-700">FREE Delivery</span>
                      </div>
                    )}
                  </div>

                  {/* FREQUENTLY PAIRED UPSELL SECTION */}
                  {pairings.length > 0 && (
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-jakarta text-[11px] font-bold text-slate-800 flex items-center gap-1">
                          <span>🎁</span> Customers Also Paired With:
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 font-jakarta">
                          Fresh Agra Batch
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {pairings.filter((u: any) => u.title !== item.title).slice(0, 3).map((pair: any) => {
                          const pairPromo = calculatePrice(pair.price)
                          return (
                            <div
                              key={pair.id}
                              className="p-2 rounded-xl bg-white border border-amber-100 hover:border-amber-200 flex items-center justify-between sm:flex-col sm:items-start gap-2 shadow-2xs"
                            >
                              <div className="flex items-center sm:flex-col sm:items-start gap-2 min-w-0">
                                <div className="relative w-9 h-9 sm:w-full sm:h-16 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0">
                                  <Image
                                    src={pair.thumbnail || "/hero_image.webp"}
                                    alt={pair.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-jakarta text-[11px] font-bold text-slate-900 truncate">
                                    {pair.title}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <span className="font-mono text-[11px] font-bold text-slate-900">
                                      ₹{formatIndianPrice(pairPromo.discountedPrice)}
                                    </span>
                                    {pairPromo.isDiscounted && (
                                      <span className="font-mono text-[9px] text-slate-400 line-through">
                                        ₹{formatIndianPrice(pair.price)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={addingUpsell[pair.id] || addedUpsell[pair.id]}
                                onClick={() => handleAddUpsell(pair)}
                                className={`w-auto sm:w-full py-1 px-2.5 rounded-lg text-[10px] font-bold font-jakarta transition-all flex items-center justify-center gap-1 cursor-pointer flex-shrink-0 ${
                                  addedUpsell[pair.id]
                                    ? "bg-emerald-100 text-emerald-800"
                                    : addingUpsell[pair.id]
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-amber-50 hover:bg-petha-amber hover:text-white text-slate-800 border border-amber-200/80"
                                }`}
                              >
                                {addedUpsell[pair.id]
                                  ? "✓ Added"
                                  : addingUpsell[pair.id]
                                  ? "Adding..."
                                  : "+ Add"}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-amber-50 border border-amber-200 font-jakarta text-xs font-bold text-slate-800 transition-colors cursor-pointer text-center"
                    >
                      ← Keep Shopping
                    </button>

                    <Link
                      href={`/${countryCode}/cart`}
                      onClick={onClose}
                      className="w-full py-2.5 px-3 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 text-center cursor-pointer"
                    >
                      <span>View Box &amp; Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
