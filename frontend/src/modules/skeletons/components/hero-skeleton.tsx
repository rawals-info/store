"use client"

import { Skeleton } from "@medusajs/ui"

export default function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full bg-gray-50">
      {/* Background skeleton */}
      <div className="absolute inset-0 z-0 w-full h-full bg-gray-200 animate-pulse"></div>
      
      {/* Content skeleton */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 w-full py-12">
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col gap-4 items-center">
            <Skeleton className="h-12 md:h-16 lg:h-20 w-80 md:w-96" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-64 md:w-80" />
          </div>
        </div>
        
        <div className="mb-6 md:mb-8">
          <Skeleton className="h-6 md:h-8 w-72 md:w-96 mx-auto" />
        </div>
        
        <div className="flex justify-center">
          <Skeleton className="h-12 w-48 rounded-lg" />
        </div>
      </div>
      
      {/* Scrolling indicator skeleton */}
      <div className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <Skeleton className="w-10 h-10 rounded" />
      </div>
    </section>
  )
} 