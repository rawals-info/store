"use client"

import { useEffect, useState } from "react"
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

const UPSELL_PRODUCTS = [
  {
    title: "Special Agra Dalmoth",
    handle: "dalmoth",
    price: "₹220",
    image: "/images/dalmoth.webp",
    tag: "Signature Snack",
    variantId: "variant_01JZMK1P7V9J664Y7G5Y7A1B1A",
  },
  {
    title: "Kesar Angoori Petha",
    handle: "kesar-angoori-petha",
    price: "₹260",
    image: "/hero_petha_square.webp",
    tag: "Royal Juicy Sweet",
    variantId: "variant_01K21PYF6X8K7B5G8H9J2A4C6E",
  },
  {
    title: "Special Masala Peanuts",
    handle: "masala-peanuts",
    price: "₹140",
    image: "/images/namkeen.webp",
    tag: "Crispy Namkeen",
    variantId: "variant_01JZMK5X3E1L2K3J4H5G6F7E8D",
  },
  {
    title: "Chocolate Petha",
    handle: "chocolate-petha",
    price: "₹280",
    image: "/images/combo.webp",
    tag: "Kids Favorite",
    variantId: "variant_01JZMJVZ9J2H3K4L5P6Q7R8S9T",
  },
]

const CartClientWrapper = ({
  initialCart,
  customer,
}: {
  initialCart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const [cart, setCart] = useState(initialCart)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [addingUpsell, setAddingUpsell] = useState<Record<string, boolean>>({})
  const router = useRouter()

  useEffect(() => {
    const handleCartUpdate = async () => {
      setIsRefreshing(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      try {
        const cacheBuster = Date.now()
        const response = await fetch(`/api/cart?t=${cacheBuster}`, {
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
        
        if (response.ok) {
          const { cart: updatedCart } = await response.json()
          setCart(updatedCart)
        } else {
          router.refresh()
        }
      } catch (error) {
        router.refresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [router])
  
  useEffect(() => {
    if (initialCart !== cart && initialCart !== undefined) {
      setCart(initialCart)
    }
  }, [initialCart])

  const subtotal = cart?.subtotal || 0

  const handleAddUpsell = async (item: typeof UPSELL_PRODUCTS[0]) => {
    setAddingUpsell(prev => ({ ...prev, [item.handle]: true }))
    try {
      // Find matching product in catalog to get real variant ID
      const res = await fetch(`/api/search-suggest?q=${encodeURIComponent(item.title)}&countryCode=in`)
      const data = await res.json()
      const matchedProd = data.products?.[0]
      const variantId = matchedProd?.variants?.[0]?.id

      if (variantId) {
        const addRes = await addToCart({
          variantId,
          quantity: 1,
          countryCode: "in",
        })

        if (addRes?.success && addRes?.cart) {
          setCart(addRes.cart)
        }
      }

      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { quantity: 1, forceOpen: false } }))
      router.refresh()
    } catch (error) {
      console.error("Failed to add pairing sweet to cart:", error)
    } finally {
      setTimeout(() => {
        setAddingUpsell(prev => ({ ...prev, [item.handle]: false }))
      }, 1500)
    }
  }

  return (
    <div className="py-6 sm:py-10 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="cart-container">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[{ label: "Shopping Box & Cart", isCurrent: true }]}
          countryCode="in"
          className="rounded-2xl border border-amber-100/90 shadow-xs mb-8"
        />

        {/* Loading Spinner */}
        {isRefreshing && (
          <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3 border border-amber-100">
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
              <div className="bg-white rounded-3xl border border-amber-100/90 shadow-sm p-5 sm:p-8 space-y-6">
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
                  <div className="bg-white rounded-3xl border border-amber-100/90 shadow-sm p-6">
                    {/* Free shipping meter */}
                    <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs font-jakarta">
                      {subtotal >= 500 ? (
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                          <span className="text-base">🎉</span> You have unlocked FREE Shipping!
                        </div>
                      ) : (
                        <div>
                          <p className="text-slate-700 font-semibold mb-1.5">
                            Add <span className="font-bold text-petha-amber">₹{500 - Math.round(subtotal)}</span> more for <span className="font-bold text-emerald-700">FREE Shipping</span>
                          </p>
                          <div className="w-full h-2 rounded-full bg-amber-200/60 overflow-hidden">
                            <div 
                              className="h-full bg-petha-amber rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }} 
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

            {/* UPSELL: Complete Your Agra Sweet Box (Boosts Sales) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-100/90 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <div>
                  <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold">
                    Pairing Recommendations
                  </span>
                  <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                    Complete Your Sweet Box with Agra Snacks
                  </h3>
                </div>
                <span className="font-jakarta text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                  ✨ Handcrafted Fresh Daily
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {UPSELL_PRODUCTS.map((prod) => (
                  <div
                    key={prod.handle}
                    className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-100/80 hover:border-amber-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-amber-200/60 flex-shrink-0">
                        <Image
                          src={prod.image}
                          alt={prod.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block text-[10px] font-bold uppercase text-petha-amber font-jakarta">
                          {prod.tag}
                        </span>
                        <h4 className="font-cormorant text-base font-bold text-slate-900 truncate">
                          {prod.title}
                        </h4>
                        <p className="font-mono text-sm font-bold text-slate-900">
                          {prod.price}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddUpsell(prod)}
                      className="w-full py-2 rounded-xl bg-white hover:bg-petha-amber hover:text-white border border-amber-300 text-slate-800 font-jakarta text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm text-center"
                    >
                      {addingUpsell[prod.handle] ? "✓ Added to Box" : "+ Add to Order"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-amber-100 p-8">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartClientWrapper
