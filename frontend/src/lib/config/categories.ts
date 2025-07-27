/**
 * Categories configuration
 * Contains mapping of display names to actual backend handles
 */

export type CategoryConfig = {
  displayName: string
  handle: string
  imageSrc?: string
}

/**
 * Category configurations
 * Use this to manage category data across the application
 */
export const CATEGORIES: Record<string, CategoryConfig> = {
  petha: {
    displayName: "Petha",
    handle: "petha",
    imageSrc: "/categories/petha.png",
  },
  namkeen: {
    displayName: "Namkeen",
    handle: "namkeen",
    imageSrc: "/categories/namkeen.png",
  },
  dalmoth: {
    displayName: "Dalmoth",
    handle: "dalmoth",
    imageSrc: "/categories/dalmoth.png",
  },
  combo: {
    displayName: "Combo (Petha + Dalmoth)",
    handle: "combo1",
    imageSrc: "/categories/combo.png",
  },
}

/**
 * Get a category by a legacy handle
 * This is useful for redirecting from old URLs
 * @param legacyHandle The old handle that might be used in links
 * @returns The correct category configuration or undefined
 */
export function getCategoryByLegacyHandle(legacyHandle: string): CategoryConfig | undefined {
  // Common legacy handle mappings
  const legacyHandleMap: Record<string, string> = {
    "petha-taj-mahal": "tajMahal"
    // Add other legacy mappings as needed
  }
  
  const categoryKey = legacyHandleMap[legacyHandle]
  return categoryKey ? CATEGORIES[categoryKey] : undefined
}

/**
 * Get a category configuration by its correct handle
 * @param handle The correct backend handle
 * @returns The category configuration or undefined
 */
export function getCategoryByHandle(handle: string): CategoryConfig | undefined {
  return Object.values(CATEGORIES).find(category => category.handle === handle)
} 