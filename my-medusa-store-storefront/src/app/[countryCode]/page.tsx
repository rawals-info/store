import { getCachedCategories } from "@modules/home/components/categories"
import { getHomepageProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import HomeClientWrapper from "@modules/home/components/home-client-wrapper"

export default async function Home({ params }: { params: { countryCode: string } }) {
  const { countryCode } = await params
  
  const region = await getRegion(countryCode).catch(() => null)
  const categories = await getCachedCategories().catch(() => [])
  
  const { featuredProducts } = await getHomepageProducts(countryCode).catch(() => ({
    featuredProducts: [],
  }))

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