import { HttpTypes } from "@medusajs/types";

// Extend the StoreProductVariant type to include our custom in_cart property
export interface ExtendedStoreProductVariant extends HttpTypes.StoreProductVariant {
  in_cart?: boolean;
}

// Extend the StoreCartLineItem type to make the variant property use our extended type
export interface ExtendedStoreCartLineItem extends HttpTypes.StoreCartLineItem {
  variant?: ExtendedStoreProductVariant;
} 