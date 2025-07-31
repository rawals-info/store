"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { CART_FIELDS } from "@lib/constants/api-fields"
import { scheduleRevalidate } from "@lib/utils/revalidate"
import { scheduleRevalidates } from "@lib/utils/revalidate"
import { redirect } from "next/navigation"
import { ExtendedStoreCartLineItem } from "../../types/cart"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"
import { getIndiaRegion } from "@lib/constants/india-region"
import { retryWithBackoff } from "@lib/utils/retry"
import { withTimeout } from "@lib/utils/retry"
import { randomUUID } from "crypto"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @param fields - optional - Specific fields to retrieve (defaults to FULL)
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string, fields: string = CART_FIELDS.FULL) {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  // Always fetch the latest cart state. Using `revalidate: 0` ensures the
  // request bypasses any cached response, preventing issues where the
  // checkout page shows an empty cart even though items have just been
  // added.
  const next = {
    revalidate: 30, // Use smart caching with 30s TTL
    tags: ["cart", `cart-${id}`],
  }

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields, // Use optimized fields based on context
      },
      headers,
      next,
    })
    .then(({ cart }) => {
      // Mark cart items and variants to help identify them in price calculations
      if (cart && cart.items) {
        cart.items = cart.items.map(item => {
          if (item.variant) {
            // Use type assertion to avoid TypeScript errors
            (item.variant as any).in_cart = true;
          }
          return item;
        });
      }
      return cart;
    })
    .catch(() => null)
}

/**
 * Retrieve cart with minimal fields for cart count/badge
 */
export async function retrieveCartCount(cartId?: string) {
  return retrieveCart(cartId, CART_FIELDS.COUNT)
}

/**
 * Retrieve cart with essential fields for cart dropdown
 */
export async function retrieveCartDropdown(cartId?: string) {
  return retrieveCart(cartId, CART_FIELDS.DROPDOWN)
}

/**
 * Retrieve cart with full fields for cart page and checkout
 */
export async function retrieveCartFull(cartId?: string) {
  return retrieveCart(cartId, CART_FIELDS.FULL)
}

