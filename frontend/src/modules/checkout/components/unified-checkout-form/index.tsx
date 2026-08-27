"use client"

import { setAddressesSinglePage } from "@lib/actions/cart"
import { setShippingMethod, initiatePaymentSession } from "@lib/data/cart"
import { isStripe as isStripeFunc, paymentInfoMap, isPaypal as isPaypalFunc, isRazorpay as isRazorpayFunc } from "@lib/constants"
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
import { useState, useEffect } from "react"
import { MapPin, CreditCard, Check, ArrowRight, ArrowLeft, ShieldCheck, Lock, Sparkles, Truck, Phone, Mail, User, Building } from "lucide-react"

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
  const [isSwitchingPayment, setIsSwitchingPayment] = useState(false)
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

  // Shipping methods filter
  const shippingMethods = availableShippingMethods
    ?.filter((sm: any) => sm.service_zone?.fulfillment_set?.type !== "pickup")
    ?.filter((sm: any) => sm.name.toLowerCase() !== "express shipping")

  // Shipping states
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(
    cart.shipping_methods?.at(-1)?.shipping_option_id || shippingMethods?.[0]?.id || ""
  )

  // Initial payment provider detection
  const initialProvider = 
    cart.payment_collection?.payment_sessions?.[0]?.provider_id ||
    availablePaymentMethods?.find((pm: any) => isRazorpayFunc(pm.id) || isStripeFunc(pm.id) || pm.id === "pp_system_default")?.id ||
    availablePaymentMethods?.[0]?.id ||
    "pp_system_default"

  // Payment states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(initialProvider)
  const [cardComplete, setCardComplete] = useState(false)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cartUpdated, setCartUpdated] = useState(cart)
  const [currentSection, setCurrentSection] = useState<1 | 2>(1)

  useEffect(() => {
    setCartUpdated(cart)
  }, [cart])

  useEffect(() => {
    const handleCartUpdate = (e: CustomEvent) => {
      if (e.detail?.cart) {
        setCartUpdated(e.detail.cart)
      }
    }
    window.addEventListener("cartUpdated" as any, handleCartUpdate)
    return () => window.removeEventListener("cartUpdated" as any, handleCartUpdate)
  }, [])

  const currentItemsSubtotal = (cartUpdated?.item_subtotal ?? ((cartUpdated?.subtotal ?? 0) - (cartUpdated?.shipping_subtotal ?? 0)))
  const currentDiscount = cartUpdated?.discount_total || 0
  const currentNetItemsTotal = Math.max(0, currentItemsSubtotal - currentDiscount)
  const isFreeShippingUnlocked = currentNetItemsTotal >= 500

  const handleShippingMethodChange = (methodId: string) => {
    setSelectedShippingMethod(methodId)
    const activeShippingOption = shippingMethods?.find((m: any) => m.id === methodId)
    const shippingAmount = isFreeShippingUnlocked ? 0 : 89
    const netTotal = currentNetItemsTotal + shippingAmount

    const liveUpdatedCart: HttpTypes.StoreCart = {
      ...cartUpdated,
      shipping_subtotal: shippingAmount,
      shipping_total: shippingAmount,
      total: netTotal,
      shipping_methods: [
        {
          id: methodId,
          shipping_option_id: methodId,
          amount: shippingAmount,
          name: activeShippingOption?.name || "Standard Shipping",
        } as any,
      ],
    }
    setCartUpdated(liveUpdatedCart)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart: liveUpdatedCart } }))
    }
  }

  useEffect(() => {
    if (shippingMethods?.length === 1 && !selectedShippingMethod) {
      handleShippingMethodChange(shippingMethods[0].id)
    }
  }, [shippingMethods, selectedShippingMethod, isFreeShippingUnlocked])

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
      case "shipping_address.phone": {
        const digits = value.replace(/\D/g, "")
        if (!value.trim() || digits === "" || digits === "91") {
          return "Phone number is required for courier delivery updates"
        }
        if (digits.length < 10 || (digits.startsWith("91") && digits.length < 12)) {
          return "Please enter a valid 10-digit mobile number"
        }
        return ""
      }
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
    const fieldError = validateField(name, value)
    setFormErrors(prev => {
      const updated = { ...prev }
      if (!fieldError) {
        delete updated[name]
      } else {
        updated[name] = fieldError
      }
      return updated
    })
    if (fieldError) {
      setError(null)
    }
  }

  const handlePaymentMethodChange = async (providerId: string) => {
    setSelectedPaymentMethod(providerId)
    setError(null)
    setIsSwitchingPayment(true)

    try {
      const response = await initiatePaymentSession(cartUpdated, {
        provider_id: providerId,
      })

      if (response?.payment_collection) {
        setCartUpdated((prev: any) => ({
          ...prev,
          payment_collection: response.payment_collection,
        }))
      }
    } catch (err: any) {
      console.error("Failed to update payment method session:", err)
      setError(err.message || "Failed to switch payment method. Please try again.")
    } finally {
      setIsSwitchingPayment(false)
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
      const fieldError = validateField(field, val)
      if (fieldError) errors[field] = fieldError
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
      // 1. Save Addresses via Server Action
      const addressResult = await setAddressesSinglePage(formData)
      if (addressResult && !addressResult.success) {
        throw new Error(addressResult.error || "Failed to update address")
      }

      // 2. Set Shipping Method
      if (selectedShippingMethod) {
        await setShippingMethod({ cartId: cart.id, shippingMethodId: selectedShippingMethod })
      }

      // 3. Determine and Initiate Payment Session
      const chosenProvider = selectedPaymentMethod || initialProvider
      let paymentCollection = (cartUpdated?.payment_collection || cart.payment_collection)
      try {
        const paymentResponse = await initiatePaymentSession(cartUpdated || cart, {
          provider_id: chosenProvider,
        })
        if (paymentResponse?.payment_collection) {
          paymentCollection = paymentResponse.payment_collection
        }
      } catch (payErr: any) {
        console.warn("[handleSubmit] Payment session warning:", payErr?.message)
      }

      // 4. Construct complete updated cart object with all addresses & methods set
      const updatedAddress = {
        first_name: (formData.get("shipping_address.first_name") as string) || "",
        last_name: (formData.get("shipping_address.last_name") as string) || "",
        address_1: (formData.get("shipping_address.address_1") as string) || "",
        address_2: (formData.get("shipping_address.address_2") as string) || "",
        city: (formData.get("shipping_address.city") as string) || "",
        postal_code: (formData.get("shipping_address.postal_code") as string) || "",
        province: (formData.get("shipping_address.province") as string) || "",
        phone: (formData.get("shipping_address.phone") as string) || "",
        country_code: "in",
      }

      const activeShippingOption = shippingMethods?.find((m: any) => m.id === selectedShippingMethod)
      const itemsSubtotal = (cartUpdated?.item_subtotal ?? ((cartUpdated?.subtotal ?? 0) - (cartUpdated?.shipping_subtotal ?? 0)))
      const discount = cartUpdated?.discount_total || 0
      const netItemsTotal = Math.max(0, itemsSubtotal - discount)
      const shippingAmount = netItemsTotal >= 500 ? 0 : 89
      const netTotal = netItemsTotal + shippingAmount

      const updatedCart: HttpTypes.StoreCart = {
        ...cartUpdated,
        shipping_subtotal: shippingAmount,
        shipping_total: shippingAmount,
        total: netTotal,
        shipping_address: updatedAddress as any,
        billing_address: updatedAddress as any,
        email: formData.get("email") as string,
        shipping_methods: selectedShippingMethod
          ? [
              {
                id: selectedShippingMethod,
                shipping_option_id: selectedShippingMethod,
                amount: shippingAmount,
                name: activeShippingOption?.name || "Standard Shipping",
              } as any,
            ]
          : cartUpdated?.shipping_methods || [],
        payment_collection: paymentCollection as any,
      }

      setCartUpdated(updatedCart)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart: updatedCart } }))
      }
      setSelectedPaymentMethod(chosenProvider)
      setAddressSelected(true)
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
      {/* 2-Step Interactive Header */}
      <div className="bg-white rounded-3xl border border-amber-100/90 p-3.5 sm:p-4 shadow-xs">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCurrentSection(1)}
            className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all cursor-pointer text-left ${
              currentSection === 1
                ? "bg-amber-50/90 border-2 border-petha-amber text-amber-950 font-bold shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                currentSection === 1
                  ? "bg-petha-amber text-white shadow-sm"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {currentSection === 2 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div>
              <p className="text-[11px] font-jakarta uppercase tracking-wider text-slate-400 font-semibold">Step 1</p>
              <h4 className="text-xs sm:text-sm font-jakarta font-bold text-slate-900">Delivery Address</h4>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (addressSelected) setCurrentSection(2)
            }}
            disabled={!addressSelected}
            className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left ${
              currentSection === 2
                ? "bg-amber-50/90 border-2 border-petha-amber text-amber-950 font-bold shadow-xs cursor-pointer"
                : addressSelected
                ? "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                : "bg-slate-50/60 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-75"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentSection === 2
                  ? "bg-petha-amber text-white shadow-sm"
                  : addressSelected
                  ? "bg-slate-300 text-slate-700"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              2
            </div>
            <div>
              <p className="text-[11px] font-jakarta uppercase tracking-wider text-slate-400 font-semibold">Step 2</p>
              <h4 className="text-xs sm:text-sm font-jakarta font-bold">Payment &amp; Confirmation</h4>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 1: Shipping & Delivery */}
      {currentSection === 1 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-amber-100/90 space-y-8 animate-fadeIn">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-jakarta font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-petha-amber" />
              <span>Nationwide Fresh Delivery</span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900">
              Shipping &amp; Customer Details
            </h2>
            <p className="font-jakarta text-xs sm:text-sm text-slate-600 mt-1">
              Where should we send your authentic Agra sweets?
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
                  label="Email Address (for order receipt & dispatch tracking)"
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
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
                <span className="font-jakarta text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
                    Quick Address Autocomplete:
                  </span>
                  <span className="text-[11px] font-medium text-amber-800/80 normal-case">
                    (Optional)
                  </span>
                </span>
                <AddressAutocomplete
                  label="Search area, apartment, colony, or landmark... (Optional)"
                  name="search_address"
                  required={false}
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
                  label="Complete Flat / House No. / Street Address"
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
                  label="Landmark / Suite / Floor (Optional)"
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
                    label="State / Province"
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
                    className="text-slate-500 bg-slate-100 cursor-not-allowed font-medium"
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

              <RadioGroup value={selectedShippingMethod} onChange={handleShippingMethodChange}>
                <div className="space-y-3">
                  {shippingMethods?.map((method: any) => (
                    <Radio
                      key={method.id}
                      value={method.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        method.id === selectedShippingMethod
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
                        {isFreeShippingUnlocked ? "₹0 (Free)" : "₹89.00"}
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
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving &amp; Initializing Payment...</span>
                </div>
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
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-amber-100/90 space-y-8 animate-fadeIn">
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
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-jakarta">
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px] block">Delivering to</span>
                <span className="font-bold text-slate-900 text-sm block">
                  {cartUpdated.shipping_address?.first_name} {cartUpdated.shipping_address?.last_name}
                </span>
                <span className="text-slate-600 block">
                  {cartUpdated.shipping_address?.address_1}
                  {cartUpdated.shipping_address?.address_2 ? `, ${cartUpdated.shipping_address?.address_2}` : ""},{" "}
                  {cartUpdated.shipping_address?.city}, {cartUpdated.shipping_address?.postal_code}
                </span>
                <span className="text-slate-500 font-mono block">
                  {cartUpdated.shipping_address?.phone} · {cartUpdated.email}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentSection(1)}
                className="self-start sm:self-center text-petha-amber font-bold hover:underline cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60"
              >
                <span>Edit Address</span>
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
                  onChange={handlePaymentMethodChange}
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

            {isSwitchingPayment && (
              <div className="flex items-center gap-2 text-xs font-jakarta text-petha-amber font-medium">
                <div className="w-4 h-4 border-2 border-petha-amber border-t-transparent rounded-full animate-spin" />
                <span>Updating payment provider...</span>
              </div>
            )}

            <ErrorMessage error={error} />

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