import { Metadata } from "next"
import { Home, Package, User, Mail, ArrowLeft } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "404 - Page Not Found | Taj Petha",
  description: "The page you're looking for doesn't exist. Explore our authentic Agra petha and namkeen collection.",
}

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Header */}
        <div className="space-y-4">
          <h1 className="font-serif text-8xl sm:text-9xl font-bold text-[#1A1A1A]">
            404
          </h1>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#C9A962]">
              Page Not Found
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto">
              The page you're looking for doesn't exist. Perhaps it was moved or the URL was mistyped.
            </p>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-[#C9A962]"></div>
          <div className="w-2 h-2 rounded-full bg-[#C9A962]"></div>
          <div className="h-px w-12 bg-[#C9A962]"></div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <NavigationCard
            href="/"
            icon={<Home size={22} />}
            title="Home"
            description="Back to homepage"
          />
          <NavigationCard
            href="/products"
            icon={<Package size={22} />}
            title="Shop"
            description="Browse products"
          />
          <NavigationCard
            href="/account"
            icon={<User size={22} />}
            title="Account"
            description="Your profile"
          />
          <NavigationCard
            href="/contact"
            icon={<Mail size={22} />}
            title="Contact"
            description="Get in touch"
          />
        </div>

        {/* Main Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <LocalizedClientLink
            href="/"
            className="group flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            Go Home
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/products"
            className="text-[#C9A962] hover:text-[#B8983D] font-medium underline underline-offset-4"
          >
            Browse Our Collection
          </LocalizedClientLink>
        </div>

        {/* Trust message */}
        <p className="text-gray-500 text-sm mt-8">
          Still can't find what you're looking for?{" "}
          <LocalizedClientLink href="/contact" className="text-[#C9A962] hover:underline">
            Contact us
          </LocalizedClientLink>
        </p>
      </div>
    </div>
  )
}

// Navigation Card Component
interface NavigationCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}

function NavigationCard({ href, icon, title, description }: NavigationCardProps) {
  return (
    <LocalizedClientLink
      href={href}
      className="group bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-[#C9A962] hover:bg-white transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="text-[#C9A962] transition-colors duration-200">
          {icon}
        </div>
        <h3 className="font-medium text-[#1A1A1A] group-hover:text-[#C9A962] transition-colors duration-200 text-sm">
          {title}
        </h3>
        <p className="text-xs text-gray-500">
          {description}
        </p>
      </div>
    </LocalizedClientLink>
  )
}
