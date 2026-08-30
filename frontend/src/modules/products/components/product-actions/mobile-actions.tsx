import { Dialog, Transition } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import React, { Fragment, useMemo, useState } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import { formatIndianPrice } from "@lib/util/money"
import { calculateDiscountedPrice } from "@lib/config/promotions"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const rawNum = selectedPrice?.calculated_price_number || 0
  const { discountedPrice, isDiscounted } = calculateDiscountedPrice(rawNum)

  const isSimple = isSimpleProduct(product)

  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed z-[60]", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0 translate-y-full"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-full"
        >
          <div
            className="bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-amber-200/80 p-3 px-4 w-full flex items-center justify-between gap-2.5"
            data-testid="mobile-actions"
          >
            {/* Price & Title on Left */}
            <div className="flex-1 min-w-0">
              <span className="font-jakarta text-xs sm:text-sm font-bold text-slate-900 truncate block">
                {product.title}
              </span>
              <div className="flex items-baseline gap-1.5 font-mono text-sm font-bold text-slate-900">
                <span>₹{formatIndianPrice(discountedPrice)}</span>
                {isDiscounted && (
                  <span className="line-through text-xs text-slate-400 font-normal">
                    ₹{formatIndianPrice(rawNum)}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons on Right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isSimple && product.variants && product.variants.length > 1 && (
                <button
                  type="button"
                  onClick={open}
                  className="px-2.5 py-2 rounded-xl border border-amber-200 bg-amber-50/60 font-jakarta text-xs font-semibold text-slate-800 flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95 flex-shrink-0"
                  data-testid="mobile-actions-button"
                >
                  <span className="truncate max-w-[85px]">
                    {variant ? variant.title || Object.values(options).join(" / ") : "Select Pack"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                </button>
              )}
              
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={Boolean(!inStock || (!variant && product.variants && product.variants.length > 1))}
                className="px-4 sm:px-5 py-2.5 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                data-testid="mobile-cart-button"
              >
                {isAdding ? (
                  <span>Adding...</span>
                ) : !inStock ? (
                  <span>Sold Out</span>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <Dialog.Panel className="w-full h-full transform overflow-hidden p-5 bg-white text-left align-middle shadow-2xl rounded-t-3xl border-t border-amber-200 transition-all font-jakarta">
                  <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                    <span className="font-cormorant text-xl font-bold text-slate-900">
                      Select Pack Size
                    </span>
                    <button
                      type="button"
                      onClick={close}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4 pb-4">
                    {(product.options || []).map((option) => (
                      <div key={option.id}>
                        <OptionSelect
                          option={option}
                          current={options[option.id]}
                          updateOption={updateOptions}
                          title={option.title}
                          disabled={optionsDisabled}
                          product={product}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="w-full py-3.5 bg-petha-amber text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    Confirm Selection
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
