"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Package, ArrowRight, Sparkles } from "lucide-react"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="space-y-6 font-jakarta">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              Your Orders &amp; Delivery History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing all {orders.length} orders placed with Taj Petha Agra.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full bg-slate-50/70 border border-slate-200 rounded-3xl p-10 text-center space-y-4 font-jakarta"
      data-testid="no-orders-container"
    >
      <div className="w-16 h-16 rounded-full bg-amber-100 text-petha-amber flex items-center justify-center mx-auto shadow-xs">
        <Package className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h2 className="font-cormorant text-2xl font-bold text-slate-900">
          No Orders Placed Yet
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Ready to experience authentic Agra sweets? Browse our freshly prepared white petha, kesar angoori, and dalmoth.
        </p>
      </div>
      <div className="pt-2">
        <LocalizedClientLink href="/products">
          <button className="px-6 py-3 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer inline-flex items-center gap-2">
            <span>Explore Fresh Sweets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
