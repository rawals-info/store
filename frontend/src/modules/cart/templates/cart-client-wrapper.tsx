"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"
import { ProductTrustBadges } from "@components/TrustBadges"
import { addToCart } from "@lib/data/cart"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { triggerPackingSweetBox } from "@components/PackingSweetBoxOverlay"
import { usePromotion } from "@lib/context/promotion-context"
import { formatIndianPrice } from "@lib/util/money"

const CartClientWrapper = ({
  initialCart,
  customer,
}: {
  initialCart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(initialCart)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [addingUpsell, setAddingUpsell] = useState<Record<string, boolean>>({})
  const [upsellProducts, setUpsellProducts] = useState<any[]>([])
  const { activePromo, calculatePrice } = usePromotion()
  const autoAppliedRef = useRef(false)
  const router = useRouter()

  // Auto-apply active coupon (e.g. TAJ10) if cart has items and no promo applied
  useEffect(() => {
    if (autoAppliedRef.current) return
    const promoCodeToApply = activePromo?.code || "TAJ10"

    if (cart && cart.items && cart.items.length > 0 && (!cart.promotions || cart.promotions.length === 0)) {
      autoAppliedRef.current = true
      fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCodeToApply }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.cart) {
            setCart(data.cart)
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart: data.cart } }))
            }
          }
        })
        .catch((err) => console.log("[Auto-Coupon] Handled:", err))
    }
  }, [cart?.items?.length, activePromo?.code, cart?.promotions?.length])

  // Fetch dynamic pairing products from backend
  useEffect(() => {
    fetch("/api/products/popular?limit=4&countryCode=in")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products) {
          setUpsellProducts(data.products)
        }
      })
      .catch((err) => console.error("Error loading cart upsells:", err))
  }, [])

  // Sync state if server prop changes
  useEffect(() => {
    if (initialCart) {
      setCart(initialCart)
    }
  }, [initialCart])

  // Real-time listener for cart changes dispatched anywhere in the app
  useEffect(() => {
    const handleCartUpdate = (e: CustomEvent) => {
      if (e.detail?.cart) {
        setCart(e.detail.cart)
      } else {
        refreshCart()
      }
    }

    window.addEventListener("cartUpdated" as any, handleCartUpdate)
    return () => {
      window.removeEventListener("cartUpdated" as any, handleCartUpdate)
    }
  }, [])

  // Refresh cart from server directly if needed
  const refreshCart = async () => {
    try {
      setIsRefreshing(true)
      const res = await fetch("/api/cart")
      if (res.ok) {
        const data = await res.json()
        if (data.cart) {
          setCart(data.cart)
        }
      }
    } catch (e) {
      console.error("Failed to refresh cart in client:", e)
    } finally {
      setIsRefreshing(false)
    }
  }

  const itemsSubtotal = (cart?.item_subtotal ?? ((cart?.subtotal ?? 0) - (cart?.shipping_subtotal ?? 0)))
  const discountTotal = cart?.discount_total ?? 0
  const netItemsTotal = Math.max(0, itemsSubtotal - discountTotal)
  const freeShippingThreshold = 500
  const isFreeShipping = netItemsTotal >= freeShippingThreshold
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - Math.round(netItemsTotal))

  const handleAddUpsell = async (item: any) => {
    if (!item?.variantId) return
    setAddingUpsell(prev => ({ ...prev, [item.id]: true }))
    triggerPackingSweetBox(true, `Adding ${item.title} to sweet box ✨`)
    try {
      const addRes = await addToCart({
        variantId: item.variantId,
        quantity: 1,
        countryCode: "in",
      })

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: {
              cart: addRes?.cart || null,
              quantity: 1,
              forceOpen: false,
            },
          })
        )
      }
    } catch (e) {
      console.error("Failed to add pairing item:", e)
    } finally {
      setAddingUpsell(prev => ({ ...prev, [item.id]: false }))
      triggerPackingSweetBox(false)
    }
  }

  return (
    <div className="w-full py-6 sm:py-10 font-jakarta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="cart-container">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[{ label: "Shopping Box & Cart", isCurrent: true }]}
          countryCode="in"
          className="rounded-2xl border border-amber-200/60 shadow-xs mb-8 bg-white/70 backdrop-blur-xs"
        />

        {/* Loading Spinner */}
        {isRefreshing && (
          <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3 border border-amber-200/60">
              <div className="w-5 h-5 border-2 border-t-transparent border-petha-amber rounded-full animate-spin" />
              <span className="text-slate-800 font-jakarta font-bold text-sm">Updating fresh box...</span>
            </div>
          </div>
        )}
        
        {cart && cart.items && cart.items.length > 0 ? (
          <div className="space-y-10">
            {/* Main Cart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
              
              {/* Left: Cart Items Card */}
              <div className="bg-white rounded-3xl border border-amber-200/60 shadow-xs p-5 sm:p-8 space-y-6">
                {!customer && (
                  <div className="pb-4 border-b border-slate-100">
                    <SignInPrompt />
                  </div>
                )}
                <ItemsTemplate cart={cart} />
              </div>

              {/* Right: Summary Sticky Box */}
              <div className="relative">
                <div className="sticky top-28 space-y-6">
                  <div className="bg-white rounded-3xl border border-amber-200/60 shadow-xs p-6">
                    {/* Free shipping meter */}
                    <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs font-jakarta">
                      {isFreeShipping ? (
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                          <span className="text-base">🎉</span> You have unlocked FREE Shipping!
                        </div>
                      ) : (
                        <div>
                          <p className="text-slate-700 font-semibold mb-1.5">
                            Add <span className="font-bold text-petha-amber">₹{neededForFreeShipping}</span> more for <span className="font-bold text-emerald-700">FREE Shipping</span>
                          </p>
                          <div className="w-full h-2 rounded-full bg-amber-200/60 overflow-hidden">
                            <div 
                              className="h-full bg-petha-amber rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(100, (netItemsTotal / 500) * 100)}%` }} 
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Summary cart={cart as any} />
                  </div>
                  
                  {/* Trust Badges */}
                  <ProductTrustBadges />
                </div>
              </div>
            </div>

            {/* UPSELL: Complete Your Agra Sweet Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-200/60 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <div>
                  <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold">
                    Pairing Recommendations
                  </span>
                  <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                    Complete Your Sweet Box with Agra Snacks
                  </h3>
                </div>
                <span className="font-jakarta text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 w-fit">
                  ✨ Handcrafted Fresh Daily
                </span>
              </div>

              {upsellProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {upsellProducts.map((prod: any) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/60 hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-amber-200/60 flex-shrink-0">
                          <Image
                            src={prod.thumbnail || "/hero_image.webp"}
                            alt={prod.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="inline-block text-[10px] font-bold uppercase text-petha-amber font-jakarta">
                            Fresh Agra
                          </span>
                          <h4 className="font-cormorant text-base font-bold text-slate-900 truncate">
                            {prod.title}
                          </h4>
                          {(() => {
                            const prodPromo = calculatePrice(prod.price)
                            return (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-sm font-bold text-slate-900">
                                  ₹{formatIndianPrice(prodPromo.discountedPrice)}
                                </span>
                                {prodPromo.isDiscounted && (
                                  <>
                                    <span className="font-mono text-[10px] text-slate-400 line-through">
                                      ₹{formatIndianPrice(prod.price)}
                                    </span>
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-jakarta">
                                      {prodPromo.discountPercent}% OFF
                                    </span>
                                  </>
                                )}
                              </div>
                            )
                          })()}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={addingUpsell[prod.id]}
                        onClick={() => handleAddUpsell(prod)}
                        className={`w-full py-2 rounded-xl border border-amber-300 text-slate-800 font-jakarta text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm text-center ${
                          addingUpsell[prod.id]
                            ? "bg-amber-100 text-amber-800"
                            : "bg-white hover:bg-petha-amber hover:text-white"
                        }`}
                      >
                        {addingUpsell[prod.id] ? "Adding to Box..." : "+ Add to Order"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-10 shadow-xs">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartClientWrapper
