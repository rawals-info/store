"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { staggerContainer, fadeIn } from "@lib/util/animations"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import AnimatedButton from "@modules/common/components/animated-button"
import Link from "next/link"
import Image from "next/image"
import { Heading, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type HomeClientWrapperProps = {
  featuredProducts: any[]
  categories: any[]
  region: HttpTypes.StoreRegion | null
  countryCode: string
}

export default function HomeClientWrapper({ 
  featuredProducts, 
  categories, 
  region,
  countryCode
}: HomeClientWrapperProps) {
  // Fallback image for categories
  const fallbackImage = "/table-top.webp"

  // Filter to only parent categories for the carousel
  const parentCategories = categories.filter(cat => !cat.parent_category)
  
  // State for category carousel
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null)
  
  // Background colors for categories
  const bgGradients = [
    'from-amber-50 to-amber-200',
    'from-slate-100 to-slate-300',
    'from-stone-100 to-stone-200',
    'from-gray-50 to-gray-200',
  ]

  // Get category image or use fallback
  const getCategoryImage = (handle: string) => {
    // Map category handles to the new images
    const imageMappings: Record<string, string> = {
      "table-top": "/category_table_top.webp",
      "jewelry": "/category_jewelry.webp",
      "home-decor": "/category_home_decor.webp", 
      "sculpture": "/category_sculpture.webp"
    }
    
    return imageMappings[handle] || fallbackImage
  }

  // Auto-rotate categories
  useEffect(() => {
    if (autoRotate && parentCategories.length > 1) {
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

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center overflow-hidden pt-20 w-full"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Hero image with marble piece in situ */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/table-top.webp"
            alt="Luxury marble tabletop in elegant interior"
            fill
            priority={true}
            sizes="100vw"
            className="object-cover"
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 w-full">
          <motion.div variants={fadeIn} className="mb-6">
            <Heading level="h1" className="text-4xl md:text-6xl lg:text-7xl mb-4 font-serif text-white">
              Bespoke Marble Handicrafts<br />for Timeless Luxury
            </Heading>
          </motion.div>
          
          <motion.div variants={fadeIn} className="mb-8">
            <Text className="text-lg md:text-xl max-w-2xl mx-auto text-white">
              Hand-carved by Master Artisans in [Your Region]
            </Text>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Link href="/categories">
              <AnimatedButton variant="gold" size="large">
                Shop Signature Collection
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
        
        {/* Scrolling indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M12 5L12 19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.section>
      
      {/* Featured Products Section */}
      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 w-full box-border">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Heading level="h2" className="text-3xl md:text-4xl mb-3 font-serif">
                Featured Products
              </Heading>
              <div className="h-px w-24 bg-luxury-gold mx-auto mb-4"></div>
            </div>
          </ScrollReveal>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full box-border">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={0.1 * index} className="group w-full">
                <div className="h-full transition-all duration-500 hover:-translate-y-1 w-full">
                  <div className="relative h-[300px] overflow-hidden rounded-lg mb-4 w-full">
                    {product.thumbnail ? (
                      <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover"
                          onError={(e) => {
                            // @ts-ignore - TypeScript doesn't know about currentTarget
                            e.currentTarget.src = fallbackImage;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href={`/products/${product.handle}`}>
                        <AnimatedButton variant="gold" size="small" className="w-full">
                          View Details
                        </AnimatedButton>
                      </Link>
                    </div>
                  </div>
                  <Link href={`/products/${product.handle}`} className="block">
                    <Text className="font-medium text-lg mb-1 group-hover:text-luxury-gold transition-colors duration-300 truncate">
                      {product.title}
                    </Text>
                    {product.variants?.[0] && (
                      <Text className="text-luxury-charcoal/80">
                        {region?.currency_code && region.currency_code ? 
                          new Intl.NumberFormat(undefined, {
                            style: 'currency',
                            currency: region.currency_code
                          }).format((product.variants[0] as any)?.prices?.[0]?.amount / 100 || 0) 
                          : 'Price unavailable'}
                      </Text>
                    )}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* Category Carousel Section */}
      <section className="py-16 bg-white relative overflow-hidden w-full">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full box-border">
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
          
          {/* Always display as carousel */}
          {(!parentCategories || parentCategories.length === 0) ? (
            <div className="text-center">
              <Text className="text-luxury-charcoal/80">
                Categories coming soon...
              </Text>
            </div>
          ) : (
            <div className="relative w-full">
              {/* Category cards */}
              <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg w-full">
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
          )}
        </div>
      </section>
    </div>
  )
}