'use server'

import { redirect } from "next/navigation"
import { getCartId } from "@lib/data/cookies"
import { updateCart } from "@lib/data/cart"

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

  const data: any = {
    shipping_address: {
      first_name: formData.get("shipping_address.first_name"),
      last_name: formData.get("shipping_address.last_name"),
      address_1: formData.get("shipping_address.address_1"),
      address_2: "",
      company: formData.get("shipping_address.company"),
      postal_code: formData.get("shipping_address.postal_code"),
      city: formData.get("shipping_address.city"),
      country_code: formData.get("shipping_address.country_code"),
      province: formData.get("shipping_address.province"),
      phone: formData.get("shipping_address.phone"),
    },
    email: formData.get("email"),
  }

  const sameAsBilling = formData.get("same_as_billing")
  if (sameAsBilling === "on") {
    data.billing_address = data.shipping_address
  } else {
    data.billing_address = {
      first_name: formData.get("billing_address.first_name"),
      last_name: formData.get("billing_address.last_name"),
      address_1: formData.get("billing_address.address_1"),
      address_2: "",
      company: formData.get("billing_address.company"),
      postal_code: formData.get("billing_address.postal_code"),
      city: formData.get("billing_address.city"),
      country_code: formData.get("billing_address.country_code"),
      province: formData.get("billing_address.province"),
      phone: formData.get("billing_address.phone"),
    }
  }

  await updateCart(data)

  // Redirect to unified checkout
  redirect(`/${formData.get("shipping_address.country_code")}/checkout`)
}

/**
 * Server Action: Updates the cart with shipping/billing addresses without redirecting
 * for single-page checkout flow.
 */
export async function setAddressesSinglePage(_prevState: unknown, formData: FormData) {
  if (!formData) {
    throw new Error("No form data found when setting addresses")
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("No existing cart found when setting addresses")
  }

  const data: any = {
    shipping_address: {
      first_name: formData.get("shipping_address.first_name"),
      last_name: formData.get("shipping_address.last_name"),
      address_1: formData.get("shipping_address.address_1"),
      address_2: "",
      company: formData.get("shipping_address.company"),
      postal_code: formData.get("shipping_address.postal_code"),
      city: formData.get("shipping_address.city"),
      country_code: formData.get("shipping_address.country_code"),
      province: formData.get("shipping_address.province"),
      phone: formData.get("shipping_address.phone"),
    },
    email: formData.get("email"),
  }

  const sameAsBilling = formData.get("same_as_billing")
  if (sameAsBilling === "on") {
    data.billing_address = data.shipping_address
  } else {
    data.billing_address = {
      first_name: formData.get("billing_address.first_name"),
      last_name: formData.get("billing_address.last_name"),
      address_1: formData.get("billing_address.address_1"),
      address_2: "",
      company: formData.get("billing_address.company"),
      postal_code: formData.get("billing_address.postal_code"),
      city: formData.get("billing_address.city"),
      country_code: formData.get("billing_address.country_code"),
      province: formData.get("billing_address.province"),
      phone: formData.get("billing_address.phone"),
    }
  }

  await updateCart(data)

  // Return success response instead of redirecting
  return { success: true, message: "Address saved successfully" }
} 