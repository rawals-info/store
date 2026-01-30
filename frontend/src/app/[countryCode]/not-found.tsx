import { Metadata } from "next"
import { Home, Package, ArrowLeft } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "404 - Page Not Found | Taj Petha",
  description: "The page you're looking for doesn't exist.",
}

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md mx-auto text-center space-y-6">
        <h1 className="font-serif text-7xl font-bold text-[#1A1A1A]">404</h1>
        <div className="space-y-2">
          <h2 className="font-serif text-xl text-[#C9A962]">Page Not Found</h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[#C9A962]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A962]"></div>
          <div className="h-px w-8 bg-[#C9A962]"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <LocalizedClientLink
            href="/"
            className="group flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-medium px-5 py-2.5 rounded-lg transition-all"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Go Home
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/products"
            className="text-[#C9A962] hover:text-[#B8983D] font-medium underline underline-offset-4"
          >
            Browse Products
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}