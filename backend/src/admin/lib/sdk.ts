import Medusa from "@medusajs/js-sdk"

const resolveBaseUrl = () => {
  if (typeof window === "undefined") {
    // Server side – use process env or default
    return (typeof process !== "undefined" && (process.env.MEDUSA_BACKEND_URL || process.env.VITE_MEDUSA_BACKEND_URL)) || "http://localhost:9000"
  }

  // Client side (browser) – use current origin (works seamlessly on localhost and production)
  return window.location.origin
}

export const sdk = new Medusa({
  baseUrl: resolveBaseUrl(),
  debug: typeof process !== "undefined" ? process.env.NODE_ENV === "development" : false,
  auth: {
    type: "session",
  },
})