import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
} else if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

// Use the publishable key from the environment. Throw an error if it's not set.
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

if (!PUBLISHABLE_API_KEY) {
  throw new Error(
    "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set in your environment. " +
    "Please set it in .env.local"
  )
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: false,
  publishableKey: PUBLISHABLE_API_KEY,
})

/**
 * Configuration for data fetching in the application
 */

export const dataFetchingConfig = {
  // Set cache behavior for region data
  regions: {
    // Use ISR with revalidation time of 60 seconds
    revalidate: 60,
  },
  
  // Set cache behavior for product data
  products: {
    // Use ISR with revalidation time of 60 seconds
    revalidate: 60,
  },
  
  // Set cache behavior for category data
  categories: {
    // Use ISR with revalidation time of 60 seconds
    revalidate: 60,
  },
  
  // Set cache behavior for collection data
  collections: {
    // Use ISR with revalidation time of 60 seconds
    revalidate: 60,
  },
  
  // Set cache behavior for cart data
  cart: {
    // Smart cache with short TTL for better performance
    // Cart mutations will trigger targeted revalidation via scheduleRevalidate
    revalidate: 30, // 30 seconds cache, invalidated on mutations
  },
}

/**
 * Configuration for dynamic routes
 */
export const routeConfig = {
  // Define which routes should be static vs. dynamic
  isDynamic: {
    // Cart pages are always dynamic
    cart: true,
    // Account pages are always dynamic
    account: true,
    // Product pages can be static with ISR
    products: false,
    // Category pages can be static with ISR
    categories: false,
  }
}
