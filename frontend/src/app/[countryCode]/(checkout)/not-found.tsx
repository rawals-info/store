import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Empty Cart | Taj Petha",
  description: "Your shopping cart is empty",
}

export default async function NotFound() {
  return (
    <div className="bg-[#f9f6f2] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 flex flex-col justify-center items-center bg-luxury-ivory border border-luxury-lightgold/30 shadow-luxury-sm">
          {/* Gold line at top */}
          <div className="h-0.5 w-full gold-gradient absolute top-0"></div>
          
          <div className="w-20 h-20 flex items-center justify-center rounded-full border border-luxury-lightgold mb-6">
            <svg className="w-10 h-10 text-luxury-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          
          <h1 className="font-display text-2xl text-luxury-charcoal mb-2">Your cart is empty</h1>
          
          <p className="text-luxury-charcoal/70 text-center max-w-md mb-8 px-6">
            Please add items to your cart before proceeding to checkout.
          </p>
          
          <LocalizedClientLink href="/products">
            <Button className="luxury-btn font-medium tracking-wider uppercase transition-all duration-300 bg-luxury-gold hover:bg-luxury-gold/90">
              Explore Collection
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
