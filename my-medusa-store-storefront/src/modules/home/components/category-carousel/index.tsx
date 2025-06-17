"use client"

import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import { HttpTypes } from "@medusajs/types"

type CategoryCarouselProps = {
  categories: HttpTypes.StoreProductCategory[]
  countryCode: string
}

// Define our category structure
type CategoryItem = {
  name: string
  handle: string
  imageSrc: string
}

export default function CategoryCarousel({ categories, countryCode }: CategoryCarouselProps) {
  // Define all the categories we want to display
  const allCategories: CategoryItem[] = [
    { name: "Marble Ring Box", handle: "marble-ring-box", imageSrc: "/Marble ring box.jpg" },
    { name: "Marble Jewellery Box", handle: "marble-jewellery-box", imageSrc: "/marble jewellery box.jpg" },
    { name: "Marble Animal Sculpture", handle: "marble-animal-sculpture", imageSrc: "/Marble animal sculpture.png" },
    { name: "Marble God Sculpture", handle: "marble-god-sculpture", imageSrc: "/Marble god sculpture.png" },
    { name: "Agate Picture Frame", handle: "agate-picture-frame", imageSrc: "/agate picture frame.webp" },
    { name: "Marble Flower Vase", handle: "marble-flower-vase", imageSrc: "/Marble flower vase.png" },
    { name: "Marble Taj Mahal", handle: "marble-taj-mahal", imageSrc: "/Marble taj mahal.png" },
    { name: "Marble Coaster", handle: "marble-coaster", imageSrc: "/Marble Coaster.jpg" },
    { name: "Marble Table", handle: "marble-table", imageSrc: "/Marble table.png" },
    { name: "Marble Chess Board", handle: "marble-chess-board", imageSrc: "/Marble chess board.png" },
    { name: "Marble Inlay Plate", handle: "marble-inlay-plate", imageSrc: "/Marble inlay plate.png" },
    { name: "Gemstone Table", handle: "gemstone-table", imageSrc: "/Gemstone table.png" },
    { name: "Epoxy Table", handle: "epoxy-table", imageSrc: "/Epoxy table.png" },
  ]

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
            {allCategories.map((category) => (
              <div key={category.handle} className="group">
                <div className="aspect-square overflow-hidden rounded-lg relative bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Image */}
                  <div className="absolute inset-0">
                    <Image 
                      src={category.imageSrc}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                    <h3 className="text-sm sm:text-base md:text-lg text-white font-medium mb-2 group-hover:text-luxury-gold/90 transition-colors">
                      {category.name}
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