import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Suspense } from "react"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { CategoryTemplate } from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

type Props = {
  params: { category: string[]; countryCode: string }
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
}

// Use a more conservative caching strategy
export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

// Cache category data to prevent redundant fetches
const getCachedCategory = cache(async (handle: string) => {
  return await getCategoryByHandle(handle);
});

export async function generateStaticParams() {
  const categories = await listCategories()
  
  if (!categories) {
    return []
  }

  const regions = await listRegions()

  // Only generate the most popular categories to avoid too many pages
  return regions
    .map((region) => {
      return categories.slice(0, 10).map((category) => {
        return {
          category: [category.handle],
          countryCode: region.countries?.[0]?.iso_2 || "us",
        }
      })
    })
    .flat()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Properly await params before using them - Next.js 15 requirement
  const paramsData = await params;
  const category = paramsData.category;

  try {
    // Use the last part of the category path as the handle
    const categoryHandle = category[category.length - 1];
    const categoryObj = await getCachedCategory(categoryHandle);

    if (!categoryObj) {
      return notFound()
    }

    return {
      title: `${categoryObj.name} | Luxury Marble Collection`,
      description: categoryObj.description || `Browse our exclusive ${categoryObj.name.toLowerCase()} collection, handcrafted by master artisans for your luxury home.`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Category | Luxury Marble Collection",
      description: "Browse our exclusive marble collection, handcrafted by master artisans for your luxury home.",
    }
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  try {
    // IMPORTANT: Await params and searchParams to fix Next.js 15 async API requirements
    const paramsData = await params;
    const searchParamsData = await searchParams;
    
    // Now safe to destructure after properly awaiting
    const category = paramsData.category;
    const countryCode = paramsData.countryCode;
    
    // Handle pagination and sorting with proper type checking after awaiting searchParams
    const sortBy = searchParamsData.sortBy;
    const pageParam = searchParamsData.page;
    const pageNumber = pageParam ? parseInt(pageParam) : 1;
    
    // Important: Create a stable key for React to recognize the page has changed
    // Use after awaiting params to avoid the sync-dynamic-apis error
    const pageKey = `category-${category.join('-')}-${countryCode}-${Date.now()}`;
    
    // Safe to use now that we've properly handled the async operations
    const categoryHandle = category[category.length - 1];
    const categoryObj = await getCachedCategory(categoryHandle);

    if (!categoryObj) {
      return notFound()
    }

    return (
      <div key={pageKey} id={`category-${categoryObj.id}`}>
        <Suspense fallback={<SkeletonProductGrid numberOfProducts={8} />}>
          <CategoryTemplate
            category={categoryObj}
            sortBy={sortBy}
            page={pageNumber.toString()}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error loading category:", error)
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold">Error loading category</h2>
        <p className="mt-4 text-gray-500">
          We encountered an error while loading this category. Please try again later.
        </p>
      </div>
    )
  }
}
