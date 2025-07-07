import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col small:flex-row small:items-start py-12 content-container">
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="flex flex-col mb-16">
          <h1 className="font-display text-4xl text-luxury-charcoal mb-2">
            {collection.title}
          </h1>
          <div className="h-px w-20 bg-luxury-gold mb-8"></div>
          <p className="text-serif-regular text-luxury-charcoal/80 max-w-xl">
            {collection.metadata?.description || "Discover our exclusive collection of handcrafted marble pieces."}
          </p>
        </div>
        
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
