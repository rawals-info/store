import { Metadata } from "next"
import { searchProducts } from "@lib/data/search"
import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { listTags } from "@lib/data/tags"
import { StoreRegion } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview/server"
import SearchResultsHeader from "@modules/search/components/search-results-header"
import { Pagination } from "@modules/store/components/pagination"
import ProductListSkeleton from "@modules/skeletons/components/product-list-skeleton"
import { Suspense } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@medusajs/ui"
import { redirect } from "next/navigation"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sdk } from "@lib/config"

// Define a simpler category type
type Category = {
  id: string
  name?: string
  handle?: string
  description?: string
  parent_category?: any
  category_children?: Category[]
}

type SearchPageProps = {
  params: {
    countryCode: string
  }
  searchParams: {
    q?: string
    page?: string
    sort?: string
    categories?: string
    tags?: string
    price_min?: string
    price_max?: string
  }
}

// Generate metadata server-side
export async function generateMetadata({ 
  params, 
  searchParams 
}: SearchPageProps): Promise<Metadata> {
  const { q = "" } = await searchParams
  
  return {
    title: q ? `Search results for "${q}"` : "Search Results",
    description: q ? `Find products matching "${q}"` : "Find products you're looking for",
  }
}

const PRODUCT_LIMIT = 100 // Increased to match search.ts changes

