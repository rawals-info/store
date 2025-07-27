"use client"

import { Text } from "@medusajs/ui"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import AnimatedButton from "@modules/common/components/animated-button"
import Image from "next/image"

type CategoriesTemplateProps = {
  categories: HttpTypes.StoreProductCategory[]
  region: any
}

export default function CategoriesTemplate({ categories, region }: CategoriesTemplateProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  // Find main/parent categories
  const mainCategories = categories.filter(cat => !cat.parent_category)
  
  // Background gradients for categories with luxurious color schemes
  const bgGradients = [
    'from-amber-50 to-amber-200',
    'from-slate-100 to-slate-300',
    'from-stone-100 to-stone-200',
    'from-gray-50 to-gray-200',
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut",
      }
    },
  }

  // Function to get subcategories for a parent category
  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => 
      cat.parent_category && cat.parent_category.id === parentId
    )
  }

  // Function to get category image or use fallback
  const getCategoryImage = (handle: string) => {
    // Use the new category images
    const imageMappings: Record<string, string> = {
      "petha": "/categories/petha.png",
      "namkeen": "/categories/namkeen.png",
      "dalmoth": "/categories/dalmoth.png",
      "combo1": "/categories/combo.png",
    }
    
    return imageMappings[handle] || null
  }

  // Background image handling with error fallback
  const CategoryBackground = ({ image, bgGradient, name }: { 
    image: string | null, 
    bgGradient: string,
    name: string 
  }) => {
    const [hasError, setHasError] = useState(false);
    
    if (!image || hasError) {
      return <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}></div>;
    }
    
    return (
      <div className="absolute inset-0">
        <Image 
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onError={() => setHasError(true)}
        />
      </div>
    );
  };

  return (
    <div className="py-12 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-luxury-charcoal mb-4">
          Browse Our Exclusive Categories
        </h1>
        <div className="h-px w-32 bg-luxury-gold mx-auto mb-6"></div>
        <Text className="max-w-2xl mx-auto text-luxury-charcoal/80 text-base md:text-lg">
          Discover our curated selection of authentic Agra pethas, meticulously crafted using traditional recipes to bring you the sweetest taste of royal heritage.
        </Text>
      </motion.div>

      {/* Featured Categories Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {mainCategories.map((category, index) => {
          const bgGradient = bgGradients[index % bgGradients.length]
          const categoryImage = getCategoryImage(category.handle)
          
          return (
            <motion.div 
              key={category.id}
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                className={`aspect-[3/4] rounded-lg overflow-hidden group relative cursor-pointer ${
                  activeCategory === category.id ? 'ring-2 ring-luxury-gold' : ''
                }`}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              >
                {/* Background image or gradient */}
                <CategoryBackground 
                  image={categoryImage}
                  bgGradient={bgGradient}
                  name={category.name}
                />
                
                {/* Content overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500 z-10"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
                  <motion.h3 
                    className="text-2xl mb-3 text-white font-display tracking-wide"
                    initial={{ opacity: 0.9 }}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.name}
                  </motion.h3>
                  
                  {category.description && (
                    <p className="mb-6 text-white/90 max-w-xs text-sm md:text-base line-clamp-3">
                      {category.description}
                    </p>
                  )}
                  
                  <AnimatedButton 
                    variant="gold" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent click
                      setActiveCategory(activeCategory === category.id ? null : category.id);
                    }}
                  >
                    {activeCategory === category.id ? "Close" : "View Collection"}
                  </AnimatedButton>
                </div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/30"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/30"></div>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Subcategories Dropdown/Reveal */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-luxury-ivory/80 backdrop-blur-sm rounded-lg p-8 mb-16"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-display text-luxury-charcoal mb-2">
                {mainCategories.find(c => c.id === activeCategory)?.name} Collections
              </h3>
              <div className="h-px w-24 bg-luxury-gold/40 mb-6"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getSubcategories(activeCategory).map((subcat) => (
                <LocalizedClientLink 
                  href={`/categories/${subcat.handle}`} 
                  key={subcat.id}
                  className="group"
                >
                  <motion.div 
                    className="bg-white/70 backdrop-blur-sm p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 border border-luxury-gold/10 hover:border-luxury-gold/30"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium text-luxury-charcoal text-lg mb-2 group-hover:text-luxury-gold/90 transition-colors">
                      {subcat.name}
                    </h4>
                    {subcat.description && (
                      <p className="text-sm text-luxury-charcoal/70 line-clamp-2">
                        {subcat.description}
                      </p>
                    )}
                  </motion.div>
                </LocalizedClientLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant divider */}
      <div className="relative my-16">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-luxury-gold/20"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white px-6">
            <svg className="w-6 h-6 text-luxury-gold/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-3a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom message */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <Text className="italic text-luxury-charcoal/70">
          "Each piece tells a story of authentic flavor, traditional craftsmanship, and royal sweetness."
        </Text>
      </motion.div>
    </div>
  )
} 