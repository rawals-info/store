"use client"

import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import { HttpTypes } from "@medusajs/types"
import { CATEGORIES, CategoryConfig } from "@lib/config/categories"

type CategoryCarouselProps = {
  categories: HttpTypes.StoreProductCategory[]
  countryCode: string
}

export default function CategoryCarousel({ categories, countryCode }: CategoryCarouselProps) {
  // Use our centralized category configurations
  // Convert from record to array for rendering
  const displayCategories: CategoryConfig[] = Object.values(CATEGORIES)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Heading level="h2" className="text-3xl md:text-4xl mb-3 font-serif">
              Shop by Category
            </Heading>
            <div className="h-px w-24 bg-luxury-gold mx-auto mb-4"></div>
            <Text className="text-luxury-charcoal/80 max-w-xl mx-auto">
              Explore our curated collection of handcrafted marble pieces
            </Text>
          </div>
        </ScrollReveal>
        
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayCategories.map((category) => (
              <div key={category.handle} className="group">
                <div className="aspect-square overflow-hidden rounded-lg relative bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Image */}
                  <div className="absolute inset-0">
                    <Image 
                      src={category.imageSrc || ""}
                      alt={category.displayName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                    <h3 className="text-sm sm:text-base md:text-lg text-white font-medium mb-2 group-hover:text-luxury-gold/90 transition-colors">
                      {category.displayName}
                    </h3>
                    <LocalizedClientLink href={`/${countryCode}/categories/${category.handle}`}>
                      <button className="bg-luxury-gold/80 hover:bg-luxury-gold text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                        View
                      </button>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
} 