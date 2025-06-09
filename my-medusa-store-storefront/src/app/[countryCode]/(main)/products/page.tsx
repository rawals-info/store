"use server"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { listTags } from "@lib/data/tags"
import ProductPreview from "@modules/products/components/product-preview"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

interface ProductsPageProps {
  params: {
    countryCode: string
  }
  searchParams: {
    sortBy?: SortOptions
    categories?: string
    tags?: string
    price_min?: string
    price_max?: string
  }
}

// Helper function to safely get product price
const getProductPrice = (product: HttpTypes.StoreProduct): number => {
  if (!product.variants || product.variants.length === 0) {
    return 0
  }
  
  return product.variants[0]?.calculated_price?.calculated_amount || 0
}

export default async function ProductsPage(props: ProductsPageProps) {
  const params = await props.params
  const countryCode = params.countryCode
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  // Get search params
  const searchParams = await props.searchParams
  const { sortBy = "created_at", categories, tags, price_min, price_max } = searchParams

  // Build query params for product API
  const queryParams: Record<string, any> = {}
  
  // Add category filter
  if (categories) {
    queryParams.category_id = categories.split(",")
  }
  
  // Add tag filter
  if (tags) {
    queryParams.tags = tags.split(",")
  }
  
  // Add price range filter
  if (price_min || price_max) {
    queryParams.price = {}
    if (price_min) queryParams.price.gte = parseInt(price_min)
    if (price_max) queryParams.price.lte = parseInt(price_max)
  }

  // Fetch products with filters
  const {
    response: { products, count },
  } = await listProducts({
    regionId: region.id,
    queryParams,
  })
  
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
  
  // Fetch categories for filtering
  const categories_list = await listCategories()
  
  // Fetch tags for filtering
  const tags_list = await listTags()
  
  // Calculate min and max prices for the price range filter
  // First get all products without price filtering to calculate proper range
  const { response: { products: allProducts } } = await listProducts({
    regionId: region.id,
    queryParams: {
      category_id: queryParams.category_id,
      tags: queryParams.tags,
      // Don't include price filter here
    },
  })
  
  const prices = allProducts.map(product => getProductPrice(product)).filter(price => price > 0)
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000
  
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
                alt="Featured marble"
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
            Luxury Handcrafted Collection
          </h1>
          <div className="h-px w-40 bg-luxury-gold mb-4"></div>
          <p className="text-serif-regular text-luxury-charcoal/80 max-w-2xl mb-6">
            Discover our handcrafted marble masterpieces, each one a testament to generations of 
            artisanal tradition and meticulous attention to detail.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8">
        {/* Sidebar with refinements */}
        <aside>
          {/* Product count & filters */}
          <div className="sticky top-20">
            <RefinementList 
              sortBy={sortBy}
              categories={categories_list}
              tags={tags_list}
              minPrice={minPrice}
              maxPrice={maxPrice}
              currencyCode={region.currency_code}
              productCount={count}
              region={region}
            />
            
            {/* Trustpilot-style testimonial */}
            <div className="mt-8 p-4 border border-luxury-gold/20 bg-luxury-cream/10 rounded-sm">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-serif-italic text-sm text-luxury-charcoal/80 mb-2">
                "Absolutely stunning craftsmanship. The marble table is a conversation piece in our home."
              </p>
              <p className="text-xs text-luxury-charcoal/60">Emily W., Verified Customer</p>
            </div>
          </div>
        </aside>

        {/* Main product grid */}
        <main>
          {count > 0 ? (
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
                We're currently updating our collection. Please check back soon for our latest creations.
              </p>
            </div>
          )}
          
          {/* Value proposition section */}
          {count > 0 && (
            <div className="mt-16 border-t border-luxury-gold/20 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-luxury-cream/10 border border-luxury-gold/30 mb-4">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <h3 className="font-display text-sm uppercase tracking-wider text-luxury-charcoal mb-1">Artisan Crafted</h3>
                  <p className="text-xs text-luxury-charcoal/70">Each piece individually handcrafted with precision</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-luxury-cream/10 border border-luxury-gold/30 mb-4">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="font-display text-sm uppercase tracking-wider text-luxury-charcoal mb-1">Premium Materials</h3>
                  <p className="text-xs text-luxury-charcoal/70">Sourced from the finest marble quarries worldwide</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-luxury-cream/10 border border-luxury-gold/30 mb-4">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h3 className="font-display text-sm uppercase tracking-wider text-luxury-charcoal mb-1">Free Shipping</h3>
                  <p className="text-xs text-luxury-charcoal/70">Complimentary white-glove delivery service</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 