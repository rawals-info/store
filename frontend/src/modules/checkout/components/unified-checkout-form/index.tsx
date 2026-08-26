"use client"

import { setAddressesSinglePage } from "@lib/actions/cart"
import { setShippingMethod, initiatePaymentSession } from "@lib/data/cart"
import { isStripe as isStripeFunc, paymentInfoMap, isPaypal as isPaypalFunc } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { RadioGroup, Radio } from "@headlessui/react"
import Input from "@modules/common/components/input"
import AddressAutocomplete from "@modules/common/components/address-autocomplete"
import MedusaRadio from "@modules/common/components/radio"
import PaymentContainer, { StripeCardContainer } from "@modules/checkout/components/payment-container"
import PayPalContainer from "@modules/checkout/components/paypal-container"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentButton from "@modules/checkout/components/payment-button"
import DiscountCode from "@modules/checkout/components/discount-code"
import { useState, useEffect } from "react"
import { MapPin, CreditCard, Check, ArrowRight, ArrowLeft, ShieldCheck, Lock, Sparkles, Truck } from "lucide-react"

interface UnifiedCheckoutFormProps {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  availableShippingMethods: HttpTypes.StoreCartShippingOption[]
  availablePaymentMethods: any[]
}

export default function UnifiedCheckoutForm({
  cart,
  customer,
  availableShippingMethods,
  availablePaymentMethods,
}: UnifiedCheckoutFormProps) {
  // Form states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formTouched, setFormTouched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Address states
  const [searchAddress, setSearchAddress] = useState(cart?.shipping_address?.address_1 || "")
  const [addressSelected, setAddressSelected] = useState(Boolean(cart?.shipping_address?.address_1))
  const [autoFields, setAutoFields] = useState({
    address_1: cart?.shipping_address?.address_1 || "",
    city: cart?.shipping_address?.city || "",
    postal_code: cart?.shipping_address?.postal_code || "",
    province: cart?.shipping_address?.province || "",
    phone: cart?.shipping_address?.phone || "+91",
  })

  // Shipping states
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(
    cart.shipping_methods?.at(-1)?.shipping_option_id || ""
  )

  // Payment states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [cardComplete, setCardComplete] = useState(false)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cartUpdated, setCartUpdated] = useState(cart)
  const [currentSection, setCurrentSection] = useState<1 | 2>(1)

  useEffect(() => {
    const handleCartUpdate = () => {
      window.location.reload()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("cartUpdated", handleCartUpdate)
      return () => window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  const shippingMethods = availableShippingMethods
    ?.filter((sm: any) => sm.service_zone?.fulfillment_set?.type !== "pickup")
    ?.filter((sm: any) => sm.name.toLowerCase() !== "express shipping")

  useEffect(() => {
    if (shippingMethods?.length === 1 && !selectedShippingMethod) {
      setSelectedShippingMethod(shippingMethods[0].id)
    }
  }, [shippingMethods, selectedShippingMethod])

  const formatPhoneNumber = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, "")
    if (!cleaned.startsWith("+91")) {
      if (cleaned.startsWith("91")) {
        cleaned = "+" + cleaned
      } else if (cleaned.startsWith("+")) {
        cleaned = "+91" + cleaned.slice(1)
      } else {
        cleaned = "+91" + cleaned
      }
    }
    const digitsOnly = cleaned.slice(3).replace(/\D/g, "")
    const limitedDigits = digitsOnly.slice(0, 10)
    return "+91" + (limitedDigits ? " " + limitedDigits : "")
  }

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "shipping_address.first_name":
        return !value.trim() ? "First name is required" : ""
      case "shipping_address.last_name":
        return !value.trim() ? "Last name is required" : ""
      case "email":
        return !value.trim() ? "Email is required" : !/\S+@\S+\.\S+/.test(value) ? "Please enter a valid email address" : ""
      case "shipping_address.phone":
        const digits = value.replace(/\D/g, "")
        if (!value.trim() || digits === "" || digits === "91") {
          return "Phone number is required for courier delivery updates"
        }
        if (digits.length < 10 || (digits.startsWith("91") && digits.length < 12)) {
          return "Please enter a valid 10-digit mobile number"
        }
        return ""
      case "shipping_address.address_1":
        return !value.trim() ? "Complete street address is required" : ""
      case "shipping_address.city":
        return !value.trim() ? "City is required" : ""
      case "shipping_address.postal_code":
        return !value.trim() ? "6-digit PIN code is required" : !/^\d{6}$/.test(value.trim()) ? "Please enter a valid 6-digit PIN code" : ""
      default:
        return ""
    }
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setFormErrors(prev => {
      const updated = { ...prev }
      if (!error) {
        delete updated[name]
      } else {
        updated[name] = error
      }
      return updated
    })
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const errors: Record<string, string> = {}

    // Required fields to guarantee complete check
    const requiredFields = [
      "shipping_address.first_name",
      "shipping_address.last_name",
      "email",
      "shipping_address.phone",
      "shipping_address.address_1",
      "shipping_address.city",
      "shipping_address.postal_code",
    ]

    for (const field of requiredFields) {
      const val = (formData.get(field) as string) || ""
      const error = validateField(field, val)
      if (error) errors[field] = error
    }

    if (!selectedShippingMethod && shippingMethods && shippingMethods.length > 0) {
      errors["shipping"] = "Please select a delivery speed option"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      const firstErrorMessage = Object.values(errors)[0]
      setError(`Please complete all required fields: ${firstErrorMessage}`)
      setIsSubmitting(false)
      setFormTouched(true)

      // Auto-focus and scroll to first invalid field
      const firstField = Object.keys(errors)[0]
      setTimeout(() => {
        const inputElem = document.querySelector(`[name="${firstField}"]`) as HTMLInputElement | null
        if (inputElem) {
          inputElem.focus()
          inputElem.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 50)
      return
    }

    try {
      const addressResult = await setAddressesSinglePage(formData)
      if (addressResult && !addressResult.success) {
        throw new Error(addressResult.error || "Failed to update address")
      }

      if (selectedShippingMethod) {
        await setShippingMethod({ cartId: cart.id, shippingMethodId: selectedShippingMethod })
      }

      const defaultPaymentProvider = availablePaymentMethods?.find(
        (pm: any) => pm.id === "pp_system_default" || isStripeFunc(pm.id)
      )?.id || availablePaymentMethods?.[0]?.id || "manual"

      const paymentResponse = await initiatePaymentSession(cart, {
        provider_id: defaultPaymentProvider,
      })

      const updatedCart = {
        ...cart,
        shipping_address: {
          first_name: formData.get("shipping_address.first_name") as string,
          last_name: formData.get("shipping_address.last_name") as string,
          address_1: formData.get("shipping_address.address_1") as string,
          address_2: formData.get("shipping_address.address_2") as string,
          city: formData.get("shipping_address.city") as string,
          postal_code: formData.get("shipping_address.postal_code") as string,
          province: formData.get("shipping_address.province") as string,
          phone: formData.get("shipping_address.phone") as string,
          country_code: "in",
        } as any,
        email: formData.get("email") as string,
        payment_collection: paymentResponse.payment_collection,
      } as any

      setCartUpdated(updatedCart)
      setSelectedPaymentMethod(defaultPaymentProvider)
      setIsSubmitting(false)
      setCurrentSection(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: any) {
      setError(err.message || "Failed to process checkout. Please try again.")
      setIsSubmitting(false)
    }

    setFormTouched(true)
  }

  return (
    <div className="space-y-6">
      {/* 2-Step Progress Header */}
      <div className="bg-white rounded-2xl border border-amber-100/90 p-4 shadow-xs">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCurrentSection(1)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${currentSection === 1
                ? "bg-amber-50 border-2 border-petha-amber text-amber-950 font-bold"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentSection === 1 ? "bg-petha-amber text-white" : "bg-emerald-600 text-white"
              }`}>
              {currentSection === 2 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div>
              <p className="text-xs font-jakarta uppercase tracking-wider text-slate-400">Step 1</p>
              <h4 className="text-xs sm:text-sm font-jakarta font-bold">Delivery Address</h4>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (addressSelected) setCurrentSection(2)
            }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${currentSection === 2
                ? "bg-amber-50 border-2 border-petha-amber text-amber-950 font-bold"
                : "bg-slate-50 text-slate-400 border border-slate-200"
              }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentSection === 2 ? "bg-petha-amber text-white" : "bg-slate-300 text-slate-600"
              }`}>
              2
            </div>
            <div>
              <p className="text-xs font-jakarta uppercase tracking-wider text-slate-400">Step 2</p>
              <h4 className="text-xs sm:text-sm font-jakarta font-bold">Payment &amp; Place Order</h4>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 1: Shipping & Delivery */}
      {currentSection === 1 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-amber-100/90 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-jakarta font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-petha-amber" />
              <span>Nationwide Fresh Delivery</span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900">
              Shipping &amp; Customer Details
            </h2>
            <p className="font-jakarta text-xs sm:text-sm text-slate-600 mt-1">
              Where should we send your fresh Agra sweets?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="same_as_billing" value="on" />

            {/* Customer & Address Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="shipping_address.first_name"
                  autoComplete="given-name"
                  defaultValue={cart?.shipping_address?.first_name || ""}
                  required
                  errors={formErrors}
                  onChange={handleFieldChange}
                />
                <Input
                  label="Last Name"
                  name="shipping_address.last_name"
                  autoComplete="family-name"
                  defaultValue={cart?.shipping_address?.last_name || ""}
                  required
                  errors={formErrors}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address (for order tracking)"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={cart?.email || customer?.email || ""}
                  required
                  errors={formErrors}
                  onChange={handleFieldChange}
                />

                <Input
                  label="Mobile Number (+91 XXXXXXXXXX)"
                  name="shipping_address.phone"
                  autoComplete="tel"
                  type="tel"
                  value={autoFields.phone}
                  required
                  errors={formErrors}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    handleFieldChange({ ...e, target: { ...e.target, value: formatted } })
                    setAutoFields({ ...autoFields, phone: formatted })
                  }}
                />
              </div>

              {/* Google Address Autocomplete */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                <span className="font-jakarta text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
                  Quick Google Address Search:
                </span>
                <AddressAutocomplete
                  label="Search area, building or colony..."
                  name="search_address"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onSelect={(details: any) => {
                    setSearchAddress(details.address_1)
                    setAutoFields(prev => ({
                      ...prev,
                      address_1: details.address_1 || "",
                      city: details.city || "",
                      postal_code: details.postal_code || "",
                      province: details.province || "",
                    }))
                    setAddressSelected(true)
                  }}
                />
              </div>

              <div className="space-y-4 pt-2">
                <Input
                  label="Complete House / Flat / Street Address"
                  name="shipping_address.address_1"
                  autoComplete="address-line1"
                  value={autoFields.address_1}
                  required
                  errors={formErrors}
                  onChange={(e) => {
                    handleFieldChange(e)
                    setAutoFields({ ...autoFields, address_1: e.target.value })
                  }}
                />
                <Input
                  label="Landmark / Apartment / Suite (Optional)"
                  name="shipping_address.address_2"
                  autoComplete="address-line2"
                  defaultValue={cart?.shipping_address?.address_2 || ""}
                  errors={formErrors}
                  onChange={handleFieldChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="shipping_address.city"
                    autoComplete="address-level2"
                    value={autoFields.city}
                    required
                    errors={formErrors}
                    onChange={(e) => {
                      handleFieldChange(e)
                      setAutoFields({ ...autoFields, city: e.target.value })
                    }}
                  />
                  <Input
                    label="6-Digit PIN Code"
                    name="shipping_address.postal_code"
                    autoComplete="postal-code"
                    value={autoFields.postal_code}
                    required
                    errors={formErrors}
                    onChange={(e) => {
                      handleFieldChange(e)
                      setAutoFields({ ...autoFields, postal_code: e.target.value })
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="State / Region"
                    name="shipping_address.province"
                    autoComplete="address-level1"
                    value={autoFields.province}
                    errors={formErrors}
                    onChange={(e) => {
                      handleFieldChange(e)
                      setAutoFields({ ...autoFields, province: e.target.value })
                    }}
                  />
                  <Input
                    label="Country"
                    name="country_display"
                    value="India (Nationwide)"
                    disabled
                    className="text-slate-500 bg-slate-100 cursor-not-allowed"
                  />
                  <input type="hidden" name="shipping_address.country_code" value="in" />
                </div>
              </div>
            </div>

            {/* Delivery Method Selection */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-jakarta text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-petha-amber" />
                Select Delivery Speed
              </h3>

              <RadioGroup value={selectedShippingMethod} onChange={setSelectedShippingMethod}>
                <div className="space-y-3">
                  {shippingMethods?.map((method: any) => (
                    <Radio
                      key={method.id}
                      value={method.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${method.id === selectedShippingMethod
                          ? "border-2 border-petha-amber bg-amber-50/70 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <MedusaRadio checked={method.id === selectedShippingMethod} />
                        <div>
                          <span className="font-jakarta font-bold text-slate-900 text-sm block">
                            {method.name}
                          </span>
                          <span className="text-xs text-slate-500 font-jakarta">
                            Dispatched via Air Express in temperature-sealed packaging
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {convertToLocale({
                          amount: method.amount!,
                          currency_code: cart?.currency_code,
                        })}
                      </span>
                    </Radio>
                  ))}
                </div>
              </RadioGroup>
              {formErrors.shipping && (
                <p className="text-rose-600 text-xs font-bold font-jakarta">{formErrors.shipping}</p>
              )}
            </div>

            <ErrorMessage error={error} />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-petha-amber hover:bg-petha-saffron text-white py-4 px-6 rounded-2xl font-jakarta font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Continue to Secure Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* SECTION 2: Payment & Final Order Confirmation */}
      {currentSection === 2 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-amber-100/90 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-jakarta font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step 2 · 100% Encrypted Checkout</span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900">
              Payment Method &amp; Confirmation
            </h2>
            <p className="font-jakarta text-xs sm:text-sm text-slate-600 mt-1">
              Select your preferred payment option below.
            </p>
          </div>

          <div className="space-y-6">
            {/* Delivery address mini-recap */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-jakarta">
              <div>
                <span className="text-slate-500 block">Delivering to:</span>
                <span className="font-bold text-slate-800">
                  {cartUpdated.shipping_address?.first_name} {cartUpdated.shipping_address?.last_name} · {cartUpdated.shipping_address?.city}, {cartUpdated.shipping_address?.postal_code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentSection(1)}
                className="text-petha-amber font-bold hover:underline cursor-pointer"
              >
                Edit Address
              </button>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <h3 className="font-jakarta text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-petha-amber" />
                Select Payment Method
              </h3>

              {availablePaymentMethods?.length ? (
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={setSelectedPaymentMethod}
                >
                  <div className="space-y-3">
                    {availablePaymentMethods.map((paymentMethod) => (
                      <div key={paymentMethod.id}>
                        {isStripeFunc(paymentMethod.id) ? (
                          <StripeCardContainer
                            paymentProviderId={paymentMethod.id}
                            selectedPaymentOptionId={selectedPaymentMethod}
                            paymentInfoMap={paymentInfoMap}
                            setCardBrand={setCardBrand}
                            setError={setError}
                            setCardComplete={setCardComplete}
                          />
                        ) : isPaypalFunc(paymentMethod.id) ? (
                          <PayPalContainer
                            cart={cartUpdated}
                            paymentProviderId={paymentMethod.id}
                            selectedPaymentOptionId={selectedPaymentMethod}
                            paymentInfoMap={paymentInfoMap}
                          />
                        ) : (
                          <PaymentContainer
                            paymentInfoMap={paymentInfoMap}
                            paymentProviderId={paymentMethod.id}
                            selectedPaymentOptionId={selectedPaymentMethod}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-jakarta text-amber-900">
                  Standard direct payment gateway initialized.
                </div>
              )}
            </div>

            {/* Terms confirmation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-jakarta">
              By placing your order, you agree to Taj Petha's{" "}
              <a href="/terms" className="text-petha-amber underline font-semibold">Terms of Service</a> and{" "}
              <a href="/privacy" className="text-petha-amber underline font-semibold">Privacy Policy</a>. All orders are packed fresh in Agra.
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentSection(1)}
                className="flex items-center gap-1.5 text-xs font-jakarta font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Shipping
              </button>

              <div className="w-full sm:w-auto">
                <PaymentButton
                  cart={cartUpdated}
                  data-testid="submit-order-button"
                  className="w-full sm:w-auto bg-petha-amber hover:bg-petha-saffron text-white py-4 px-8 rounded-2xl font-jakarta font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}