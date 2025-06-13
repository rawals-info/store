"use client"

import { Heading } from "@medusajs/ui"
import { motion } from "framer-motion"

export default function FeaturedProductsSkeleton() {
  return (
    <div className="relative overflow-hidden py-16">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Heading level="h2" className="font-display text-3xl md:text-4xl mb-4">
            Featured Products
          </Heading>
          <div className="h-px w-24 bg-luxury-gold mx-auto mb-6"></div>
          <div className="text-serif-regular text-luxury-charcoal/80 max-w-xl mx-auto h-5 bg-gray-200 animate-pulse rounded w-3/4 mx-auto">
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="group animate-pulse">
              <div className="overflow-hidden rounded-sm border border-luxury-gold/10 bg-luxury-ivory/10">
                <div className="relative">
                  {/* Product thumbnail skeleton */}
                  <div className="w-full h-60 bg-gray-200"></div>
                  
                  {/* Product details skeleton */}
                  <div className="pt-3 pb-3 px-4">
                    <div className="flex justify-between items-start mb-1">
                      <div className="h-5 bg-gray-200 w-3/4 rounded"></div>
                      <div className="h-5 bg-gray-200 w-16 rounded"></div>
                    </div>
                    
                    <div className="h-px bg-luxury-gold/20 w-full my-2"></div>
                    
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                      <div className="w-6 h-6 rounded-full border border-luxury-gold/30 flex items-center justify-center">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block h-12 w-36 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  )
} 