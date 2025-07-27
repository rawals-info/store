"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getCachedCategories } from "@modules/home/components/categories"

type CategoryDropdownProps = {
  countryCode: string
  isOpen: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const CategoryDropdown = ({ countryCode, isOpen, onMouseEnter, onMouseLeave }: CategoryDropdownProps) => {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Parent category images mapping
  const categoryImages: Record<string, string> = {
    "table-top": "/category_table_top.webp",
    "marble-table-top": "/category_table_top.webp",
    "jewelry": "/category_jewelry.webp",
    "home-decor": "/category_home_decor.webp", 
    "sculpture": "/category_sculpture.webp",
    "petha-gift-box": "/category_gift_box.webp"
  }

  // Get all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getCachedCategories()
        // Filter to only parent categories
        const parentCategories = allCategories.filter((cat: any) => !cat.parent_category)
        setCategories(parentCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Don't render anything if we have no categories or still loading
  if (isLoading || categories.length === 0) {
    return null
  }

  return (
    <div 
      className="absolute top-full left-1/2 transform -translate-x-1/2 z-50"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mt-2 bg-white border border-luxury-gold/10 shadow-luxury-md rounded-md overflow-hidden w-[600px] max-w-[calc(100vw-2rem)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Gold gradient line at top */}
            <div className="h-0.5 w-full gold-gradient"></div>
            
            {/* Max height container with scrolling if needed */}
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="flex flex-wrap justify-center gap-4 p-6">
                {categories.map((category) => {
                  const imageSrc = categoryImages[category.handle] || "/petha-bg.jpg"
                  
                  return (
                    <LocalizedClientLink 
                      href={`/${countryCode}/categories/${category.handle}`}
                      key={category.id}
                      className="group flex flex-col w-[140px] sm:w-[160px] md:w-[180px]"
                    >
                      <div className="aspect-square overflow-hidden rounded-md relative mb-3 bg-gray-100">
                        <Image 
                          src={imageSrc}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 180px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                          <h3 className="text-white text-base sm:text-lg font-serif group-hover:text-luxury-gold transition-colors duration-300 text-center">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-xs sm:text-sm text-luxury-charcoal/80 group-hover:text-luxury-gold transition-colors duration-300">
                          View Collection
                        </span>
                      </div>
                    </LocalizedClientLink>
                  )
                })}
              </div>
            </div>
            
            {/* View All Categories Link */}
            <div className="p-4 border-t border-luxury-gold/10 bg-luxury-ivory/50 text-center">
              <LocalizedClientLink 
                href={`/${countryCode}/categories`}
                className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300 text-sm font-medium"
              >
                View All Categories
              </LocalizedClientLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategoryDropdown 