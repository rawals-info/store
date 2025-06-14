"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { useCart } from "@lib/hooks/use-cart"

const CartDropdown = () => {
  const { cart: cartState } = useCart()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // Save the current number of items for future comparison
    itemRef.current = totalItems
  }, [totalItems, pathname])

  // Listen for cart updates via custom event
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      if (!pathname.includes("/cart")) {
        // Force open the cart dropdown immediately
        if (event.detail?.forceOpen) {
          // Clear any existing timer
          if (activeTimer) {
            clearTimeout(activeTimer)
          }
          open()
          
          // Set a new timer to close after 5 seconds
          const timer = setTimeout(close, 5000)
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
  }, [pathname, activeTimer, open, close, timedOpen])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-small-semi flex items-center"
            href="/cart"
            data-testid="nav-cart-link"
          >
            <span className="relative">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-luxury-gold rounded-full flex items-center justify-center text-[10px] text-luxury-ivory font-medium">
                  {totalItems}
                </span>
              )}
            </span>
            Cart
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="absolute top-[calc(100%+1px)] right-0 bg-luxury-ivory border border-luxury-lightgold shadow-luxury-md w-[360px] max-w-[90vw] text-luxury-charcoal z-[110]"
            data-testid="nav-cart-dropdown"
          >
            {/* Gold line at top */}
            <div className="h-0.5 w-full gold-gradient"></div>
            
            <div className="p-4 flex items-center justify-center border-b border-luxury-lightgold/30">
              <h3 className="font-display text-xl text-luxury-gold">Your Cart</h3>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar py-4">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[100px_1fr] gap-x-3 pb-4 border-b border-luxury-lightgold/20 last:border-0"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-[90px] overflow-hidden group"
                        >
                          <div className="relative">
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.variant?.product?.images}
                              size="square"
                            />
                            <div className="absolute inset-0 bg-luxury-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[150px]">
                                <h3 className="font-display text-base overflow-hidden text-ellipsis">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    className="hover:text-luxury-gold transition-colors duration-300"
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                                <span
                                  className="text-serif-regular text-sm text-luxury-charcoal/80 mt-1"
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                >
                                  Quantity: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-end">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-2 text-xs uppercase tracking-wider text-luxury-charcoal/70 hover:text-luxury-gold transition-colors duration-300"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-6 flex flex-col gap-y-4 text-small-regular border-t border-luxury-lightgold/30 bg-luxury-cream/20">
                  <div className="flex items-center justify-between">
                    <span className="text-luxury-charcoal font-serif font-medium text-base">
                      Subtotal{" "}
                      <span className="font-normal text-luxury-charcoal/70">(excl. taxes)</span>
                    </span>
                    <span
                      className="font-display text-xl text-luxury-gold"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      className="luxury-btn w-full mt-2"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      Proceed to Checkout
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-16 flex-col gap-y-6 items-center justify-center px-8 text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full border border-luxury-lightgold">
                    <svg className="w-8 h-8 text-luxury-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <span className="font-display text-lg">Your shopping bag is empty</span>
                    <span className="text-serif-regular text-luxury-charcoal/80">Discover our collection of handcrafted marble pieces</span>
                  </div>
                  <div>
                    <LocalizedClientLink href="/products">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button className="luxury-btn" onClick={close}>Explore Collection</Button>
                      </>
                    </LocalizedClientLink>
                  </div>
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
