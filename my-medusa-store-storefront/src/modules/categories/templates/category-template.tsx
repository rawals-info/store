"use client"

import { useEffect, useState } from "react"
import { Heading, Text } from "@medusajs/ui"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import ProductPreview from "@modules/products/components/product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { listRegions } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"

type CategoryTemplateProps = {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}

export default function CategoryTemplate({ 
  category, 
  sortBy, 
  page = "1",
  countryCode 
}: CategoryTemplateProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null)
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [subcategories, setSubcategories] = useState<HttpTypes.StoreProductCategory[]>([])
  
  // Log category data for debugging and fetch region and products
  useEffect(() => {
    if (!category) {
      console.error("Category is undefined")
      setIsLoading(false)
      return
    }

    console.log("Category template received:", category)
    console.log("Category children:", category.category_children?.length || 0)
    
    // Set subcategories
    setSubcategories(category.category_children || [])
    
    // Fetch region data and products for this category
    const fetchData = async () => {
      try {
        // Fetch region
        const regions = await listRegions()
        const currentRegion = regions.find(r => 
          r.countries?.some(c => c.iso_2?.toLowerCase() === countryCode.toLowerCase())
        )
        setRegion(currentRegion || null)
        
        // Fetch products for this category
        const { response } = await listProducts({
          countryCode,
          queryParams: {
            category_id: [category.id],
            limit: 100
          },
        }).catch(() => {
          return { response: { products: [] } }
        })
        
        console.log(`Fetched ${response.products.length} products for category ${category.name}`)
        setProducts(response.products || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
      setIsLoading(false)
    }
    
    fetchData()
  }, [category, countryCode])
  
  // Return loading state if category is undefined
  if (!category) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-12">
        <div className="text-center py-12 bg-luxury-ivory/50 rounded-lg">
          <Text className="text-luxury-charcoal/70">
            Category not found or still loading...
          </Text>
        </div>
      </div>
    )
  }
  
  // Get background image based on category handle
  const getCategoryImage = (handle: string) => {
    const imageMappings: Record<string, string> = {
      "table-top": "/category_table_top.webp",
      "jewelry": "/category_jewelry.webp",
      "home-decor": "/category_home_decor.webp", 
      "sculpture": "/category_sculpture.webp"
    }
    
    return imageMappings[handle] || null
  }
  
  const categoryImage = getCategoryImage(category.handle)

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12">
      {/* Hero section */}
      <ScrollReveal>
        <div className="relative rounded-lg overflow-hidden mb-16 h-64 md:h-80 flex items-center justify-center">
          {/* Background image or gradient */}
          {categoryImage ? (
            <div className="absolute inset-0">
              <Image 
                src={categoryImage}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-amber-200"></div>
          )}
          
          <div className="relative text-center z-10 px-6">
            <Heading level="h1" className="text-3xl md:text-5xl mb-4 font-serif text-white">
              {category.name}
            </Heading>
            <div className="h-px w-32 bg-luxury-gold mx-auto mb-6"></div>
            {category.description && (
              <Text className="text-white/90 max-w-2xl mx-auto">
                {category.description}
              </Text>
            )}
          </div>
        </div>
      </ScrollReveal>
      
      {/* Subcategories section */}
      {subcategories.length > 0 && (
        <ScrollReveal>
          <div className="mb-16">
            <Heading level="h2" className="text-2xl mb-6 font-serif text-luxury-charcoal">
              Browse {category.name} Collections
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subcategories.map((subcat) => (
                <div 
                  key={subcat.id}
                  className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 border border-luxury-gold/10 hover:border-luxury-gold/30"
                >
                  <h3 className="font-medium text-luxury-charcoal text-lg mb-2">
                    {subcat.name}
                  </h3>
                  {subcat.description && (
                    <p className="text-sm text-luxury-charcoal/70 line-clamp-2 mb-4">
                      {subcat.description}
                    </p>
                  )}
                  <a 
                    href={`/${countryCode}/categories/${subcat.handle}`}
                    className="text-sm text-luxury-gold hover:text-luxury-gold/80 font-medium"
                  >
                    View Collection →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
      
      {/* Products section */}
      <ScrollReveal>
        <div>
          <Heading level="h2" className="text-2xl mb-6 font-serif text-luxury-charcoal">
            {category.name} Products
          </Heading>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-md mb-2"></div>
                  <div className="bg-gray-200 h-4 w-2/3 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductPreview 
                  key={product.id} 
                  product={product} 
                  region={region as HttpTypes.StoreRegion} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-luxury-ivory/50 rounded-lg">
              <Text className="text-luxury-charcoal/70">
                No products found in this category.
              </Text>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  )
} 