import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState, useRef } from "react"
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
  const deleteInProgress = useRef(false) // Extra guard against double-clicks

  const handleDelete = async () => {
    // ✅ FIX: Prevent multiple clicks with both state and ref
    if (isDeleting || deleteInProgress.current) {
      console.log("[DeleteButton] Delete already in progress, ignoring click")
      return
    }
    
    deleteInProgress.current = true
    setIsDeleting(true)
    setError(null)
    
    console.log(`[DeleteButton] Starting delete for item ${id}`)
    
    try {
      // ✅ Call the fixed deleteLineItem function
      await deleteLineItem(id)
      
      console.log(`[DeleteButton] Successfully deleted item ${id}`)
      
      // ✅ Notify all listeners to refresh cart state
      if (typeof window !== "undefined") {
        announceCart({
          // @ts-ignore
          removeItemId: id,
        } as any)
        
        // Also trigger cartUpdated event for other components
        window.dispatchEvent(new Event("cartUpdated"))
      }
    } catch (err) {
      // ✅ Show detailed error to user
      console.error(`[DeleteButton] Failed to remove item ${id}:`, err)
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to remove item. Please try again."
      
      setError(errorMessage)
      
      // Trigger a refresh to reconcile cart state even on error
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"))
      }
      
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      // ✅ Always reset loading state
      setIsDeleting(false)
      deleteInProgress.current = false
      console.log(`[DeleteButton] Delete operation completed for item ${id}`)
    }
  }

  return (
    <div className={clx("flex flex-col gap-1", className)}>
      <button
        type="button"
        className={clx(
          "flex items-center gap-x-1 text-small-regular transition-colors",
          isDeleting
            ? "text-gray-400 cursor-not-allowed pointer-events-none"
            : "text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer active:text-ui-fg-disabled"
        )}
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={isDeleting ? "Removing item..." : "Remove item from cart"}
      >
        {isDeleting ? (
          <Spinner className="animate-spin w-4 h-4" />
        ) : (
          <Trash className="w-4 h-4" />
        )}
        <span className="select-none">
          {isDeleting ? "Removing..." : children}
        </span>
      </button>
      
      {/* ✅ Show error message with retry option */}
      {error && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-red-500 leading-tight">{error}</span>
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs text-ui-fg-interactive hover:underline text-left"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}

export default DeleteButton
