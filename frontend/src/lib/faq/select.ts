import type { HttpTypes } from "@medusajs/types"
import { CATEGORY_FAQS, QA } from "./data"

/**
 * Returns FAQs for a product using category handle or collection handle.
 * - Checks all category handles (lowercased) in order
 * - Falls back to collection handle
 * - Finally falls back to default FAQs
 */
export function getProductFaqs(product: HttpTypes.StoreProduct): QA[] {
  const handles: string[] = []

  // Category handles
  if (Array.isArray(product.categories)) {
    for (const c of product.categories) {
      if (c?.handle) handles.push(c.handle.toLowerCase())
    }
  }

  // Collection handle as secondary signal
  if (product.collection?.handle) {
    handles.push(product.collection.handle.toLowerCase())
  }

  for (const h of handles) {
    if (CATEGORY_FAQS[h]) return CATEGORY_FAQS[h]
  }

  return CATEGORY_FAQS.default
} 