import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"

import { listProducts } from "../../../lib/data/products"
import { getRegion } from "../../../lib/data/regions"
import { getIndiaRegion } from "@lib/constants/india-region"
import { SortOptions } from "../../store/components/refinement-list/sort-products"

import CategoryHero from "../components/category-hero"
import ProductList from "../components/product-list"
import SubcategoryGrid from "../components/subcategory-grid"

type CategoryTemplateProps = {
  category: HttpTypes.StoreProductCategory
  countryCode: string
  sortBy?: SortOptions
  page?: string
}

export default async function CategoryTemplate({
  category,
  countryCode,
  sortBy,
  page,
}: CategoryTemplateProps) {
  const region = getIndiaRegion()

  if (!region) {
    return notFound()
  }

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    regionId: region?.id,
    queryParams: {
      category_id: [category.id],
      limit: 100,
    } as any,
  }).catch(() => ({ response: { products: [] } }))

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12">
      <CategoryHero category={category} />

      {category.category_children && category.category_children.length > 0 && (
        <SubcategoryGrid
          subcategories={category.category_children}
          countryCode={countryCode}
        />
      )}

      <ProductList products={products} region={region} />
    </div>
  )
} 