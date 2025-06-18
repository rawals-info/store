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
    
    // First check if this is a known legacy handle from our config
    const configCategory = getCategoryByLegacyHandle(categoryHandle);
    if (configCategory) {
      console.log(`Redirecting from legacy handle ${categoryHandle} to ${configCategory.handle}`);
      redirect(`/${countryCode}/categories/${configCategory.handle}`);
    }
    
    // Then proceed with regular category lookup
    const categoryObj = await getCachedCategory(categoryHandle);

    if (!categoryObj) {
      // Try to find a similar category
      const similarCategory = await findSimilarCategory(categoryHandle);
      
      if (similarCategory) {
        // Redirect to the correct category URL
        console.log(`Redirecting from ${categoryHandle} to ${similarCategory.handle}`);
        redirect(`/${countryCode}/categories/${similarCategory.handle}`);
      }
      
      // If no similar category found, show a helpful not found page
      return (
        <div className="py-8 px-4">
          <h2 className="text-2xl font-bold">Category not found</h2>
          <p className="mt-4 text-gray-500">
            We couldn't find the category "{categoryHandle}". Please check the URL or browse our available categories.
          </p>
          <a href={`/${countryCode}/categories`} className="mt-4 inline-block py-2 px-4 bg-luxury-gold text-white rounded hover:bg-luxury-gold/90 transition-colors">
            Browse All Categories
          </a>
        </div>
      );
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
