"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  // Ensure we always have an array to reduce
  return (variantOptions || []).reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    const variant = product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
    
    return variant
  }, [product.variants, options])

  // Side effect: store selected variant ID in localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedVariant?.id) {
      localStorage.setItem('selectedVariantId', selectedVariant.id)
      window.dispatchEvent(new Event('storage'))
    }
  }, [selectedVariant])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // Handle quantity adjustments
  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    try {
      const startTime = Date.now()

      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity,
          countryCode,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      const elapsedTime = Date.now() - startTime
      if (elapsedTime < 500) {
        await new Promise((r) => setTimeout(r, 500 - elapsedTime))
      }

      // Guard localStorage usage to avoid errors during server rendering or tests
      if (typeof window !== 'undefined') {
        localStorage.setItem('last_cart_addition', Date.now().toString())
        window.dispatchEvent(new Event('storage'))
      }
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 3000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-4" ref={actionsRef}>
        {/* Variants */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => {
              return (
                <div key={option.id} className="product-option">
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              )
            })}
            <div className="h-px bg-luxury-gold/20 my-2"></div>
          </div>
        )}

        {/* Price display */}
        <div className="mb-2">
          <ProductPrice product={product} variant={selectedVariant} />
        </div>
        
        {/* Quantity selector */}
        <div className="flex flex-col gap-y-2">
          <p className="text-small-semi uppercase tracking-wider text-luxury-charcoal/70">Quantity</p>
          <div className="flex items-center">
            <button 
              className="w-8 h-8 flex items-center justify-center border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-cream transition-colors"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || !!disabled || isAdding}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 12H4"></path>
              </svg>
            </button>
            
            <span className="w-12 text-center text-luxury-charcoal">{quantity}</span>
            
            <button 
              className="w-8 h-8 flex items-center justify-center border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-cream transition-colors"
              onClick={incrementQuantity}
              disabled={quantity >= 10 || !!disabled || isAdding}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Add to cart button */}
        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className={`w-full h-12 mt-2 font-medium tracking-wider uppercase transition-all duration-300 ${
            addedToCart 
              ? 'bg-emerald-600 hover:bg-emerald-700' 
              : !selectedVariant || !isValidVariant 
                ? 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                : 'bg-luxury-gold hover:bg-luxury-gold/90'
          }`}
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !Object.keys(options).length
            ? "Select options to continue"
            : !selectedVariant || !isValidVariant
            ? "Select all options"
            : !inStock
            ? "Out of stock"
            : addedToCart
            ? "Added to cart!"
            : "Add to cart"}
        </Button>
        
        {/* Additional info */}
        <div className="text-xs text-luxury-charcoal/60 mt-2">
          <p className="flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
            </svg>
            Free shipping on orders over $150
          </p>
          <p className="flex items-center mt-1">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Each purchase is protected by our quality guarantee
          </p>
        </div>
        
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
