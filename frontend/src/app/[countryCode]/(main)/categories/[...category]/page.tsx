import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { cache } from "react"
import { Suspense } from "react"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { listIndiaRegions } from "@lib/constants/india-region"
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
export const dynamic = 'force-static'
export const revalidate = 300 // Cache for 5 minutes; category pages change less often

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

  const regions = listIndiaRegions()

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
          title: `${similarCategory.name} | Taj Petha`,
          description: 'description' in similarCategory && similarCategory.description 
            ? similarCategory.description 
            : `Browse our exclusive ${similarCategory.name.toLowerCase()} collection of authentic Agra pethas, Hand-Made with traditional recipes.`,
        };
      }
      
      return {
        title: "Category | Taj Petha",
        description: "Browse our exclusive collection of authentic Agra pethas, Hand-Made with traditional recipes passed down through generations.",
      };
    }

    return {
      title: `${categoryObj.name} | Taj Petha`,
      description: categoryObj.description || `Browse our exclusive ${categoryObj.name.toLowerCase()} collection of authentic Agra pethas, Hand-Made with traditional recipes.`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Category | Taj Petha",
      description: "Browse our exclusive collection of authentic Agra pethas, Hand-Made with traditional recipes passed down through generations.",
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
    <>
      <CategoryTemplate
        category={category}
        sortBy={sortBy}
        page={page}
        countryCode={paramsData.countryCode}
      />

      {/* Compact product links for SEO internal linking */}
      {category?.products && category.products.length > 0 && (
        <section className="content-container py-8">
          <h2 className="text-lg font-serif text-luxury-charcoal mb-3">Popular in {category.name}</h2>
          <div className="flex flex-wrap gap-3">
            {category.products.slice(0, 40).map((p: any) => (
              <a
                key={p.id}
                href={`/${paramsData.countryCode}/products/${p.handle}`}
                className="text-sm text-luxury-charcoal/80 hover:text-luxury-gold underline-offset-2 hover:underline"
              >
                {p.title}
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