// Make each part of the page a separate component to avoid params access issues
async function SearchContent({ 
  countryCode,
  query,
  pageNum,
  sort,
  categories: categoryParam,
  tags: tagParam,
  price_min,
  price_max
}: { 
  countryCode: string
  query: string
  pageNum: string
  sort?: string
  categories?: string
  tags?: string
  price_min?: string
  price_max?: string
}) {
  const parsedPage = parseInt(pageNum, 10)
  const offset = (parsedPage - 1) * PRODUCT_LIMIT

  // Get categories for suggested browsing
  const categories: Category[] = await listCategories().catch(err => {
    console.error("Failed to load categories:", err)
    return []
  })
  
  const topCategories = categories.slice(0, 4)

  if (!query) {
    return (
      <div className="py-10">
        <div className="content-container">
          <SearchResultsHeader query="" count={0} />
          <div className="flex flex-col items-center text-center py-12">
            <h2 className="text-base-regular font-semibold mb-2">No search query</h2>
            <p className="text-small-regular text-gray-700 mb-6">
              Please enter a search term to find products
            </p>
            <LocalizedClientLink href="/">
              <Button variant="secondary">Browse all products</Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    )
  }

  // Determine user region
  let regions: StoreRegion[] = []
  try {
    regions = await listRegions()
  } catch (error) {
    console.error("Error fetching regions:", error)
  }

  // Even if we can't find the exact region, attempt the search anyway with available info
  const region = regions.find(
    (r) => r.countries?.find((c) => c.iso_2 === countryCode.toLowerCase())
  )

  try {    
    const { products: fetchedProducts, count } = await searchProducts({
      query,
      limit: PRODUCT_LIMIT,
      offset,
      countryCode,
      filter: region ? { region_id: region.id } : {},
    })

    // Apply filtering based on category, tag and price
    let products = fetchedProducts

    const hasPrice = (product: any): number => {
      return product.variants?.[0]?.calculated_price?.calculated_amount || 0
    }

    if (categoryParam) {
      const catIds = categoryParam.split(",")
      products = products.filter((p) => p.categories?.some((c) => catIds.includes(c.id)))
    }

    if (tagParam) {
      const tagIds = tagParam.split(",")
      products = products.filter((p) => p.tags?.some((t) => tagIds.includes(t.id)))
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
        products = [...products].sort((a, b) => {
          const pa = hasPrice(a)
          const pb = hasPrice(b)
          return pa - pb
        })
      } else if (sort === "price_desc") {
        products = [...products].sort((a, b) => {
          const pa = hasPrice(a)
          const pb = hasPrice(b)
          return pb - pa
        })
      } else if (sort === "alpha") {
        products = [...products].sort((a, b) => a.title.localeCompare(b.title))
      }
    }

    // Fetch categories and tags for sidebar
    let categoriesList: Category[] = []
    let tagsList: any[] = []

    try {
      const [categoriesResponse, tagRes] = await Promise.all([
        sdk.client.fetch<{ product_categories: any[] }>(
          "/store/product-categories",
          {
            query: {
              limit: 100,
              fields: "*category_children,*parent_category",
            },
          }
        ),
        listTags(),
      ])

      categoriesList = categoriesResponse.product_categories || []
      tagsList = tagRes
    } catch (e) {
      console.error("failed fetching categories/tags", e)
    }

    // Price range for slider
    const prices = products.map((p) => hasPrice(p))
    const minPrice = prices.length ? Math.min(...prices) : 0
    const maxPrice = prices.length ? Math.max(...prices) : 0

    // --- Trim categories / subcategories to those present in current result set ---
    const productCategoryIds = new Set<string>()
    products.forEach((p: any) => p.categories?.forEach((c: any) => productCategoryIds.add(c.id)))

    if (productCategoryIds.size) {
      const filterCats = (cats: Category[]): Category[] => {
        return cats
          .map((cat) => {
            const child = cat.category_children as Category[] | undefined
            const filteredChildren = child ? filterCats(child) : []
            const includeSelf = productCategoryIds.has(cat.id) || filteredChildren.length
            if (!includeSelf) return null
            return { ...cat, category_children: filteredChildren } as Category
          })
          .filter(Boolean) as Category[]
      }

      categoriesList = filterCats(categoriesList)
    }

    const totalPages = Math.ceil(count / PRODUCT_LIMIT)

    return (
      <div className="py-10">
        <div className="content-container grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <RefinementList
                sortBy={(sort || "created_at") as SortOptions}
                categories={categoriesList}
                tags={tagsList}
                minPrice={minPrice}
                maxPrice={maxPrice}
                currencyCode={region?.currency_code || ""}
                productCount={products.length}
                region={region}
                search
              />
            </div>
          </aside>

          {/* Main section */}
          <div>
            <SearchResultsHeader query={query} count={count} />

            {count > 0 ? (
              <>
                <Suspense fallback={<ProductListSkeleton count={PRODUCT_LIMIT} />}>
                  <ul
                    className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8 py-6"
                    data-testid="search-results-list"
                  >
                    {products.map((product) => (
                      <li key={product.id}>
                        <Suspense fallback={<div className="aspect-[9/16] bg-luxury-ivory/50 rounded-sm animate-pulse"></div>}>
                          <ProductPreview 
                            product={product} 
                            region={region} 
                          />
                        </Suspense>
                      </li>
                    ))}
                  </ul>
                </Suspense>
                
                {totalPages > 1 && (
                  <Pagination
                    page={parsedPage}
                    totalPages={totalPages}
                    searchParams={new URLSearchParams({
                      q: query,
                      sort,
                      categories: categoryParam,
                      tags: tagParam,
                      price_min,
                      price_max
                    })}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-12">
                <h2 className="text-base-regular font-semibold mb-2">No results found for "{query}"</h2>
                <p className="text-small-regular text-gray-700 mb-6">
                  Try different keywords or browse our collections
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-lg">
                  <LocalizedClientLink href="/">
                    <Button variant="secondary" className="w-full">Browse all products</Button>
                  </LocalizedClientLink>
                  <LocalizedClientLink href="/categories">
                    <Button variant="secondary" className="w-full">View categories</Button>
                  </LocalizedClientLink>
                </div>
                
                {topCategories.length > 0 && (
                  <div className="w-full max-w-lg">
                    <h3 className="text-base-regular font-medium mb-4">Browse popular categories</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {topCategories.map((category) => (
                        <LocalizedClientLink 
                          key={category.id} 
                          href={`/categories/${category.handle}`}
                          className="text-sm py-2 px-4 border border-gray-200 hover:border-luxury-gold rounded-md transition-colors"
                        >
                          {category.name}
                        </LocalizedClientLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error during search:", error);
    return (
      <div className="py-10">
        <div className="content-container">
          <SearchResultsHeader query={query} count={0} />
          <div className="flex flex-col items-center text-center py-12">
            <h2 className="text-base-regular font-semibold mb-2">Something went wrong</h2>
            <p className="text-small-regular text-gray-700 mb-6">
              We encountered an issue with your search. Please try again later.
            </p>
            <LocalizedClientLink href="/">
              <Button variant="secondary">Return to homepage</Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    )
  }
}

// Main page component that uses the search content component
export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { countryCode } = await params
  const { q = "", page = "1", sort, categories, tags, price_min, price_max } = await searchParams
  const query = q
  const pageNum = page
  
  return <SearchContent countryCode={countryCode} query={query} pageNum={pageNum} sort={sort} categories={categories} tags={tags} price_min={price_min} price_max={price_max} />
} 