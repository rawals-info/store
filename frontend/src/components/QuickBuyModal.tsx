"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { addToCart, applyPromotions } from "@lib/data/cart"
import { X, ShoppingBag, Check, Minus, Plus } from "lucide-react"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { useParams, useRouter } from "next/navigation"

interface QuickBuyModalProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isOpen: boolean
  onClose: () => void
}

export default function QuickBuyModal({ product, region, isOpen, onClose }: QuickBuyModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const countryCode = useParams().countryCode as string
  const router = useRouter()

  // Set default variant
  useEffect(() => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0].id!)
    }
  }, [product, selectedVariant])

  // Calculate price based on selected variant
  const { cheapestPrice, variantPrice } = getProductPrice({ 
    product, 
    variantId: selectedVariant 
  })
  
  // Use the selected variant's price if available, otherwise cheapest
  const displayPrice = variantPrice || cheapestPrice

  const handleAddToCart = async () => {
    if (!selectedVariant) return

    setIsAdding(true)
    try {
      // Add item to cart
      await addToCart({
        variantId: selectedVariant,
        quantity,
        countryCode,
      })

      // Apply the SWEET20 discount coupon
      try {
        await applyPromotions(["SWEET20"])
        console.log("✅ Applied SWEET20 coupon to cart")
      } catch (promoError) {
        console.warn("⚠️ Failed to apply SWEET20 coupon:", promoError)
        // Don't fail the whole operation if coupon fails
      }

      setShowSuccess(true)
      
      // Trigger cart update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { quantity, forceOpen: true }
        }))
      }

      // Close after 1.5 seconds
      setTimeout(() => {
        onClose()
        setShowSuccess(false)
        setQuantity(1)
      }, 1500)
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
      // Add item to cart
      await addToCart({
        variantId: selectedVariant,
        quantity,
        countryCode,
      })

      // Apply the SWEET20 discount coupon
      try {
        await applyPromotions(["SWEET20"])
        console.log("✅ Applied SWEET20 coupon to cart")
      } catch (promoError) {
        console.warn("⚠️ Failed to apply SWEET20 coupon:", promoError)
        // Don't fail the whole operation if coupon fails
      }

      // Navigate to checkout with address step
      router.push(`/${countryCode}/checkout?step=address`)
    } catch (error) {
      console.error("Failed to add to cart:", error)
      setIsAdding(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-[101] animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
        <div className="bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-luxury-gold/20 px-4 py-3 flex items-center justify-between z-10">
            <h2 className="font-display text-lg text-luxury-charcoal">Quick Buy</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-luxury-ivory rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-luxury-charcoal" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-luxury-ivory/20">
                <Thumbnail
                  thumbnail={product.thumbnail}
                  images={product.images}
                  size="full"
                  className="object-cover w-full h-full"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-luxury-gold to-yellow-600 px-2.5 py-1.5 text-white text-[10px] uppercase tracking-wider font-bold flex items-center shadow-md">
                    💰 Save 20%
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <h3 className="font-display text-xl sm:text-2xl text-luxury-charcoal mb-2">
                  {product.title}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  {displayPrice && (
                    <>
                      <span className="font-display text-2xl sm:text-3xl text-luxury-gold">
                        ₹{Math.round(displayPrice.calculated_price_number * 0.8)}
                      </span>
                      <span className="text-lg text-luxury-charcoal/50 line-through">
                        ₹{Math.round(displayPrice.calculated_price_number)}
                      </span>
                    </>
                  )}
                </div>

                {/* Urgency Bar */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-orange-700">
                    <span className="text-lg">⚡</span>
                    <span className="font-medium">Only 6 left in stock!</span>
                  </div>
                  <div className="mt-2 text-xs text-orange-600">
                    🔥 12 people viewing this right now
                  </div>
                </div>

                {/* Variant Selection */}
                {product.variants && product.variants.length > 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-luxury-charcoal mb-2">
                      Select Size:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant.id!)}
                          className={`px-3 py-2 border rounded-lg text-sm font-medium transition-all ${
                            selectedVariant === variant.id
                              ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                              : 'border-luxury-gold/30 text-luxury-charcoal hover:border-luxury-gold'
                          }`}
                        >
                          {variant.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-luxury-charcoal mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-luxury-gold/30 flex items-center justify-center hover:bg-luxury-ivory transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-10 h-10 rounded-lg border border-luxury-gold/30 flex items-center justify-center hover:bg-luxury-ivory transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mt-auto">
                  {showSuccess ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-center gap-2 text-green-700">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Added to cart!</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleBuyNow}
                        disabled={isAdding}
                        className="w-full bg-luxury-gold text-white py-3 px-6 rounded-lg font-medium hover:bg-luxury-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isAdding ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShoppingBag className="w-5 h-5" />
                            Buy Now
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="w-full bg-white text-luxury-charcoal border border-luxury-gold/30 py-3 px-6 rounded-lg font-medium hover:bg-luxury-ivory transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                    </>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-luxury-gold/20">
                  <div className="flex items-center gap-2 text-xs text-luxury-charcoal/70">
                    <span>✓</span>
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-luxury-charcoal/70">
                    <span>✓</span>
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

