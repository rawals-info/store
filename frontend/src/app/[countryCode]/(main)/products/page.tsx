import { Suspense } from "react"
import { listProducts } from "@lib/data/products"
import { getIndiaRegion } from "@lib/constants/india-region"
import { listCategories } from "@lib/data/categories"
import { listTags } from "@lib/data/tags"
import ProductPreview from "@modules/products/components/product-preview"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import ProductListSkeleton from "@modules/skeletons/components/product-list-skeleton"
import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles, Truck, ShieldCheck } from "lucide-react"

import Breadcrumb from "@modules/common/components/breadcrumb"

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string }> }): Promise<Metadata> {
  const { countryCode } = await params
  return {
    title: "Buy Authentic Agra Petha Online | Fresh Dalmoth & Namkeen | Taj Petha",
    description: "Buy 100% authentic Agra petha and crispy dalmoth online. Handcrafted daily by master halwais, vacuum-sealed, and delivered fresh across India in 24–48 hours. Free shipping above ₹500. Order now!",
    keywords: [
      "buy petha online",
      "buy agra petha",
      "best petha in agra",
      "order petha online",
      "authentic agra petha",
      "kesar petha online",
      "dry petha buy online",
      "paan petha online",
      "chocolate petha online",
      "angoori petha online",
      "agra dalmoth online",
      "fresh namkeen buy online",
      "taj petha online order",
      "petha home delivery"
    ],
    openGraph: {
      title: "Buy Authentic Agra Petha Online | Taj Petha India",
      description: "Order authentic Agra petha & fresh namkeen direct to your doorstep with same-day dispatch and 30-day freshness guarantee.",
      url: `https://tajpetha.in/${countryCode}/products`,
      type: "website",
      images: [{ url: "/hero_image.webp", width: 1200, height: 630, alt: "Buy Authentic Agra Petha Online" }]
    },
    twitter: {
      card: "summary_large_image",
      title: "Buy Authentic Agra Petha Online | Taj Petha India",
      description: "Order authentic Agra petha online. 50,000+ happy sweet lovers nationwide!",
      images: ["/hero_image.webp"]
    },
    alternates: {
      canonical: `https://tajpetha.in/${countryCode}/products`,
    },
    robots: { index: true, follow: true }
  }
}

type SearchParams = {
  sortBy?: string
  categories?: string
  category?: string
  tags?: string
  price_min?: string
  price_max?: string
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<SearchParams>
}

