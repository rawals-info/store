import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Sparkles, ArrowRight, ShieldCheck, Truck, Award } from "lucide-react"
import { addToCart } from "@lib/data/cart"

const EmptyCartMessage = () => {
  const [featuredSweets, setFeaturedSweets] = useState<any[]>([])
  const [addingItem, setAddingItem] = useState<Record<string, boolean>>({})
  const [addedItem, setAddedItem] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch("/api/products/popular?limit=3&countryCode=in")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products && data.products.length > 0) {
          setFeaturedSweets(data.products)
        }
      })
      .catch((err) => console.error("Error loading empty cart recommendations:", err))
  }, [])

  const handleQuickAdd = async (sweet: any) => {
    if (!sweet?.variantId) return
    setAddingItem(prev => ({ ...prev, [sweet.id]: true }))
    try {
      const addRes = await addToCart({
        variantId: sweet.variantId,
        quantity: 1,
        countryCode: "in",
      })

      setAddedItem(prev => ({ ...prev, [sweet.id]: true }))
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { cart: addRes?.cart || null, quantity: 1, forceOpen: false },
          })
        )
      }
    } catch (error) {
      console.error("Failed to quick add sweet:", error)
    } finally {
      setAddingItem(prev => ({ ...prev, [sweet.id]: false }))
    }
  }

  return (
    <div className="py-8 sm:py-12 flex flex-col items-center justify-center text-center space-y-10" data-testid="empty-cart-message">
      
      {/* Hero Visual Card */}
      <div className="max-w-xl mx-auto space-y-4">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-inner">
            <span className="text-4xl animate-bounce">🍬</span>
          </div>
          <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-petha-amber flex items-center justify-center text-white text-xs shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900">
            Your Sweet Box is Empty
          </h1>
          <p className="font-jakarta text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Experience the royal taste of authentic Agra sweets &amp; crispy snacks, vacuum-sealed and dispatched fresh daily across India.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/in/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Explore Full Sweets Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Featured Quick Add Recommendations */}
      <div className="w-full max-w-4xl pt-4 border-t border-amber-100/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-6">
          <div className="text-left">
            <h3 className="font-cormorant text-2xl font-bold text-slate-900">
              Agra&apos;s Most Loved Specialties
            </h3>
            <p className="font-jakarta text-xs text-slate-500">
              Add these customer favorites directly to your fresh box in one click:
            </p>
          </div>
          <span className="text-xs font-jakarta font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            ✈️ Free Delivery over ₹500
          </span>
        </div>

        {featuredSweets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {featuredSweets.map((sweet: any) => (
              <div
                key={sweet.id}
                className="p-4 rounded-3xl bg-white border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-amber-50 border border-amber-100">
                    <Image
                      src={sweet.thumbnail || "/hero_image.webp"}
                      alt={sweet.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs font-jakarta text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-xs">
                      Popular
                    </span>
                  </div>

                  <div>
                    <h4 className="font-cormorant text-lg font-bold text-slate-900 leading-tight">
                      {sweet.title}
                    </h4>
                    <p className="font-jakarta text-xs text-slate-500 line-clamp-2 mt-1">
                      {sweet.description || "Authentic freshly prepared Agra delicacy."}
                    </p>
                    <p className="font-mono text-sm font-bold text-slate-900 mt-2">
                      {sweet.priceFormatted || `₹${sweet.price}`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={addingItem[sweet.id] || addedItem[sweet.id]}
                  onClick={() => handleQuickAdd(sweet)}
                  className={`w-full py-2.5 px-4 rounded-2xl font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    addedItem[sweet.id]
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : addingItem[sweet.id]
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-white hover:bg-petha-amber hover:text-white border border-amber-300 text-slate-800"
                  }`}
                >
                  {addingItem[sweet.id] ? (
                    <>
                      <div className="w-3 h-3 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
                      <span>Packing into Box...</span>
                    </>
                  ) : addedItem[sweet.id] ? (
                    "✓ Added to Box"
                  ) : (
                    "+ Add to Sweet Box"
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Heritage Trust Badges */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-amber-100/60 text-xs font-jakarta text-slate-600">
        <div className="flex items-center justify-center sm:justify-start gap-2.5 p-3 rounded-2xl bg-amber-50/40">
          <Truck className="w-4 h-4 text-petha-amber flex-shrink-0" />
          <span>Same Day Dispatch from Agra</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2.5 p-3 rounded-2xl bg-amber-50/40">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>30-Day Vacuum Freshness Guarantee</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2.5 p-3 rounded-2xl bg-amber-50/40">
          <Award className="w-4 h-4 text-petha-amber flex-shrink-0" />
          <span>100% Pure Vegetarian Ingredients</span>
        </div>
      </div>
    </div>
  )
}

export default EmptyCartMessage
