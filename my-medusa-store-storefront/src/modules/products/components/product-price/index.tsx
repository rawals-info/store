import { clx } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"
import { getProductPrice, CalculatedVariant } from "@lib/util/get-product-price"
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
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col text-luxury-charcoal/90">
      <span
        className={clx("text-lg", {
          "text-luxury-gold": selectedPrice.price_type === "sale",
        })}
      >
        {selectedPrice.calculated_price}
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
