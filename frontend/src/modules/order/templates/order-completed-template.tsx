import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import CartTotals from "@modules/common/components/cart-totals"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import Items from "@modules/order/components/items"
import OrderAnalyticsTracker from "@modules/order/components/order-analytics-tracker"
import {
  CheckCircle2,
  Sparkles,
  Truck,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  PackageCheck,
  Utensils,
  MapPin,
  CreditCard,
  ShoppingBag,
  Clock,
  Printer
} from "lucide-react"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const orderId = order.display_id || order.id.slice(0, 8)
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : ""

  const fStatus = (order.fulfillment_status || "not_fulfilled").toLowerCase()
  const isFulfilled =
    fStatus === "fulfilled" ||
    fStatus === "partially_shipped" ||
    fStatus === "shipped" ||
    fStatus === "delivered"
  const isShipped =
    fStatus === "partially_shipped" ||
    fStatus === "shipped" ||
    fStatus === "delivered"
  const isDelivered = fStatus === "delivered"

  // Check for any tracking info from fulfillments
  const fulfillments = (order as any).fulfillments || []
  let trackingNumber = ""
  let trackingUrl = ""
  for (const f of fulfillments) {
    if (f.labels && Array.isArray(f.labels) && f.labels.length > 0) {
      trackingNumber = f.labels[0].tracking_number || ""
      trackingUrl = f.labels[0].tracking_url || ""
      if (trackingUrl || trackingNumber) break
    }
  }
  if (!trackingUrl && trackingNumber.startsWith("http")) {
    trackingUrl = trackingNumber
  }

  const customerFirstName = order.shipping_address?.first_name || "Valued Customer"
  const itemCount = order.items?.length || 0

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10 font-jakarta">
      <OrderAnalyticsTracker order={order} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" data-testid="order-complete-container">
        
        {/* TOP CELEBRATORY CONFIRMATION HERO */}
        <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-3xl shadow-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-petha-amber flex items-center justify-center text-white text-[10px] shadow-sm">
                  <Sparkles className="w-3 h-3" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                    Order Confirmed
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/80">
                    Order #{orderId}
                  </span>
                  {orderDate && (
                    <span className="text-xs text-slate-500 font-medium">
                      &bull; {orderDate}
                    </span>
                  )}
                </div>
                <h1 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  Thank You, {customerFirstName}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                  We have received your order. A confirmation receipt has been sent to{" "}
                  <strong className="text-slate-900 font-semibold">{order.email}</strong>.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/919259418994?text=${encodeURIComponent(
                  `Hello Taj Petha, I have an inquiry regarding Order #${orderId}:`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Support</span>
              </a>

              <Link
                href="/in"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Connected Fulfillment Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-jakarta">
                Live Fulfillment Progress
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {isDelivered
                  ? "Delivered Successfully"
                  : isShipped
                  ? "In Express Air Transit"
                  : isFulfilled
                  ? "Packed & Ready for Courier"
                  : "Cooking Fresh Batch in Agra"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Step 1: Confirmed */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold font-jakarta">1. Confirmed</span>
                </div>
                <p className="text-[11px] text-slate-600">Payment approved</p>
              </div>

              {/* Step 2: Kitchen Prep */}
              {isFulfilled ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold font-jakarta">2. Kitchen Prep</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Fresh batch packed</p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-900">
                    <Utensils className="w-4 h-4 text-petha-amber" />
                    <span className="text-xs font-bold font-jakarta">2. Kitchen Prep</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Cooking fresh in Agra</p>
                </div>
              )}

              {/* Step 3: Air Dispatch */}
              {isShipped ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold font-jakarta">3. Air Dispatch</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Dispatched via Air</p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 opacity-75">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Truck className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold font-jakarta">3. Air Dispatch</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Tracking via Email/SMS</p>
                </div>
              )}

              {/* Step 4: Delivered */}
              {isDelivered ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold font-jakarta">4. Delivered</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Delivered successfully</p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 opacity-75">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <PackageCheck className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold font-jakarta">4. Delivered</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Fresh at doorstep</p>
                </div>
              )}
            </div>

            {/* Live Tracking Link Card if shipped */}
            {trackingUrl && (
              <div className="mt-3 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-petha-amber shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Dispatched {trackingNumber && !trackingNumber.startsWith("http") ? `• AWB: ${trackingNumber}` : ""}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Your parcel is in express air transit to your delivery address.
                    </div>
                  </div>
                </div>
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-petha-amber hover:bg-petha-saffron text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all whitespace-nowrap"
                >
                  <span>Track Live Shipment &rarr;</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 2-COLUMN BALANCED COMMERCIAL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Items in Sweet Box & Delivery Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Items Card */}
            <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-petha-amber" />
                  <h2 className="font-cormorant text-2xl font-bold text-slate-900">
                    Items in Your Sweet Box
                  </h2>
                </div>
                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </span>
              </div>

              <Items order={order} />
            </div>

            {/* Delivery Information Card */}
            <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-petha-amber" />
                <h2 className="font-cormorant text-2xl font-bold text-slate-900">
                  Delivery Details
                </h2>
              </div>

              <ShippingDetails order={order} />
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary, Payment Status & Guarantees (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Order Summary & Totals */}
            <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Clock className="w-4 h-4 text-petha-amber" />
                <h2 className="font-cormorant text-2xl font-bold text-slate-900">
                  Order Summary
                </h2>
              </div>

              <CartTotals totals={order} />
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <h2 className="font-cormorant text-2xl font-bold text-slate-900">
                  Payment Status
                </h2>
              </div>

              <PaymentDetails order={order} />
            </div>

            {/* Trust & Quality Guarantee Card */}
            <div className="bg-white rounded-3xl border border-amber-200/70 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 pb-2 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-petha-amber" />
                <span>Taj Petha Quality &amp; Safety Promise</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌱</span>
                  <span>100% Pure Vegetarian Artisanal Confectionery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">🛡️</span>
                  <span>FSSAI Registered: Reg. No. 22725113001738</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">📦</span>
                  <span>Vacuum-Sealed for 30-Day Sealed Freshness</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">🚚</span>
                  <span>100% Transit Insured Delivery via Air Express</span>
                </div>
              </div>
            </div>

            {/* Support Desk Box */}
            <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 text-center space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Need Help with Your Order?
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Agra customer concierge is available daily, 9:00 AM – 9:00 PM IST on WhatsApp.
              </p>
              <a
                href={`https://wa.me/919259418994?text=${encodeURIComponent(
                  `Hello Taj Petha, I have a question regarding Order #${orderId}:`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all w-full cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 92594 18994)</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
