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
import ProductVariantInfo from "../product-variant-info"
import MobileActions from "./mobile-actions"
import { announceCart } from "@lib/cart/events"
import { enqueueCartJob } from "@lib/utils/offline-cart-queue"

// Legacy in-memory mutation queue replaced by persistent offline queue

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

// For variant finding
const isEqualVariant = (v: HttpTypes.StoreProductVariant, opts: Record<string, string | undefined>): boolean => {
  const variantOptions = optionsAsKeymap(v.options)
  return isEqual(variantOptions, opts)
}

// Helper function to generate options from variant titles
const generateOptionsFromVariants = (variants: HttpTypes.StoreProductVariant[] | undefined): any[] => {
  if (!variants || variants.length <= 0) return []

  // Try to detect option types from variant titles
  // This is a fallback when the backend doesn't provide proper option data
  const optionTypes: Record<string, Set<string>> = {}
  
  // First, collect all potential option types and values
  variants.forEach(variant => {
    const title = variant.title || ""
    
    // Common patterns to identify options (Size: L, Color: Blue, etc.)
    const optionMatches = title.match(/([a-zA-Z]+)\s*:\s*([a-zA-Z0-9]+)/g)
    
    if (optionMatches) {
      // Parse structured variant titles like "Size: L, Color: Blue"
      optionMatches.forEach(match => {
        const [optionType, optionValue] = match.split(/:/).map(s => s.trim())
        if (optionType && optionValue) {
          if (!optionTypes[optionType]) {
            optionTypes[optionType] = new Set()
          }
          optionTypes[optionType].add(optionValue)
        }
      })
    } else {
      // If no structured pattern, use "Option" as fallback
      // For titles like "Small", "Large", "Red", etc.
      if (!optionTypes["Option"]) {
        optionTypes["Option"] = new Set()
      }
      if (title) {
        optionTypes["Option"].add(title)
      }
    }
  })
  
  // Convert the collected data to the required format
  return Object.entries(optionTypes).map(([optionType, valueSet], index) => {
    const optionId = `generated_option_id_${index}`
    
    return {
      id: optionId,
      title: optionType,
      values: Array.from(valueSet).map((value: string) => ({
        id: `value_${value.replace(/\s+/g, '_')}`,
        value: value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        option_id: optionId,
        variant_id: undefined,
        metadata: undefined
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_id: undefined,
      metadata: undefined
    }
  })
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [manuallySelectedVariant, setManuallySelectedVariant] = useState<HttpTypes.StoreProductVariant | undefined>(undefined)
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "us"

  // Create dynamic options if none exist
  const productOptions = useMemo(() => {
    // Use options directly from the product if they exist and have values
    if (product.options && product.options.length > 0) {
      // Ensure each option has values
      const validOptions = product.options.filter(option => 
        option.values && option.values.length > 0
      );
      
      if (validOptions.length > 0) {
        return validOptions;
      }
    }
    
    // Only generate options if we have no options but have variants
    if ((!product.options || product.options.length === 0) && product.variants && product.variants.length > 0) {
      // Try to extract options from variant.options first, as this is more reliable than titles
      const variantsWithOptions = product.variants.filter(v => v.options && v.options.length > 0);
      
      if (variantsWithOptions.length > 0) {
        // Group variant options by option_id to create synthetic product options
        const optionGroups: Record<string, any> = {};
        
        variantsWithOptions.forEach(variant => {
          variant.options?.forEach(opt => {
            // Skip if option_id is null or undefined
            if (!opt.option_id) return;
            
            if (!optionGroups[opt.option_id]) {
              // Try to get the option title from any option on any variant
              let optionTitle = "Option";
              // Look through all variants to find a title for this option_id
              for (const v of product.variants || []) {
                for (const o of v.options || []) {
                  if (o.option_id === opt.option_id && (o as any).title) {
                    optionTitle = (o as any).title;
                    break;
                  }
                }
                if (optionTitle !== "Option") break;
              }
              
              optionGroups[opt.option_id] = {
                id: opt.option_id,
                title: optionTitle,
                values: []
              };
            }
            
            // Check if value exists and add it if not already in the array
            if (opt.value) {
              const existing = optionGroups[opt.option_id].values.find((v: any) => v.value === opt.value);
              if (!existing) {
                optionGroups[opt.option_id].values.push({
                  id: `${opt.option_id}_${opt.value}`.replace(/\s+/g, '_'),
                  value: opt.value,
                  option_id: opt.option_id
                });
              }
            }
          });
        });
        
        const generatedOptions = Object.values(optionGroups);
        
        // Only return if we have valid options with values
        if (generatedOptions.length > 0 && generatedOptions.every(opt => opt.values && opt.values.length > 0)) {
          return generatedOptions;
        }
      }
      
      // Use our fallback generator if variant.options is not available
      const generatedOptions = generateOptionsFromVariants(product.variants);
      
      return generatedOptions.filter(opt => opt.values && opt.values.length > 0);
    }
    
    return []
  }, [product])

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    // Reset options when product changes
    if (product) {
      // Create default options map
      const defaultOptions: Record<string, string | undefined> = {}
      
      // If product options exist, use them
      if (productOptions.length > 0) {
        // For each option, select the first value
        productOptions.forEach(option => {
          if (option.values?.length) {
            defaultOptions[option.id] = option.values[0].value || undefined
          }
        })
        
        // If there's only one variant, select its exact options - ensure it's always selected
        if (product.variants?.length === 1 && product.variants[0].options) {
          const variantOptions = optionsAsKeymap(product.variants[0].options)
          Object.assign(defaultOptions, variantOptions)
        }
        
        // Set the default options
        if (Object.keys(defaultOptions).length > 0) {
          setOptions(defaultOptions)
        }
      } else {
        // If there are no selectable options, auto-select the first variant (even if there are many)
        if (product.variants && product.variants.length > 0) {
          setManuallySelectedVariant(product.variants[0])
        }
      }
    }
  }, [product, productOptions])

  const selectedVariant = useMemo(() => {
    if (manuallySelectedVariant) {
      return manuallySelectedVariant
    }

    if (!product.variants || product.variants.length === 0) {
      return
    }

    // For products with standard options
    if (product.options && product.options.length > 0) {
      const variant = product.variants.find((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, options)
      })
      return variant
    }
    
    // For products with generated options
    if (Object.keys(options).length > 0) {
      // First try to find by exact option match (for formatted titles)
      const variant = product.variants.find(v => {
        if (!v.title) return false
        
        // For options like "Size: L, Color: Blue"
        const optionMatches = v.title.match(/([a-zA-Z]+)\s*:\s*([a-zA-Z0-9]+)/g)
        if (optionMatches) {
          // Check if all options match
          return Object.entries(options).every(([optionId, value]) => {
            // Find the option title from productOptions
            const option = productOptions.find(o => o.id === optionId)
            if (!option || !value) return false
            
            // Check if this option's value is in the variant title
            const pattern = new RegExp(`${option.title}\\s*:\\s*${value}`, 'i')
            return pattern.test(v.title || '')
          })
        }
        
        // For simple titles, match if any of our options match the title
        return Object.values(options).includes(v.title)
      })
      
      if (variant) return variant
    }
    
    // Default to first variant if no match found
    return product.variants[0]
  }, [product.variants, options, product.options, productOptions])

  // Side effect: store selected variant ID in localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedVariant?.id) {
      const id = selectedVariant.id // safe after optional chaining check
      const currentVariantId = localStorage.getItem('selectedVariantId')
      if (currentVariantId !== id) {
        localStorage.setItem('selectedVariantId', id)
        // Trigger custom storage event for other tabs/components
        window.dispatchEvent(new Event('storage'))
      }
    }
  }, [selectedVariant?.id]); // Only depend on the ID, not the entire variant

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return false
    }
    
    // For products with standard options
    if (product.options && product.options.length > 0) {
      return product.variants.some((variant) => {
        const variantOptions = optionsAsKeymap(variant.options)
        return isEqual(variantOptions, options)
      })
    }
    
    // For products with generated options
    if (Object.keys(options).length > 0) {
      // First try to find by exact option match
      return product.variants.some(variant => {
        if (!variant.title) return false
        
        // For options like "Size: L, Color: Blue"
        const optionMatches = variant.title.match(/([a-zA-Z]+)\s*:\s*([a-zA-Z0-9]+)/g)
        if (optionMatches) {
          // Check if all options match
          return Object.entries(options).every(([optionId, value]) => {
            // Find the option title from productOptions
            const option = productOptions.find(o => o.id === optionId)
            if (!option || !value) return false
            
            // Check if this option's value is in the variant title
            const pattern = new RegExp(`${option.title}\\s*:\\s*${value}`, 'i')
            return pattern.test(variant.title || '')
          })
        }
        
        // For simple titles, match if any of our options match the title
        return Object.values(options).includes(variant.title)
      })
    }
    
    // If no options to check, default to having variants
    return product.variants.length > 0
  }, [product.variants, options, product.options, productOptions])

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

    // Optimistic UI update for instantaneous feedback
    setAddedToCart(true)
    setIsAdding(true)

    const timestamp = Date.now().toString()

    // Fire early cart announcement so header badge updates immediately
    if (typeof window !== "undefined") {
      localStorage.setItem("last_cart_addition", timestamp)
      announceCart({ variantId: selectedVariant.id, quantity, forceOpen: true })
    }

    try {
      if (typeof navigator !== "undefined" && navigator.onLine) {
        await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            variantId: selectedVariant.id,
            quantity,
            countryCode,
          }),
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to add item to cart")
          }
        })
      } else {
        enqueueCartJob({ variantId: selectedVariant.id, quantity, countryCode })
      }

      // Keep success message visible a little longer
      setTimeout(() => setAddedToCart(false), 3000)
    } catch (error) {
      console.error("Failed to add to cart:", error)
      setAddedToCart(false)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <div>
          {/* Only show options selector if there are multiple variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-col gap-y-2" data-testid="product-options">
              {productOptions.map((option) => {
                return (
                  <div key={option.id} data-testid={option.title}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title}
                      disabled={disabled || false}
                      product={product}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Only show the variant info section if there's more than one variant */}
        {selectedVariant && product.variants && product.variants.length > 1 && (
          <ProductVariantInfo variant={selectedVariant} product={product} />
        )}

        <div className="mt-4">
          <div className="flex flex-col gap-y-6">
            <ProductPrice 
              product={product} 
              variantId={selectedVariant?.id} 
            />
            
            {/* Quantity selector */}
            <div className="flex flex-col gap-y-2">
              <p className="text-sm text-luxury-charcoal/70">Quantity</p>
              <div className="flex items-center">
                <button 
                  className="w-8 h-8 flex items-center justify-center border border-luxury-charcoal/20 text-luxury-charcoal hover:bg-luxury-cream/50 transition-colors"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1 || !!disabled || isAdding}
                >
                  <span className="text-lg">−</span>
                </button>
                
                <span className="w-12 text-center text-luxury-charcoal">{quantity}</span>
                
                <button 
                  className="w-8 h-8 flex items-center justify-center border border-luxury-charcoal/20 text-luxury-charcoal hover:bg-luxury-cream/50 transition-colors"
                  onClick={incrementQuantity}
                  disabled={quantity >= 10 || !!disabled || isAdding}
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>
            
            <div>
              <Button
                onClick={handleAddToCart}
                disabled={
                  // Require manual selection only when real options exist
                  (productOptions.length > 0 && product.variants && product.variants.length > 1 && !selectedVariant) ||
                  // For all cases, check calculated price and inventory
                  !selectedVariant?.calculated_price ||
                  (selectedVariant && typeof selectedVariant.inventory_quantity === 'number' && selectedVariant.inventory_quantity < 1)
                }
                variant="primary"
                className="w-full bg-luxury-charcoal hover:bg-luxury-charcoal/90 h-12 rounded-md text-luxury-ivory"
                isLoading={isAdding}
                data-testid="add-to-cart-button"
              >
                {!selectedVariant
                  ? "Select options"
                  : selectedVariant && typeof selectedVariant.inventory_quantity === 'number' && selectedVariant.inventory_quantity < 1
                    ? "Out of stock"
                    : addedToCart
                      ? "Added!"
                      : `Add to cart (${quantity})`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Only show MobileActions when there are multiple variants */}
      {product.variants && product.variants.length > 1 && (
        <MobileActions
          product={product}
          options={options}
          variant={selectedVariant}
          updateOptions={setOptionValue}
          inStock={selectedVariant ? typeof selectedVariant.inventory_quantity !== 'number' || selectedVariant.inventory_quantity > 0 : false}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={disabled || false}
        />
      )}
    </>
  )
}
