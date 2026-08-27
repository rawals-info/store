"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "in"

  useEffect(() => {
    console.error("[Route Error Caught]:", error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF8F5] px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-amber-200/90 shadow-2xl p-8 sm:p-10 text-center relative overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-petha-amber/10 rounded-full blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-25" />
          <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-sm flex items-center justify-center text-3xl">
            🍬
          </div>
        </div>

        {/* Headings */}
        <span className="font-jakarta text-xs uppercase tracking-[0.2em] font-bold text-petha-amber inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 mb-3">
          Fresh Batch Assurance
        </span>
        <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-3">
          Something Paused in Our Kitchen
        </h2>

        <p className="font-jakarta text-sm text-slate-600 mb-6 leading-relaxed max-w-sm mx-auto">
          We encountered a brief hiccup loading this page. Your sweet cart is completely safe and sound.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer text-center"
          >
            🔄 Refresh &amp; Try Again
          </button>

          <Link
            href={`/${countryCode}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-slate-800 border border-amber-200 font-jakarta text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
          >
            ← Back to Sweet Store
          </Link>
        </div>
      </div>
    </div>
  )
}
