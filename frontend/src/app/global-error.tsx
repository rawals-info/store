'use client'

import Link from "next/link"
import { Home, Package, User, Mail, ArrowLeft, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en-IN" data-mode="light">
      <head>
        <title>Something went wrong - Taj Petha</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-background text-foreground">
        <div className="min-h-screen bg-gradient-to-br from-black via-luxury-charcoal-dark/20 to-black flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Large Error Display */}
            <div className="relative">
              <h1 className="font-display text-8xl sm:text-9xl md:text-[12rem] font-bold text-luxury-gold/20 select-none">
                500
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/80 backdrop-blur-sm rounded-2xl px-8 py-6 border border-luxury-gold/20">
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-luxury-gold mb-2">
                    Something Went Wrong
                  </h2>
                  <p className="text-luxury-ivory/80 text-base sm:text-lg max-w-md">
                    Our sweet shop encountered an unexpected error. Don't worry, we're working to fix it!
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              <NavigationCard
                href="/"
                icon={<Home size={24} />}
                title="Home"
                description="Back to homepage"
              />
              <NavigationCard
                href="/in/products"
                icon={<Package size={24} />}
                title="Shop Petha"
                description="Browse our sweets"
              />
              <NavigationCard
                href="/account"
                icon={<User size={24} />}
                title="Account"
                description="Your profile"
              />
              <NavigationCard
                href="/contact"
                icon={<Mail size={24} />}
                title="Contact"
                description="Get in touch"
              />
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link
                href="/"
                className="group flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-600 text-black font-medium px-6 py-3 rounded-soft transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-luxury-gold/20"
              >
                <ArrowLeft 
                  size={18} 
                  className="transition-transform group-hover:-translate-x-1" 
                />
                Go Home
              </Link>
              
              <button
                onClick={reset}
                className="group flex items-center gap-2 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black font-medium px-6 py-3 rounded-soft transition-all duration-200"
              >
                <RefreshCw 
                  size={18} 
                  className="transition-transform group-hover:rotate-180" 
                />
                Try Again
              </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-luxury-gold/30 rounded-full animate-pulse" 
                   style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-luxury-saffron/40 rounded-full animate-pulse" 
                   style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-luxury-gold/20 rounded-full animate-pulse" 
                   style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-luxury-gold/25 rounded-full animate-pulse" 
                   style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>
        </div>
      </body>
    </html>
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
    <Link
      href={href}
      className="group bg-black/40 backdrop-blur-sm border border-luxury-charcoal/30 rounded-base p-6 hover:border-luxury-gold/40 hover:bg-black/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-luxury-gold/10"
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="text-luxury-gold group-hover:text-luxury-gold-400 transition-colors duration-200">
          {icon}
        </div>
        <h3 className="font-medium text-luxury-ivory group-hover:text-luxury-gold transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-luxury-ivory/60 group-hover:text-luxury-ivory/80 transition-colors duration-200">
          {description}
        </p>
      </div>
    </Link>
  )
} 