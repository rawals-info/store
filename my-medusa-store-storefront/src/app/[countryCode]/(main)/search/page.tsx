import { Metadata } from "next"
import { searchProducts } from "@lib/data/search"
import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { StoreRegion } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview/server"
import SearchResultsHeader from "@modules/search/components/search-results-header"
import { Pagination } from "@modules/store/components/pagination"
import ProductListSkeleton from "@modules/skeletons/components/product-list-skeleton"
import { Suspense } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@medusajs/ui"
import { redirect } from "next/navigation"

// Define a simpler category type
type Category = {
  id: string
  name?: string
  handle?: string
  description?: string
}

type SearchPageProps = {
  params: {
    countryCode: string
  }
  searchParams: {
    q?: string
    page?: string
  }
}

// Generate metadata server-side
export async function generateMetadata({ 
  params, 
  searchParams 
}: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || ""
  
  return {
    title: query ? `Search results for "${query}"` : "Search Results",
    description: query ? `Find products matching "${query}"` : "Find products you're looking for",
  }
}

const PRODUCT_LIMIT = 100 // Increased to match search.ts changes

// Make each part of the page a separate component to avoid params access issues
async function SearchContent({ 
  countryCode,
  query,
  pageNum
}: { 
  countryCode: string
  query: string
  pageNum: string
}) {
  const parsedPage = parseInt(pageNum, 10)
  const offset = (parsedPage - 1) * PRODUCT_LIMIT

  // Special case for chess searches
  if (query.toLowerCase().includes('chess')) {
    console.log('[SEARCH DEBUG] Chess search detected, preparing fallback')
  }

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
    console.log(`[SEARCH DEBUG] Found ${regions.length} regions`)
  } catch (error) {
    console.error("[SEARCH DEBUG] Error fetching regions:", error)
  }

  // Even if we can't find the exact region, attempt the search anyway with available info
  const region = regions.find(
    (r) => r.countries?.find((c) => c.iso_2 === countryCode.toLowerCase())
  )

  console.log(`[SEARCH DEBUG] Selected region:`, region?.name || "Not found")

  try {
    console.log(`[SEARCH DEBUG] Starting search for "${query}" in ${countryCode}`)
    
    const { products, count } = await searchProducts({
      query,
      limit: PRODUCT_LIMIT,
      offset,
      countryCode,
      filter: region ? { region_id: region.id } : {},
    })

    console.log(`[SEARCH DEBUG] Search completed. Found ${count} products`)

    // Special case for chess - if no results but search is for chess, redirect to category
    if (count === 0 && query.toLowerCase().includes('chess')) {
      console.log('[SEARCH DEBUG] No chess results found, redirecting to chess category')
      // Find chess category
      const chessCategory = categories.find(c => 
        (c.name?.toLowerCase() || '').includes('chess') || 
        (c.handle?.toLowerCase() || '').includes('chess')
      )
      
      if (chessCategory) {
        return redirect(`/${countryCode}/categories/${chessCategory.handle}`)
      }
    }

    const totalPages = Math.ceil(count / PRODUCT_LIMIT)

    return (
      <div className="py-10">
        <div className="content-container">
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
                        <ProductPreview product={product} region={region} />
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
    )
  } catch (error) {
    console.error("[SEARCH DEBUG] Error during search:", error);
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
export default function SearchPage({ params, searchParams }: SearchPageProps) {
  const countryCode = params.countryCode
  const query = searchParams.q || ""
  const pageNum = searchParams.page || "1"
  
  return <SearchContent countryCode={countryCode} query={query} pageNum={pageNum} />
} 