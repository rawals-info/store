import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

const getStorefrontUrls = (): string[] => {
  const envUrls = process.env.STOREFRONT_URL || "http://localhost:8000"
  return envUrls
    .split(",")
    .map((u) => u.trim().replace(/\/$/, ""))
    .filter(Boolean)
}

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "supersecret"
const MAX_RETRIES = 3

async function fireRevalidation(tags: string[], attempt = 1): Promise<void> {
  const storefrontUrls = getStorefrontUrls()
  if (!storefrontUrls.length) {
    console.warn("[Revalidate] No STOREFRONT_URL configured — skipping webhook")
    return
  }

  for (const baseUrl of storefrontUrls) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const res = await fetch(`${baseUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: REVALIDATE_SECRET,
          tags,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`)
      }

      console.log(`[Revalidate] ✅ Successfully cleared tags [${tags.join(", ")}] on ${baseUrl}`)
    } catch (err: any) {
      console.warn(`[Revalidate] ⚠️ Attempt ${attempt}/${MAX_RETRIES} failed for ${baseUrl}: ${err?.message}`)
      if (attempt < MAX_RETRIES) {
        const backoffMs = 1000 * Math.pow(2, attempt - 1) // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, backoffMs))
        return fireRevalidation(tags, attempt + 1)
      }
      console.error(`[Revalidate] ❌ All ${MAX_RETRIES} attempts failed for ${baseUrl}. Stale pages will auto-heal via ISR fallback timer.`)
    }
  }
}

export default async function revalidateFrontendHandler({
  event,
}: SubscriberArgs<any>) {
  const eventName = event?.name || ""
  console.log(`[Revalidate] Received Medusa event: ${eventName}`)

  const tags: string[] = ["products"]

  if (eventName.includes("shipping")) {
    tags.push("shipping")
  }

  const data = event?.data as any
  if (data?.handle && typeof data.handle === "string") {
    tags.push(`product-handle-${data.handle}`)
  }

  await fireRevalidation(tags)
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product-variant.created",
    "product-variant.updated",
    "product-variant.deleted",
    "price.created",
    "price.updated",
    "price.deleted",
    "shipping-option.created",
    "shipping-option.updated",
    "shipping-option.deleted",
    "product-category.created",
    "product-category.updated",
    "product-category.deleted",
    "product-collection.created",
    "product-collection.updated",
    "product-collection.deleted",
  ],
  context: { subscriberId: "revalidate-frontend" },
}
