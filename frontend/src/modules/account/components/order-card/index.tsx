import { useMemo } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Package, ArrowRight, Clock, CheckCircle2 } from "lucide-react"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div
      className="bg-white rounded-3xl border border-slate-200 hover:border-petha-amber p-6 shadow-xs hover:shadow-md transition-all font-jakarta space-y-6"
      data-testid="order-card"
    >
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-slate-900">
              Order #{order.display_id || order.id.slice(0, 8)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {order.status || "Confirmed"}
            </span>
          </div>
          <p className="text-xs text-slate-500" data-testid="order-created-at">
            Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
          </p>
        </div>

        <div className="flex items-baseline sm:flex-col sm:items-end gap-2 sm:gap-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Amount</span>
          <span className="font-mono font-bold text-base text-slate-900" data-testid="order-amount">
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Items Ordered ({numberOfLines} {numberOfLines === 1 ? "pack" : "packs"}):
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {order.items?.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/40 border border-amber-100"
              data-testid="order-item"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-amber-200 flex-shrink-0 relative">
                <Thumbnail thumbnail={item.thumbnail} images={[]} size="full" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-slate-900 truncate" data-testid="item-title">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Qty: <span className="font-bold text-slate-800" data-testid="item-quantity">{item.quantity}</span>
                </p>
              </div>
            </div>
          ))}

          {numberOfProducts > 3 && (
            <div className="flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500">
              +{numberOfProducts - 3} more items
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-petha-amber" />
          <span>Dispatched from Agra via Air Cargo</span>
        </span>

        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-petha-amber hover:bg-petha-saffron text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
          data-testid="order-details-link"
        >
          <span>Order Details &amp; Tracking</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
