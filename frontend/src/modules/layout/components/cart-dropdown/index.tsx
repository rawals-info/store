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
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  // Use SWR to fetch and auto-revalidate cart
  const { data: cartState } = (useSWR as any)(
    "/api/cart",
    fetcher,
    {
      fallbackData: initialCart,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  )

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const cart = cartState as HttpTypes.StoreCart | null

  const totalItems =
    cart?.items?.reduce((acc: number, item: any) => {
      return acc + (item.quantity || 0)
    }, 0) || 0

  const subtotal = cart?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 4000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname() ?? ""
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      itemRef.current = totalItems
      return
    }

    if (itemRef.current === 0) {
      itemRef.current = totalItems
      return
    }

    if (
      itemRef.current !== totalItems &&
      !pathname.includes("/cart") &&
      !pathname.includes("/checkout")
    ) {
      timedOpen()
    }

    itemRef.current = totalItems
  }, [totalItems, pathname])

  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      if (!pathname.includes("/cart") && !pathname.includes("/checkout")) {
        if (event.detail?.forceOpen) {
          if (activeTimer) {
            clearTimeout(activeTimer)
          }
          open()
          const timer = setTimeout(close, 4000)
          setActiveTimer(timer)
        } else {
          timedOpen()
        }
      }
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener)
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener)
    }
  }, [pathname, activeTimer])

  // Free shipping threshold (₹500)
  const freeShippingThreshold = 500
  const currentTotalInINR = subtotal > 100 ? subtotal : subtotal * 100 // adjust if needed
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full focus:outline-none">
          <LocalizedClientLink
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-slate-800 hover:text-petha-amber transition-all duration-200 shadow-sm"
            href="/cart"
            data-testid="nav-cart-link"
          >
            <div className="relative flex items-center">
              <svg className="w-5 h-5 text-petha-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold font-jakarta shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm font-bold font-jakarta uppercase tracking-wider text-slate-800">
              Cart
            </span>
          </LocalizedClientLink>
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-1 scale-95"
        >
          <PopoverPanel
            static
            className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-3xl border border-amber-100/90 shadow-2xl w-[90vw] max-w-[340px] sm:w-[400px] sm:max-w-[420px] text-slate-800 z-[110] overflow-hidden"
            data-testid="nav-cart-dropdown"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-amber-50/70 border-b border-amber-100/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛍️</span>
                <h3 className="font-cormorant text-xl font-bold text-slate-900">Your Fresh Box</h3>
              </div>
              <span className="font-jakarta text-xs font-bold text-petha-amber">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Free Delivery Bar */}
            <div className="px-5 py-2.5 bg-[#FFFDF9] border-b border-amber-100/60 text-xs font-jakarta">
              {subtotal >= 500 ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span>🎉</span> You qualify for FREE Nationwide Delivery!
                </div>
              ) : (
                <div className="text-slate-600">
                  Add <span className="font-bold text-petha-amber">₹{500 - Math.round(subtotal)}</span> more for <span className="font-bold text-emerald-700">FREE Express Delivery</span>
                </div>
              )}
            </div>

            {cart && cart.items?.length ? (
              <>
                {/* Items List */}
                <div className="overflow-y-auto max-h-[45vh] px-5 py-3 divide-y divide-slate-100 no-scrollbar">
                  {cart.items
                    .sort((a: any, b: any) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
                    .map((item: any) => (
                      <div
                        className="py-3.5 flex items-center gap-3.5 group"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-14 h-14 rounded-xl overflow-hidden bg-amber-50 border border-amber-100 flex-shrink-0"
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
                              currencyCode={cartState.currency_code}
                            />
                            <DeleteButton
                              id={item.id}
                              className="text-[11px] font-jakarta font-semibold text-rose-600 hover:underline"
                            >
                              Remove
                            </DeleteButton>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Subtotal & Buttons */}
                <div className="p-5 bg-amber-50/40 border-t border-amber-100 space-y-3">
                  <div className="flex items-baseline justify-between font-jakarta">
                    <span className="text-xs font-semibold text-slate-600">Subtotal:</span>
                    <span className="font-mono text-xl font-bold text-slate-900">
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <LocalizedClientLink
                      href="/cart"
                      onClick={close}
                      className="w-full text-center py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-jakarta text-xs font-bold text-slate-800 transition-colors"
                    >
                      View Cart
                    </LocalizedClientLink>

                    <LocalizedClientLink
                      href="/checkout"
                      onClick={close}
                      className="w-full text-center py-2.5 px-3 rounded-xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold transition-colors shadow-sm"
                    >
                      Checkout →
                    </LocalizedClientLink>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-petha-amber flex items-center justify-center mx-auto text-xl">
                  🍬
                </div>
                <div>
                  <h4 className="font-cormorant text-lg font-bold text-slate-900">Your bag is empty</h4>
                  <p className="font-jakarta text-xs text-slate-500 mt-0.5">Explore our freshly prepared Agra sweets:</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <LocalizedClientLink
                    href="/categories/petha"
                    onClick={close}
                    className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-jakarta font-semibold text-petha-amber hover:bg-amber-100 transition-colors"
                  >
                    🍬 Petha
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/categories/dalmoth"
                    onClick={close}
                    className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-jakarta font-semibold text-petha-amber hover:bg-amber-100 transition-colors"
                  >
                    🥜 Dalmoth
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/store"
                    onClick={close}
                    className="px-3 py-1.5 rounded-full bg-slate-900 text-xs font-jakarta font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    All Sweets →
                  </LocalizedClientLink>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
