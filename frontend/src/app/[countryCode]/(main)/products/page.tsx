import { Suspense } from "react"
import { listProducts } from "@lib/data/products"
import { getIndiaRegion } from "@lib/constants/india-region"
import { listCategories } from "@lib/data/categories"
import { listTags } from "@lib/data/tags"
import ProductPreview from "@modules/products/components/product-preview/server"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { sdk } from "@lib/config"
import ProductListSkeleton from "@modules/skeletons/components/product-list-skeleton"

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
  const { response } = await listProducts({
    regionId: regionData.id,
    queryParams,
  })

  const products = response.products
  const productCount = response.count

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
          Indulge in our hand‑refined Petha recipes—each cube a taste of centuries‑old tradition and pure cane sugar bliss.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8">
        {/* Sidebar with refinements */}
        <aside>
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

        {/* Main product grid */}
        <main>
          <Suspense fallback={<ProductListSkeleton count={8} />}>
            {productCount > 0 ? (
              <ul className="grid grid-cols-1 small:grid-cols-2 gap-x-8 gap-y-10">
                {sortedProducts.map((product) => (
                  <li key={product.id}>
                    <ProductPreview product={product} region={regionData} />
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
          </Suspense>
        </main>
      </div>
    </div>
  )
} 