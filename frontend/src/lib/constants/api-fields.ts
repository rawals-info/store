/**
 * Optimized API field constants to reduce over-fetching
 * Each constant is tailored for specific use cases
 */

// Product fields for different contexts
export const PRODUCT_FIELDS = {
  // Minimal fields for product listings (cards, grids)
  LIST: "id,title,handle,thumbnail,status,*variants.prices",
  
  // Essential fields for product detail pages
  // Include *images to fetch all related images
  DETAIL: "id,title,handle,description,thumbnail,*images,status,weight,length,height,width,*variants,*variants.prices,*variants.options,*options,*options.values,collection_id,*categories,tags,metadata",
  
  // Fields for search results
  SEARCH: "id,title,handle,thumbnail,status,*variants.prices",
  
  // Fields for cart items (minimal for performance)
  CART_ITEM: "id,title,handle,thumbnail,*variants.prices",
  
  // Fields for related products
  RELATED: "id,title,handle,thumbnail,status,*variants.prices",
} as const

// Cart fields for different contexts
export const CART_FIELDS = {
  // Minimal fields for cart count/badge
  COUNT: "id,items.quantity",
  
  // Essential fields for cart dropdown
  DROPDOWN: "id,*items.product.title,*items.product.handle,*items.product.thumbnail,*items.variant.title,*items.quantity,*items.unit_price,+subtotal,+total",
  
  // Full fields for cart page and checkout
  FULL: "*items,*region,*items.product.title,*items.product.handle,*items.product.thumbnail,*items.variant.title,*items.variant.prices,*items.metadata,+items.total,*promotions,+shipping_methods.name,+subtotal,+total,+discount_total,+shipping_subtotal,+shipping_total,+tax_total,+gift_card_total",
  
  // Fields for order completion
  COMPLETE: "id,email,*items,*region,*shipping_address,*billing_address,+subtotal,+total,+discount_total,+shipping_total,+tax_total",
} as const

// Collection fields
export const COLLECTION_FIELDS = {
  // Basic collection info
  LIST: "id,title,handle",
  
  // Collection with products for detail page
  DETAIL: "id,title,handle,*products.id,*products.title,*products.handle,*products.thumbnail,*products.status,*products.variants.prices",
} as const

// Category fields
export const CATEGORY_FIELDS = {
  // Basic category listing
  LIST: "id,name,handle,description,*category_children.id,*category_children.name,*category_children.handle",
  
  // Category with parent info
  DETAIL: "id,name,handle,description,*category_children,*parent_category",
} as const

// Region fields (though we use hardcoded regions now)
export const REGION_FIELDS = {
  BASIC: "id,name,currency_code,*countries.iso_2,*countries.display_name",
} as const

// Order fields
export const ORDER_FIELDS = {
  // Order listing
  LIST: "id,status,created_at,currency_code,+total,+item_total",
  
  // Order detail
  DETAIL: "id,status,created_at,currency_code,*items,*shipping_address,*billing_address,+total,+subtotal,+shipping_total,+tax_total,+discount_total",
} as const 