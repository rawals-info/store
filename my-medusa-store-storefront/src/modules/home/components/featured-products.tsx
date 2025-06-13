"use server"

import { Heading, Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import ProductPreview from "@modules/products/components/product-preview/server"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import AnimatedButton from "@modules/common/components/animated-button"
import Link from "next/link"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

export default async function FeaturedProducts({ countryCode }: { countryCode: string }) {
  // Fetch region
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  console.log("Fetching featured collection with handle: featured=products")
  
  // Debug: List all collections first
  try {
    const { collections } = await listCollections()
    console.log("Available collections:", collections.map(c => ({ id: c.id, handle: c.handle, title: c.title })))
  } catch (error) {
    console.error("Error listing collections:", error)
  }
  
  // First try to fetch products from "Featured Collection" by handle
  let displayProducts: HttpTypes.StoreProduct[] = []
  
  try {
    const featuredCollection = await getCollectionByHandle("featured=products")
    console.log("Featured collection result:", featuredCollection ? {
      id: featuredCollection.id,
      handle: featuredCollection.handle,
      title: featuredCollection.title,
      productCount: featuredCollection.products?.length || 0
    } : "Not found")
    
    if (featuredCollection && featuredCollection.products) {
      displayProducts = featuredCollection.products as HttpTypes.StoreProduct[]
      console.log(`Found ${displayProducts.length} products in featured collection`)
    }
  } catch (error) {
    console.error("Error fetching featured collection:", error)
  }
  
  // If no products in featured collection, fall back to 'featured' tag
  if (!displayProducts || displayProducts.length === 0) {
    console.log("No products in featured collection, falling back to 'featured' tag")
    const { response } = await listProducts({
      countryCode,
      queryParams: {
        limit: 4,
        tags: ["featured"],
      },
    }).catch((err) => {
      console.error("Error fetching products with featured tag:", err)
      // Return empty response if there's an error
      return { response: { products: [] } }
    })

    displayProducts = response.products
    console.log(`Found ${displayProducts.length} products with 'featured' tag`)
  }

  // If still no products, fall back to getting some products
  if (!displayProducts || displayProducts.length === 0) {
    console.log("No products with 'featured' tag, falling back to any products")
    const { response: fallbackResponse } = await listProducts({
      countryCode,
      queryParams: { limit: 4 },
    }).catch((err) => {
      console.error("Error fetching fallback products:", err)
      // Return empty response if there's an error
      return { response: { products: [] } }
    })
    
    displayProducts = fallbackResponse.products
    console.log(`Found ${displayProducts.length} products as fallback`)
  }

  // If still no products, return null
  if (!displayProducts || displayProducts.length === 0) {
    console.log("No products found at all")
    return null
  }

  return (
    <div className="relative overflow-hidden py-16">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold opacity-5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <ScrollReveal>
            <Heading level="h2" className="font-display text-3xl md:text-4xl mb-4">
              Featured Products
            </Heading>
            <div className="h-px w-24 bg-luxury-gold mx-auto mb-6"></div>
            <Text className="text-serif-regular text-luxury-charcoal/80 max-w-xl mx-auto">
              Discover our handcrafted masterpieces, each one a testament to generations of artisanal tradition.
            </Text>
          </ScrollReveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((product, index) => (
            <ScrollReveal key={product.id} delay={0.1 * (index + 1)}>
              <div className="group">
                <ProductPreview product={product} region={region} />
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        <ScrollReveal delay={0.5} className="mt-16 text-center">
          <Link href="/products">
            <AnimatedButton variant="gold" size="large">
              View All Products
            </AnimatedButton>
          </Link>
        </ScrollReveal>
      </div>
    </div>
  )
} 