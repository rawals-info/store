import { getCachedCategories } from "@modules/home/components/categories"
import { listProducts } from "@lib/data/products" 
import { getRegion } from "@lib/data/regions"
import HomeClientWrapper from "@modules/home/components/home-client-wrapper"

export default async function Home({ params }: { params: { countryCode: string } }) {
  // Properly await params object before accessing properties
  const paramsData = await params
  const countryCode = paramsData.countryCode
  
  // Fetch region
  const region = await getRegion(countryCode) || null
  
  // Fetch categories
  const categories = await getCachedCategories()
  
  // Fetch featured products (best sellers or new arrivals)
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 6,
      tags: ["featured", "best_seller", "new_arrival"],
    },
  }).catch(() => {
    return { response: { products: [] } }
  })
  
  const featuredProducts = response.products

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