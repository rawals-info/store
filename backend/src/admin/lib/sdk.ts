import Medusa from "@medusajs/js-sdk"

const resolveBaseUrl = () => {
  if (typeof window === "undefined") {
    // Server side – use process env or default
    return process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  }

  // Client side – prefer compiled Vite env, otherwise fall back to current origin
  const viteUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL
  if (viteUrl && viteUrl.length > 0) {
    return viteUrl
  }

  // Fallback: use the host that served the admin app (avoids localhost in prod)
  return window.location.origin
}

export const sdk = new Medusa({
  baseUrl: resolveBaseUrl(),
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
}) 