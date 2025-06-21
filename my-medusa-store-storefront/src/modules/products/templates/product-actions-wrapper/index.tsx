"use client"

import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import { useEffect, useState } from "react"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region: HttpTypes.StoreRegion
}) {
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(false)
        
        // Fetch the product data from the client side
        const response = await fetch(`/api/products/${id}?regionId=${region.id}`)
        
        if (!response.ok) {
          throw new Error("Failed to load product")
        }
        
        const data = await response.json()
        setProduct(data.product)
      } catch (err) {
        console.error("Error loading product actions:", err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProduct()
  }, [id, region.id])
  
  if (isLoading) {
    return (
      <div className="py-4">
        <div className="w-full h-8 bg-gray-100 animate-pulse rounded"></div>
        <div className="mt-4 w-2/3 h-8 bg-gray-100 animate-pulse rounded"></div>
      </div>
    )
  }
  
  if (error || !product) {
    return (
      <div className="p-4 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-500">Product information could not be loaded. Please try again later.</p>
      </div>
    )
  }

  return <ProductActions product={product} region={region} />
}
