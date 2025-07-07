import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"
import { announceCart } from "@lib/cart/events"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteLineItem(id)
      // Notify all listeners to refresh cart state
      if (typeof window !== "undefined") {
        announceCart({
          // @ts-ignore
          removeItemId: id,
        } as any)
      }
    } catch {
      // On error, also trigger a refresh to reconcile
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"))
      }
    }
    setIsDeleting(false)
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className={clx(
          "flex gap-x-1 cursor-pointer",
          isDeleting
            ? "text-gray-400 cursor-not-allowed"
            : "text-ui-fg-subtle hover:text-ui-fg-base"
        )}
        onClick={() => !isDeleting && handleDelete(id)}
        disabled={isDeleting}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{isDeleting ? "Removing..." : children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
