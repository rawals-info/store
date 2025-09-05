"use client"

import { useState, useEffect } from "react"
import { sdk } from "@lib/config"
import ProductPreview from "@modules/products/components/product-preview"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

// Helper function to safely get cheapest product price
const getProductPrice = (product: HttpTypes.StoreProduct): number => {
  if (!product.variants || product.variants.length === 0) {
    return 0
  }
  
  // Find the cheapest variant
  let cheapestPrice = Number.MAX_VALUE
  
  for (const variant of product.variants as any[]) {
    let variantPrice = 0
    
    // First check if we have calculated_price
    if (variant.calculated_price?.calculated_amount) {
      variantPrice = typeof variant.calculated_price.calculated_amount === 'number' 
        ? variant.calculated_price.calculated_amount 
        : 0
    }
    // Then check if we have prices array
    else if (variant.prices && variant.prices.length > 0) {
      const price = variant.prices[0]
      // Prices in the prices array are in cents, convert to dollars
      variantPrice = price.amount ? price.amount / 100 : 0
    }
    
    if (variantPrice > 0 && variantPrice < cheapestPrice) {
      cheapestPrice = variantPrice
    }
  }
  
  return cheapestPrice === Number.MAX_VALUE ? 0 : cheapestPrice
}

interface ProductsContentProps {
  region: HttpTypes.StoreRegion
  initialProducts: HttpTypes.StoreProduct[]
  count: number
  sortBy?: SortOptions
  categories?: string
  tags?: string
  price_min?: string
  price_max?: string
}

export default function ProductsContent({ 
  region, 
  initialProducts, 
  count,
  sortBy = "created_at",
  categories,
  tags, 
  price_min,
  price_max 
}: ProductsContentProps) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>(initialProducts)
  const [productCount, setProductCount] = useState<number>(count)
  const [categoryList, setCategoryList] = useState<HttpTypes.StoreProductCategory[]>([])
  const [tagsList, setTagsList] = useState<any[]>([])
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(1000)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await sdk.client.fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
          "/store/product-categories",
          {
            query: {
              limit: 100,
              fields: "*category_children, *parent_category",
            },
          }
        )
        setCategoryList(response.product_categories || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    // Fetch tags
    const fetchTags = async () => {
      try {
        const response = await sdk.client.fetch<{ tags: any[] }>(
          "/store/products/tag-usage",
          {
            next: {
              revalidate: 60,
              tags: ['tags'],
            }
          }
        )
        setTagsList(response.tags || [])
      } catch (error) {
        console.error("Error fetching tags:", error)
      }
    }

    // Calculate price range
    const calculatePriceRange = () => {
      const prices = products.map(product => getProductPrice(product)).filter(price => price > 0)
      if (prices.length > 0) {
        setMinPrice(Math.floor(Math.min(...prices)))
        setMaxPrice(Math.ceil(Math.max(...prices)))
      }
    }

    const loadAllData = async () => {
      setIsLoading(true)
      await Promise.all([fetchCategories(), fetchTags()])
      calculatePriceRange()
      setIsLoading(false)
    }

    loadAllData()
  }, [products])

  // Sort products if needed
  let sortedProducts = [...products]
  if (sortBy) {
    if (sortBy === "price_asc") {
      sortedProducts.sort((a, b) => {
        return getProductPrice(a) - getProductPrice(b)
      })
    } else if (sortBy === "price_desc") {
      sortedProducts.sort((a, b) => {
        return getProductPrice(b) - getProductPrice(a)
      })
    } else if (sortBy === "created_at") {
      sortedProducts.sort((a, b) => {
        return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      })
    }
  }
  
  // Get featured product (first product or null)
  const featuredProduct = sortedProducts.length > 0 ? sortedProducts[0] : null
  
  return (
    <div className="content-container">
      {/* Hero section with featured product backdrop */}
      <div className="relative overflow-hidden bg-luxury-ivory/5 mb-8">
        {/* Background with gold gradient overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          {featuredProduct?.thumbnail && (
            <div className="w-full h-full relative blur-sm">
              <Image
                src={featuredProduct.thumbnail}
                alt="Featured petha"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/30 to-luxury-charcoal/80"></div>
            </div>
          )}
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 py-8 px-4 flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl text-luxury-charcoal mb-2">
           Premium Agra Petha Selection
          </h1>
          <div className="h-px w-40 bg-luxury-gold mb-4"></div>
          <p className="text-serif-regular text-luxury-charcoal/80 max-w-2xl mb-6">
            Discover our authentic Agra pethas, each piece crafted with traditional recipes and premium ingredients for a delightful sweet experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8">
        {/* Sidebar with refinements */}
        <aside>
          {/* Product count & filters */}
          <div className="sticky top-20">
            {!isLoading && (
              <RefinementList 
                sortBy={sortBy || "created_at"}
                categories={categoryList}
                tags={tagsList}
                minPrice={minPrice}
                maxPrice={maxPrice}
                currencyCode={region.currency_code}
                productCount={productCount}
                region={region}
              />
            )}
            
          </div>
        </aside>

        {/* Main product grid */}
        <main>
          {productCount > 0 ? (
            <ul className="grid grid-cols-1 small:grid-cols-2 gap-x-8 gap-y-10">
              {sortedProducts.map((product) => (
                <li key={product.id}>
                  <ProductPreview product={product} region={region} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center">
              <h2 className="font-display text-xl text-luxury-gold mb-4">No products found</h2>
              <p className="text-serif-regular text-luxury-charcoal/80 text-center max-w-lg">
                We're currently updating our sweet collection. Please check back soon for our latest petha creations.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 