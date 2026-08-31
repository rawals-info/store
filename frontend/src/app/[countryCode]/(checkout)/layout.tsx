"use client"

import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Lock } from "lucide-react"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-jakarta">
      {/* Trust Checkout Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden relative shadow-xs">
              <Image src="/logo.webp" alt="Taj Petha" fill className="object-cover" />
            </div>
            <span className="font-cormorant text-2xl font-bold tracking-wider text-slate-900 group-hover:text-petha-amber transition-colors">
              TAJ PETHA
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-jakarta font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1" data-testid="checkout-container">
        {children}
      </main>

      {/* Trust Footer */}
      <footer className="pt-6 pb-24 sm:pb-6 border-t border-slate-200/60 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Taj Petha Agra. Authentic Royal Confectioners.</span>
          <div className="flex items-center gap-4 text-slate-600">
            <span>🌱 100% Pure Vegetarian</span>
            <span>•</span>
            <span>🛡️ FSSAI Certified</span>
            <span>•</span>
            <span>📦 30-Day Freshness Guarantee</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
