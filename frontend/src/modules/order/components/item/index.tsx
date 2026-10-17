import { HttpTypes } from "@medusajs/types"
import { Table } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  const quantity = item.quantity || 1
  const unitPrice = item.unit_price ?? 0
  const lineTotal = item.total ?? (unitPrice * quantity)
  const originalLineTotal = item.original_total ?? lineTotal
  const hasDiscount = lineTotal < originalLineTotal

  const variantTitle = item.variant_title || (item.variant as any)?.title || ""
  const displayVariant =
    variantTitle &&
    variantTitle !== "Default variant" &&
    variantTitle !== item.product_title &&
    variantTitle !== item.title
      ? variantTitle
      : ""

  return (
    <Table.Row
      className="w-full border-b border-amber-100/80 last:border-b-0 hover:bg-amber-50/20 transition-colors"
      data-testid="product-row"
    >
      <Table.Cell className="!pl-0 py-3.5 w-16">
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200/80 bg-white shrink-0">
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
      </Table.Cell>

      <Table.Cell className="text-left py-3.5 pl-3">
        <p className="font-jakarta font-bold text-sm text-slate-900 leading-snug" data-testid="product-name">
          {item.product_title || item.title}
        </p>
        {displayVariant && (
          <span className="inline-block mt-1 font-jakarta text-xs text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md font-medium">
            Pack: {displayVariant}
          </span>
        )}
        <div className="font-jakarta text-xs text-slate-500 mt-0.5">
          Quantity: <span className="font-bold text-slate-800">{quantity}</span>
        </div>
      </Table.Cell>

      <Table.Cell className="!pr-0 py-3.5 text-right">
        <div className="flex flex-col items-end justify-center">
          {hasDiscount && (
            <span className="font-mono text-xs text-slate-400 line-through">
              {convertToLocale({ amount: originalLineTotal, currency_code: currencyCode })}
            </span>
          )}
          <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
            {convertToLocale({ amount: lineTotal, currency_code: currencyCode })}
          </span>
          {quantity > 1 && (
            <span className="font-mono text-[11px] text-slate-500">
              ({convertToLocale({ amount: lineTotal / quantity, currency_code: currencyCode })}/pack)
            </span>
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
