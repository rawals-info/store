"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

type PackingSweetBoxOverlayProps = {
  show?: boolean
  subtitle?: string
}

export default function PackingSweetBoxOverlay({
  show = false,
  subtitle = "Securing fresh batch guarantee ✨",
}: PackingSweetBoxOverlayProps) {
  const [mounted, setMounted] = useState(false)
  const [globalShow, setGlobalShow] = useState(false)
  const [customSubtitle, setCustomSubtitle] = useState(subtitle)

  useEffect(() => {
    setMounted(true)

    // Listen to global packing events
    const handlePackingEvent = (e: CustomEvent<{ show: boolean; subtitle?: string }>) => {
      if (typeof e.detail?.show === "boolean") {
        setGlobalShow(e.detail.show)
        if (e.detail.subtitle) {
          setCustomSubtitle(e.detail.subtitle)
        }
      }
    }

    window.addEventListener("packingSweetBox" as any, handlePackingEvent)
    return () => {
      window.removeEventListener("packingSweetBox" as any, handlePackingEvent)
    }
  }, [])

  if (!mounted) return null

  const isVisible = show || globalShow

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-[999999] flex items-center justify-center p-4 pointer-events-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="bg-[#FFFDF9] rounded-2xl border border-amber-200/90 shadow-2xl px-5 py-4 flex items-center gap-3.5 max-w-xs w-auto text-left"
          >
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full border-2 border-amber-200 border-t-petha-amber animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-sm">
                🍬
              </span>
            </div>

            <div className="min-w-0">
              <h4 className="font-jakarta text-xs font-bold text-slate-900 leading-tight">
                Packing Sweet Box...
              </h4>
              <p className="font-jakarta text-[10px] text-slate-500 truncate mt-0.5">
                {customSubtitle}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

/**
 * Universal helper function to show/hide the Packing Sweet Box overlay anywhere in the app
 */
export function triggerPackingSweetBox(show: boolean, subtitle?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("packingSweetBox", {
        detail: { show, subtitle },
      })
    )
  }
}
