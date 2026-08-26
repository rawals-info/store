import { Metadata } from "next"
import { searchProducts } from "@lib/data/search"
import { listProducts } from "@lib/data/products"
import { getIndiaRegion } from "@lib/constants/india-region"
import { listCategories } from "@lib/data/categories"
import { listTags } from "@lib/data/tags"
import ProductPreview from "@modules/products/components/product-preview"
import SearchResultsHeader from "@modules/search/components/search-results-header"
import { Pagination } from "@modules/store/components/pagination"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import Link from "next/link"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { Search, Sparkles, ShoppingBag, ArrowRight } from "lucide-react"

type Category = {
  id: string
  name?: string
  handle?: string
  description?: string
  parent_category?: any
  category_children?: Category[]
}

type SearchPageProps = {
  params: Promise<{
    countryCode: string
  }>
  searchParams: Promise<{
    q?: string
    page?: string
    sort?: string
    categories?: string
    tags?: string
    price_min?: string
    price_max?: string
  }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q = "" } = await searchParams
  return {
    title: q ? `Search Results for "${q}" | Taj Petha Agra` : "Search Authentic Agra Sweets | Taj Petha",
    description: q ? `Browse authentic Agra petha and snacks matching "${q}".` : "Search our full handcrafted confectionery catalog.",
  }
}

const PRODUCT_LIMIT = 24

const CATEGORY_TABS = [
  { label: "✨ All Sweets", href: "/products" },
  { label: "🍬 Agra Petha", href: "/products?category=petha" },
  { label: "🥜 Royal Dalmoth", href: "/products?category=dalmoth" },
  { label: "🌶️ Crispy Namkeen", href: "/products?category=namkeen" },
  { label: "🎁 Sweet Gift Boxes", href: "/products?category=combo" },
]

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { countryCode } = await params
  const { q = "", page = "1", sort, categories: categoryParam, tags: tagParam, price_min, price_max } = await searchParams

  const query = q.trim()
  const parsedPage = parseInt(page, 10) || 1
  const offset = (parsedPage - 1) * PRODUCT_LIMIT
  const region = getIndiaRegion()

  // Fetch search results
  let { products: searchHits, count } = await searchProducts({
    query,
    limit: PRODUCT_LIMIT,
    offset,
    countryCode,
    filter: region ? { region_id: region.id } : {},
  })

  // Also fetch bestsellers if 0 results
  let fallbackProducts: any[] = []
  if (searchHits.length === 0) {
    try {
      const fallbackRes = await listProducts({
        regionId: region.id,
        queryParams: { limit: 8 },
      })
      fallbackProducts = fallbackRes.response.products || []
    } catch (e) {}
  }

  // Fetch categories and tags for sidebar
  const [categoriesList, tagsList] = await Promise.all([
    listCategories().catch(() => [] as Category[]),
    listTags().catch(() => [] as any[]),
  ])

  let products = searchHits

  const hasPrice = (product: any): number => {
    return product.variants?.[0]?.calculated_price?.calculated_amount || 0
  }

  if (categoryParam) {
    const catIds = categoryParam.split(",")
    products = products.filter((p) => p.categories?.some((c: any) => catIds.includes(c.id) || catIds.includes(c.handle)))
  }

  if (tagParam) {
    const tagIds = tagParam.split(",")
    products = products.filter((p) => p.tags?.some((t: any) => tagIds.includes(t.id)))
  }

  if (price_min || price_max) {
    const min = price_min ? parseInt(price_min) : 0
    const max = price_max ? parseInt(price_max) : Number.MAX_SAFE_INTEGER
    products = products.filter((p) => {
      const price = hasPrice(p)
      return price >= min && price <= max
    })
  }

  if (sort) {
    if (sort === "price_asc") {
      products = [...products].sort((a, b) => hasPrice(a) - hasPrice(b))
    } else if (sort === "price_desc") {
      products = [...products].sort((a, b) => hasPrice(b) - hasPrice(a))
    } else if (sort === "alpha") {
      products = [...products].sort((a, b) => a.title.localeCompare(b.title))
    }
  }

  const prices = products.map((p) => hasPrice(p)).filter(p => p > 0)
  const minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0
  const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 1000

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12 font-jakarta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search Header Banner */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-8 shadow-sm space-y-4">
          <Breadcrumb
            items={[
              { label: "Search", href: `/${countryCode}/search` },
              ...(query ? [{ label: `"${query}"`, isCurrent: true }] : [{ label: "All Delicacies", isCurrent: true }]),
            ]}
            countryCode={countryCode}
            className="p-0 bg-transparent border-0"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-petha-amber block">
                Storefront Search
              </span>
              <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                {query ? `Search Results for "${query}"` : "Search Agra Sweets"}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {products.length > 0
                  ? `Showing ${products.length} matching delicacies found in our Agra kitchen.`
                  : `No exact sweet matches found for "${query}".`}
              </p>
            </div>

            {/* In-page search input */}
            <form action={`/${countryCode}/search`} method="GET" className="w-full sm:w-80">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search white petha, dalmoth, paan..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
                />
              </div>
            </form>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {CATEGORY_TABS.map((tab) => (
              <Link
                key={tab.label}
                href={`/${countryCode}${tab.href}`}
                className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-slate-50 hover:bg-petha-amber hover:text-white border border-slate-200 transition-all shadow-xs"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Results Grid with Sidebar */}
        <div className="flex flex-col small:flex-row small:items-start gap-8">
          <RefinementList
            sortBy={sort as SortOptions}
            categories={categoriesList as any}
            tags={tagsList}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          <div className="flex-1 w-full min-w-0">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductPreview
                      key={product.id}
                      product={product}
                      region={region}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pt-8">
                    <Pagination
                      page={parsedPage}
                      totalPages={totalPages}
                      searchParams={new URLSearchParams(Object.entries({
                        q: query,
                        sort,
                        categories: categoryParam,
                        tags: tagParam,
                        price_min,
                        price_max,
                      }).filter(([, v]) => v) as any)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-8">
                {/* Friendly Empty Banner */}
                <div className="bg-white rounded-3xl border border-amber-100/90 p-8 sm:p-12 text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-petha-amber flex items-center justify-center mx-auto text-2xl shadow-xs">
                    🔍
                  </div>
                  <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
                    No Exact Matches for "{query}"
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    We couldn't find sweets matching this exact keyword, but you might love these top-selling authentic Agra delicacies below!
                  </p>
                  <div>
                    <Link
                      href={`/${countryCode}/products`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                      <span>Explore All Fresh Sweets</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Bestseller Recommendations */}
                {fallbackProducts.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-petha-amber" />
                      <h4 className="font-cormorant text-2xl font-bold text-slate-900">
                        Trending Royal Agra Delicacies
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {fallbackProducts.map((p) => (
                        <ProductPreview
                          key={p.id}
                          product={p}
                          region={region}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}