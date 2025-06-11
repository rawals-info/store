"use client"

import { Heading, Text } from "@medusajs/ui"
import { motion } from "framer-motion"
import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import AnimatedButton from "@modules/common/components/animated-button"

type CategoriesTemplateProps = {
  categories: HttpTypes.StoreProductCategory[]
}

export default function CategoriesTemplate({ categories }: CategoriesTemplateProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  
  // Background gradients for categories with luxurious color schemes
  const bgGradients = [
    'from-amber-50 to-amber-200',
    'from-slate-100 to-slate-300',
    'from-stone-100 to-stone-200',
    'from-gray-50 to-gray-200',
    'from-neutral-100 to-neutral-200',
    'from-zinc-50 to-zinc-200'
  ]

  // Animation variants for staggered children with elegant transitions
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }
    },
  }

  return (
    <div className="py-12 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero section with refined typography */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-luxury-charcoal mb-4">
          Browse Our Exclusive Categories
        </h1>
        <div className="h-px w-32 bg-luxury-gold mx-auto mb-6"></div>
        <Text className="max-w-2xl mx-auto text-luxury-charcoal/80 text-base md:text-lg">
          Discover our curated selection of handcrafted marble pieces, meticulously created by master artisans to elevate your living space.
        </Text>
      </motion.div>

      {/* Categories grid with luxury hover effects */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {categories.map((category, index) => {
          const bgGradient = bgGradients[index % bgGradients.length]
          
          return (
            <motion.div 
              key={category.id}
              variants={itemVariants}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <motion.div
                className={`aspect-[4/3] rounded-lg overflow-hidden group relative ${
                  hoveredCategory === category.id ? 'ring-2 ring-luxury-gold/30' : ''
                }`}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] }
                }}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}></div>
                
                {/* Content overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 z-10"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
                  <motion.h3 
                    className="text-2xl mb-3 text-luxury-charcoal font-display tracking-wide"
                    initial={{ opacity: 0.9 }}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.name}
                  </motion.h3>
                  
                  {category.description && (
                    <p className="mb-6 text-luxury-charcoal/80 max-w-xs text-sm md:text-base">
                      {category.description}
                    </p>
                  )}
                  
                  <LocalizedClientLink href={`/categories/${category.handle}`}>
                    <AnimatedButton variant="gold" size="small">View Category</AnimatedButton>
                  </LocalizedClientLink>
                </div>
                
                {/* Decorative corner element */}
                <motion.div 
                  className="absolute top-4 right-4 w-8 h-8 border-t border-r border-luxury-gold/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCategory === category.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div 
                  className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-luxury-gold/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCategory === category.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Elegant divider */}
      <div className="relative my-16">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-luxury-gold/20"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-luxury-ivory px-6">
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
          "Each piece tells a story of craftsmanship, elegance, and timeless design."
        </Text>
      </motion.div>
    </div>
  )
} 