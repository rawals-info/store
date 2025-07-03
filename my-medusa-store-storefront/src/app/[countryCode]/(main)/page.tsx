import { Metadata } from "next";

import { listCollections } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";
import { getCachedCategories } from "@modules/home/components/categories"
import { getHomepageProducts } from "@lib/data/products"
import HomeClientWrapper from "@modules/home/components/home-client-wrapper"

export const metadata: Metadata = {
  title: "Imperial Craft Of India | Fine Hand-Crafts",
  description: "A custom e-commerce storefront with Next.js and Medusa.",
};

interface HomeProps {
  params: {
    countryCode: string;
  };
}

export default async function Home({ params }: HomeProps) {
  const { countryCode } = await params;
  const region = await getRegion(countryCode);
  const { collections } = await listCollections({ fields: "id, handle, title" });
  const categories = await getCachedCategories().catch(() => [])
  const { featuredProducts } = await getHomepageProducts(countryCode).catch(() => ({
    featuredProducts: [],
  }))

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