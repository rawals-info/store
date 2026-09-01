"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Share2, Check, ArrowUp, ShoppingBag, Truck, ShieldCheck, Sparkles, BookOpen, Clock, ChevronRight } from "lucide-react"
import { BlogProductLink } from "@lib/blog/types"

interface BlogPostClientProps {
  countryCode: string
  title: string
  url: string
  headings: { id: string; text: string; level: number }[]
  primaryProduct?: BlogProductLink
}

export default function BlogPostClient({
  countryCode,
  title,
  url,
  headings,
  primaryProduct,
}: BlogPostClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeHeading, setActiveHeading] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)))
      }

      // Check active heading
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[]

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i]
        const rect = el.getBoundingClientRect()
        if (rect.top <= 140) {
          setActiveHeading(el.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const shareOnWhatsApp = () => {
    const shareText = encodeURIComponent(`Read "${title}" on Taj Petha: ${url}`)
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank")
  }

  return (
    <>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Desktop Sidebar Content */}
      <div className="hidden lg:block space-y-6 sticky top-24">
        {/* Quick Buy Card */}
        {primaryProduct && (
          <div className="p-5 rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-50 to-white border border-amber-300/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-2xs">
                {primaryProduct.badge || "Featured Treat"}
              </span>
              <span className="text-[11px] font-bold text-amber-900">Direct From Agra</span>
            </div>

            <div className="flex items-center gap-3">
              {primaryProduct.thumbnail ? (
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-amber-100 flex-shrink-0 border border-amber-200 shadow-2xs">
                  <Image
                    src={primaryProduct.thumbnail}
                    alt={primaryProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-3xl flex-shrink-0">{primaryProduct.emoji || "🍬"}</span>
              )}

              <div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {primaryProduct.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-1">
                  {primaryProduct.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Live Price</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {primaryProduct.price}
                </span>
              </div>
              <Link
                href={`/${countryCode}/products/${primaryProduct.handle}`}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 group"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Order Fresh</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* Table of Contents Widget */}
        {headings.length > 0 && (
          <div className="p-5 rounded-3xl bg-white border border-amber-200/60 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>In This Guide</span>
            </div>

            <nav className="space-y-1.5 text-xs">
              {headings.map((h) => {
                const isActive = activeHeading === h.id
                return (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`block py-1.5 px-3 rounded-lg transition-all leading-snug ${
                      isActive
                        ? "bg-amber-100/80 text-amber-950 font-bold border-l-2 border-amber-600 pl-2.5"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {h.text}
                  </a>
                )
              })}
            </nav>
          </div>
        )}

        {/* Agra Authenticity & Dispatch Signals */}
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
          <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Taj Petha Guarantee
          </h5>
          <div className="space-y-2.5 text-slate-600">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>100% Pure Ash Gourd & Natural Ingredients</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Dispatched within 24–48h from Agra</span>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Food-grade vacuum freshness seal</span>
            </div>
          </div>
        </div>

        {/* Social Share Strip in Sidebar */}
        <div className="p-4 rounded-2xl bg-white border border-amber-200/60 shadow-xs flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Share Story:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={shareOnWhatsApp}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 font-bold transition-all flex items-center gap-1.5"
            >
              <span>WhatsApp</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 font-bold transition-all flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
