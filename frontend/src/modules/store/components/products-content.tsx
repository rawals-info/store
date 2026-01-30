"use client"

import { useState, useEffect } from "react"
import { sdk } from "@lib/config"
import ProductPreview from "@modules/products/components/product-preview"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import ProductsCountdownBanner from "@components/ProductsCountdownBanner"

// Helper function to safely get cheapest product price
const getProductPrice = (product: HttpTypes.StoreProduct): number => {
  if (!product.variants || product.variants.length === 0) {
    return 0
  }

  let cheapestPrice = Number.MAX_VALUE

  for (const variant of product.variants as any[]) {
    let variantPrice = 0

    if (variant.calculated_price?.calculated_amount) {
      variantPrice = typeof variant.calculated_price.calculated_amount === 'number'
        ? variant.calculated_price.calculated_amount
        : 0
    }
    else if (variant.prices && variant.prices.length > 0) {
      const price = variant.prices[0]
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

  // Sort products
  let sortedProducts = [...products]
  if (sortBy) {
    if (sortBy === "price_asc") {
      sortedProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b))
    } else if (sortBy === "price_desc") {
      sortedProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a))
    } else if (sortBy === "created_at") {
      sortedProducts.sort((a, b) =>
        new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      )
    }
  }

  return (
    <div className="content-container">
      {/* Premium Hero Section */}
      <div className="relative py-12 md:py-16 mb-8 bg-gradient-to-b from-luxury-ivory to-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-luxury-gold/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-charcoal/50">
              Handcrafted in Agra
            </span>
            <div className="h-px w-12 bg-luxury-gold/50" />
          </div>

          {/* Main heading */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-luxury-charcoal font-normal mb-4">
            Premium Agra Petha
          </h1>

          {/* Subheading */}
          <p className="text-luxury-charcoal/60 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Traditional sweets crafted with authentic recipes,
            delivered fresh to your doorstep
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-8 text-luxury-charcoal/70">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs uppercase tracking-wide">1000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-xs uppercase tracking-wide">4.8 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className="text-xs uppercase tracking-wide">Fresh Delivery</span>
            </div>
          </div>

          {/* Shipping timer */}
          <ProductsCountdownBanner />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
        {/* Sidebar */}
        <aside>
          <div className="sticky top-24">
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

        {/* Products grid */}
        <main>
          {/* Results count */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-luxury-charcoal/5">
            <p className="text-sm text-luxury-charcoal/60">
              Showing <span className="font-medium text-luxury-charcoal">{productCount}</span> products
            </p>
          </div>

          {productCount > 0 ? (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <li key={product.id}>
                  <ProductPreview product={product} region={region} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <h2 className="text-xl text-luxury-charcoal mb-3">No products found</h2>
              <p className="text-sm text-luxury-charcoal/60 max-w-md">
                We're currently updating our collection. Please check back soon for our latest creations.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}