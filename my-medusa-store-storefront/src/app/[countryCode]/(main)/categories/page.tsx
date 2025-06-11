import { Metadata } from "next"
import { listCategories } from "@lib/data/categories"
import { Suspense } from "react"
import CategoriesTemplate from "@modules/categories/templates/categories-template"
import SkeletonCategoriesPage from "@modules/skeletons/templates/skeleton-categories-page"
import { cache } from "react"

export const metadata: Metadata = {
  title: "Luxury Marble Categories | Browse our Exclusive Collections",
  description: "Explore our curated categories of handcrafted marble pieces, each meticulously created by master artisans for your luxury home. Discover table tops, jewelry boxes, home decor, and more.",
}

// Configure ISR for better performance
export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

// Cache the categories data
const getCachedCategories = cache(async () => {
  return await listCategories({
    limit: 100,
    fields: "id,name,handle,description,category_children,parent_category"
  });
});

export default function CategoriesPage({
  params,
}: {
  params: { countryCode: string }
}) {
  // Note: We're not destructuring params directly to avoid the error
  // The error happens when we do: params: { countryCode }
  
  return (
    <>
      <Suspense fallback={<SkeletonCategoriesPage />}>
        <CategoriesContent />
      </Suspense>
    </>
  )
}

// Separate async component to handle data fetching
async function CategoriesContent() {
  // Fetch categories with proper error handling
  const categories = await getCachedCategories();
  
  return <CategoriesTemplate categories={categories} />
} 