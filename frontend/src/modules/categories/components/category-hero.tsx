import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import { Sparkles, ShieldCheck, Truck, Leaf } from "lucide-react"

type CategoryHeroProps = {
  category: HttpTypes.StoreProductCategory
  countryCode?: string
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ category, countryCode = "in" }) => {
  return (
    <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-10 lg:p-12 shadow-sm mb-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-jakarta text-slate-500 mb-4" aria-label="Breadcrumb">
        <Link href={`/${countryCode}`} className="hover:text-petha-amber transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${countryCode}/categories`} className="hover:text-petha-amber transition-colors">Categories</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{category.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-jakarta font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
            <span>Authentic Agra Speciality</span>
          </div>

          <h1 className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Fresh Agra {category.name}
          </h1>

          <p className="font-jakarta text-xs sm:text-sm text-slate-600 leading-relaxed">
            {category.description ||
              `Explore our freshly handcrafted ${category.name.toLowerCase()} collection, prepared daily in Agra using royal halwai recipes and 100% natural ingredients.`}
          </p>
        </div>

        {/* Highlight Perks Card */}
        <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-4 sm:p-5 flex-shrink-0 space-y-2.5 text-xs font-jakarta text-slate-800 min-w-[240px]">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">100% Pure Vegetarian</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-petha-amber" />
            <span className="font-semibold">Free Express Shipping ₹500+</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Sealed 30-Day Freshness</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryHero