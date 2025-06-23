import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { cache } from "react"
import { Suspense } from "react"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { CategoryTemplate } from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { getCategoryByLegacyHandle } from "@lib/config/categories"

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
  try {
    return await getCategoryByHandle(handle);
  } catch (error) {
    console.error(`Error fetching category with handle ${handle}:`, error);
    // Return null instead of calling notFound() to allow fallback handling
    return null;
  }
});

// Function to find similar category handles
async function findSimilarCategory(handle: string) {
  try {
    // First check our configuration for known legacy handles
    const configCategory = getCategoryByLegacyHandle(handle);
    if (configCategory) {
      return { handle: configCategory.handle, name: configCategory.displayName };
    }
    
    // If not in config, try to find a similar one by string matching
    const allCategories = await listCategories();
    
    // Check if there's a similar category (e.g., "marble-table" vs "marble-table-top")
    const similarCategory = allCategories.find(c => 
      c.handle?.includes(handle) || handle.includes(c.handle || '')
    );
    
    return similarCategory;
  } catch (error) {
    console.error("Error finding similar category:", error);
    return null;
  }
}

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
      // Try to find a similar category before giving up
      const similarCategory = await findSimilarCategory(categoryHandle);
      
      if (similarCategory) {
        return {
          title: `${similarCategory.name} | Luxury Marble Collection`,
          description: 'description' in similarCategory && similarCategory.description 
            ? similarCategory.description 
            : `Browse our exclusive ${similarCategory.name.toLowerCase()} collection, handcrafted by master artisans for your luxury home.`,
        };
      }
      
      return {
        title: "Category | Luxury Marble Collection",
        description: "Browse our exclusive marble collection, handcrafted by master artisans for your luxury home.",
      };
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
  // Await params and searchParams to comply with Next.js 15 dynamic routes
  const paramsData = await params
  const searchData = await searchParams

  const { sortBy, page } = searchData
  const categoryHandle = paramsData.category[paramsData.category.length - 1]

  const category = await getCategoryByHandle(categoryHandle)

  if (!category) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={category}
      sortBy={sortBy}
      page={page}
      countryCode={paramsData.countryCode}
    />
  )
}
