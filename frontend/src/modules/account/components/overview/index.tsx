import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Package, MapPin, User, ArrowRight, Clock, CheckCircle2 } from "lucide-react"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)

  return (
    <div data-testid="overview-page-wrapper" className="space-y-8 font-jakarta">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-petha-amber">
            Customer Dashboard
          </span>
          <h1
            className="font-cormorant text-3xl font-bold text-slate-900"
            data-testid="welcome-message"
            data-value={customer?.first_name}
          >
            Namaste, {customer?.first_name || "Sweet Connoisseur"}!
          </h1>
        </div>
        
        <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
          Logged in as: <span className="font-bold text-slate-900" data-testid="customer-email">{customer?.email}</span>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">Profile</span>
            <User className="w-4 h-4 text-petha-amber" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900">{profileCompletion}%</span>
            <span className="text-xs text-slate-500">Completed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">Addresses</span>
            <MapPin className="w-4 h-4 text-petha-amber" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900">{customer?.addresses?.length || 0}</span>
            <span className="text-xs text-slate-500">Saved</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">Orders</span>
            <Package className="w-4 h-4 text-petha-amber" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900">{orders?.length || 0}</span>
            <span className="text-xs text-slate-500">Total Placed</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-cormorant text-2xl font-bold text-slate-900">
            Recent Sweet Box Orders
          </h2>
          {orders && orders.length > 0 && (
            <LocalizedClientLink
              href="/account/orders"
              className="text-xs font-bold text-petha-amber hover:underline flex items-center gap-1"
            >
              <span>View all ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </LocalizedClientLink>
          )}
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-3" data-testid="orders-wrapper">
            {orders.slice(0, 5).map((order) => (
              <LocalizedClientLink
                key={order.id}
                href={`/account/orders/details/${order.id}`}
                className="block p-5 rounded-2xl bg-white border border-slate-200 hover:border-petha-amber hover:shadow-md transition-all group"
                data-testid="order-wrapper"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        #{order.display_id || order.id.slice(0, 8)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {order.status || "Confirmed"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {convertToLocale({
                        amount: order.total,
                        currency_code: order.currency_code,
                      })}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-amber-100 group-hover:text-amber-950 flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-cormorant text-xl font-bold text-slate-800">
              No orders placed yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready to experience authentic Agra sweets? Browse our freshly prepared white petha, kesar angoori, and dalmoth.
            </p>
            <LocalizedClientLink
              href="/products"
              className="inline-block px-5 py-2.5 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              Explore Fresh Sweets →
            </LocalizedClientLink>
          </div>
        )}
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0
  if (!customer) return 0
  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  if (customer.addresses && customer.addresses.length > 0) count++
  return Math.round((count / 4) * 100)
}

export default Overview
