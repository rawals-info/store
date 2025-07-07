import { Metadata } from "next"
import { listOrders } from "@lib/data/orders"
import OrderOverview from "@modules/account/components/order-overview"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Orders",
  description: "View your orders",
}

export default async function Orders() {
  const orders = await listOrders().catch(() => null)

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-[var(--color-luxury-charcoal)] mb-2">
          Orders
        </h1>
        <div className="h-0.5 w-16 gold-gradient"></div>
        <p className="mt-4 text-[var(--color-luxury-charcoal)]/70">
          View your previous orders and their status. You can also create returns or exchanges for your orders if needed.
        </p>
      </div>
      
      <div className="mt-8">
        {orders && <OrderOverview orders={orders} />}
      </div>
      
      <div className="mt-12 mb-12">
        <TransferRequestForm />
      </div>
    </div>
  )
} 