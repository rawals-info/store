import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo, useState } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
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

  const isSimple = isSimpleProduct(product)

  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="bg-white/95 backdrop-blur-md shadow-2xl border-t border-amber-100 p-3.5 px-4 h-full w-full z-50 flex items-center justify-between gap-3"
            data-testid="mobile-actions"
          >
            {/* Price & Title on Left */}
            <div className="flex-1 min-w-0">
              <span className="font-cormorant text-base font-bold text-slate-900 truncate block">
                {product.title}
              </span>
              {selectedPrice ? (
                <div className="flex items-baseline gap-1.5 font-mono text-sm font-bold text-petha-amber">
                  <span>{selectedPrice.calculated_price}</span>
                  {selectedPrice.price_type === "sale" && (
                    <span className="line-through text-xs text-slate-400 font-normal">
                      {selectedPrice.original_price}
                    </span>
                  )}
                </div>
              ) : null}
            </div>

            {/* Action Buttons on Right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isSimple && product.variants && product.variants.length > 1 && (
                <button
                  type="button"
                  onClick={open}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-jakarta text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                  data-testid="mobile-actions-button"
                >
                  <span>
                    {variant ? Object.values(options).join(" / ") : "Size"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              )}
              
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={Boolean(!inStock || (!variant && product.variants && product.variants.length > 1))}
                className="px-5 py-2.5 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                data-testid="mobile-cart-button"
              >
                {isAdding ? "Adding..." : !inStock ? "Sold Out" : "+ Add to Cart"}
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
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-12">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
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
