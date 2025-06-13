"use server"

import { Suspense } from "react"
import { getRegion } from "@lib/data/regions"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import Craftsmanship from "@modules/home/components/craftsmanship"
import Testimonials from "@modules/home/components/testimonials"
import Newsletter from "@modules/home/components/newsletter"
import FeaturedProducts from "@modules/home/components/featured-products"
import FeaturedProductsSkeleton from "@modules/skeletons/components/featured-products-skeleton"
import Features from "@modules/home/components/features"
import { listCategories } from "@lib/data/categories"

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
  
  // Fetch categories for other components
  const categories = await listCategories()

  return (
    <div className="overflow-x-hidden w-full">
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Products Section with Suspense */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts countryCode={countryCode} />
      </Suspense>
      
      {/* Features Section */}
      <Features />
      
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
