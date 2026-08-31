"use client"

import { setAddressesSinglePage } from "@lib/actions/cart"
import { setShippingMethod, initiatePaymentSession, placeOrder } from "@lib/data/cart"
import { isStripe as isStripeFunc, paymentInfoMap, isPaypal as isPaypalFunc, isRazorpay as isRazorpayFunc } from "@lib/constants"
import { formatIndianPrice } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { RadioGroup, Radio } from "@headlessui/react"
import Input from "@modules/common/components/input"
import MedusaRadio from "@modules/common/components/radio"
import PaymentContainer, { StripeCardContainer } from "@modules/checkout/components/payment-container"
import PayPalContainer from "@modules/checkout/components/paypal-container"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { MapPin, CreditCard, Check, ArrowRight, ShieldCheck, Lock, Sparkles, Truck, Phone, Mail, User, Building, QrCode, Zap, AlertCircle } from "lucide-react"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay"
import AddressAutocomplete from "@modules/common/components/address-autocomplete"

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
  const [isPinLoading, setIsPinLoading] = useState(false)
  const [searchAddress, setSearchAddress] = useState(cart?.shipping_address?.address_1 || "")
  const [error, setError] = useState<string | null>(null)

  // Customer Name State (Unified Full Name)
  const initialFullName = [
    cart?.shipping_address?.first_name || customer?.first_name || "",
    cart?.shipping_address?.last_name || customer?.last_name || "",
  ].filter(Boolean).join(" ")

  const [fullName, setFullName] = useState(initialFullName)
  const [email, setEmail] = useState(cart?.email || customer?.email || "")

  // Address states
  const [autoFields, setAutoFields] = useState({
    address_1: cart?.shipping_address?.address_1 || "",
    address_2: cart?.shipping_address?.address_2 || "",
    city: cart?.shipping_address?.city || "",
    postal_code: cart?.shipping_address?.postal_code || "",
    province: cart?.shipping_address?.province || "",
    phone: cart?.shipping_address?.phone || customer?.phone || "+91",
  })

  // Shipping methods filter
  const shippingMethods = availableShippingMethods
    ?.filter((sm: any) => sm.service_zone?.fulfillment_set?.type !== "pickup")
    ?.filter((sm: any) => sm.name.toLowerCase() !== "express shipping")

  const [selectedShippingMethod, setSelectedShippingMethod] = useState(
    cart.shipping_methods?.at(-1)?.shipping_option_id || shippingMethods?.[0]?.id || ""
  )

  // Payment states
  const initialProvider =
    cart.payment_collection?.payment_sessions?.[0]?.provider_id ||
    availablePaymentMethods?.find((pm: any) => isRazorpayFunc(pm.id) || isStripeFunc(pm.id) || pm.id === "pp_system_default")?.id ||
    availablePaymentMethods?.[0]?.id ||
    "pp_system_default"

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(initialProvider)
  const [cardComplete, setCardComplete] = useState(false)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cartUpdated, setCartUpdated] = useState(cart)

  // Razorpay Hook
  const { Razorpay } = useRazorpay()

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

  const currentItemsSubtotal = (cartUpdated?.item_subtotal ?? (cartUpdated?.subtotal ?? 0))
  const currentDiscount = cartUpdated?.discount_total || 0
  const currentNetItemsTotal = Math.max(0, currentItemsSubtotal - currentDiscount)
  const isFreeShippingUnlocked = currentNetItemsTotal >= 500

  // Live shipping calculation
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

  // Phone Formatter
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

  // Instant PIN Code Autofill
  const handlePinCodeChange = async (pin: string) => {
    const cleanPin = pin.replace(/\D/g, "").slice(0, 6)
    setAutoFields((prev) => ({ ...prev, postal_code: cleanPin }))

    if (cleanPin.length === 6) {
      setIsPinLoading(true)
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`)
        const data = await res.json()
        if (data?.[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0]
          setAutoFields((prev) => ({
            ...prev,
            postal_code: cleanPin,
            city: po.District || po.Block || po.Circle || prev.city,
            province: po.State || prev.province,
          }))
          // Clear error
          setFormErrors((prev) => {
            const updated = { ...prev }
            delete updated["postal_code"]
            delete updated["city"]
            delete updated["province"]
            return updated
          })
        }
      } catch (err) {
        console.error("PIN lookup error:", err)
      } finally {
        setIsPinLoading(false)
      }
    }
  }

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!fullName.trim()) {
      errors["fullName"] = "Please enter your full name"
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errors["email"] = "Please enter a valid email for order tracking"
    }

    const phoneDigits = autoFields.phone.replace(/\D/g, "")
    if (!phoneDigits || phoneDigits.length < 10) {
      errors["phone"] = "Please enter a valid 10-digit mobile number"
    }

    if (!autoFields.postal_code || !/^\d{6}$/.test(autoFields.postal_code)) {
      errors["postal_code"] = "Please enter a valid 6-digit PIN code"
    }

    if (!autoFields.address_1.trim()) {
      errors["address_1"] = "Please enter your house/flat no. and street address"
    }

    if (!autoFields.city.trim()) {
      errors["city"] = "Please enter your city"
    }

    if (!autoFields.province.trim()) {
      errors["province"] = "Please enter your state"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Payment Method Switch
  const handlePaymentMethodChange = async (providerId: string) => {
    setSelectedPaymentMethod(providerId)
    setError(null)
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
      console.error("Payment session initialization error:", err)
    }
  }

  // Primary 1-Tap Checkout Handler
  const handleExpressCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)

    if (!validateForm()) {
      // Scroll to top of form
      const el = document.getElementById("checkout-form-top")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      return
    }

    setIsSubmitting(true)

    try {
      // Split full name into first and last name
      const nameParts = fullName.trim().split(" ")
      const firstName = nameParts[0] || "Customer"
      const lastName = nameParts.slice(1).join(" ") || nameParts[0] || "Customer"

      // 1. Build and Submit Address
      const formData = new FormData()
      formData.append("email", email.trim())
      formData.append("shipping_address.first_name", firstName)
      formData.append("shipping_address.last_name", lastName)
      formData.append("shipping_address.address_1", autoFields.address_1.trim())
      formData.append("shipping_address.address_2", autoFields.address_2.trim())
      formData.append("shipping_address.city", autoFields.city.trim())
      formData.append("shipping_address.province", autoFields.province.trim())
      formData.append("shipping_address.postal_code", autoFields.postal_code.trim())
      formData.append("shipping_address.phone", autoFields.phone.trim())
      formData.append("shipping_address.country_code", "in")

      formData.append("billing_address.first_name", firstName)
      formData.append("billing_address.last_name", lastName)
      formData.append("billing_address.address_1", autoFields.address_1.trim())
      formData.append("billing_address.address_2", autoFields.address_2.trim())
      formData.append("billing_address.city", autoFields.city.trim())
      formData.append("billing_address.province", autoFields.province.trim())
      formData.append("billing_address.postal_code", autoFields.postal_code.trim())
      formData.append("billing_address.phone", autoFields.phone.trim())
      formData.append("billing_address.country_code", "in")

      if (selectedShippingMethod) {
        formData.append("shipping_method_id", selectedShippingMethod)
      }

      await setAddressesSinglePage(formData)

      // 2. Ensure Shipping Method is Applied
      if (selectedShippingMethod) {
        await setShippingMethod({
          cartId: cartUpdated.id,
          shippingMethodId: selectedShippingMethod,
        }).catch(() => null)
      }

      // 3. Initiate Payment Session
      const sessionRes = await initiatePaymentSession(cartUpdated, {
        provider_id: selectedPaymentMethod,
      })

      const paymentSession =
        sessionRes?.payment_collection?.payment_sessions?.find((s: any) => s.provider_id === selectedPaymentMethod) ||
        sessionRes?.payment_collection?.payment_sessions?.[0]

      // 4. Trigger Payment Gateway
      if (isRazorpayFunc(selectedPaymentMethod)) {
        const orderData = (paymentSession?.data as any) || {}
        const razorpayOrderId = orderData?.razorpayOrder?.id || orderData?.id || orderData?.order_id

        if (!razorpayOrderId) {
          // Fallback direct place order
          await placeOrder()
          return
        }

        const unlockScroll = () => {
          if (typeof document !== "undefined") {
            document.body.style.overflow = ""
            document.body.style.position = ""
            document.body.style.height = ""
            document.body.style.width = ""
            document.documentElement.style.overflow = ""
            document.documentElement.style.position = ""
            document.documentElement.style.height = ""
          }
        }

        const options: RazorpayOrderOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || "",
          callback_url: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/razorpay/hooks`,
          amount: paymentSession?.amount || Math.round((currentNetItemsTotal + (isFreeShippingUnlocked ? 0 : 89)) * 100),
          order_id: razorpayOrderId,
          currency: "INR",
          name: "Taj Petha Agra",
          description: "Fresh Agra Sweets Order",
          image: "https://tajpetha.in/logo.webp",
          modal: {
            backdropclose: true,
            escape: true,
            handleback: true,
            confirm_close: false,
            ondismiss: () => {
              setIsSubmitting(false)
              unlockScroll()
              setTimeout(unlockScroll, 50)
              setTimeout(unlockScroll, 300)
            },
            animation: true,
          },
          handler: async () => {
            setIsSubmitting(true)
            await placeOrder().catch((err) => {
              setError("Payment received. Finalizing your order...")
              setIsSubmitting(false)
              unlockScroll()
            })
          },
          prefill: {
            name: fullName.trim(),
            email: email.trim(),
            contact: autoFields.phone.trim(),
          },
          theme: {
            color: "#059669",
          },
        }

        const rzp = new Razorpay(options)
        rzp.open()
        // Ensure state is released once popup opens
        setIsSubmitting(false)

        rzp.on("payment.failed", function (resp: any) {
          setError(resp?.error?.description || "Payment was not completed. Please try again.")
          setIsSubmitting(false)
          unlockScroll()
        })
      } else {
        await placeOrder().catch((err) => {
          setError(err?.message || "Could not place order. Please try again.")
          setIsSubmitting(false)
        })
      }
    } catch (err: any) {
      console.error("Express checkout error:", err)
      setError(err?.message || "An unexpected error occurred. Please verify your details.")
      setIsSubmitting(false)
    }
  }

  const finalPayAmount = currentNetItemsTotal + (isFreeShippingUnlocked ? 0 : 89)

  return (
    <div className="w-full font-jakarta text-slate-800 space-y-6" id="checkout-form-top">

      {/* EXPRESS CHECKOUT CONTAINER */}
      <div className="bg-white rounded-3xl border border-amber-200/60 p-5 sm:p-8 lg:p-10 shadow-xs space-y-8">

        {/* Header with Security Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Delivery &amp; Payment
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-amber-50/80 px-3.5 py-2 rounded-2xl border border-amber-200/60 self-start sm:self-auto">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <form onSubmit={handleExpressCheckout} className="space-y-8">

          {/* SECTION 1: Customer Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-petha-amber text-white font-bold text-xs flex items-center justify-center">1</span>
              <h2 className="font-cormorant text-2xl font-bold text-slate-900">
                Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (formErrors["fullName"]) {
                        setFormErrors((prev) => ({ ...prev, fullName: "" }))
                      }
                    }}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white border text-sm font-jakarta focus:outline-none transition-all ${formErrors["fullName"]
                        ? "border-rose-400 focus:border-rose-500 ring-2 ring-rose-100"
                        : "border-slate-200 hover:border-amber-300 focus:border-petha-amber focus:ring-2 focus:ring-amber-100"
                      }`}
                  />
                </div>
                {formErrors["fullName"] && (
                  <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {formErrors["fullName"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={autoFields.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      setAutoFields((prev) => ({ ...prev, phone: formatted }))
                      if (formErrors["phone"]) {
                        setFormErrors((prev) => ({ ...prev, phone: "" }))
                      }
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white border text-sm font-jakarta focus:outline-none transition-all font-mono font-medium ${formErrors["phone"]
                        ? "border-rose-400 focus:border-rose-500 ring-2 ring-rose-100"
                        : "border-slate-200 hover:border-amber-300 focus:border-petha-amber focus:ring-2 focus:ring-amber-100"
                      }`}
                  />
                </div>
                {formErrors["phone"] && (
                  <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {formErrors["phone"]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (formErrors["email"]) {
                      setFormErrors((prev) => ({ ...prev, email: "" }))
                    }
                  }}
                  placeholder="yourname@gmail.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white border text-sm font-jakarta focus:outline-none transition-all ${formErrors["email"]
                      ? "border-rose-400 focus:border-rose-500 ring-2 ring-rose-100"
                      : "border-slate-200 hover:border-amber-300 focus:border-petha-amber focus:ring-2 focus:ring-amber-100"
                    }`}
                />
              </div>
              {formErrors["email"] && (
                <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {formErrors["email"]}
                </p>
              )}
            </div>
          </div>

          {/* SECTION 2: Shipping Address & Smart PIN code & Google Autocomplete */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-petha-amber text-white font-bold text-xs flex items-center justify-center">2</span>
                <h2 className="font-cormorant text-2xl font-bold text-slate-900">
                  Delivery Address
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-petha-amber" />
                <span>Nationwide Delivery</span>
              </span>
            </div>

            {/* Google Places Address Autocomplete Bar */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                🔍 Search Location (Google Places)
              </label>
              <AddressAutocomplete
                label="Search locality, apartment, building, or area"
                value={searchAddress}
                name="search_address"
                onChange={(e) => setSearchAddress(e.target.value)}
                onSelect={(details) => {
                  setSearchAddress(details.address_1)
                  setAutoFields((prev) => ({
                    ...prev,
                    address_1: details.address_1 || prev.address_1,
                    city: details.city || prev.city,
                    province: details.province || prev.province,
                    postal_code: details.postal_code || prev.postal_code,
                  }))
                  setFormErrors((prev) => {
                    const updated = { ...prev }
                    delete updated["address_1"]
                    delete updated["city"]
                    delete updated["province"]
                    delete updated["postal_code"]
                    return updated
                  })
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  PIN Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={autoFields.postal_code}
                    onChange={(e) => handlePinCodeChange(e.target.value)}
                    placeholder="e.g. 282001"
                    className={`w-full px-4 py-3 rounded-2xl bg-white border text-sm font-jakarta font-mono font-bold tracking-wider focus:outline-none transition-all ${formErrors["postal_code"]
                        ? "border-rose-400 ring-2 ring-rose-100"
                        : "border-slate-200 hover:border-amber-300 focus:border-petha-amber focus:ring-2 focus:ring-amber-100"
                      }`}
                  />
                  {isPinLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-petha-amber border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {formErrors["postal_code"] && (
                  <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {formErrors["postal_code"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  City / District <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={autoFields.city}
                  onChange={(e) => {
                    setAutoFields({ ...autoFields, city: e.target.value })
                    if (formErrors["city"]) {
                      setFormErrors((prev) => ({ ...prev, city: "" }))
                    }
                  }}
                  placeholder="e.g. Agra / New Delhi"
                  className={`w-full px-4 py-3 rounded-2xl bg-white border text-sm font-jakarta focus:outline-none transition-all font-medium ${formErrors["city"]
                      ? "border-rose-400 ring-2 ring-rose-100"
                      : "border-slate-200 hover:border-amber-300 focus:border-petha-amber focus:ring-2 focus:ring-amber-100"
                    }`}
                />
                {formErrors["city"] && (
                  <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {formErrors["city"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  State <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={autoFields.province}
                  onChange={(e) => {
                    setAutoFields({ ...autoFields, province: e.target.value })
                    if (formErrors["province"]) {
                      setFormErrors((prev) => ({ ...prev, province: "" }))
                    }
                  }}
                  placeholder="e.g. Uttar Pradesh"
                  className={`w-full px-4 py-3 rounded-2xl bg-white border text-sm font-jakarta focus:outline-none transition-all font-medium ${formErrors["province"]
                      ? "border-rose-400 ring-2 ring-rose-100"
                      : "border-slate-200 hover:border-amber-300 focus:border-petha-amber focus:ring-2 focus:ring-amber-100"
                    }`}
                />
                {formErrors["province"] && (
                  <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {formErrors["province"]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                House No., Building &amp; Street <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={autoFields.address_1}
                onChange={(e) => {
                  setAutoFields({ ...autoFields, address_1: e.target.value })
                  if (formErrors["address_1"]) {
                    setFormErrors((prev) => ({ ...prev, address_1: "" }))
                  }
                }}
                placeholder="Flat / House No., Apartment name, Street or Area"
                className={`w-full px-4 py-3 rounded-2xl bg-white border text-sm font-jakarta focus:outline-none transition-all ${formErrors["address_1"]
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 hover:border-amber-300 focus:border-petha-amber focus:ring-2 focus:ring-amber-100"
                  }`}
              />
              {formErrors["address_1"] && (
                <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {formErrors["address_1"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={autoFields.address_2}
                onChange={(e) => setAutoFields({ ...autoFields, address_2: e.target.value })}
                placeholder="Near Temple / Metro Station / Landmark"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 focus:border-petha-amber focus:ring-2 focus:ring-amber-100 text-sm font-jakarta focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* SECTION 3: Delivery Speed Selection */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-petha-amber text-white font-bold text-xs flex items-center justify-center">3</span>
              <h2 className="font-cormorant text-2xl font-bold text-slate-900">
                Delivery Option
              </h2>
            </div>

            <div className="space-y-2.5">
              {shippingMethods?.map((method: any) => {
                const isSelected = method.id === selectedShippingMethod
                return (
                  <div
                    key={method.id}
                    onClick={() => handleShippingMethodChange(method.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${isSelected
                        ? "border-2 border-petha-amber bg-amber-50/70 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-petha-amber bg-petha-amber ring-2 ring-amber-100" : "border-slate-300 bg-white"}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <span className="font-jakarta font-bold text-slate-900 text-sm block">
                          Express Delivery
                        </span>
                        <span className="text-xs text-slate-500 font-jakarta">
                          Fast and fresh dispatch across India
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {isFreeShippingUnlocked ? "FREE" : "₹89"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* SECTION 4: Upfront Visual Payment Methods (Razorpay & UPI) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-petha-amber text-white font-bold text-xs flex items-center justify-center">4</span>
                <h2 className="font-cormorant text-2xl font-bold text-slate-900">
                  Payment Method
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                100% Safe &amp; Encrypted
              </span>
            </div>

            <div className="space-y-3">
              {/* Razorpay UPI / Online Payment Card */}
              <div
                onClick={() => handlePaymentMethodChange(initialProvider)}
                className="p-5 rounded-2xl border-2 border-petha-amber bg-amber-50/50 shadow-xs cursor-pointer transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-1 w-4 h-4 rounded-full border-2 border-petha-amber bg-petha-amber ring-2 ring-amber-200/60 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-jakarta font-bold text-slate-900 text-sm sm:text-base">
                          UPI, Cards &amp; NetBanking
                        </span>
                        <span className="text-[10px] font-bold text-petha-amber bg-white px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider shadow-2xs">
                          Instant &amp; Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-jakarta">
                        Pay via Google Pay, PhonePe, Paytm, All UPI Apps, Debit/Credit Cards &amp; NetBanking.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SVG Logo Row */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60">
                  <div className="h-8 px-2.5 bg-white border border-slate-200/80 rounded-xl flex items-center justify-center shadow-2xs">
                    <Image src="/payment-icons/upi.svg" alt="UPI" width={40} height={16} className="h-4 w-auto object-contain" />
                  </div>
                  <div className="h-8 px-2.5 bg-white border border-slate-200/80 rounded-xl flex items-center justify-center shadow-2xs">
                    <Image src="/Google_Pay_Logo.svg" alt="Google Pay" width={46} height={18} className="h-4.5 w-auto object-contain" />
                  </div>
                  <div className="h-8 px-2.5 bg-white border border-slate-200/80 rounded-xl flex items-center justify-center shadow-2xs">
                    <Image src="/Paytm_Logo.svg" alt="Paytm" width={44} height={16} className="h-3.5 w-auto object-contain" />
                  </div>
                  <div className="h-8 px-2 bg-white border border-slate-200/80 rounded-xl flex items-center justify-center shadow-2xs">
                    <Image src="/payment-icons/visaa.svg" alt="Visa" width={32} height={14} className="h-3.5 w-auto object-contain" />
                  </div>
                  <div className="h-8 px-2 bg-white border border-slate-200/80 rounded-xl flex items-center justify-center shadow-2xs">
                    <Image src="/payment-icons/mastercard.svg" alt="Mastercard" width={28} height={16} className="h-4 w-auto object-contain" />
                  </div>
                  <div className="h-8 px-2.5 bg-white border border-slate-200/80 rounded-xl flex items-center justify-center shadow-2xs">
                    <Image src="/payment-icons/razorpay.svg" alt="Razorpay" width={56} height={16} className="h-3.5 w-auto object-contain" />
                  </div>
                </div>

              </div>
            </div>
          </div>

          <ErrorMessage error={error} />

          {/* SOLID HIGH-CONVERTING 1-TAP PAY BUTTON */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 sm:h-15 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-jakarta font-bold text-base sm:text-lg shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-75"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Pay ₹{formatIndianPrice(finalPayAmount)} via UPI / Cards</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Pay ₹{formatIndianPrice(finalPayAmount)} via UPI / Cards</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                </>
              )}
            </button>

            {/* Trust and Safety Footer Strip */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500 pt-1">
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Refund Guarantee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                🌱 100% Pure Vegetarian
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                🛡️ FSSAI Certified
              </span>
            </div>
          </div>

        </form>
      </div>

      {/* STICKY BOTTOM CHECKOUT BAR FOR MOBILE */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-white border-t border-slate-200/90 p-3 px-4 shadow-[0_-6px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block font-jakarta">Total Amount</span>
          <span className="font-mono text-xl font-extrabold text-slate-900">
            ₹{formatIndianPrice(finalPayAmount)}
          </span>
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleExpressCheckout()}
          className="flex-1 max-w-[210px] h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-jakarta font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Pay ₹{formatIndianPrice(finalPayAmount)} →</span>
            </>
          )}
        </button>
      </div>

    </div>
  )
}