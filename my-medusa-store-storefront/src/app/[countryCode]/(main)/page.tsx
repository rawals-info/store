"use server"

import { Suspense } from "react"
import { getRegion } from "@lib/data/regions"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import Categories from "@modules/home/components/categories"
import Craftsmanship from "@modules/home/components/craftsmanship"
import Testimonials from "@modules/home/components/testimonials"
import Newsletter from "@modules/home/components/newsletter"
import FeaturedProducts from "@modules/home/components/featured-products"
import FeaturedProductsSkeleton from "@modules/skeletons/components/featured-products-skeleton"

export const metadata: Metadata = {
  title: "Luxury Marble Craftsmanship | Home",
  description: "Discover our exquisite collection of handcrafted marble pieces, meticulously created by master artisans for your luxury home.",
}

// Use separate exports for Next.js configuration
export const dynamic = "force-dynamic"
// In Next.js 15.3, use a direct number export
export const revalidate = 300

export default async function Home(props: {
  params: { countryCode: string }
}) {
  // Properly await params in Next.js 15
  const paramsData = await props.params
  const countryCode = paramsData.countryCode
  
  const region = await getRegion(countryCode)

  if (!region) {
    return notFound()
  }

  return (
    <div>
      {/* Hero Section - Priority load */}
      <Hero />
      
      {/* Categories Section - Deferred loading */}
      <Suspense fallback={
        <section className="py-16 bg-luxury-cream">
          <div className="content-container">
            <div className="flex flex-col items-center mb-12">
              <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="h-px w-24 bg-luxury-gold mb-6"></div>
              <div className="h-4 w-full max-w-lg bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-luxury-ivory border border-luxury-gold/20 rounded-md overflow-hidden h-64 animate-pulse">
                  <div className="p-6 flex flex-col h-full">
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-3"></div>
                    <div className="h-px w-12 bg-luxury-gold/40 mb-3"></div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-4"></div>
                    <div className="mt-auto">
                      <div className="h-5 w-28 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      }>
        <Categories />
      </Suspense>
      
      {/* Featured Products Section - Deferred loading */}
      <section className="py-16 bg-white">
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts countryCode={countryCode} />
        </Suspense>
      </section>
      
      {/* Craftsmanship Section */}
      <Craftsmanship />
      
      {/* Testimonials Section - Deferred loading */}
      <Suspense fallback={
        <section className="py-16 bg-luxury-ivory">
          <div className="content-container">
            <div className="flex flex-col items-center mb-12">
              <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="h-px w-24 bg-luxury-gold mb-6"></div>
            </div>
          </div>
        </section>
      }>
        <Testimonials />
      </Suspense>
      
      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}
