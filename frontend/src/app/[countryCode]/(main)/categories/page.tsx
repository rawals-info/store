import { Metadata } from "next"
import { getIndiaRegion } from "@lib/constants/india-region"
import { listCategories } from "@lib/data/categories"
import CategorySection from "@modules/categories/components/category-section"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"

import { listIndiaRegions } from "@lib/constants/india-region"

export const metadata: Metadata = {
  title: "Explore Sweet Categories | Authentic Agra Petha & Namkeen | Taj Petha",
  description: "Browse all Agra sweet and snack categories: Kesar Petha, Dry Petha, Paan Petha, Agra Dalmoth, Crispy Namkeen, and Gift Hampers. Fresh daily dispatch across India.",
}

export const revalidate = 3600

export async function generateStaticParams() {
  const regions = listIndiaRegions()
  return regions.flatMap((r) => r.countries?.map((c) => ({ countryCode: c.iso_2?.toLowerCase() || "in" })) || [{ countryCode: "in" }])
}

export default async function Categories(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  
  const region = getIndiaRegion()
  const categories = await listCategories().catch(() => null)

  if (!categories || categories.length === 0) {
    return notFound()
  }

  const parentCategories = categories.filter((c) => !c.parent_category)

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-10 shadow-sm mb-10">
          <nav className="flex items-center gap-2 text-xs font-jakarta text-slate-500 mb-4" aria-label="Breadcrumb">
            <Link href={`/${countryCode}`} className="hover:text-petha-amber transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Categories</span>
          </nav>

          <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold inline-block px-3 py-1 rounded-full bg-amber-100/70 mb-2">
            Curated Sweets &amp; Snacks
          </span>
          <h1 className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Browse Authentic Agra Sweet Categories
          </h1>
          <p className="font-jakarta text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Handcrafted daily in small batches in Agra with ash gourd, royal saffron, pistachio, and traditional spices.
          </p>
        </div>

        {/* Categories Sections */}
        <div className="space-y-12 pb-16">
          {parentCategories.map((c: HttpTypes.StoreProductCategory) => (
            <CategorySection category={c} key={c.id} />
          ))}
        </div>
      </div>
    </div>
  )
}