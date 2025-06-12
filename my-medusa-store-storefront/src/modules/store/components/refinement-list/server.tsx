import { SortOptions } from "./sort-products"
import ClientRefinementList from "./index"
import { HttpTypes } from "@medusajs/types"

export default function RefinementList({
  sortBy,
  categories = [],
  tags = [],
  minPrice,
  maxPrice,
  currencyCode,
  productCount,
  region,
  "data-testid": dataTestId,
}: {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
  categories?: {
    id: string
    name: string
    handle: string
    products_count?: number
  }[]
  tags?: {
    id: string
    value: string
    products_count?: number
  }[]
  minPrice: number
  maxPrice: number
  currencyCode: string
  productCount?: number
  region: HttpTypes.StoreRegion
}) {
  return (
    <ClientRefinementList
      sortBy={sortBy}
      categories={categories}
      tags={tags}
      minPrice={minPrice}
      maxPrice={maxPrice}
      currencyCode={currencyCode}
      productCount={productCount}
      region={region}
      data-testid={dataTestId}
    />
  )
} 