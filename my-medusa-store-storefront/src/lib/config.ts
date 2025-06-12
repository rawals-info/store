import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

// Use the publishable key from the environment or fallback to a hardcoded one
// This key was found in the terminal logs
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 
  "pk_b3673015769dc80c7f8c6d3bf797d09541dbc2459b8044afdd33937af1731b99"

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
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
    // Cart data should always be fetched fresh
    revalidate: 0,
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
