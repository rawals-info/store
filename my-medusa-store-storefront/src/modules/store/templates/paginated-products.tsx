"use server"

import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview/server"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductListSkeleton from "@modules/skeletons/components/product-list-skeleton"
import { Suspense } from "react"
import { cache } from "react"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

// Cached region fetch to prevent redundant requests
const getCachedRegion = cache(async (countryCode: string) => {
  return await getRegion(countryCode)
})

// Pre-fetch data outside of the component with streaming support
export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  // Get region using cached function
  const region = await getCachedRegion(countryCode)
  
  if (!region) {
    return null
  }
  
  try {
    // Fetch products with optimized parameters
    const { response, nextPage } = await listProductsWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
    })
    
    const { products, count } = response
    const totalPages = Math.ceil(count / PRODUCT_LIMIT)

    // If no products found, show a message
    if (products.length === 0) {
      return (
        <div className="flex flex-col items-center text-center py-12">
          <h3 className="text-base-regular font-semibold mb-4">No products found</h3>
          <p className="text-small-regular text-gray-700">
            Try adjusting your filters or search term
          </p>
        </div>
      )
    }

    return (
      <>
        <Suspense fallback={<ProductListSkeleton count={PRODUCT_LIMIT} />}>
          <ul
            className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8"
            data-testid="products-list"
          >
            {products.map((p) => (
              <li key={p.id}>
                <Suspense fallback={<div className="aspect-[9/16] bg-luxury-ivory/50 rounded-sm animate-pulse"></div>}>
                  <ProductPreview product={p} region={region} />
                </Suspense>
              </li>
            ))}
          </ul>
        </Suspense>
        
        {totalPages > 1 && (
          <Pagination
            data-testid="product-pagination"
            page={page}
            totalPages={totalPages}
          />
        )}
      </>
    )
  } catch (error) {
    console.error("Error fetching products:", error)
    return (
      <div className="flex flex-col items-center text-center py-12">
        <h3 className="text-base-regular font-semibold mb-4">Error loading products</h3>
        <p className="text-small-regular text-gray-700">
          Please try again later
        </p>
      </div>
    )
  }
}
