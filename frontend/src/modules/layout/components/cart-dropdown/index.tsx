"use client"

import { Dialog, Transition } from "@headlessui/react"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
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
  const [mobileCartOpen, setMobileCartOpen] = useState(false)
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

  const openDesktop = () => setCartDropdownOpen(true)
  const closeDesktop = () => setCartDropdownOpen(false)
  
  const toggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      setCartDropdownOpen((prev) => !prev)
    } else {
      setMobileCartOpen((prev) => !prev)
    }
  }
  const close = () => {
    setCartDropdownOpen(false)
    setMobileCartOpen(false)
  }

  const cart = (cartState || initialCart) as HttpTypes.StoreCart | null

  const totalItems =
    cart?.items?.reduce((acc: number, item: any) => {
      return acc + (item.quantity || 0)
    }, 0) || 0

  const itemsSubtotal = (cart?.item_subtotal ?? (cart?.subtotal ?? 0))
  const discountTotal = cart?.discount_total ?? 0
  const netItemsTotal = Math.max(0, itemsSubtotal - discountTotal)
  const freeShippingThreshold = 500
  const isFreeShipping = netItemsTotal >= freeShippingThreshold
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - Math.round(netItemsTotal))

  const pathname = usePathname() ?? ""
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    // Only auto-open on desktop screens
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      openDesktop()
    }
  }

  const handleMouseLeave = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        closeDesktop()
      }, 220)
    }
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

  const renderCartContent = (isMobileView = false) => (
    <div className="flex flex-col h-full max-h-[88vh] sm:max-h-none overflow-hidden font-jakarta">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-b border-amber-200/60 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🛍️</span>
          <div>
            <h3 className="font-cormorant text-xl font-bold text-slate-900 leading-tight">
              Your Fresh Box
            </h3>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
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
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-amber-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
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
          <div className="overflow-y-auto max-h-[46vh] sm:max-h-[42vh] px-4 sm:px-5 py-2 divide-y divide-slate-100 no-scrollbar flex-1 min-h-0">
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
                    className="w-14 h-14 rounded-2xl overflow-hidden bg-amber-50 border border-amber-100 flex-shrink-0 relative"
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
          <div className={`p-4 sm:p-5 bg-amber-50/50 border-t border-amber-100 space-y-3 flex-shrink-0 ${isMobileView ? "pb-7" : ""}`}>
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

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <LocalizedClientLink
                href="/cart"
                onClick={close}
                className="w-full text-center py-3.5 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-amber-200 font-jakarta text-xs font-bold text-slate-800 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
              >
                View Full Box
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/checkout"
                onClick={close}
                className="w-full text-center py-3.5 px-3 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
              >
                Proceed to Buy →
              </LocalizedClientLink>
            </div>
          </div>
        </>
      ) : (
        <div className={`p-6 sm:p-8 text-center space-y-4 ${isMobileView ? "pb-8" : ""}`}>
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
  )

  return (
    <div
      className="h-full relative"
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

        {/* Desktop Popover (Anchored Dropdown) */}
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
          <div className="hidden sm:block absolute right-0 top-[100%] pt-2 w-[380px] z-[90]">
            <div className="bg-white shadow-2xl rounded-3xl border border-amber-200/80 overflow-hidden">
              {renderCartContent(false)}
            </div>
          </div>
        </Transition>

        {/* Mobile Slide-Up Drawer Portal */}
        <Transition appear show={mobileCartOpen} as={Fragment}>
          <Dialog as="div" className="relative z-[100] sm:hidden" onClose={close}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" />
            </Transition.Child>

            <div className="fixed inset-x-0 bottom-0 z-[101]">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <Dialog.Panel className="w-full bg-white shadow-2xl rounded-t-3xl border-t border-amber-200/90 overflow-hidden">
                  {/* Subtle top grab bar */}
                  <div className="w-12 h-1.5 bg-amber-200/80 rounded-full mx-auto mt-2.5 mb-1" />
                  {renderCartContent(true)}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  )
}

export default CartDropdown
