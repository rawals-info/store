import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import Link from "next/link"

import { listProducts } from "../../../lib/data/products"
import { getIndiaRegion } from "@lib/constants/india-region"
import { SortOptions } from "../../store/components/refinement-list/sort-products"

import CategoryHero from "../components/category-hero"
import ProductList from "../components/product-list"
import SubcategoryGrid from "../components/subcategory-grid"

import Breadcrumb from "@modules/common/components/breadcrumb"

type CategoryTemplateProps = {
  category: HttpTypes.StoreProductCategory
  countryCode: string
  sortBy?: SortOptions
  page?: string
}

const CATEGORY_CHIPS = [
  { handle: "petha", label: "🍬 Petha Specials", emoji: "🍬" },
  { handle: "dalmoth", label: "🥜 Agra Dalmoth", emoji: "🥜" },
  { handle: "namkeen", label: "🌶️ Crispy Namkeen", emoji: "🌶️" },
  { handle: "combo1", label: "🎁 Combo Boxes", emoji: "🎁" },
]

export default async function CategoryTemplate({
  category,
  countryCode,
  sortBy,
  page,
}: CategoryTemplateProps) {
  const region = getIndiaRegion()

  if (!region) {
    return notFound()
  }

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    regionId: region?.id,
    queryParams: {
      category_id: [category.id],
      limit: 100,
    } as any,
  }).catch(() => ({ response: { products: [] } }))

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "All Sweets", href: `/${countryCode}/products` },
            { label: category.name || "Category", isCurrent: true },
          ]}
          countryCode={countryCode}
          className="mb-6 rounded-2xl border border-amber-100/90 shadow-xs"
        />

        {/* Category Hero */}
        <CategoryHero category={category} countryCode={countryCode} />

        {/* Quick Category Switcher Pills */}
        <div className="mb-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2.5 pb-2">
            <Link
              href={`/${countryCode}/products`}
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-jakarta text-xs font-bold whitespace-nowrap transition-colors shadow-sm"
            >
              ✨ All Sweets
            </Link>
            {CATEGORY_CHIPS.map((chip) => {
              const isActive = category.handle === chip.handle
              return (
                <Link
                  key={chip.handle}
                  href={`/${countryCode}/categories/${chip.handle}`}
                  className={`px-4 py-2 rounded-full font-jakarta text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-white hover:bg-amber-50 border border-amber-200/80 text-slate-800"
                  }`}
                >
                  {chip.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Subcategories (if any) */}
        {category.category_children && category.category_children.length > 0 && (
          <div className="mb-8">
            <SubcategoryGrid
              subcategories={category.category_children}
              countryCode={countryCode}
            />
          </div>
        )}

        {/* Products Grid */}
        <ProductList products={products} region={region} countryCode={countryCode} />
      </div>
    </div>
  )
}