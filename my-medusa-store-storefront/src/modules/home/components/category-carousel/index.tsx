"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import AnimatedButton from "@modules/common/components/animated-button"
import { HttpTypes } from "@medusajs/types"

type CategoryCarouselProps = {
  categories: HttpTypes.StoreProductCategory[]
  countryCode: string
}

export default function CategoryCarousel({ categories, countryCode }: CategoryCarouselProps) {
  // Filter to only parent categories
  const parentCategories = categories.filter(cat => !cat.parent_category)
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null)
  
  // Logging for debugging
  useEffect(() => {
    console.log("Parent categories:", parentCategories.length)
    console.log("Category names:", parentCategories.map(c => c.name))
  }, [parentCategories])
  
  // Background colors for categories
  const bgGradients = [
    'from-amber-50 to-amber-200',
    'from-slate-100 to-slate-300',
    'from-stone-100 to-stone-200',
    'from-gray-50 to-gray-200',
  ]

  // Get category image or use fallback
  const getCategoryImage = (handle: string) => {
    // For demo purposes, we're using a static mapping
    const imageMappings: Record<string, string> = {
      "table-top": "/categories/table-top.webp",
      "jewelry": "/categories/jewelry-placeholder.jpg",
      "home-decor": "/categories/home-decor-placeholder.jpg", 
      "sculpture": "/categories/sculpture-placeholder.jpg"
    }
    
    return imageMappings[handle] || null
  }

  // Auto-rotate categories
  useEffect(() => {
    if (autoRotate && parentCategories.length > 1) {
      console.log("Setting up auto-rotation")
      autoRotateRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % parentCategories.length)
      }, 5000)
    }
    
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
      }
    }
  }, [autoRotate, parentCategories.length])
  
  // Pause auto-rotation when user interacts
  const handleNavigation = (index: number) => {
    setCurrentIndex(index)
    setAutoRotate(false)
    
    // Resume auto-rotation after 10 seconds of inactivity
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current)
    }
    
    setTimeout(() => {
      setAutoRotate(true)
    }, 10000)
  }
  
  // Handle next/prev navigation
  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? parentCategories.length - 1 : currentIndex - 1
    handleNavigation(newIndex)
  }
  
  const handleNext = () => {
    const newIndex = (currentIndex + 1) % parentCategories.length
    handleNavigation(newIndex)
  }

  // If no categories, render a placeholder
  if (!parentCategories || parentCategories.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Heading level="h2" className="font-display text-3xl md:text-4xl mb-4">
              Shop by Category
            </Heading>
            <div className="h-px w-24 bg-luxury-gold mx-auto mb-6"></div>
            <Text className="text-luxury-charcoal/80 max-w-xl mx-auto">
              Categories coming soon...
            </Text>
          </div>
        </div>
      </section>
    )
  }

  // For static display (as seen in the screenshot)
  if (parentCategories.length <= 3) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Heading level="h2" className="text-3xl md:text-4xl mb-3 font-serif">
              Shop by Category
            </Heading>
            <div className="h-px w-24 bg-luxury-gold mx-auto mb-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {parentCategories.map((category, index) => (
              <div key={category.id} className="group">
                <div className="aspect-square overflow-hidden rounded-lg relative bg-gray-100">
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-2xl mb-4 text-luxury-charcoal font-serif">
                      {category.name}
                    </h3>
                    <LocalizedClientLink href={`/categories/${category.handle}`}>
                      <button className="bg-luxury-gold/90 hover:bg-luxury-gold text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                        View Category
                      </button>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // For carousel display (when more than 3 categories)
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
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
        
        {/* Carousel container */}
        <div className="relative">
          {/* Category cards */}
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
            {parentCategories.map((category, index) => {
              const bgGradient = bgGradients[index % bgGradients.length]
              const categoryImage = getCategoryImage(category.handle)
              
              return (
                <motion.div
                  key={category.id}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: currentIndex === index ? 1 : 0,
                    scale: currentIndex === index ? 1 : 0.9,
                    zIndex: currentIndex === index ? 10 : 0
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="w-full h-full relative overflow-hidden rounded-lg">
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
                      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}></div>
                    )}
                    
                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
                      <motion.h3 
                        className="text-3xl md:text-4xl mb-4 text-white font-serif"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                      >
                        {category.name}
                      </motion.h3>
                      
                      {category.description && (
                        <motion.p 
                          className="mb-8 text-white/90 max-w-md text-base md:text-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                        >
                          {category.description}
                        </motion.p>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        <LocalizedClientLink href={`/categories/${category.handle}`}>
                          <AnimatedButton variant="gold" size="large">
                            View Collection
                          </AnimatedButton>
                        </LocalizedClientLink>
                      </motion.div>
                    </div>
                    
                    {/* Decorative corner elements */}
                    <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/30"></div>
                    <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/30"></div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          {/* Navigation buttons */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-luxury-charcoal hover:bg-white transition-colors z-20"
            onClick={handlePrev}
            aria-label="Previous category"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-luxury-charcoal hover:bg-white transition-colors z-20"
            onClick={handleNext}
            aria-label="Next category"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {parentCategories.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-luxury-gold' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => handleNavigation(index)}
                aria-label={`Go to category ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 