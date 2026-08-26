import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import CartTotals from "@modules/common/components/cart-totals"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import Items from "@modules/order/components/items"
import OrderAnalyticsTracker from "@modules/order/components/order-analytics-tracker"
import { CheckCircle2, Sparkles, Truck, ShieldCheck, ArrowRight } from "lucide-react"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 font-jakarta">
      <OrderAnalyticsTracker order={order} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" data-testid="order-complete-container">
        
        {/* Celebratory Banner */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-8 sm:p-12 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/80 text-amber-950 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
            <span>Order Confirmed · Preparing Fresh in Agra</span>
          </div>

          <h1 className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Thank You for Your Sweet Order!
          </h1>

          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Your authentic Agra sweets are being slow-cooked and vacuum-sealed for Air Express dispatch. We will send you SMS &amp; email tracking updates shortly.
          </p>

          <div className="pt-2">
            <span className="font-mono font-bold text-sm bg-slate-100 px-4 py-2 rounded-xl text-slate-800 border border-slate-200">
              Order #{order.display_id || order.id.slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="font-cormorant text-2xl font-bold text-slate-900">
              Items in Your Sweet Box
            </h2>
          </div>

          <Items order={order} />

          <div className="pt-6 border-t border-slate-100">
            <CartTotals totals={order} />
          </div>
        </div>

        {/* Shipping & Payment Recap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-amber-100/90 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-petha-amber mb-3">
              <Truck className="w-4 h-4" />
              <span>Shipping Information</span>
            </div>
            <ShippingDetails order={order} />
          </div>

          <div className="bg-white rounded-3xl border border-amber-100/90 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Payment Details</span>
            </div>
            <PaymentDetails order={order} />
          </div>
        </div>

        {/* Back to Home CTA */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Return to Taj Petha Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}
