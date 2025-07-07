import { deleteLineItem } from "@lib/data/cart"
import { announceCart } from "@lib/cart/events"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

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
    // Optimistically announce removal so UI updates instantly
    if (typeof window !== "undefined") {
      announceCart({
        // @ts-ignore extend event
        removeItemId: id,
      } as any)
    }

    setIsDeleting(true)
    await deleteLineItem(id).catch(() => {
      // If backend fails, we should probably refetch cart to correct state
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"))
      }
    })
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
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
