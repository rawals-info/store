import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

import CategoryHero from "@modules/categories/components/category-hero"
import ProductList from "@modules/categories/components/product-list"
import SubcategoryGrid from "@modules/categories/components/subcategory-grid"

type CategoryTemplateProps = {
  category: HttpTypes.StoreProductCategory
  countryCode: string
}

export default async function CategoryTemplate({
  category,
  countryCode,
}: CategoryTemplateProps) {
  const region = await getRegion(countryCode).catch(() => null)

  if (!region) {
    return notFound()
  }

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      category_id: [category.id],
      limit: 100,
    },
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

      <ProductList
        categoryName={category.name}
        products={products}
        region={region}
      />
    </div>
  )
} 