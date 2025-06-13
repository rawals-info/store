import { getCachedCategories } from "@modules/home/components/categories"
import { listProducts } from "@lib/data/products" 
import { getRegion } from "@lib/data/regions"
import HomeClientWrapper from "@modules/home/components/home-client-wrapper"

// Debug function to inspect product data
function debugProductPrices(products: any[]) {
  if (!products || products.length === 0) {
    console.log("No products to debug")
    return
  }
  
  // Take the first product as an example
  const product = products[0]
  
  // Get variant details for debugging
  const variantDetails = product.variants && product.variants.length > 0 
    ? product.variants.map((v: any) => {
        // Debug price formats
        let priceInfo: any = "No price data"
        
        if (v.prices && v.prices.length > 0) {
          const price = v.prices[0]
          priceInfo = {
            raw_amount: price.amount,
            amount_in_dollars: price.amount / 100,
            currency: price.currency_code
          }
        } else if (v.calculated_price) {
          priceInfo = {
            calculated_amount: v.calculated_price.calculated_amount,
            currency: v.calculated_price.currency_code
          }
        }
        
        return {
          id: v.id,
          title: v.title,
          hasPrices: v.prices && v.prices.length > 0,
          pricesCount: v.prices?.length || 0,
          priceInfo,
          hasCalculatedPrice: !!v.calculated_price,
          calculatedAmount: v.calculated_price?.calculated_amount || "No calculated amount"
        }
      })
    : "No variants"
  
  console.log("DEBUG PRODUCT:", {
    id: product.id,
    title: product.title,
    hasVariants: product.variants && product.variants.length > 0,
    variantCount: product.variants?.length || 0,
    variants: variantDetails
  })
}

export default async function Home({ params }: { params: { countryCode: string } }) {
  // Properly await params object before accessing properties
  const paramsData = await params
  const countryCode = paramsData.countryCode
  
  // Fetch region
  const region = await getRegion(countryCode) || null
  
  // Fetch categories
  const categories = await getCachedCategories()
  
  // Fetch featured products (best sellers or new arrivals) with detailed pricing info
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 6,
      tags: ["featured", "best_seller", "new_arrival"],
    },
    isDetailed: true, // Request detailed product info including prices
  }).catch(() => {
    return { response: { products: [] } }
  })
  
  const featuredProducts = response.products
  
  // Debug product prices
  debugProductPrices(featuredProducts)

  // Pass all data to client component
  return (
    <div className="-mx-6 sm:-mx-8 lg:-mx-12">
      <HomeClientWrapper 
        featuredProducts={featuredProducts} 
        categories={categories} 
        region={region} 
        countryCode={countryCode}
      />
    </div>
  )
}