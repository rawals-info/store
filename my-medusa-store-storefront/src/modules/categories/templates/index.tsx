"use client"

import { notFound } from "next/navigation"
import { Suspense, memo, useState, useEffect } from "react"
import { motion } from "framer-motion"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { getRegion } from "@lib/data/regions"

// Memoize child components for better performance
const CategoryBreadcrumbs = memo(({ 
  parents, 
  categoryName 
}: { 
  parents: HttpTypes.StoreProductCategory[], 
  categoryName: string 
}) => {
  return (
    <div className="flex flex-row mb-8 items-center gap-2 flex-wrap">
      {parents.length > 0 && (
        <div className="flex items-center text-luxury-charcoal/70 text-base-regular">
          <LocalizedClientLink
            className="hover:text-luxury-gold transition-colors duration-300 inline-flex items-center"
            href="/categories"
          >
            <span>Categories</span>
          </LocalizedClientLink>
          <span className="mx-2 text-luxury-gold/40">/</span>
        </div>
      )}
      
      {parents &&
        parents.map((parent) => (
          <div key={parent.id} className="flex items-center text-luxury-charcoal/70">
            <LocalizedClientLink
              className="hover:text-luxury-gold transition-colors duration-300 inline-flex items-center"
              href={`/categories/${parent.handle}`}
              data-testid="sort-by-link"
              prefetch={true}
            >
              <span>{parent.name}</span>
            </LocalizedClientLink>
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
})

// Memoize subcategories component for better performance
const SubCategories = memo(({ 
  children 
}: { 
  children: HttpTypes.StoreProductCategory[] 
}) => {
  // Track navigation state to prevent multiple clicks
  const [navigating, setNavigating] = useState<string | null>(null);
  
  const handleCategoryClick = (id: string) => {
    if (navigating) return; // Prevent multiple clicks
    setNavigating(id);
    
    // Reset after navigation completes or times out
    setTimeout(() => {
      setNavigating(null);
    }, 1000);
  };
  
  if (!children || children.length === 0) return null
  
  return (
    <div className="mb-14 text-base-large">
      <h2 className="font-display text-xl mb-5 text-luxury-charcoal flex items-center">
        <span>Browse Subcategories</span>
        <span className="ml-3 h-px flex-grow bg-luxury-gold/20"></span>
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {children.map((c) => (
          <li key={c.id}>
            <div className={`transition-all duration-300 hover:translate-y-[-3px] hover:shadow-md ${
              navigating === c.id ? 'pointer-events-none opacity-70' : ''
            }`}>
              <LocalizedClientLink 
                href={`/categories/${c.handle}`}
                className="block p-5 border border-luxury-gold/10 rounded-md bg-luxury-ivory hover:border-luxury-gold/30 transition-all duration-300"
                onClick={() => handleCategoryClick(c.id)}
                prefetch={true}
              >
                <div className="flex items-center justify-between">
                  <span className="text-luxury-gold font-display">{c.name}</span>
                  <span className="text-luxury-gold/60">
                    {navigating === c.id ? '...' : '→'}
                  </span>
                </div>
                {c.description && (
                  <p className="mt-2 text-sm text-luxury-charcoal/70 leading-relaxed">{c.description}</p>
                )}
              </LocalizedClientLink>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
})

// Main category template component
export default function CategoryTemplate({
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
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null)

  // Fetch region data for refinement list
  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const regionData = await getRegion(countryCode)
        setRegion(regionData)
      } catch (error) {
        console.error("Error fetching region:", error)
      }
    }
    
    fetchRegion()
  }, [countryCode])

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
    <div
      className="flex flex-col small:flex-row small:items-start py-10 content-container"
      data-testid="category-container"
    >
      {region ? (
        <RefinementList 
          sortBy={sort} 
          data-testid="sort-by-container" 
          minPrice={0}
          maxPrice={10000}
          currencyCode={region.currency_code || "USD"}
          region={region}
        />
      ) : (
        <div className="w-64 mr-6 hidden small:block">
          <div className="animate-pulse bg-gray-100 h-8 w-full rounded mb-4"></div>
          <div className="animate-pulse bg-gray-100 h-4 w-3/4 rounded mb-2"></div>
          <div className="animate-pulse bg-gray-100 h-4 w-1/2 rounded mb-4"></div>
          <div className="animate-pulse bg-gray-100 h-8 w-full rounded"></div>
        </div>
      )}
      <div className="w-full">
        {/* Breadcrumbs navigation */}
        <CategoryBreadcrumbs parents={parents} categoryName={category.name} />
        
        {/* Category description */}
        {category.description && (
          <div className="mb-10 text-base-regular text-luxury-charcoal/80 max-w-2xl">
            <p className="leading-relaxed">{category.description}</p>
          </div>
        )}
        
        {/* Child categories with optimized rendering */}
        <SubCategories children={category.category_children || []} />
        
        {/* Products grid with optimized loading */}
        <div className="relative">
          <div className="absolute -top-3 left-0 right-0 h-px bg-luxury-gold/10" />
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={8}
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
