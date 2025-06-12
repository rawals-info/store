import { notFound } from "next/navigation"
import { Suspense, memo } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// Memoize child components for better performance
const CategoryBreadcrumbs = ({ 
  parents, 
  categoryName,
  countryCode
}: { 
  parents: HttpTypes.StoreProductCategory[], 
  categoryName: string,
  countryCode: string
}) => {
  return (
    <div className="flex flex-row mb-8 items-center gap-2 flex-wrap">
      {parents.length > 0 && (
        <div className="flex items-center text-luxury-charcoal/70 text-base-regular">
          <Link
            className="hover:text-luxury-gold transition-colors duration-300 inline-flex items-center"
            href={`/${countryCode}/categories`}
          >
            <span>Categories</span>
          </Link>
          <span className="mx-2 text-luxury-gold/40">/</span>
        </div>
      )}
      
      {parents &&
        parents.map((parent) => (
          <div key={parent.id} className="flex items-center text-luxury-charcoal/70">
            <Link
              className="hover:text-luxury-gold transition-colors duration-300 inline-flex items-center"
              href={`/${countryCode}/categories/${parent.handle}`}
              data-testid="sort-by-link"
              prefetch={true}
            >
              <span>{parent.name}</span>
            </Link>
            <span className="mx-2 text-luxury-gold/40">/</span>
          </div>
        ))}
      
      <h1 
        className="font-display text-2xl text-luxury-charcoal relative inline-flex"
        data-testid="category-page-title"
      >
        {categoryName}
        <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-luxury-gold/30" />
      </h1>
    </div>
  )
}

// Memoize subcategories component for better performance
const SubCategories = ({ 
  children,
  countryCode
}: { 
  children: HttpTypes.StoreProductCategory[],
  countryCode: string
}) => {
  if (!children || children.length === 0) return null
  
  return (
    <div className="mb-10 text-base-large">
      <h2 className="font-display text-xl mb-5 text-luxury-charcoal flex items-center">
        <span>Browse Subcategories</span>
        <span className="ml-3 h-px flex-grow bg-luxury-gold/20"></span>
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {children.map((c) => (
          <li key={c.id}>
            <div className="transition-all duration-300 hover:translate-y-[-3px] hover:shadow-md">
              <Link 
                href={`/${countryCode}/categories/${c.handle}`}
                className="block p-5 border border-luxury-gold/10 rounded-md bg-luxury-ivory hover:border-luxury-gold/30 transition-all duration-300"
                prefetch={true}
              >
                <div className="flex items-center justify-between">
                  <span className="text-luxury-gold font-display">{c.name}</span>
                  <span className="text-luxury-gold/60">→</span>
                </div>
                {c.description && (
                  <p className="mt-2 text-sm text-luxury-charcoal/70 leading-relaxed">{c.description}</p>
                )}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Main category template component - now a server component
export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  
  // Fetch region directly instead of using useState and useEffect
  const region = await getRegion(countryCode)

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="py-10 content-container" data-testid="category-container">
      {/* Breadcrumbs navigation */}
      <CategoryBreadcrumbs parents={parents} categoryName={category.name} countryCode={countryCode} />
      
      {/* Category description */}
      {category.description && (
        <div className="mb-8 text-base-regular text-luxury-charcoal/80 max-w-2xl">
          <p className="leading-relaxed">{category.description}</p>
        </div>
      )}
      
      {/* Child categories with optimized rendering */}
      <SubCategories children={category.category_children || []} countryCode={countryCode} />
      
      {/* Products grid */}
      <div className="w-full">
        <div className="relative">
          <div className="absolute -top-3 left-0 right-0 h-px bg-luxury-gold/10" />
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={12}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
