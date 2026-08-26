import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

type CategorySectionProps = {
  category: HttpTypes.StoreProductCategory
  className?: string
}

const CATEGORY_IMAGES: Record<string, string> = {
  petha: "/hero_petha_square.webp",
  dalmoth: "/images/dalmoth.webp",
  namkeen: "/images/namkeen.webp",
  combo1: "/images/combo.webp",
}

const CategorySection = ({ category, className }: CategorySectionProps) => {
  const image = (category.metadata?.image as string) || CATEGORY_IMAGES[category.handle] || "/hero_petha_square.webp"

  return (
    <div
      className={`bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 ${className || ""}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 items-center">
        {/* Info */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-jakarta font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
            <span>Featured Sweet Collection</span>
          </div>

          <h2 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900">
            {category.name}
          </h2>

          <p className="font-jakarta text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            {category.description ||
              `Discover authentic ${category.name.toLowerCase()} prepared freshly in Agra by master halwais with pure ingredients.`}
          </p>

          <Link
            href={`/categories/${category.handle}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Explore {category.name} ({category.products?.length || 0})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Thumbnail Preview */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-amber-50 border border-amber-200/60 shadow-sm">
          <Image
            src={image}
            alt={category.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  )
}

export default CategorySection