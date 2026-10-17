import { HttpTypes } from "@medusajs/types"
import { MapPin, Phone, Mail, Truck } from "lucide-react"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  const addr = order.shipping_address
  const shippingMethod = (order as any).shipping_methods?.[0]?.name || "Express Air Delivery"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-jakarta">
      {/* Shipping Address */}
      <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-petha-amber" />
          <span>Delivery Address</span>
        </div>
        <div className="text-slate-700 leading-relaxed space-y-0.5">
          <p className="font-bold text-slate-900 text-sm">
            {addr?.first_name} {addr?.last_name}
          </p>
          <p>{addr?.address_1}</p>
          {addr?.address_2 && <p>{addr?.address_2}</p>}
          <p>
            {addr?.city}, {addr?.province || ""} {addr?.postal_code}
          </p>
          <p className="font-medium text-slate-600">
            {addr?.country_code?.toUpperCase() === "IN" ? "India" : addr?.country_code?.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Contact & Courier Method */}
      <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            <Phone className="w-3.5 h-3.5 text-petha-amber" />
            <span>Contact Information</span>
          </div>
          <div className="text-slate-700 space-y-1">
            <p className="font-mono text-xs font-semibold text-slate-900">{addr?.phone || "Phone not provided"}</p>
            <p className="text-slate-600 break-all">{order.email}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-amber-200/60">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Shipping Speed</span>
          </div>
          <p className="text-xs text-slate-700 font-medium mt-0.5">{shippingMethod}</p>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
