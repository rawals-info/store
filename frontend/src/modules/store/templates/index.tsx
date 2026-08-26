import { Suspense } from "react"
import Link from "next/link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import { Sparkles, Truck, ShieldCheck, Gift } from "lucide-react"

const CATEGORY_PILLS = [
  { label: "✨ All Delicacies", href: "/products" },
  { label: "🍬 Agra Petha", href: "/categories/petha" },
  { label: "🥜 Royal Dalmoth", href: "/categories/dalmoth" },
  { label: "🌶️ Crispy Namkeen", href: "/categories/namkeen" },
  { label: "🎁 Sweet Gift Boxes", href: "/categories/combo" },
]

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10 font-jakarta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" data-testid="category-container">
        
        {/* Header Hero Card */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-950 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
                <span>Authentic Agra Confectionery</span>
              </div>
              <h1 className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900 leading-tight" data-testid="store-page-title">
                Explore All Authentic Sweets &amp; Snacks
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Handcrafted daily in small kadhai batches in Agra. Vacuum-sealed at peak freshness and dispatched via Air Express nationwide.
              </p>
            </div>

            {/* Quick Trust Strip */}
            <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-600 bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-2xl">
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-petha-amber" /> Free Air Delivery ₹500+</span>
              <span>•</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 30-Day Freshness</span>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
                Filter by Sweet:
              </span>
              {CATEGORY_PILLS.map((pill) => (
                <Link
                  key={pill.label}
                  href={`/${countryCode}${pill.href}`}
                  className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-slate-50 hover:bg-petha-amber hover:text-white border border-slate-200 transition-all shadow-xs"
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Store Grid with Sidebar Filter */}
        <div className="flex flex-col small:flex-row small:items-start gap-8">
          <RefinementList sortBy={sort} />
          
          <div className="flex-1 w-full min-w-0">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>

      </div>
    </div>
  )
}

export default StoreTemplate
