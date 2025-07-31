"use client"

import { Badge, Heading, Input, Label, Text, Tooltip } from "@medusajs/ui"
import React, { useActionState } from "react";
import { useRouter } from "next/navigation"

import { applyPromotions, submitPromotionForm } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { InformationCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const router = useRouter()
  const [submitted, setSubmitted] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [localError, setLocalError] = React.useState<string | null>(null)

  const { items = [], promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const remainingPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      remainingPromotions
        .filter((p) => p.code !== undefined)
        .map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    const code = formData.get("code")
    if (!code) {
      return
    }

    const input = document.getElementById("promotion-input") as HTMLInputElement
    const existingCodes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)

    const normalizedCode = code.toString().trim().toUpperCase()

    existingCodes.push(normalizedCode)

    await applyPromotions(existingCodes)

    if (input) {
      input.value = ""
    }
  }

  const [message, formAction] = useActionState(submitPromotionForm, null)

// Trigger a refresh (to fetch the updated cart with the applied promotion) and show a
// transient success banner once the server action completes without error.
React.useEffect(() => {
  if (!submitted) {
    return
  }

  // If `message` is undefined the action completed successfully. Any string is an error.
  if (message === undefined) {
    // Revalidate Server Components and cached fetches
    router.refresh()
    setShowSuccess(true)
    // Hide success after a short delay
    const t = setTimeout(() => setShowSuccess(false), 4000)
    return () => clearTimeout(t)
  }

  // Reset success state on error
  setShowSuccess(false)
}, [message, submitted, router])

  return (
    <div className="w-full flex flex-col">
      <div className="text-[#8a7f72]">
        <form
          action={formAction}
          className="w-full mb-5"
          onSubmit={(e) => {
            const val = inputRef.current?.value.trim()
            if (!val) {
              e.preventDefault()
              setLocalError("Please enter a promotion code.")
              return
            }
            // Upper-case the value for consistency
            if (inputRef.current) {
              inputRef.current.value = val.toUpperCase()
            }
            setSubmitted(true)
            setLocalError(null)
          }}
        >
          <Label className="flex gap-x-1 my-2 items-center">
            <button
              onClick={() => {
                setIsOpen(!isOpen)
                // reset local error when reopening input
                setLocalError(null)
              }}
              type="button"
              className="font-medium text-[#43372f] hover:text-[#2a221e] transition-colors duration-150 ease-in-out"
              data-testid="add-discount-button"
            >
              Add Promotion Code(s)
            </button>
          </Label>

          {isOpen && (
            <>
              <div className="flex w-full gap-x-2">
                <Input
                  className="size-full border-[#e2d9cf] rounded-md focus:border-[#43372f] transition-all duration-150 ease-in-out"
                  id="promotion-input"
                  name="code"
                  type="text"
                  autoFocus={false}
                  ref={inputRef}
                  data-testid="discount-input"
                />
                <SubmitButton
                  variant="secondary"
                  className="bg-[var(--color-luxury-gold)] hover:bg-[var(--color-luxury-darkgold)] text-white border-none px-4 py-2 rounded-md"
                  data-testid="discount-apply-button"
                >
                  Apply
                </SubmitButton>
              </div>

              {/* Server-returned error takes precedence */}
              <ErrorMessage
                error={message || localError}
                data-testid="discount-error-message"
              />
              {showSuccess && !message && (
                <div className="mt-4 flex items-start gap-2 rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-800" role="alert">
                  <span>Promotion applied successfully!</span>
                </div>
              )}
            </>
          )}
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="font-medium text-[#43372f] text-base mb-2">
                Promotion(s) applied:
              </Heading>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <Text className="flex gap-x-1 items-baseline text-sm w-4/5 pr-1">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          color={promotion.is_automatic ? "green" : "grey"}
                          size="small"
                          className="bg-[#f3efe9] text-[#43372f] border-[#e2d9cf]"
                        >
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined && (
                            <>
                              {promotion.application_method.type ===
                              "percentage"
                                ? `${promotion.application_method.value}%`
                                : convertToLocale({
                                    amount:
                                      typeof promotion.application_method
                                        .value === "string"
                                        ? parseInt(
                                            promotion.application_method.value
                                          )
                                        : promotion.application_method.value,
                                    currency_code:
                                      promotion.application_method
                                        .currency_code,
                                  })}
                            </>
                          )}
                        )
                      </span>
                    </Text>
                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center text-[#9b8b7e] hover:text-[#43372f] transition-colors duration-150 ease-in-out"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">
                          Remove discount code from order
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
