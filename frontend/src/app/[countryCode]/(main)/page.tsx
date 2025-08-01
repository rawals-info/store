import { Metadata } from "next";

import { listCollections } from "@lib/data/collections";
import { getIndiaRegion } from "@lib/constants/india-region";
import { getCachedCategories } from "@modules/home/components/categories";
import { getHomepageProducts } from "@lib/data/products";
import HomeClientWrapper from "@modules/home/components/home-client-wrapper";

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
  const { countryCode } = params;

  const [collectionsResp, categories, homepageProducts] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    getCachedCategories().catch(() => []),
    getHomepageProducts(countryCode).catch(() => ({ featuredProducts: [] })),
  ]);

  const region = getIndiaRegion();
  const { collections } = collectionsResp;
  const { featuredProducts } = homepageProducts;

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