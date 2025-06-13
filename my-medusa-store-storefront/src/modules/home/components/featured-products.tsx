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

export default async function FeaturedProducts({ countryCode }: { countryCode: string }) {
  console.log("FeaturedProducts: Starting to fetch featured products")
  
  // Fetch region
  const region = await getRegion(countryCode)

  if (!region) {
    console.log("FeaturedProducts: No region found for countryCode", countryCode)
    return null
  }
  
  console.log("FeaturedProducts: Region found", region.name)
  
  // First try to fetch all collections to debug
  let collections: HttpTypes.StoreCollection[] = []
  try {
    const result = await listCollections()
    collections = result.collections
    console.log("Available collections:", collections.map(c => ({ 
      id: c.id, 
      handle: c.handle, 
      title: c.title 
    })))
  } catch (error) {
    console.error("Error listing collections:", error)
  }
  
  // Try to fetch products from a featured collection first
  let displayProducts: HttpTypes.StoreProduct[] = []
  let collectionTitle = "Featured Products"
  
  // Try to find a collection with "featured" in the handle
  const featuredCollection = collections.find(c => 
    c.handle?.includes("featured") || 
    c.title?.toLowerCase().includes("featured")
  )
  
  if (featuredCollection) {
    try {
      console.log("Found featured collection:", featuredCollection.title)
      collectionTitle = featuredCollection.title
      
      // Get the products from this collection
      const collection = await getCollectionByHandle(featuredCollection.handle)
      if (collection && collection.products && collection.products.length > 0) {
        displayProducts = collection.products as HttpTypes.StoreProduct[]
        console.log(`Found ${displayProducts.length} products in featured collection`)
      }
    } catch (error) {
      console.error("Error fetching featured collection products:", error)
    }
  }
  
  // If no products found in collections, fetch any products
  if (displayProducts.length === 0) {
    try {
      console.log("No products in featured collection, fetching any products")
      // Simplified query without tags to avoid errors
      const { response } = await listProducts({
        countryCode,
        queryParams: { 
          limit: 8,
        },
        isDetailed: true
      })
      
      displayProducts = response.products
      console.log(`Found ${displayProducts.length} products as fallback`)
      
      // Debug: log some info about the products
      if (displayProducts.length > 0) {
        const firstProduct = displayProducts[0]
        console.log("First product:", {
          id: firstProduct.id,
          title: firstProduct.title,
          handle: firstProduct.handle,
          hasVariants: firstProduct.variants && firstProduct.variants.length > 0,
          hasImages: firstProduct.images && firstProduct.images.length > 0,
          thumbnail: firstProduct.thumbnail
        })
      }
    } catch (error: any) {
      console.error("Error fetching products:", error)
      console.error("Error details:", error.message || String(error))
    }
  }

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white to-luxury-ivory/50">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-luxury-gold/20 rounded-full"></div>
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 border border-luxury-gold/10 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <ScrollReveal>
            <Heading level="h2" className="font-display text-3xl md:text-4xl mb-4">
              {collectionTitle}
            </Heading>
            <div className="h-px w-24 bg-luxury-gold mx-auto mb-6"></div>
            <Text className="text-serif-regular text-luxury-charcoal/80 max-w-xl mx-auto">
              Discover our handcrafted marble creations, each one a testament to generations of artisanal tradition and timeless elegance.
            </Text>
          </ScrollReveal>
        </div>
        
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
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