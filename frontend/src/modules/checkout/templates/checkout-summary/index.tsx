"use client"

import { useState, useEffect } from "react"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { ShieldCheck, Truck, Sparkles, Plus, Check } from "lucide-react"
import Image from "next/image"
import { addToCart } from "@lib/data/cart"
import { useParams } from "next/navigation"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  const [currentCart, setCurrentCart] = useState<any>(cart)
  const countryCode = (useParams()?.countryCode as string) || "in"
  const [upsellSnacks, setUpsellSnacks] = useState<any[]>([])
  const [addingId, setAddingId] = useState<string | null>(null)
  const [addedIds, setAddedIds] = useState<string[]>([])

  useEffect(() => {
    setCurrentCart(cart)
  }, [cart])

  useEffect(() => {
    const handleCartUpdate = (e: CustomEvent) => {
      if (e.detail?.cart) {
        setCurrentCart(e.detail.cart)
      }
    }
    window.addEventListener("cartUpdated" as any, handleCartUpdate)
    return () => window.removeEventListener("cartUpdated" as any, handleCartUpdate)
  }, [])

  const itemsSubtotal = (currentCart?.item_subtotal ?? ((currentCart?.subtotal ?? 0) - (currentCart?.shipping_subtotal ?? 0)))
  const discountTotal = currentCart?.discount_total ?? 0
  const netItemsTotal = Math.max(0, itemsSubtotal - discountTotal)
  const isFreeShipping = netItemsTotal >= 500

  const hasShippingMethod = Boolean(
    (currentCart?.shipping_methods && currentCart.shipping_methods.length > 0) ||
    (currentCart?.shipping_subtotal !== undefined && currentCart?.shipping_subtotal !== null && currentCart?.shipping_subtotal > 0) ||
    isFreeShipping
  )
  const atAddressStep = (!currentCart?.shipping_address?.address_1 || !currentCart?.email) && !hasShippingMethod
  const shippingPlaceholder = isFreeShipping 
    ? "Free shipping" 
    : (atAddressStep ? "Enter your shipping address" : "Calculated at checkout")

  const dynamicShippingSubtotal = isFreeShipping ? 0 : 89
  const dynamicTotal = netItemsTotal + dynamicShippingSubtotal

  const displayCart = {
    ...currentCart,
    shipping_subtotal: dynamicShippingSubtotal,
    shipping_total: dynamicShippingSubtotal,
    total: dynamicTotal,
  }

  // Fetch live products for impulse add
  useEffect(() => {
    fetch(`/api/products/popular?limit=2&countryCode=${countryCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.products) {
          setUpsellSnacks(data.products)
        }
      })
      .catch((err) => console.error("Error loading checkout cross-sells:", err))
  }, [countryCode])

  const handleQuickAdd = async (item: any) => {
    if (!item?.variantId) return
    setAddingId(item.id)
    try {
      const addRes = await addToCart({
        variantId: item.variantId,
        quantity: 1,
        countryCode,
      })
      if (addRes?.success) {
        setAddedIds((prev) => [...prev, item.id])
        if (typeof window !== "undefined") {
          window.location.reload()
        }
      }
    } catch (e) {
      console.error("Failed to add cross-sell snack:", e)
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="sticky top-20 flex flex-col gap-y-6">
      {/* Order Summary Card */}
      <div className="w-full bg-white flex flex-col p-6 sm:p-8 rounded-3xl shadow-sm border border-amber-100/90">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="font-cormorant text-2xl font-bold text-slate-900">
            Order Summary
          </h2>
          <span className="font-jakarta text-xs font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-full">
            {currentCart?.items?.length || 0} {currentCart?.items?.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Totals */}
        <div className="py-4">
          <CartTotals 
            totals={displayCart} 
            shippingPlaceholder={shippingPlaceholder}
            taxPlaceholder="All taxes included" 
          />
        </div>

        <div className="h-px bg-slate-100 my-2" />

        {/* Items Preview */}
        <div className="py-2">
          <ItemsPreviewTemplate cart={currentCart} />
        </div>

        <div className="h-px bg-slate-100 my-4" />

        {/* Promo Code Input */}
        <div>
          <DiscountCode cart={currentCart} />
        </div>
      </div>

      {/* Cross-Sell / Impulse Snack Row */}
      {upsellSnacks.length > 0 && (
        <div className="w-full bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-jakarta font-bold text-amber-900 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
            <span>Add Royal Agra Snacks (Best with Petha):</span>
          </div>

          <div className="space-y-2.5">
            {upsellSnacks.map((snack: any) => {
              const isAdded = addedIds.includes(snack.id)
              return (
                <div
                  key={snack.id}
                  className="flex items-center justify-between p-2.5 bg-white rounded-2xl border border-amber-200/60 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden relative bg-amber-100/50 flex-shrink-0">
                      <Image src={snack.thumbnail || "/hero_image.webp"} alt={snack.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-jakarta text-xs font-bold text-slate-800 leading-tight truncate">
                        {snack.title}
                      </h4>
                      <p className="font-jakarta text-[11px] text-slate-500">
                        {snack.priceFormatted || `₹${snack.price}`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(snack)}
                    disabled={isAdded || addingId === snack.id}
                    className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0 ${
                      isAdded
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 hover:bg-petha-amber hover:text-white text-amber-950"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" /> + Add
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Trust & Guarantee Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 text-xs font-jakarta text-slate-600">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-petha-amber flex-shrink-0" />
          <span>Express Nationwide Air Dispatch in 24h</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>30-Day Freshness Guarantee (Vacuum Sealed)</span>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
