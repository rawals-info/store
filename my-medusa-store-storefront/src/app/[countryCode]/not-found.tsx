import Link from "next/link"
import { getDefaultCountry } from "@lib/util/get-default-country"

export default async function NotFound() {
  // Get the default country code from the backend
  const defaultCountryCode = await getDefaultCountry()
  
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="font-display text-4xl text-luxury-charcoal mb-4">Country not available</h1>
      <p className="text-luxury-charcoal/80 mb-8 text-center max-w-md">
        Sorry, this country store is not available yet. Please visit our main store.
      </p>
      <Link 
        href={`/${defaultCountryCode}`}
        className="px-6 py-3 text-sm font-serif bg-luxury-gold text-white rounded-sm hover:bg-luxury-gold/90 transition-colors"
      >
        Go to main store
      </Link>
    </div>
  )
} 