export async function getOrSetCart(countryCode: string) {
  // Fetch region and existing cart concurrently since they are independent
  const [region, existingCart] = await Promise.all([
    getIndiaRegion(),
    retrieveCart(),
  ])

  if (!region) {
    console.error(`Region not found for country code: ${countryCode}`)
    return null
  }

  let cart = existingCart

  const headers = {
    ...(await getAuthHeaders()),
  }

  // Build parameters for cart creation: always include region, optionally sales_channel_id
  const createParams: Record<string, any> = { region_id: region.id }

  if (!cart) {
    try {
      const cartResp = await sdk.store.cart.create(
        createParams,
        {},
        headers
      )
      cart = cartResp.cart

      await setCartId(cart.id)

      // Revalidation is handled by mutation routes or server actions to avoid
      // calling `revalidateTag` during a server render.
    } catch (error) {
      console.error("Error creating cart:", error)
      return null
    }
  }

  if (cart && cart?.region_id !== region.id) {
    try {
      await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
      // Revalidation deferred – it will be triggered by the first client-side
      // cart mutation, which is a supported context for `revalidateTag`.
    } catch (error) {
      console.error("Error updating cart region:", error)
      // Continue with existing cart
    }
  }

  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }) => {
      const [cartCacheTag, fulfillmentCacheTag] = await Promise.all([
        getCacheTag("carts"),
        getCacheTag("fulfillment"),
      ])

      scheduleRevalidates([cartCacheTag, fulfillmentCacheTag])
       
      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    return { success: false, error: "Missing variant ID" }
  }

  // Try to fetch an existing cart first to avoid unnecessary creation
  const existingCart = await retrieveCart()

  const headers = {
    ...(await getAuthHeaders()),
  }

  // No cart yet → create one and include the requested item in the same request
  if (!existingCart) {
    const [region, authHeaders] = await Promise.all([
      getIndiaRegion(),
      getAuthHeaders(),
    ])

    if (!region) {
      return { success: false, error: "Region not found" }
    }

    const combinedHeaders = { ...authHeaders }

    try {
      const { cart: newCart } = await withTimeout(
        sdk.store.cart.create(
          {
            region_id: region.id,
            items: [
              {
                variant_id: variantId,
                quantity,
              },
            ],
          },
          {},
          combinedHeaders
        ),
        10000,
        "Creating cart timed out"
      )

      // Persist cart ID for subsequent requests
      await setCartId(newCart.id)

      const cartCacheTag = await getCacheTag("carts")
      // Also revalidate the generic and specific cart tags used by RSC fetches
      scheduleRevalidates([
        cartCacheTag,
        "cart",
        `cart-${newCart.id}`,
      ])

      return { success: true, cart: newCart }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Cart already exists → add the item via the usual line-item endpoint
  try {
    const idempotentHeaders = { ...headers, "Idempotency-Key": randomUUID() }

    const result = await retryWithBackoff(() =>
      withTimeout(
        sdk.store.cart.createLineItem(
          existingCart.id,
          {
            variant_id: variantId,
            quantity,
          },
          {},
          { ...headers, "Idempotency-Key": randomUUID() }
        ),
        8000,
        "Adding item to cart timed out"
      )
    )

    const cartCacheTag = await getCacheTag("carts")
    scheduleRevalidates([
      cartCacheTag,
      "cart",
      `cart-${existingCart.id}`,
    ])

    return { success: true, cart: result.cart }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// New function to support batch operations
export async function batchAddToCart({
  items,
  countryCode,
}: {
  items: Array<{ variantId: string; quantity: number }>
  countryCode: string
}) {
  if (!items?.length) {
    return { success: false, error: "No items provided" }
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    return { success: false, error: "Failed to retrieve or create cart" }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    // We could implement this with a batch endpoint if available
    // For now, we'll use Promise.all to add items in parallel
    const results = await Promise.all(
      items.map(({ variantId, quantity }) =>
        retryWithBackoff(() =>
          sdk.store.cart.createLineItem(
            cart.id,
            {
              variant_id: variantId,
              quantity,
            },
            {},
            { ...headers, "Idempotency-Key": randomUUID() }
          )
        ).catch(error => ({ error }))
      )
    )
    
    // Check for any errors
    const errors = results.filter(result => 'error' in result)
    if (errors.length) {
      // Some items failed to add
      return { 
        success: false, 
        error: "Some items could not be added to cart", 
        partialSuccess: errors.length < items.length 
      }
    }
    
    // Get the last successful result that contains the cart
    const lastValidResult = results[results.length - 1] as HttpTypes.StoreCartResponse
    
    // Revalidate cache only once for all additions
    const cartCacheTag = await getCacheTag("carts")
    scheduleRevalidates([
      cartCacheTag,
      "cart",
      `cart-${cart.id}`,
    ])
    
    return { success: true, cart: lastValidResult.cart }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await retryWithBackoff(() => 
    sdk.store.cart
      .updateLineItem(cartId, lineId, { quantity }, {}, { 
        ...headers, 
        "Idempotency-Key": randomUUID() 
      })
  )
    .then(async () => {
      const [cartCacheTag, fulfillmentCacheTag] = await Promise.all([
        getCacheTag("carts"),
        getCacheTag("fulfillment")
      ])
      scheduleRevalidates([cartCacheTag, fulfillmentCacheTag])
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await retryWithBackoff(() =>
    sdk.store.cart
      .deleteLineItem(cartId, lineId, { 
        ...headers, 
        "Idempotency-Key": randomUUID() 
      })
  )
    .then(async () => {
      const [cartCacheTag, fulfillmentCacheTag] = await Promise.all([
        getCacheTag("carts"),
        getCacheTag("fulfillment")
      ])
      scheduleRevalidates([cartCacheTag, fulfillmentCacheTag])
    })
    .catch(medusaError)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return retryWithBackoff(() =>
    sdk.store.cart
      .addShippingMethod(
        cartId, 
        { option_id: shippingMethodId }, 
        {}, 
        { ...headers, "Idempotency-Key": randomUUID() }
      )
  )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidates([cartCacheTag])
    })
    .catch(medusaError)
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return retryWithBackoff(() =>
    sdk.store.payment
      .initiatePaymentSession(
        cart, 
        data, 
        {}, 
        { ...headers, "Idempotency-Key": randomUUID() }
      )
  )
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidates([cartCacheTag])
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return retryWithBackoff(() =>
    sdk.store.cart
      .update(
        cartId, 
        { promo_codes: codes }, 
        {}, 
        { ...headers, "Idempotency-Key": randomUUID() }
      )
  )
    .then(async () => {
      const [cartCacheTag, fulfillmentCacheTag] = await Promise.all([
        getCacheTag("carts"),
        getCacheTag("fulfillment")
      ])
      scheduleRevalidates([cartCacheTag, fulfillmentCacheTag])
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const rawCode = formData.get("code") as string | null
  const code = rawCode?.trim().toUpperCase()
  if (!code) {
    return "Please enter a promotion code."
  }
  try {
    await applyPromotions([code])
    // Fetch updated cart to confirm promotion actually applied
    const region = getIndiaRegion()
    const cart = await retrieveCart()
    const applied = cart?.promotions?.some((p) => p.code?.toUpperCase() === code)
    if (!applied) {
      return "Invalid or ineligible promotion code."
    }
  } catch (e: any) {
    return e.message
  }
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  // Start pre-fetching order cache invalidation to save time later
  const orderCacheTagPromise = getCacheTag("orders")
  const customCartCacheTagPromise = getCacheTag("cart")

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    // Set a timeout to prevent hanging on slow connections
    const cartRes = await Promise.race([
      retryWithBackoff(() =>
        sdk.store.cart.complete(id, {}, { ...headers, "Idempotency-Key": randomUUID() })
      ),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Order placement timed out (took longer than 5 minutes). Your payment might still be processing—please check your email for a confirmation or contact support."
            )
          )
        }, 300000) // 5 minutes
      })
    ]) as any;

    // We can now use the pre-fetched cache tags
    const [orderCacheTag, customCartCacheTag] = await Promise.all([
      orderCacheTagPromise,
      customCartCacheTagPromise
    ]);

    // Revalidate caches in a single batched call
    scheduleRevalidates([
      "cart",
      `cart-${id}`,
      customCartCacheTag,
      orderCacheTag,
    ].filter(Boolean))

    if (cartRes?.type === "order") {
      const countryCode =
        cartRes.order.shipping_address?.country_code?.toLowerCase()

      // Clear cart before redirect to prevent unnecessary redirects
      await removeCartId()

      // Revalidate related data
      scheduleRevalidate("products") // Potentially update inventory
      
      redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`)
    }

    return cartRes.cart
  } catch (error) {
    console.error("Error placing order:", error)
    // Revalidate cart to ensure UI is consistent
    const customCartCacheTag = await customCartCacheTagPromise
    scheduleRevalidates([
      "cart",
      `cart-${id}`,
      customCartCacheTag,
    ].filter(Boolean))
    throw error
  }
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = getIndiaRegion()

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  try {
    if (cartId) {
      // Try to update existing cart
      try {
        await updateCart({ region_id: region.id })
        const cartCacheTag = await getCacheTag("carts")
        scheduleRevalidates([
          cartCacheTag,
          "cart",
          `cart-${cartId}`,
        ])
      } catch (error) {
        console.error("Error updating cart region, will create new cart:", error)
        // If updating fails, remove the cart ID so we create a new one on next visit
        await removeCartId()
      }
    }

    const [regionCacheTag, productsCacheTag] = await Promise.all([
      getCacheTag("regions"),
      getCacheTag("products")
    ])
    scheduleRevalidates([regionCacheTag, productsCacheTag])

    // Ensure currentPath doesn't start with a slash to avoid double slashes
    const cleanPath = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath
    
    redirect(`/${countryCode}/${cleanPath}`)
  } catch (error) {
    console.error("Error in updateRegion:", error)
    throw error
  }
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
    cache: "force-cache",
  })
}
