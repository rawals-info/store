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
  tajMahal: {
    displayName: "Marble Taj Mahal",
    handle: "taj-mahal", // Correct backend handle
    imageSrc: "/Marble taj mahal.png"
  },
  ringBox: {
    displayName: "Marble Ring Box",
    handle: "ring-box",
    imageSrc: "/Marble ring box.jpg"
  },
  jewelleryBox: {
    displayName: "Marble Jewelry Box",
    handle: "jewelry-box",
    imageSrc: "/marble jewellery box.jpg"
  },
  animalSculpture: {
    displayName: "Marble Animal Sculpture",
    handle: "animal-sculpture",
    imageSrc: "/Marble animal sculpture.png"
  },
  godSculpture: {
    displayName: "Marble God Sculpture",
    handle: "god-sculpture",
    imageSrc: "/Marble god sculpture.png"
  },
  pictureFrame: {
    displayName: "Agate Picture Frame",
    handle: "picture-frame",
    imageSrc: "/agate picture frame.webp"
  },
  flowerVase: {
    displayName: "Marble Flower Vase",
    handle: "flower-vase",
    imageSrc: "/Marble flower vase.png"
  },
  coaster: {
    displayName: "Marble Coaster",
    handle: "coaster-set",
    imageSrc: "/Marble Coaster.jpg"
  },
  table: {
    displayName: "Marble Table",
    handle: "marble-table-top",
    imageSrc: "/Marble table.png"
  },
  chessBoard: {
    displayName: "Marble Chess Board",
    handle: "marble-chess-board",
    imageSrc: "/Marble chess board.png"
  },
  inlayPlate: {
    displayName: "Marble Inlay Plate",
    handle: "marble-inlay-plate",
    imageSrc: "/Marble inlay plate.png"
  },
  gemstoneTable: {
    displayName: "Gemstone Table",
    handle: "gemstone-table-top-top",
    imageSrc: "/Gemstone table.png"
  },
  epoxyTable: {
    displayName: "Epoxy Table",
    handle: "epoxy-table",
    imageSrc: "/Epoxy table.png"
  }
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
    "marble-taj-mahal": "tajMahal"
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