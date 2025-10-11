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
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    // ✅ FIX: Prevent multiple clicks
    if (isDeleting) return
    
    setIsDeleting(true)
    setError(null)
    
    try {
      await deleteLineItem(id)
      // Notify all listeners to refresh cart state
      if (typeof window !== "undefined") {
        announceCart({
          // @ts-ignore
          removeItemId: id,
        } as any)
      }
    } catch (err) {
      // ✅ FIX: Show error to user instead of silently failing
      console.error("Failed to remove item from cart:", err)
      setError(err instanceof Error ? err.message : "Failed to remove item")
      
      // Trigger a refresh to reconcile cart state
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"))
      }
    } finally {
      // ✅ FIX: Always reset loading state, even on error
      setIsDeleting(false)
    }
  }

  return (
    <div className={clx("flex flex-col", className)}>
      <div className="flex items-center justify-between text-small-regular">
        <button
          type="button"
          className={clx(
            "flex gap-x-1",
            isDeleting
              ? "text-gray-400 cursor-not-allowed"
              : "text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
          )}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
          <span>{isDeleting ? "Removing..." : children}</span>
        </button>
      </div>
      {/* ✅ FIX: Show error message if delete fails */}
      {error && (
        <span className="text-xs text-red-500 mt-1">{error}</span>
      )}
    </div>
  )
}

export default DeleteButton
