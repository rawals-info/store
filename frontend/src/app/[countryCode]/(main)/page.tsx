import { Metadata } from "next";

import { listCollections } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";
import { getCachedCategories } from "@modules/home/components/categories"
import { getHomepageProducts } from "@lib/data/products"
import HomeClientWrapper from "@modules/home/components/home-client-wrapper"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Taj Petha | Authentic Agra Sweets",
  description: "Discover the finest authentic Agra pethas crafted with traditional recipes.",
};

interface HomeProps {
  params: {
    countryCode: string;
  };
}

export default async function Home({ params }: HomeProps) {
  const { countryCode } = await params;
  const [region, collectionsResp, categories, homepageProducts] = await Promise.all([
    getRegion(countryCode),
    listCollections({ fields: "id, handle, title" }),
    getCachedCategories().catch(() => []),
    getHomepageProducts(countryCode).catch(() => ({ featuredProducts: [] })),
  ])

  const { collections } = collectionsResp
  const { featuredProducts } = homepageProducts

  if (!collections || !region) {
    return null;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}> 
      <HomeClientWrapper
        featuredProducts={featuredProducts}
        categories={categories}
        region={region}
        countryCode={countryCode}
      />
    </Suspense>
  );
} 