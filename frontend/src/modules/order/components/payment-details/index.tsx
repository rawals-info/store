import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { CreditCard, CheckCircle2, ShieldCheck, Banknote } from "lucide-react"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const isCOD = payment?.provider_id?.startsWith("pp_system_default")
  const isCaptured = (order as any).payment_status === "captured" || (payment as any)?.status === "captured"
  const amount = payment?.amount ?? order.total ?? 0

  return (
    <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 text-xs font-jakarta space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
          {isCOD ? <Banknote className="w-4 h-4 text-amber-700" /> : <CreditCard className="w-4 h-4 text-emerald-700" />}
          <span>{isCOD ? "Cash on Delivery" : "Online Payment (UPI / Cards)"}</span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isCOD
              ? "bg-amber-100 text-amber-900 border border-amber-300"
              : isCaptured
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
              : "bg-emerald-100 text-emerald-900 border border-emerald-300"
          }`}
        >
          {isCOD ? "To Be Paid On Delivery" : "Payment Approved"}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
        <span className="text-slate-600 font-medium">Transaction Amount:</span>
        <span className="font-mono text-base font-bold text-slate-900">
          {convertToLocale({ amount, currency_code: order.currency_code })}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Encrypted 256-Bit SSL Payment Processing</span>
      </div>
    </div>
  )
}

export default PaymentDetails
