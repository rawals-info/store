"use client"

import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import useSWR from "swr"

// Simple fetcher for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  })
  if (!res.ok) {
    throw new Error("Cart fetch failed")
  }
  const data = await res.json()
  return data.cart
}

const CartDropdown = ({
  cart: initialCart,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const [badgeBounced, setBadgeBounced] = useState(false)

  // Use SWR to fetch and auto-revalidate cart
  const { data: cartState, mutate } = (useSWR as any)(
    "/api/cart",
    fetcher,
    {
      fallbackData: initialCart,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  )

  const toggle = () => setCartDropdownOpen((prev) => !prev)
  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const cart = (cartState || initialCart) as HttpTypes.StoreCart | null

  const totalItems =
    cart?.items?.reduce((acc: number, item: any) => {
      return acc + (item.quantity || 0)
    }, 0) || 0

  const itemsSubtotal = (cart?.item_subtotal ?? ((cart?.subtotal ?? 0) - (cart?.shipping_subtotal ?? 0)))
  const discountTotal = cart?.discount_total ?? 0
  const netItemsTotal = Math.max(0, itemsSubtotal - discountTotal)
  const freeShippingThreshold = 500
  const isFreeShipping = netItemsTotal >= freeShippingThreshold
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - Math.round(netItemsTotal))

  const pathname = usePathname() ?? ""
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setCartDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setCartDropdownOpen(false)
    }, 220)
  }

  // Close dropdown on navigation
  useEffect(() => {
    close()
  }, [pathname])

  // Listen for cart changes without auto-opening popup
  useEffect(() => {
    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail?.cart) {
        mutate(customEvent.detail.cart, false)
      } else {
        mutate()
      }

      // Smooth subtle badge pulse to confirm item addition
      setBadgeBounced(true)
      const timer = setTimeout(() => setBadgeBounced(false), 1200)
      return () => clearTimeout(timer)
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [mutate])

  return (
    <div
      className="h-full z-50 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-full flex items-center">
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-slate-800 hover:text-petha-amber transition-all duration-200 shadow-sm cursor-pointer"
          data-testid="nav-cart-link"
          aria-label="Toggle Cart Dropdown"
        >
          <div className="relative">
            <span className="text-base">🛍️</span>
            {totalItems > 0 && (
              <span
                className={`absolute -top-1.5 -right-2 bg-petha-amber text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-white shadow-2xs transition-transform duration-300 ${
                  badgeBounced ? "scale-135 bg-emerald-600" : "scale-100"
                }`}
              >
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-xs font-jakarta font-bold uppercase tracking-wider hidden sm:inline-block">
            Cart
          </span>
        </button>

        <Transition
          as={Fragment}
          show={cartDropdownOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div>
            {/* Mobile Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[80] sm:hidden"
              onClick={close}
            />

            {/* Panel: Responsive Popover on Desktop, Slide-Up Bottom Drawer on Mobile */}
            <div
              className="fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl sm:rounded-3xl sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-full sm:w-[380px] bg-white shadow-2xl border-t sm:border border-amber-200/80 overflow-hidden z-[90] flex flex-col animate-in fade-in slide-in-from-bottom-5 sm:slide-in-from-top-2 duration-200 font-jakarta"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-b border-amber-200/60 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛍️</span>
                  <div>
                    <h3 className="font-cormorant text-xl font-bold text-slate-900 leading-tight">
                      Your Fresh Box
                    </h3>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block sm:hidden">
                      Vacuum Sealed Dispatch
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-jakarta font-bold text-petha-amber bg-white px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                  </span>
                  <button
                    type="button"
                    onClick={close}
                    className="w-7 h-7 rounded-full bg-white border border-amber-200 flex items-center justify-center text-slate-500 hover:text-slate-900 sm:hidden"
                    aria-label="Close cart"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Free Delivery Progress Bar */}
              <div className="px-4 sm:px-5 py-2.5 bg-[#FFFDF9] border-b border-amber-100/60 text-xs font-jakarta flex-shrink-0">
                {isFreeShipping ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <span>🎉</span> You unlocked FREE Air Express Delivery!
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-600 mb-1">
                      Add <strong className="text-petha-amber">₹{neededForFreeShipping}</strong> more for <strong className="text-emerald-700">FREE Delivery</strong>
                    </p>
                    <div className="w-full h-1.5 rounded-full bg-amber-100 overflow-hidden">
                      <div
                        className="h-full bg-petha-amber rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (netItemsTotal / 500) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {cart && cart.items?.length ? (
                <>
                  {/* Items List */}
                  <div className="overflow-y-auto max-h-[50vh] sm:max-h-[45vh] px-4 sm:px-5 py-3 divide-y divide-slate-100 no-scrollbar flex-1">
                    {cart.items
                      .sort((a: any, b: any) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
                      .map((item: any) => (
                        <div
                          className="py-3 sm:py-3.5 flex items-center gap-3.5 group"
                          key={item.id}
                          data-testid="cart-item"
                        >
                          <LocalizedClientLink
                            href={`/products/${item.product_handle}`}
                            onClick={close}
                            className="w-14 h-14 rounded-2xl overflow-hidden bg-amber-50 border border-amber-100 flex-shrink-0"
                          >
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.variant?.product?.images}
                              size="square"
                            />
                          </LocalizedClientLink>

                          <div className="flex-1 min-w-0">
                            <LocalizedClientLink
                              href={`/products/${item.product_handle}`}
                              onClick={close}
                              className="font-cormorant text-base font-bold text-slate-900 hover:text-petha-amber transition-colors line-clamp-1 leading-snug"
                            >
                              {item.title}
                            </LocalizedClientLink>

                            <p className="font-jakarta text-[11px] text-slate-500 truncate">
                              {item.variant?.title || "Standard Box"} · Qty: {item.quantity}
                            </p>

                            <div className="flex items-center justify-between mt-1">
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState?.currency_code || "inr"}
                              />
                              <DeleteButton
                                id={item.id}
                                className="text-[11px] font-jakarta font-semibold text-rose-600 hover:underline cursor-pointer"
                              >
                                Remove
                              </DeleteButton>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Subtotal & Buttons Footer */}
                  <div className="p-4 sm:p-5 bg-amber-50/40 border-t border-amber-100 space-y-3 flex-shrink-0">
                    <div className="flex items-baseline justify-between font-jakarta">
                      <span className="text-xs font-semibold text-slate-600">Subtotal:</span>
                      <div className="text-right">
                        {discountTotal > 0 && (
                          <span className="text-xs text-slate-400 line-through mr-2 font-mono">
                            {convertToLocale({
                              amount: itemsSubtotal,
                              currency_code: cartState?.currency_code || "inr",
                            })}
                          </span>
                        )}
                        <span className="font-mono text-xl font-bold text-slate-900">
                          {convertToLocale({
                            amount: netItemsTotal,
                            currency_code: cartState?.currency_code || "inr",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <LocalizedClientLink
                        href="/cart"
                        onClick={close}
                        className="w-full text-center py-3 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 font-jakarta text-xs font-bold text-slate-800 transition-colors shadow-2xs"
                      >
                        View Full Box
                      </LocalizedClientLink>

                      <LocalizedClientLink
                        href="/checkout"
                        onClick={close}
                        className="w-full text-center py-3 px-3 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        Proceed to Buy →
                      </LocalizedClientLink>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 sm:p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-3xl bg-amber-100 text-petha-amber flex items-center justify-center mx-auto text-2xl shadow-inner">
                    🍬
                  </div>
                  <div>
                    <h4 className="font-cormorant text-xl font-bold text-slate-900">Your fresh box is empty</h4>
                    <p className="font-jakarta text-xs text-slate-500 mt-1 max-w-xs mx-auto">Discover authentic handcrafted Agra pethas &amp; crispy dalmoth:</p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    <LocalizedClientLink
                      href="/products?category=petha"
                      onClick={close}
                      className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-jakarta font-semibold text-petha-amber hover:bg-amber-100 transition-colors"
                    >
                      🍬 Agra Petha
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href="/products?category=dalmoth"
                      onClick={close}
                      className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-jakarta font-semibold text-petha-amber hover:bg-amber-100 transition-colors"
                    >
                      🥜 Royal Dalmoth
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href="/products"
                      onClick={close}
                      className="px-3.5 py-1.5 rounded-full bg-slate-900 text-xs font-jakarta font-semibold text-white hover:bg-slate-800 transition-colors"
                    >
                      All Sweets →
                    </LocalizedClientLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
}

export default CartDropdown
