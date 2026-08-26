import { getProductPrice } from "@lib/util/get-product-price"
import { formatIndianPrice } from "@lib/util/money"
import { calculateDiscountedPrice } from "@lib/config/promotions"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId,
  })

  const selectedPrice = variantId ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-8 bg-slate-100 rounded animate-pulse" />
  }

  const rawNum = selectedPrice.calculated_price_number || 249
  const { discountedPrice, isDiscounted, discountPercent } = calculateDiscountedPrice(rawNum)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-900">
          ₹{formatIndianPrice(discountedPrice)}
        </span>
        {isDiscounted && (
          <>
            <span className="font-mono text-lg sm:text-xl text-slate-400 line-through">
              ₹{formatIndianPrice(rawNum)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-jakarta text-xs font-bold shadow-xs">
              {discountPercent}% OFF Applied
            </span>
          </>
        )}
      </div>
      <p className="text-[11px] font-jakarta font-semibold text-emerald-700">
        ✨ Inclusive of all taxes · Free Delivery on ₹500+
      </p>
    </div>
  )
}
