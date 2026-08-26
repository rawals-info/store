"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { XMarkMini } from "@medusajs/icons"
import SortProducts, { SortOptions } from "./sort-products"
import FilterDropdown from "@modules/common/components/filter-dropdown"
import PriceRange from "@modules/common/components/price-range"
import FilterTag from "@modules/common/components/filter-tag"
import { HttpTypes } from "@medusajs/types"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
  categories?: {
    id: string
    name: string
    handle: string
    products_count?: number
    parent_category?: any
    category_children?: any[]
  }[]
  tags?: {
    id: string
    value: string
    products_count?: number
  }[]
  minPrice?: number
  maxPrice?: number
  currencyCode?: string
  productCount?: number
  region?: HttpTypes.StoreRegion
}

const RefinementList = ({ 
  sortBy, 
  categories = [],
  tags = [],
  minPrice,
  maxPrice,
  currencyCode,
  productCount,
  region,
  'data-testid': dataTestId 
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!

  const safeMinPrice = minPrice ?? 0
  const safeMaxPrice = maxPrice ?? 0
  const safeCurrencyCode = currencyCode ?? "INR"
  
  const [localCategories, setLocalCategories] = useState<typeof categories>(categories)
  
  useEffect(() => {
    if (categories.length > 0) {
      setLocalCategories(categories)
    }
  }, [categories])

  const categoryIds = searchParams.get("categories")?.split(",").filter(Boolean) || []
  const tagIds = searchParams.get("tags")?.split(",").filter(Boolean) || []
  const priceMinParam = searchParams.get("price_min")
  const priceMaxParam = searchParams.get("price_max")

  const currentPriceRange: [number, number] = [
    priceMinParam ? parseInt(priceMinParam) : safeMinPrice,
    priceMaxParam ? parseInt(priceMaxParam) : safeMaxPrice
  ]

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams.toString())
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          newParams.delete(key)
        } else {
          newParams.set(key, String(value))
        }
      })
      
      return newParams.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString({ [name]: value })
    router.push(`${pathname}?${query}`)
  }

  const handleCategoryChange = (id: string) => {
    const updated = categoryIds.includes(id)
      ? categoryIds.filter(cId => cId !== id)
      : [...categoryIds, id]
    
    const query = createQueryString({
      categories: updated.length ? updated.join(",") : null
    })
    router.push(`${pathname}?${query}`)
  }

  const handleTagChange = (id: string) => {
    const updated = tagIds.includes(id)
      ? tagIds.filter(tId => tId !== id)
      : [...tagIds, id]
    
    const query = createQueryString({
      tags: updated.length ? updated.join(",") : null
    })
    router.push(`${pathname}?${query}`)
  }

  const handlePriceChange = (values: [number, number]) => {
    const query = createQueryString({
      price_min: values[0] > safeMinPrice ? values[0] : null,
      price_max: values[1] < safeMaxPrice ? values[1] : null
    })
    router.push(`${pathname}?${query}`)
  }

  const clearAllFilters = () => {
    router.push(pathname)
  }

  const hasActiveFilters = categoryIds.length > 0 || tagIds.length > 0 || priceMinParam || priceMaxParam

  return (
    <div className="flex flex-col gap-y-5" data-testid={dataTestId}>
      {/* Header with count & sort */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="font-jakarta text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Catalog Filter
          </span>
          <p className="font-cormorant text-xl font-bold text-slate-900">
            {productCount || 0} Products
          </p>
        </div>

        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-jakarta text-[11px] font-bold text-amber-900 uppercase tracking-wider">
              Active Filters:
            </span>
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-jakarta font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categoryIds.map((id) => {
              const cat = localCategories.find(c => c.id === id)
              return cat ? (
                <span
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-slate-800 text-[11px] font-jakarta font-semibold flex items-center gap-1 cursor-pointer hover:bg-rose-50 hover:text-rose-700"
                >
                  {cat.name} ×
                </span>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-4">
        {localCategories.length > 0 && (
          <FilterDropdown
            title="Sweet Category"
            items={localCategories.map(c => ({
              id: c.id,
              name: c.name,
              count: c.products_count
            }))}
            selectedItems={categoryIds}
            handleChange={handleCategoryChange}
            data-testid="category-filter"
          />
        )}

        {tags.length > 0 && (
          <FilterDropdown
            title="Flavors &amp; Specialties"
            items={tags.map(t => ({
              id: t.id,
              name: t.value,
              count: t.products_count
            }))}
            selectedItems={tagIds}
            handleChange={handleTagChange}
            data-testid="tag-filter"
          />
        )}

        {safeMinPrice !== safeMaxPrice && (
          <div className="pt-2 border-t border-slate-100">
            <PriceRange
              min={safeMinPrice}
              max={safeMaxPrice}
              value={currentPriceRange}
              handleChange={handlePriceChange}
              currencyCode={safeCurrencyCode}
              data-testid="price-filter"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default RefinementList
