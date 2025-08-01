import { listCollections } from "@lib/data/collections";
import { getIndiaRegion } from "@lib/constants/india-region";
import { getCachedCategories } from "@modules/home/components/categories"
import { getHomepageProducts } from "@lib/data/products"
import HomeClientWrapper from "@modules/home/components/home-client-wrapper"

interface HomepageDataWrapperProps {
  countryCode: string;
}

export default async function HomepageDataWrapper({ countryCode }: HomepageDataWrapperProps) {
  // Data fetch starts
  
  const [collectionsResp, categories, homepageProducts] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    getCachedCategories().catch(() => []),
    getHomepageProducts(countryCode).catch(() => ({ featuredProducts: [] })),
  ])

  // Use hardcoded India region instead of API call
  const region = getIndiaRegion()

  const { collections } = collectionsResp
  const { featuredProducts } = homepageProducts

  if (!collections || !region) {
    return null;
  }

  return (
    <HomeClientWrapper
      featuredProducts={featuredProducts}
      categories={categories}
      region={region}
      countryCode={countryCode}
    />
  );
} 