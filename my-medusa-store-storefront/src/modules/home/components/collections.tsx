"use client"

import { Heading, Text } from "@medusajs/ui"
import AnimatedButton from "@modules/common/components/animated-button"
import Link from "next/link"

export default function Collections() {
  // Static category data
  const categories = [
    { id: '1', name: 'Table Tops', handle: 'table-tops', description: 'Exquisite marble table tops for your luxury dining experience' },
    { id: '2', name: 'Jewelry Boxes', handle: 'jewelry-boxes', description: 'Elegant marble jewelry storage for your precious items' },
    { id: '3', name: 'Home Decor', handle: 'home-decor', description: 'Statement marble pieces to elevate your interior design' }
  ]

  // Background colors for categories
  const bgColors = [
    'from-amber-100 to-amber-300',
    'from-slate-200 to-slate-400',
    'from-stone-100 to-stone-300'
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Heading level="h2" className="text-3xl md:text-4xl mb-4">
            CATEGORIES SECTION
          </Heading>
          <div className="h-px w-24 bg-amber-600 mx-auto mb-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const bgColor = bgColors[index % bgColors.length]
            
            return (
              <div key={category.id} className="group aspect-square relative overflow-hidden rounded-lg">
                {/* Colored background */}
                <div className={`absolute inset-0 z-0 bg-gradient-to-br ${bgColor}`}></div>
                
                {/* Content overlay */}
                <div className="absolute inset-0 bg-black/30 z-10 transition-opacity duration-500 group-hover:bg-black/50"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
                  <h3 className="text-2xl mb-2 text-white font-serif">
                    {category.name}
                  </h3>
                  <p className="mb-6 text-gray-100 opacity-90 max-w-xs">
                    {category.description}
                  </p>
                  <Link href={`/products?category=${category.handle}`}>
                    <AnimatedButton variant="gold" size="small">Shop Now</AnimatedButton>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
} 