"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { Table } from "@medusajs/ui"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    // ✅ Prevent updating while already updating
    if (updating) {
      console.log("[CartItem] Update already in progress, ignoring request")
      return
    }
    
    setError(null)
    setUpdating(true)
    
    console.log(`[CartItem] Changing quantity for item ${item.id} to ${quantity}`)

    try {
      await updateLineItem({
        lineId: item.id,
        quantity,
      })
      
      console.log(`[CartItem] Successfully updated quantity for item ${item.id}`)
      
      // ✅ Trigger cart refresh for all components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"))
      }
    } catch (err) {
      console.error(`[CartItem] Failed to update quantity for item ${item.id}:`, err)
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to update quantity"
      setError(errorMessage)
      
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setUpdating(false)
    }
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  if (type === "preview") {
    return (
      <Table.Row className="py-4">
        {/* Image Cell */}
        <Table.Cell className="w-16 p-0 pr-4 align-top">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="block"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
        </Table.Cell>

        {/* Info Cell */}
        <Table.Cell className="p-0 align-top">
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="font-display text-base text-luxury-charcoal">
                {item.product_title}
              </h3>
              <LineItemOptions variant={item.variant} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-luxury-charcoal/70">{item.quantity}x</span>
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </div>
        </Table.Cell>
      </Table.Row>
    )
  }

  return (
    <div className="grid grid-cols-1 small:grid-cols-[100px_1fr_120px_120px_120px] gap-4 py-8" data-testid="product-row">
      {/* Image */}
      <div className="w-[100px]">
        <LocalizedClientLink href={`/products/${item.product_handle}`} className="block group">
          <div className="relative">
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
            <div className="absolute inset-0 bg-luxury-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </LocalizedClientLink>
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <h3 className="font-display text-base text-luxury-charcoal" data-testid="product-title">
          <LocalizedClientLink href={`/products/${item.product_handle}`} className="hover:text-luxury-gold transition-colors duration-300">
            {item.product_title}
          </LocalizedClientLink>
        </h3>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </div>

      {/* Quantity */}
      <div className="flex items-center">
        <div className="flex gap-2 items-center">
          <DeleteButton 
            id={item.id} 
            data-testid="product-delete-button" 
            className="text-xs uppercase tracking-wider text-luxury-charcoal/70 hover:text-luxury-gold transition-colors duration-300"
          >
            Remove
          </DeleteButton>
          <CartItemSelect
            value={item.quantity}
            onChange={(value) => changeQuantity(parseInt(value.target.value))}
            className="w-14 h-10 p-2 border border-luxury-lightgold/30 bg-luxury-ivory text-luxury-charcoal focus:border-luxury-gold"
            data-testid="product-select-button"
          >
            {Array.from(
              {
                length: Math.min(maxQuantity, 10),
              },
              (_, i) => (
                <option value={i + 1} key={i}>
                  {i + 1}
                </option>
              )
            )}
          </CartItemSelect>
          {updating && <Spinner />}
        </div>
        {error && <ErrorMessage error={error} data-testid="product-error-message" />}
      </div>

      {/* Unit Price */}
      <div className="hidden small:flex items-center text-luxury-charcoal">
        <LineItemUnitPrice
          item={item}
          style="tight"
          currencyCode={currencyCode}
        />
      </div>

      {/* Total Price */}
      <div className="flex items-center justify-end font-display text-luxury-gold">
        <LineItemPrice
          item={item}
          style="tight"
          currencyCode={currencyCode}
        />
      </div>
    </div>
  )
}

export default Item
