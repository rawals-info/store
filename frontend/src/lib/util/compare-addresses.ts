// ✅ Using consolidated utility functions to avoid duplication
// ✅ Type-safe implementation with proper TypeScript types
import { isEqual, pick } from "@lib/utils/object-utils"
import type { AddressData } from "types/address"

export default function compareAddresses(
  address1: Partial<AddressData> | null | undefined, 
  address2: Partial<AddressData> | null | undefined
): boolean {
  if (!address1 || !address2) return false
  
  const addressKeys: (keyof AddressData)[] = [
    "first_name",
    "last_name",
    "address_1",
    "company",
    "postal_code",
    "city",
    "country_code",
    "province",
    "phone",
  ]
  
  return isEqual(
    pick(address1, addressKeys),
    pick(address2, addressKeys)
  )
}
