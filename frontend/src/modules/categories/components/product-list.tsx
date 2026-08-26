import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import Link from "next/link"
import { STORE_PROMOTION } from "@lib/config/promotions"

const ProductList = ({
  products,
  region,
  countryCode = "in",
}: {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  countryCode?: string
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-amber-100/90 p-8 sm:p-12 text-center space-y-4">
        <span className="text-4xl block">🍬</span>
        <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
          Fresh Batches Coming Soon
        </h3>
        <p className="font-jakarta text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          We prepare sweets daily in limited quantities to guarantee supreme freshness. Explore our full sweet collection below!
        </p>
        <Link
          href={`/${countryCode}/products`}
          className="inline-block px-6 py-3 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
        >
          Browse All Products →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <p className="font-jakarta text-xs font-bold text-slate-500 uppercase tracking-wider">
          Showing {products.length} {products.length === 1 ? "Product" : "Products"}
        </p>
        {STORE_PROMOTION.enabled && STORE_PROMOTION.discountPercent > 0 && STORE_PROMOTION.code ? (
          <span className="text-xs font-semibold text-emerald-700 font-jakarta bg-emerald-50 px-2.5 py-1 rounded-full">
            ✨ {STORE_PROMOTION.discountPercent}% OFF with {STORE_PROMOTION.code}
          </span>
        ) : (
          <span className="text-xs font-semibold text-emerald-700 font-jakarta bg-emerald-50 px-2.5 py-1 rounded-full">
            ✨ 100% Authentic Agra Petha
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
        {products.map((p) => (
          <ProductPreview key={p.id} product={p} region={region} />
        ))}
      </div>
    </div>
  )
}

export default ProductList