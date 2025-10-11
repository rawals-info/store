import { Suspense } from "react"
import { listProducts } from "@lib/data/products"
import { getIndiaRegion } from "@lib/constants/india-region"
import { listCategories } from "@lib/data/categories"
import { listTags } from "@lib/data/tags"
import ProductPreview from "@modules/products/components/product-preview"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { sdk } from "@lib/config"
import ProductListSkeleton from "@modules/skeletons/components/product-list-skeleton"
import type { Metadata } from "next"
import ProductsCountdownBanner from "../../../../components/ProductsCountdownBanner"

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string }> }): Promise<Metadata> {
  const { countryCode } = await params
  return {
    alternates: {
      canonical: `https://tajpetha.in/${countryCode}/products`,
    },
  }
}

type SearchParams = {
  sortBy?: string
  categories?: string
  tags?: string
  price_min?: string
  price_max?: string
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<SearchParams>
}

// Helper function to get product price
const getProductPrice = (product: any) => {
  if (!product || !product.variants || !product.variants.length) return 0
  
  const prices = product.variants
    .filter((v: any) => v.calculated_price)
    .map((v: any) => v.calculated_price.calculated_amount || 0)
  
  return prices.length > 0 ? Math.min(...prices) : 0
}

export default async function ProductsPage({ params, searchParams }: Props) {
  // Await params and searchParams
  const paramsData = await params
  const searchParamsData = await searchParams
  
  // Extract search params safely
  const sortBy = searchParamsData.sortBy || "created_at"
  const categoryFilter = searchParamsData.categories
  const tagFilter = searchParamsData.tags
  const price_min = searchParamsData.price_min
  const price_max = searchParamsData.price_max
  
  // Get country code from params
  const countryCode = paramsData.countryCode

  // Use hardcoded India region instead of API call
  const regionData = getIndiaRegion()

  // Build query params for product API
  const queryParams: Record<string, any> = {}

  // Add category filter
  if (categoryFilter) {
    queryParams.category_id = categoryFilter.split(",")
  }

  // Add tag filter
  if (tagFilter) {
    queryParams.tags = tagFilter.split(",")
  }

  // Add price filter
  if (price_min || price_max) {
    queryParams.price = {}
    if (price_min) queryParams.price.gte = parseInt(price_min)
    if (price_max) queryParams.price.lte = parseInt(price_max)
  }

  // Fetch products
  let products: any[] = []
  let productCount = 0
  try {
    const { response } = await listProducts({
      regionId: regionData.id,
      queryParams,
    })
    products = response.products
    productCount = response.count
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.error("ProductsPage: listProducts failed", e)
    }
  }

  // Fetch categories and tags concurrently to reduce overall TTFB
  let categories: HttpTypes.StoreProductCategory[] = []
  let tagsList: any[] = []

  try {
    const [categoriesResponse, tagsResponse] = await Promise.all([
      // Categories – SDK fetch gives richer object graph
      sdk.client.fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
        "/store/product-categories",
        {
          query: {
            limit: 100,
            fields: "*category_children, *parent_category",
          },
        }
      ),
      // Tags – simple helper
      listTags(),
    ])

    categories = categoriesResponse.product_categories || []
    tagsList = tagsResponse || []
  } catch (error) {
    // Only log in non-production environments
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching categories or tags:", error)
    }
  }

  // Calculate price range
  const prices = products.map(product => getProductPrice(product)).filter(price => price > 0)
  let minPrice = 0
  let maxPrice = 1000
  if (prices.length > 0) {
    minPrice = Math.floor(Math.min(...prices))
    maxPrice = Math.ceil(Math.max(...prices))
  }

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
    <div className="content-container px-0 sm:px-6 pt-16 sm:pt-0">
      {/* Mobile-Optimized Hero section with urgency */}
      <div className="relative overflow-hidden bg-gradient-to-br from-luxury-cream via-luxury-ivory to-luxury-cream mb-6 sm:mb-8">
        {/* Background with gold gradient overlay */}
        <div className="absolute inset-0 z-0 opacity-10">
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
        <div className="relative z-10 py-6 sm:py-8 px-4 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Mobile-First Flash Sale Banner - Luxury Theme */}
          <div className="bg-gradient-to-r from-luxury-charcoal via-luxury-charcoal to-black text-luxury-gold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg mb-4 flex items-center gap-2 text-xs sm:text-sm font-medium shadow-lg border border-luxury-gold/30">
            <span className="text-base sm:text-lg">🔥</span>
            <span className="font-semibold uppercase tracking-wider">Flash Sale: 20% OFF All Products!</span>
          </div>
          
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl text-luxury-charcoal mb-2 leading-tight">
            Premium Agra Petha
          </h1>
          <div className="h-px w-24 sm:w-40 bg-luxury-gold mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-luxury-charcoal/80 max-w-2xl mb-4 sm:mb-6 px-4">
            Handcrafted traditional sweets delivered fresh to your doorstep
          </p>
          
          {/* Urgency Elements - Mobile Optimized */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-2xl px-4 mb-4">
            <div className="bg-white/80 backdrop-blur-sm border border-luxury-gold/20 rounded-lg p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-luxury-gold">1000+</div>
              <div className="text-[10px] sm:text-xs text-luxury-charcoal/70 uppercase">Happy Customers</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-luxury-gold/20 rounded-lg p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-luxury-gold">24hrs</div>
              <div className="text-[10px] sm:text-xs text-luxury-charcoal/70 uppercase">Fresh Delivery</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-luxury-gold/20 rounded-lg p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-luxury-gold">⭐ 4.8</div>
              <div className="text-[10px] sm:text-xs text-luxury-charcoal/70 uppercase">Rating</div>
            </div>
          </div>
          
          {/* Sale Countdown - Synced with announcement banner */}
          <ProductsCountdownBanner />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-0 lg:gap-8">
        {/* Sidebar with refinements - Hidden on mobile, shown on desktop */}
        <aside className="hidden lg:block px-6">
          {/* Product count & filters */}
          <div className="sticky top-20">
            <RefinementList 
              sortBy={sortBy as SortOptions}
              categories={categories}
              tags={tagsList}
              minPrice={minPrice}
              maxPrice={maxPrice}
              currencyCode={regionData.currency_code}
              productCount={productCount}
              region={regionData}
            />
          </div>
        </aside>

        {/* Main product grid - Mobile optimized */}
        <main className="px-3 sm:px-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4 flex items-center justify-between px-2">
            <span className="text-sm text-luxury-charcoal/70">
              {productCount} {productCount === 1 ? 'product' : 'products'}
            </span>
          </div>
          
          <Suspense fallback={<ProductListSkeleton count={8} />}>
            {productCount > 0 ? (
              <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                {sortedProducts.map((product) => (
                  <li key={product.id}>
                    <ProductPreview product={product} region={regionData} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center px-4">
                <h2 className="font-display text-xl text-luxury-gold mb-4">No products found</h2>
                <p className="text-serif-regular text-luxury-charcoal/80 text-center max-w-lg">
                  We're currently updating our sweet collection. Please check back soon for our latest petha creations.
                </p>
              </div>
            )}
          </Suspense>
        </main>
      </div>
    </div>
  )
} 