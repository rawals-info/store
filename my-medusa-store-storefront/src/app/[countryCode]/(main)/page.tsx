import { Metadata } from "next";
import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@modules/common/components/builder";

import { listCollections } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";
import { getCachedCategories } from "@modules/home/components/categories"
import { getHomepageProducts } from "@lib/data/products"
import HomeClientWrapper from "@modules/home/components/home-client-wrapper"

// Initialize Builder.io with the environment variable
builder.init(process.env.YOUR_BUILDER_API_KEY || "38d68438e314470e9a024d29227f1e31");

export const metadata: Metadata = {
  title: "Home | Medusa Storefront",
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

  const content = await builder
    .get("page", {
      userAttributes: { urlPath: "/" },
      prerender: false,
    })
    .toPromise();

  // If there's Builder.io content, render it
  // Otherwise, fall back to your original home page content
  return (
    <>
      {content && <RenderBuilderContent content={content} model="page" />}
      <HomeClientWrapper
        featuredProducts={featuredProducts}
        categories={categories}
        region={region}
        countryCode={countryCode}
      />
    </>
  );
} 