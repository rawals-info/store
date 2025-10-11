"use client"

import { setAddressesSinglePage } from "@lib/actions/cart"
import { setShippingMethod, initiatePaymentSession, placeOrder } from "@lib/data/cart"
import { isStripe as isStripeFunc, paymentInfoMap, isPaypal as isPaypalFunc } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text } from "@medusajs/ui"
import { RadioGroup, Radio } from "@headlessui/react"
import Input from "@modules/common/components/input"
import AddressAutocomplete from "@modules/common/components/address-autocomplete"
import MedusaRadio from "@modules/common/components/radio"
import PaymentContainer, { StripeCardContainer } from "@modules/checkout/components/payment-container"
import PayPalContainer from "@modules/checkout/components/paypal-container"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentButton from "@modules/checkout/components/payment-button"
import DiscountCode from "@modules/checkout/components/discount-code"
import { useActionState, startTransition, useState, useEffect, useMemo } from "react"

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
  const [isHydrated, setIsHydrated] = useState(false)
  const [cartUpdated, setCartUpdated] = useState(cart)
  const [currentSection, setCurrentSection] = useState<1 | 2>(1)
  
  // Listen for cart updates (e.g., when discounts are applied)
  useEffect(() => {
    const handleCartUpdate = () => {
      // Trigger a re-render to get fresh cart data when discounts are applied
      window.location.reload()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("cartUpdated", handleCartUpdate)
      return () => window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  // Filter shipping methods (exclude express shipping and pickup)
  const shippingMethods = availableShippingMethods
    ?.filter((sm: any) => sm.service_zone?.fulfillment_set?.type !== "pickup")
    ?.filter((sm: any) => sm.name.toLowerCase() !== "express shipping")

  // Auto-select default shipping method
  useEffect(() => {
    if (shippingMethods?.length === 1 && !selectedShippingMethod) {
      setSelectedShippingMethod(shippingMethods[0].id)
    }
  }, [shippingMethods, selectedShippingMethod])

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Phone number formatting
  const formatPhoneNumber = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, "")
    
    if (!cleaned.startsWith("+91")) {
      if (cleaned.startsWith("91")) {
        cleaned = "+" + cleaned
      } else if (cleaned.startsWith("+")) {
        cleaned = "+91" + cleaned.substring(1)
      } else {
        cleaned = "+91" + cleaned
      }
    }
    
    const prefix = "+91"
    const digits = cleaned.substring(3).replace(/\D/g, "").substring(0, 10)
    return prefix + digits
  }

  // Form validation
  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {}
    
    const requiredFields: Record<string, string> = {
      "shipping_address.first_name": "First name",
      "shipping_address.last_name": "Last name", 
      "shipping_address.address_1": "Address",
      "shipping_address.city": "City",
      "shipping_address.country_code": "Country",
      "shipping_address.postal_code": "Postal code",
      "email": "Email",
      "shipping_address.phone": "Phone number",
    }
    
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData.get(field)) {
        errors[field] = `${label} is required`
      }
    })
    
    const email = formData.get("email") as string
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors["email"] = "Please enter a valid email address"
    }
    
    const phone = formData.get("shipping_address.phone") as string
    if (phone && !/^\+91\d{10}$/.test(phone)) {
      errors["shipping_address.phone"] = "Phone must be +91 followed by exactly 10 digits"
    }

    if (!selectedShippingMethod) {
      errors["shipping"] = "Please select a delivery option"
    }

    if (currentSection === 2 && !selectedPaymentMethod) {
      errors["payment"] = "Please select a payment method"
    }
    
    return errors
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formTouched) return
    
    const { name } = e.target
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  // Handle form submission - prepare cart for payment
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    // Add shipping method to form data
    formData.set("shipping_method_id", selectedShippingMethod)
    
    // Run validation
    const errors = validateForm(formData)
    setFormErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false)
      setFormTouched(true)
      return
    }

    try {
      // 1. Save address
      const addressResult = await setAddressesSinglePage(null, formData).catch((err) => {
        throw new Error("Failed to save address: " + err.message)
      })
      
      if (!addressResult?.success) {
        throw new Error("Failed to save address")
      }

      // 2. Set shipping method
      await setShippingMethod({
        cartId: cart.id,
        shippingMethodId: selectedShippingMethod,
      }).catch((err) => {
        throw new Error("Failed to set shipping method: " + err.message)
      })

      // 3. Initialize payment session
      const defaultPaymentProvider = availablePaymentMethods?.[0]?.id || "razorpay"
      const paymentResponse = await initiatePaymentSession(cart, {
        provider_id: defaultPaymentProvider,
      }).catch((err) => {
        throw new Error("Failed to initialize payment session: " + err.message)
      })

      if (!paymentResponse?.payment_collection?.payment_sessions?.length) {
        throw new Error("Failed to initialize payment session")
      }

      // 4. Update cart state to show payment section
      const updatedCart = {
        ...cart,
        shipping_address: {
          ...cart.shipping_address,
          first_name: formData.get("shipping_address.first_name") as string,
          last_name: formData.get("shipping_address.last_name") as string,
          address_1: formData.get("shipping_address.address_1") as string,
          city: formData.get("shipping_address.city") as string,
          postal_code: formData.get("shipping_address.postal_code") as string,
          country_code: formData.get("shipping_address.country_code") as string,
          province: formData.get("shipping_address.province") as string,
          phone: formData.get("shipping_address.phone") as string,
          company: formData.get("shipping_address.company") as string,
        },
        billing_address: {
          ...cart.shipping_address,
          first_name: formData.get("shipping_address.first_name") as string,
          last_name: formData.get("shipping_address.last_name") as string,
          address_1: formData.get("shipping_address.address_1") as string,
          city: formData.get("shipping_address.city") as string,
          postal_code: formData.get("shipping_address.postal_code") as string,
          country_code: formData.get("shipping_address.country_code") as string,
          province: formData.get("shipping_address.province") as string,
          phone: formData.get("shipping_address.phone") as string,
          company: formData.get("shipping_address.company") as string,
        },
        email: formData.get("email") as string,
        shipping_methods: [{
          shipping_option_id: selectedShippingMethod,
          amount: shippingMethods?.find(sm => sm.id === selectedShippingMethod)?.amount || 0,
        }] as any,
        payment_collection: paymentResponse.payment_collection,
        // Preserve any existing discount totals
        discount_total: cart.discount_total || 0,
        promotions: (cart as any).promotions || [],
      } as any

      setCartUpdated(updatedCart)
      setSelectedPaymentMethod(defaultPaymentProvider)

      setIsSubmitting(false)
      setCurrentSection(2)
      
    } catch (err: any) {
      setError(err.message || "Failed to process checkout. Please try again.")
      setIsSubmitting(false)
    }
    
    setFormTouched(true)
  }

  const paidByGiftcard = false // Gift card functionality disabled for now

  return (
    <div className="space-y-8">
      {/* Section 1: Shipping & Address */}
      {currentSection === 1 && (
        <div className="bg-luxury-ivory p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30">
          <div className="h-0.5 w-full gold-gradient mb-8"></div>
          
          <Heading level="h2" className="font-display text-3xl text-luxury-charcoal mb-8">
            Shipping & Delivery
          </Heading>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Address Section */}
            <div>
              <h3 className="text-xl font-medium text-luxury-charcoal mb-6">Shipping Address</h3>
              <input type="hidden" name="same_as_billing" value="on" />
              
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    name="shipping_address.first_name"
                    autoComplete="given-name"
                    defaultValue={cart?.shipping_address?.first_name || ""}
                    required
                    errors={formErrors}
                    onChange={handleFieldChange}
                  />
                  <Input
                    label="Last name"
                    name="shipping_address.last_name"
                    autoComplete="family-name"
                    defaultValue={cart?.shipping_address?.last_name || ""}
                    required
                    errors={formErrors}
                    onChange={handleFieldChange}
                  />
                </div>
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={cart?.email || customer?.email || ""}
                  required
                  errors={formErrors}
                  onChange={handleFieldChange}
                />
                
                <Input
                  label="Phone (+91 XXXXXXXXXX)"
                  name="shipping_address.phone"
                  autoComplete="tel"
                  type="tel"
                  value={autoFields.phone}
                  required
                  errors={formErrors}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    handleFieldChange({...e, target: {...e.target, value: formatted}})
                    setAutoFields({...autoFields, phone: formatted})
                  }}
                />
                
                <Input
                  label="Company (optional)"
                  name="shipping_address.company"
                  autoComplete="organization"
                  defaultValue={cart?.shipping_address?.company || ""}
                  errors={formErrors}
                  onChange={handleFieldChange}
                />

                <AddressAutocomplete
                  label="Search for address"
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

                {addressSelected && (
                  <div className="space-y-4">
                    <Input
                      label="Address"
                      name="shipping_address.address_1"
                      autoComplete="address-line1"
                      value={autoFields.address_1}
                      required
                      errors={formErrors}
                      onChange={(e) => {
                        handleFieldChange(e)
                        setAutoFields({...autoFields, address_1: e.target.value})
                      }}
                    />
                    <Input
                      label="Apartment, suite, etc. (optional)"
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
                          setAutoFields({...autoFields, city: e.target.value})
                        }}
                      />
                      <Input
                        label="Postal code"
                        name="shipping_address.postal_code"
                        autoComplete="postal-code"
                        value={autoFields.postal_code}
                        required
                        errors={formErrors}
                        onChange={(e) => {
                          handleFieldChange(e)
                          setAutoFields({...autoFields, postal_code: e.target.value})
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
                          setAutoFields({...autoFields, province: e.target.value})
                        }}
                      />
                      <Input
                        label="Country"
                        name="country_display"
                        value="India"
                        disabled
                        className="text-gray-500 bg-gray-50 cursor-not-allowed"
                      />
                      <input type="hidden" name="shipping_address.country_code" value="in" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Section */}
            <div>
              <h3 className="text-xl font-medium text-luxury-charcoal mb-6">Delivery Method</h3>
              <RadioGroup value={selectedShippingMethod} onChange={setSelectedShippingMethod}>
                <div className="space-y-3">
                  {shippingMethods?.map((method: any) => (
                    <Radio
                      key={method.id}
                      value={method.id}
                      className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:border-luxury-gold transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <MedusaRadio checked={method.id === selectedShippingMethod} />
                        <span className="font-medium text-luxury-charcoal">{method.name}</span>
                      </div>
                      <span className="text-luxury-charcoal/70">
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
                <p className="text-red-600 text-sm mt-2">{formErrors.shipping}</p>
              )}
            </div>

            {/* Error Messages */}
            <ErrorMessage error={error} />

            {/* Validation Error Summary */}
            {formTouched && Object.keys(formErrors).length > 0 && (
              <div className="bg-red-50 text-red-800 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Please correct the following errors:</h3>
                <ul className="list-disc pl-4 text-sm">
                  {Object.entries(formErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Continue Button */}
            <Button
              type="submit"
              size="large"
              className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-white border-none px-8 py-4 rounded-md text-lg font-semibold"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </Button>
          </form>
        </div>
      )}

      {/* Section 2: Payment & Checkout */}
      {currentSection === 2 && (
        <div className="bg-luxury-ivory p-8 rounded-md shadow-luxury-sm border border-luxury-lightgold/30">
          <div className="h-0.5 w-full gold-gradient mb-8"></div>
          
          <Heading level="h2" className="font-display text-3xl text-luxury-charcoal mb-8">
            Payment & Checkout
          </Heading>

          <div className="space-y-8">
            {/* Discount Code Section */}
            <div>
              <h3 className="text-xl font-medium text-luxury-charcoal mb-6">Discount Code</h3>
              <DiscountCode cart={cartUpdated as any} />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-luxury-charcoal mb-4">Order Summary</h3>
              {(() => {
                const itemsSubtotal = (cartUpdated.subtotal || 0) - (cartUpdated.shipping_subtotal || 0)
                const selectedShipping = selectedShippingMethod ? 
                  shippingMethods?.find(sm => sm.id === selectedShippingMethod) : null
                const shippingAmount = selectedShipping?.amount || 0
                const discountTotal = cartUpdated.discount_total || 0
                const orderTotal = itemsSubtotal + shippingAmount - discountTotal
                
                return (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal (excl. shipping):</span>
                      <span>{convertToLocale({
                        amount: itemsSubtotal,
                        currency_code: cartUpdated.currency_code,
                      })}</span>
                    </div>
                    {selectedShipping && (
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span>{convertToLocale({
                          amount: shippingAmount,
                          currency_code: cartUpdated.currency_code,
                        })}</span>
                      </div>
                    )}
                    {discountTotal > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount:</span>
                        <span>-{convertToLocale({
                          amount: discountTotal,
                          currency_code: cartUpdated.currency_code,
                        })}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-medium text-lg">
                      <span>Total:</span>
                      <span>{convertToLocale({
                        amount: Math.max(0, orderTotal), // Ensure total doesn't go negative
                        currency_code: cartUpdated.currency_code,
                      })}</span>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Payment Section */}
            <div>
              <h3 className="text-xl font-medium text-luxury-charcoal mb-6">Payment Method</h3>
              {!paidByGiftcard && availablePaymentMethods?.length && (
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
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <Text className="text-sm text-gray-700">
                By placing your order, you confirm that you have read, understand, and agree to our{" "}
                <a href="/terms" className="underline hover:text-luxury-gold transition-colors">
                  Terms & Conditions
                </a>
                ,{" "}
                <a href="/returns" className="underline hover:text-luxury-gold transition-colors">
                  Terms of Sale & Returns Policy
                </a>
                , and{" "}
                <a href="/privacy" className="underline hover:text-luxury-gold transition-colors">
                  Privacy Policy
                </a>{" "}
                of <strong>Taj Petha</strong>.
              </Text>
            </div>

            {/* Navigation & Checkout */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentSection(1)}
                className="text-luxury-charcoal/70 hover:text-luxury-gold transition-colors duration-150 font-medium"
              >
                ← Back to Shipping
              </button>

              {/* Payment Button */}
              {cartUpdated?.payment_collection?.payment_sessions && cartUpdated.payment_collection.payment_sessions.length > 0 ? (
                <PaymentButton 
                  cart={cartUpdated} 
                  data-testid="submit-order-button" 
                  className="bg-luxury-gold hover:bg-luxury-gold/90 text-white border-none px-8 py-4 rounded-md text-lg font-semibold"
                />
              ) : (
                <Button
                  disabled
                  size="large"
                  className="bg-gray-400 text-white border-none px-8 py-4 rounded-md text-lg font-semibold"
                >
                  Payment Not Ready
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}