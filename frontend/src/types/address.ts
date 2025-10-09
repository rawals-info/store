/**
 * ✅ Type-safe address interfaces
 */

import { HttpTypes } from "@medusajs/types"

export interface AddressData {
  first_name: string | null
  last_name: string | null
  address_1: string | null
  company?: string | null
  postal_code: string | null
  city: string | null
  country_code: string | null
  province: string | null
  phone: string | null
}

export type StoreAddress = HttpTypes.StoreCartAddress | HttpTypes.StoreCustomerAddress

export interface AddressFormData {
  "shipping_address.first_name"?: string
  "shipping_address.last_name"?: string
  "shipping_address.address_1"?: string
  "shipping_address.company"?: string
  "shipping_address.postal_code"?: string
  "shipping_address.city"?: string
  "shipping_address.country_code"?: string
  "shipping_address.province"?: string
  "shipping_address.phone"?: string
  email?: string
}

export interface PlaceDetails {
  address_1: string
  city: string
  province: string
  postal_code: string
  country_code: string
}

