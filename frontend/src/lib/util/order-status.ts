export type OrderStatusBadge = {
  label: string
  className: string
}

export function getOrderStatusBadge(order: {
  status?: string | null
  fulfillment_status?: string | null
}): OrderStatusBadge {
  const status = (order.status || "").toLowerCase()
  const fStatus = (order.fulfillment_status || "").toLowerCase()

  if (status === "canceled") {
    return {
      label: "Canceled",
      className: "bg-rose-100 text-rose-800 border border-rose-200",
    }
  }

  if (fStatus === "delivered" || fStatus === "partially_delivered") {
    return {
      label: "Delivered",
      className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    }
  }

  if (fStatus === "shipped" || fStatus === "partially_shipped") {
    return {
      label: "Dispatched",
      className: "bg-sky-100 text-sky-800 border border-sky-200",
    }
  }

  if (fStatus === "fulfilled") {
    return {
      label: "Packed & Sealed",
      className: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    }
  }

  if (fStatus === "not_fulfilled") {
    return {
      label: "Kitchen Prep",
      className: "bg-amber-100 text-amber-900 border border-amber-200",
    }
  }

  if (status === "completed") {
    return {
      label: "Completed",
      className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    }
  }

  return {
    label: "Confirmed",
    className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  }
}
