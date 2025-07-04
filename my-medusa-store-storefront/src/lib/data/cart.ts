"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
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
import { scheduleRevalidate } from "@lib/utils/revalidate"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  // Optimize caching with a reasonable revalidation window
  const next = {
    revalidate: 5, // Revalidate after 5 seconds
    tags: ['cart', `cart-${id}`],
  }

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields:
          "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
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

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    console.error(`Region not found for country code: ${countryCode}`)
    return null
  }

  let cart = await retrieveCart()

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

      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidate(cartCacheTag)
    } catch (error) {
      console.error("Error creating cart:", error)
      return null
    }
  }

  if (cart && cart?.region_id !== region.id) {
    try {
      await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidate(cartCacheTag)
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
      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidate(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      scheduleRevalidate(fulfillmentCacheTag)

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
    const region = await getRegion(countryCode)

    if (!region) {
      return { success: false, error: "Region not found" }
    }

    try {
      const { cart: newCart } = await sdk.store.cart.create(
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
        headers
      )

      // Persist cart ID for subsequent requests
      await setCartId(newCart.id)

      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidate(cartCacheTag)

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
    const result = await sdk.store.cart.createLineItem(
      existingCart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      headers
    )

    const cartCacheTag = await getCacheTag("carts")
    scheduleRevalidate(cartCacheTag)

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
        sdk.store.cart.createLineItem(
          cart.id,
          {
            variant_id: variantId,
            quantity,
          },
          {},
          headers
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
    scheduleRevalidate(cartCacheTag)
    
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

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidate(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      scheduleRevalidate(fulfillmentCacheTag)
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

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidate(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      scheduleRevalidate(fulfillmentCacheTag)
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

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidate(cartCacheTag)
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

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidate(cartCacheTag)
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

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      scheduleRevalidate(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      scheduleRevalidate(fulfillmentCacheTag)
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
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
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
      sdk.store.cart.complete(id, {}, headers),
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

    // Revalidate caches: generic and id-specific cart tags
    revalidateTag("cart")
    revalidateTag(`cart-${id}`)
    if (customCartCacheTag) {
      revalidateTag(customCartCacheTag)
    }
    if (orderCacheTag) {
      revalidateTag(orderCacheTag)
    }

    if (cartRes?.type === "order") {
      const countryCode =
        cartRes.order.shipping_address?.country_code?.toLowerCase()

      // Clear cart before redirect to prevent unnecessary redirects
      await removeCartId()

      // Revalidate related data
      revalidateTag("products") // Potentially update inventory
      
      redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`)
    }

    return cartRes.cart
  } catch (error) {
    console.error("Error placing order:", error)
    // Revalidate cart to ensure UI is consistent
    const customCartCacheTag = await customCartCacheTagPromise
    revalidateTag("cart")
    revalidateTag(`cart-${id}`)
    if (customCartCacheTag) {
      revalidateTag(customCartCacheTag)
    }
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
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  try {
    if (cartId) {
      // Try to update existing cart
      try {
        await updateCart({ region_id: region.id })
        const cartCacheTag = await getCacheTag("carts")
        scheduleRevalidate(cartCacheTag)
      } catch (error) {
        console.error("Error updating cart region, will create new cart:", error)
        // If updating fails, remove the cart ID so we create a new one on next visit
        await removeCartId()
      }
    }

    const regionCacheTag = await getCacheTag("regions")
    revalidateTag(regionCacheTag)

    const productsCacheTag = await getCacheTag("products")
    revalidateTag(productsCacheTag)

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