const getProductPrice = (product: any) => {
  if (!product || !product.variants || !product.variants.length) return 0

  const prices = product.variants
    .filter((v: any) => v.calculated_price)
    .map((v: any) => v.calculated_price.calculated_amount || 0)

  return prices.length > 0 ? Math.min(...prices) : 0
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const paramsData = await params
  const searchParamsData = await searchParams

  const sortBy = searchParamsData.sortBy || "created_at"
  const rawCategory = searchParamsData.category || searchParamsData.categories || ""
  const tagFilter = searchParamsData.tags
  const price_min = searchParamsData.price_min
  const price_max = searchParamsData.price_max
  const countryCode = paramsData.countryCode

  const regionData = getIndiaRegion()

  // Fetch categories first to resolve handles to IDs
  let categories: HttpTypes.StoreProductCategory[] = []
  let tagsList: any[] = []

  try {
    const [categoriesResponse, tagsResponse] = await Promise.all([
      sdk.client.fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
        "/store/product-categories",
        { query: { limit: 100, fields: "*category_children, *parent_category" } }
      ).catch(() => ({ product_categories: [] })),
      listTags().catch(() => []),
    ])
    categories = categoriesResponse.product_categories || []
    tagsList = tagsResponse || []
  } catch (error) {}

  const queryParams: Record<string, any> = {}
  
  if (rawCategory) {
    const categoryTokens = rawCategory.split(",")
    const resolvedIds: string[] = []
    
    categoryTokens.forEach(token => {
      const matched = categories.find(c => c.handle === token || c.id === token || c.name?.toLowerCase().includes(token.toLowerCase()))
      if (matched) {
        resolvedIds.push(matched.id)
      } else {
        resolvedIds.push(token)
      }
    })
    
    if (resolvedIds.length > 0) {
      queryParams.category_id = resolvedIds
    }
  }

  if (tagFilter) queryParams.tags = tagFilter.split(",")
  if (price_min || price_max) {
    queryParams.price = {}
    if (price_min) queryParams.price.gte = parseInt(price_min)
    if (price_max) queryParams.price.lte = parseInt(price_max)
  }

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
    products = []
  }

  const prices = products.map(product => getProductPrice(product)).filter(price => price > 0)
  let minPrice = 0
  let maxPrice = 1000
  if (prices.length > 0) {
    minPrice = Math.floor(Math.min(...prices))
    maxPrice = Math.ceil(Math.max(...prices))
  }

  let sortedProducts = [...products]
  if (sortBy === "price_asc") {
    sortedProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b))
  } else if (sortBy === "price_desc") {
    sortedProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a))
  } else if (sortBy === "created_at") {
    sortedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Agra Petha & Namkeen Sweets Catalog",
    "description": "Authentic Agra Petha varieties and fresh Dalmoth snacks available for online ordering.",
    "numberOfItems": sortedProducts.length,
    "itemListElement": sortedProducts.map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": p.title,
      "url": `https://tajpetha.in/${countryCode}/products/${p.handle}`,
      "image": p.thumbnail || "https://tajpetha.in/hero_image.webp"
    }))
  }

  const CATEGORY_TABS = [
    { label: "✨ All Sweets", value: "" },
    { label: "🍬 Agra Petha", value: "petha" },
    { label: "🥜 Royal Dalmoth", value: "dalmoth" },
    { label: "🌶️ Crispy Namkeen", value: "namkeen" },
    { label: "🎁 Sweet Gift Boxes", value: "combo" },
  ]

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12 font-jakarta">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div>
          <Breadcrumb
            items={
              rawCategory
                ? [
                    { label: "All Sweets", href: `/${countryCode}/products` },
                    { label: rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1), isCurrent: true }
                  ]
                : [{ label: "All Sweets", isCurrent: true }]
            }
            countryCode={countryCode}
            className="mb-4 rounded-2xl border border-amber-100/90 shadow-xs"
          />

          <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-petha-amber font-bold inline-block px-3 py-1 rounded-full bg-amber-100/70 mb-2">
                  Direct From Agra Halwais
                </span>
                <h1 className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                  Buy Authentic Agra Petha &amp; Fresh Namkeen
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                  Crafted daily in small batches with ash gourd, cane sugar syrup, and royal spices. Sealed for 30-day doorstep freshness across India.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 flex-shrink-0">
                <span className="text-2xl">🌱</span>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">100% Pure Vegetarian</p>
                  <p className="text-emerald-700 font-semibold">Free Shipping ₹500+</p>
                </div>
              </div>
            </div>

            {/* Quick Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-100 no-scrollbar">
              {CATEGORY_TABS.map((tab) => {
                const isActive = (tab.value === "" && !rawCategory) || (tab.value !== "" && rawCategory.toLowerCase().includes(tab.value))
                const href = tab.value ? `/${countryCode}/products?category=${tab.value}` : `/${countryCode}/products`
                return (
                  <Link
                    key={tab.label}
                    href={href}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "bg-white hover:bg-amber-50 border border-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col small:flex-row small:items-start gap-8">
          <RefinementList
            sortBy={sortBy as SortOptions}
            categories={categories}
            tags={tagsList}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          <div className="flex-1 w-full min-w-0">
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-amber-100/90 p-12 text-center space-y-4">
                <span className="text-4xl">🍬</span>
                <h3 className="font-cormorant text-2xl font-bold text-slate-800">No sweets match this filter</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your category or price filters to see all authentic Agra sweets.
                </p>
                <Link
                  href={`/${countryCode}/products`}
                  className="inline-block px-5 py-2.5 rounded-full bg-petha-amber text-white font-bold text-xs uppercase tracking-wider"
                >
                  View All Sweets
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                {sortedProducts.map((p) => (
                  <ProductPreview
                    key={p.id}
                    product={p}
                    region={regionData}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}