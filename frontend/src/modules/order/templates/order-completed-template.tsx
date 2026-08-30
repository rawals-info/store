import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import CartTotals from "@modules/common/components/cart-totals"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import Items from "@modules/order/components/items"
import OrderAnalyticsTracker from "@modules/order/components/order-analytics-tracker"
import { CheckCircle2, Sparkles, Truck, ShieldCheck, ArrowRight, MessageCircle, Clock, PackageCheck, Utensils } from "lucide-react"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const orderId = order.display_id || order.id.slice(0, 8)
  const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) : ""

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-14 font-jakarta">
      <OrderAnalyticsTracker order={order} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" data-testid="order-complete-container">
        
        {/* Celebratory Hero Card */}
        <div className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-12 shadow-xs text-center space-y-5">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-petha-amber flex items-center justify-center text-white text-xs shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <span>Order Successfully Placed</span>
            </div>

            <h1 className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Thank You for Your Order!
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Your authentic Agra sweets order has been received. Our master confectioners are preparing your fresh batch for vacuum-sealed dispatch.
            </p>
          </div>

          {/* Order ID Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200/80 font-mono text-sm font-bold text-slate-900 shadow-2xs">
              Order #{orderId}
            </div>
            {orderDate && (
              <span className="text-xs font-semibold text-slate-500">
                Placed on {orderDate}
              </span>
            )}
          </div>

          {/* Live Order Timeline */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
              Order Fulfillment Progress
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              
              {/* Step 1 */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold font-jakarta">Confirmed</span>
                </div>
                <p className="text-[11px] text-slate-600">Payment approved</p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-900">
                  <Utensils className="w-4 h-4 text-petha-amber" />
                  <span className="text-xs font-bold font-jakarta">Kitchen Prep</span>
                </div>
                <p className="text-[11px] text-slate-600">Fresh batch cooking</p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 opacity-75">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Truck className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold font-jakarta">Air Dispatch</span>
                </div>
                <p className="text-[11px] text-slate-500">Tracking via SMS</p>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 opacity-75">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <PackageCheck className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold font-jakarta">Delivered</span>
                </div>
                <p className="text-[11px] text-slate-500">Fresh at doorstep</p>
              </div>

            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-cormorant text-2xl font-bold text-slate-900">
              Items in Your Sweet Box
            </h2>
            <span className="text-xs font-bold text-petha-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Fresh Batch
            </span>
          </div>

          <Items order={order} />

          <div className="pt-6 border-t border-slate-100">
            <CartTotals totals={order} />
          </div>
        </div>

        {/* Shipping & Payment Recap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-amber-200/60 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-petha-amber pb-3 border-b border-slate-100">
              <Truck className="w-4 h-4 text-petha-amber" />
              <span>Delivery Information</span>
            </div>
            <ShippingDetails order={order} />
          </div>

          <div className="bg-white rounded-3xl border border-amber-200/60 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment Details</span>
            </div>
            <PaymentDetails order={order} />
          </div>
        </div>

        {/* Action Buttons: Return Store & WhatsApp Support */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/in"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="https://wa.me/919997120002?text=Hello%2C%20I%20have%20an%20order%20question%20for%20Taj%20Petha."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Support</span>
          </a>
        </div>

      </div>
    </div>
  )
}
