'use server'

import { redirect } from "next/navigation"
import { getCartId } from "@lib/data/cookies"
import { updateCart } from "@lib/data/cart"

const getString = (val: FormDataEntryValue | null, fallback = ""): string => {
  return typeof val === "string" ? val.trim() : fallback
}

/**
 * Server Action: Updates the cart with shipping/billing addresses and redirects
 * the customer to the delivery-step.
 */
export async function setAddresses(_prevState: unknown, formData: FormData) {
  if (!formData) {
    throw new Error("No form data found when setting addresses")
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("No existing cart found when setting addresses")
  }

  const shippingFirstName = getString(formData.get("shipping_address.first_name"))
  const shippingLastName = getString(formData.get("shipping_address.last_name"))
  const shippingAddress1 = getString(formData.get("shipping_address.address_1"))
  const shippingAddress2 = getString(formData.get("shipping_address.address_2"))
  const shippingCompany = getString(formData.get("shipping_address.company"))
  const shippingPostalCode = getString(formData.get("shipping_address.postal_code"))
  const shippingCity = getString(formData.get("shipping_address.city"))
  const shippingCountryCode = getString(formData.get("shipping_address.country_code"), "in").toLowerCase()
  const shippingProvince = getString(formData.get("shipping_address.province"))
  const shippingPhone = getString(formData.get("shipping_address.phone"))

  const email = getString(formData.get("email"))

  const shipping_address = {
    first_name: shippingFirstName,
    last_name: shippingLastName,
    address_1: shippingAddress1,
    address_2: shippingAddress2,
    company: shippingCompany,
    postal_code: shippingPostalCode,
    city: shippingCity,
    country_code: shippingCountryCode,
    province: shippingProvince,
    phone: shippingPhone,
  }

  const sameAsBilling = formData.get("same_as_billing")
  const billing_address = (sameAsBilling === "on" || !formData.get("billing_address.address_1"))
    ? { ...shipping_address }
    : {
        first_name: getString(formData.get("billing_address.first_name"), shippingFirstName),
        last_name: getString(formData.get("billing_address.last_name"), shippingLastName),
        address_1: getString(formData.get("billing_address.address_1"), shippingAddress1),
        address_2: getString(formData.get("billing_address.address_2")),
        company: getString(formData.get("billing_address.company")),
        postal_code: getString(formData.get("billing_address.postal_code"), shippingPostalCode),
        city: getString(formData.get("billing_address.city"), shippingCity),
        country_code: getString(formData.get("billing_address.country_code"), shippingCountryCode).toLowerCase(),
        province: getString(formData.get("billing_address.province"), shippingProvince),
        phone: getString(formData.get("billing_address.phone"), shippingPhone),
      }

  await updateCart({
    shipping_address,
    billing_address,
    email: email || undefined,
  })

  // Redirect to unified checkout
  redirect(`/${shippingCountryCode}/checkout`)
}

/**
 * Server Action: Updates the cart with shipping/billing addresses without redirecting
 * for single-page checkout flow.
 */
export async function setAddressesSinglePage(formData: FormData) {
  if (!formData || !(formData instanceof FormData)) {
    throw new Error("No form data found when setting addresses")
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("No existing cart found when setting addresses")
  }

  const shippingFirstName = getString(formData.get("shipping_address.first_name"))
  const shippingLastName = getString(formData.get("shipping_address.last_name"))
  const shippingAddress1 = getString(formData.get("shipping_address.address_1"))
  const shippingAddress2 = getString(formData.get("shipping_address.address_2"))
  const shippingCompany = getString(formData.get("shipping_address.company"))
  const shippingPostalCode = getString(formData.get("shipping_address.postal_code"))
  const shippingCity = getString(formData.get("shipping_address.city"))
  const shippingCountryCode = getString(formData.get("shipping_address.country_code"), "in").toLowerCase()
  const shippingProvince = getString(formData.get("shipping_address.province"))
  const shippingPhone = getString(formData.get("shipping_address.phone"))

  const email = getString(formData.get("email"))

  const shipping_address = {
    first_name: shippingFirstName,
    last_name: shippingLastName,
    address_1: shippingAddress1,
    address_2: shippingAddress2,
    company: shippingCompany,
    postal_code: shippingPostalCode,
    city: shippingCity,
    country_code: shippingCountryCode,
    province: shippingProvince,
    phone: shippingPhone,
  }

  const sameAsBilling = formData.get("same_as_billing")
  const billing_address = (sameAsBilling === "on" || !formData.get("billing_address.address_1"))
    ? { ...shipping_address }
    : {
        first_name: getString(formData.get("billing_address.first_name"), shippingFirstName),
        last_name: getString(formData.get("billing_address.last_name"), shippingLastName),
        address_1: getString(formData.get("billing_address.address_1"), shippingAddress1),
        address_2: getString(formData.get("billing_address.address_2")),
        company: getString(formData.get("billing_address.company")),
        postal_code: getString(formData.get("billing_address.postal_code"), shippingPostalCode),
        city: getString(formData.get("billing_address.city"), shippingCity),
        country_code: getString(formData.get("billing_address.country_code"), shippingCountryCode).toLowerCase(),
        province: getString(formData.get("billing_address.province"), shippingProvince),
        phone: getString(formData.get("billing_address.phone"), shippingPhone),
      }

  await updateCart({
    shipping_address,
    billing_address,
    email: email || undefined,
  })

  // Return success response instead of redirecting
  return { success: true, message: "Address saved successfully", error: null as string | null }
}