"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useMemo, useEffect } from "react"
import { Button, Heading, Text } from "@medusajs/ui"
import { XMarkMini, Adjustments } from "@medusajs/icons"

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
  minPrice: number
  maxPrice: number
  currencyCode: string
  productCount?: number
  region: HttpTypes.StoreRegion
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
  const searchParams = useSearchParams()
  
  // Mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  // Use local state for categories to allow frontend fetching
  const [localCategories, setLocalCategories] = useState<typeof categories>(categories)
  
  // Fetch categories from API if needed
  useEffect(() => {
    const fetchCategories = async () => {
      if (categories.length === 0) {
        try {
          const response = await fetch('/store/product-categories?limit=100', {
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.product_categories) {
              setLocalCategories(
                data.product_categories.map((cat: any) => ({
                  id: cat.id,
                  name: cat.name,
                  handle: cat.handle,
                  parent_category: cat.parent_category,
                  category_children: cat.category_children,
                  products_count: cat.products?.length,
                }))
              );
            }
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      }
    };
    
    fetchCategories();
  }, [categories])
  
  // Parse existing filters from URL
  const categoryIds = useMemo(() => {
    const params = searchParams.get("categories")
    return params ? params.split(",") : []
  }, [searchParams])
  
  const tagIds = useMemo(() => {
    const params = searchParams.get("tags")
    return params ? params.split(",") : []
  }, [searchParams])
  
  // Get initial price range from URL or props
  const initialPriceRange = useMemo(() => {
    const minParam = searchParams.get("price_min")
    const maxParam = searchParams.get("price_max")
    return [
      minParam ? parseInt(minParam) : minPrice,
      maxParam ? parseInt(maxParam) : maxPrice
    ] as [number, number]
  }, [searchParams, minPrice, maxPrice])
  
  // Store current price range in component state 
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>(initialPriceRange)
  
  // Update currentPriceRange when URL params change
  useEffect(() => {
    setCurrentPriceRange(initialPriceRange)
  }, [initialPriceRange])
  
  // For display and filtering logic
  const hasActivePriceFilter = useMemo(() => {
    return currentPriceRange[0] > minPrice || currentPriceRange[1] < maxPrice
  }, [currentPriceRange, minPrice, maxPrice])
  
  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return categoryIds.length > 0 || tagIds.length > 0 || hasActivePriceFilter
  }, [categoryIds, tagIds, hasActivePriceFilter])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = useCallback((name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`, { scroll: false })
  }, [createQueryString, pathname, router])
  
  // Handle category filter change
  const handleCategoryChange = useCallback((id: string) => {
    const updatedCategories = categoryIds.includes(id)
      ? categoryIds.filter((catId) => catId !== id)
      : [...categoryIds, id]
    
    const params = new URLSearchParams(searchParams.toString())
    if (updatedCategories.length) {
      params.set("categories", updatedCategories.join(","))
    } else {
      params.delete("categories")
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [categoryIds, searchParams, pathname, router])
  
  // Handle tag filter change
  const handleTagChange = useCallback((id: string) => {
    const updatedTags = tagIds.includes(id)
      ? tagIds.filter((tagId) => tagId !== id)
      : [...tagIds, id]
    
    const params = new URLSearchParams(searchParams.toString())
    if (updatedTags.length) {
      params.set("tags", updatedTags.join(","))
    } else {
      params.delete("tags")
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [tagIds, searchParams, pathname, router])
  
  // Handle price range change
  const handlePriceChange = useCallback((value: [number, number]) => {
    setCurrentPriceRange(value)
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (value[0] !== minPrice) {
      params.set("price_min", value[0].toString())
    } else {
      params.delete("price_min")
    }
    
    if (value[1] !== maxPrice) {
      params.set("price_max", value[1].toString())
    } else {
      params.delete("price_max")
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, minPrice, maxPrice, pathname, router])
  
  // Reset price range
  const resetPriceRange = useCallback(() => {
    setCurrentPriceRange([minPrice, maxPrice])
    
    const params = new URLSearchParams(searchParams.toString())
    params.delete("price_min")
    params.delete("price_max")
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, minPrice, maxPrice, pathname, router])
  
  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setCurrentPriceRange([minPrice, maxPrice])
    
    const params = new URLSearchParams(searchParams.toString())
    params.delete("categories")
    params.delete("tags")
    params.delete("price_min")
    params.delete("price_max")
    
    // Keep the sort parameter
    const sort = params.get("sortBy")
    
    router.push(`${pathname}${sort ? `?sortBy=${sort}` : ""}`, { scroll: false })
  }, [searchParams, minPrice, maxPrice, pathname, router])
  
  // Determine active category names for tags
  const activeCategoryNames = useMemo(() => {
    return localCategories
      .filter(cat => categoryIds.includes(cat.id))
      .map(cat => cat.name)
  }, [localCategories, categoryIds])
  
  // Determine active tag names for tags
  const activeTagNames = useMemo(() => {
    return tags
      .filter(tag => tagIds.includes(tag.id))
      .map(tag => tag.value)
  }, [tags, tagIds])
  
  // Remove a specific category
  const removeCategory = useCallback((id: string) => {
    handleCategoryChange(id)
  }, [handleCategoryChange])
  
  // Remove a specific tag
  const removeTag = useCallback((id: string) => {
    handleTagChange(id)
  }, [handleTagChange])
  
  return (
    <div className="w-full max-w-full">
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-3 lg:hidden">
        <button 
          className="flex items-center gap-x-2 px-3 py-1.5 bg-luxury-ivory border border-luxury-gold/40 shadow-sm hover:border-luxury-gold transition-colors rounded-sm group"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Adjustments className="w-3.5 h-3.5 text-luxury-gold" />
          <span className="text-xs font-serif text-luxury-charcoal group-hover:text-luxury-gold/90 transition-colors">
            {showMobileFilters ? "Hide Filters" : "Refine"}
          </span>
          {hasActiveFilters && (
            <div className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-luxury-gold text-luxury-ivory text-[10px] font-serif">
              {categoryIds.length + tagIds.length + (hasActivePriceFilter ? 1 : 0)}
            </div>
          )}
        </button>
        {hasActiveFilters && (
          <button
            className="text-xs text-luxury-gold/80 hover:text-luxury-gold border-b border-luxury-gold/20 hover:border-luxury-gold/60 font-serif pb-0.5 transition-colors"
            onClick={clearAllFilters}
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Product count & active filters */}
      <div className="flex flex-col gap-y-2 mb-3">
        {productCount !== undefined && (
          <div className="flex justify-between items-center">
            <Text className="text-luxury-charcoal font-serif text-xs uppercase tracking-wider">
              {productCount} {productCount === 1 ? "Piece" : "Pieces"}
            </Text>
            <div className="hidden lg:block">
              <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
            </div>
          </div>
        )}
        
        {hasActiveFilters && (
          <div>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {activeCategoryNames.map((name, i) => {
                const category = localCategories.find(c => c.name === name)
                if (!category) return null
                return (
                  <FilterTag 
                    key={`cat-${category.id}`}
                    label={`${name}`}
                    onClick={() => removeCategory(category.id)}
                  />
                )
              })}
              
              {activeTagNames.map((value, i) => {
                const tag = tags.find(t => t.value === value)
                if (!tag) return null
                return (
                  <FilterTag 
                    key={`tag-${tag.id}`}
                    label={`${value}`}
                    onClick={() => removeTag(tag.id)}
                  />
                )
              })}
              
              {hasActivePriceFilter && (
                <FilterTag 
                  label={`${new Intl.NumberFormat("en-US", { 
                    style: "currency", 
                    currency: currencyCode,
                    minimumFractionDigits: 0
                  }).format(currentPriceRange[0])} - ${new Intl.NumberFormat("en-US", { 
                    style: "currency", 
                    currency: currencyCode,
                    minimumFractionDigits: 0
                  }).format(currentPriceRange[1])}`}
                  onClick={resetPriceRange}
                />
              )}
            </div>
            <Button
              variant="secondary"
              className="text-luxury-gold/80 text-xs flex items-center gap-x-1 font-serif hover:text-luxury-gold"
              onClick={clearAllFilters}
            >
              <XMarkMini className="w-3 h-3" />
              Clear all filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Filters & sort */}
      <div className={`grid gap-y-3 w-full ${!showMobileFilters && 'max-lg:hidden'}`}>
        {/* Sort (mobile) */}
        <div className="lg:hidden w-full">
          <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
        </div>
        
        {/* Divider */}
        <div className="h-px w-full bg-luxury-gold/20"></div>
        
        {/* Filters */}
        <div className="flex flex-col gap-3 w-full">
          {localCategories.length > 0 && (
            // Build a flat list of categories with indentation for children
            <FilterDropdown
              title="Categories"
              items={(() => {
                const parents = localCategories.filter(c => !c.parent_category)
                return parents.flatMap((parent) => {
                  const list: { id: string; name: string; count?: number }[] = [
                    {
                      id: parent.id,
                      name: parent.name,
                      count: parent.products_count,
                    },
                  ]

                  if (parent.category_children && parent.category_children.length) {
                    list.push(
                      ...parent.category_children.map((child: any) => ({
                        id: child.id,
                        // prepend bullet & non-breaking spaces for visual indent
                        name: `\u00A0\u00A0— ${child.name}`,
                        count: child.products_count,
                      }))
                    )
                  }

                  return list
                })
              })()}
              selectedItems={categoryIds}
              handleChange={handleCategoryChange}
              data-testid="category-filter"
            />
          )}
          
          <div className="h-px w-full bg-luxury-gold/20"></div>
          
          {tags.length > 0 && (
            <>
              <FilterDropdown
                title="Materials"
                items={tags.map(t => ({
                  id: t.id,
                  name: t.value,
                  count: t.products_count
                }))}
                selectedItems={tagIds}
                handleChange={handleTagChange}
                data-testid="tag-filter"
              />
              
              <div className="h-px w-full bg-luxury-gold/20"></div>
            </>
          )}
          
          <div className="w-full">
            {minPrice !== maxPrice && (
              <PriceRange
                min={minPrice}
                max={maxPrice}
                value={currentPriceRange}
                handleChange={handlePriceChange}
                currencyCode={currencyCode}
                data-testid="price-filter"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RefinementList
