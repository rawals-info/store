"use server"

import { Heading, Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import ProductPreview from "@modules/products/components/product-preview/server"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import AnimatedButton from "@modules/common/components/animated-button"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import { Region } from "@medusajs/medusa"

export default async function FeaturedProducts({
  region,
  countryCode,
}: {
  region: HttpTypes.StoreRegion
  countryCode: string
}) {
  const featuredCollection = await getCollectionByHandle(
    "featured-products"
  ).catch(() => null)

  if (!featuredCollection) {
    return notFound()
  }

  const {
    response: { products: displayProducts },
  } = await listProducts({
    queryParams: { collection_id: [featuredCollection.id] },
    countryCode,
  })

  return (
    <section className="relative overflow-hidden py-20 bg-transparent">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-luxury-gold/20 rounded-full"></div>
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 border border-luxury-gold/10 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <ScrollReveal>
            <Heading level="h2" className="font-display text-3xl md:text-4xl mb-4">
              {featuredCollection.title}
            </Heading>
            <div className="h-px w-24 bg-luxury-gold mx-auto mb-6"></div>
            <Text className="text-serif-regular text-luxury-charcoal/80 max-w-xl mx-auto">
              Discover our handcrafted marble creations, each one a testament to generations of artisanal tradition and timeless elegance.
            </Text>
          </ScrollReveal>
        </div>
        
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {displayProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={0.1 * (index + 1)}>
                <div className="group transform transition-all duration-500 hover:-translate-y-1">
                  <ProductPreview product={product} region={region} isFeatured={true} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Text className="text-luxury-charcoal/70 italic">
              No featured products available at the moment. Check back soon for our latest creations.
            </Text>
          </div>
        )}
        
        <ScrollReveal delay={0.5} className="mt-16 text-center">
          <Link href="/products">
            <AnimatedButton variant="gold" size="large">
              Explore Full Collection
            </AnimatedButton>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
} 