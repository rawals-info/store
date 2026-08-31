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
export const revalidate = 3600 // 1 hour fallback (webhook invalidates immediately on changes)

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
  const paramsData = await params;
  const category = paramsData.category;

  try {
    const categoryHandle = category[category.length - 1];
    let categoryObj = await getCachedCategory(categoryHandle);

    if (!categoryObj) {
      const similarCategory = await findSimilarCategory(categoryHandle);
      if (similarCategory) {
        categoryObj = similarCategory as any;
      }
    }

    const categoryName = categoryObj?.name || "Agra Sweets"
    const title = `Buy Authentic ${categoryName} Online | Fresh Agra Preparation - Taj Petha`
    const description =
      categoryObj?.description ||
      `Shop fresh authentic ${categoryName} online. Handcrafted daily in Agra with 100% pure ingredients, airtight packaging for 30-day freshness, and fast express air delivery across India.`

    return {
      title,
      description,
      keywords: [
        `buy ${categoryName.toLowerCase()} online`,
        `authentic agra ${categoryName.toLowerCase()}`,
        `best ${categoryName.toLowerCase()} to buy`,
        "buy petha online",
        "agra petha",
        "original agra sweets",
        "fresh sweets delivery",
      ],
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Buy Authentic Agra Petha & Sweets Online | Taj Petha",
      description: "Browse our fresh collection of authentic Agra pethas and crispy namkeen, handcrafted daily with pure ingredients.",
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
      {/* ItemList JSON-LD for category listings */}
      {(() => {
        try {
          const items = (category?.products || []).slice(0, 60).map((p: any, idx: number) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: `https://tajpetha.in/${paramsData.countryCode}/products/${p.handle}`,
            name: p.title,
          }))
          const itemList = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: items,
          }
          return (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
            />
          )
        } catch {
          return null
        }
      })()}

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
