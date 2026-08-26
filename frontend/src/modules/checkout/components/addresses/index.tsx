"use client"

import { setAddresses, setAddressesSinglePage } from "@lib/actions/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useToggleState } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { startTransition } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useFormState } from "react-dom"
import Input from "@modules/common/components/input"
import AddressAutocomplete from "@modules/common/components/address-autocomplete"
import { Label } from "@medusajs/ui"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Always show form if no address is set, otherwise show summary with edit option
  const isOpen = !cart?.shipping_address

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const [isEditing, setIsEditing] = useState(false)
  
  const handleEdit = () => {
    setIsEditing(true)
  }

  // Form state and validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)
  const [formTouched, setFormTouched] = useState(false)
  
  // Client-side validation function
  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {}
    
    // Required fields and their friendly labels
    const requiredFields: Record<string,string> = {
      "shipping_address.first_name": "First name",
      "shipping_address.last_name": "Last name",
      "shipping_address.address_1": "Address",
      "shipping_address.city": "City",
      "shipping_address.country_code": "Country",
      "shipping_address.postal_code": "Postal code",
      "email": "Email",
      "shipping_address.phone": "Phone number",
    }
    
    // Check required fields
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData.get(field)) {
        errors[field] = `${label} is required`
      }
    })
    
    // Validate email format
    const email = formData.get("email") as string
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors["email"] = "Please enter a valid email address"
    }
    
    // Validate phone format - must be 10 digits
    const phone = (formData.get("shipping_address.phone") as string) || ""
    const digits = phone.replace(/\D/g, "")
    if (!phone.trim() || digits === "" || digits === "91") {
      errors["shipping_address.phone"] = "Phone number is required for delivery updates"
    } else if (digits.length < 10 || (digits.startsWith("91") && digits.length < 12)) {
      errors["shipping_address.phone"] = "Please enter a valid 10-digit mobile number"
    }
    
    return errors
  }

  // Form submission with validation
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsValidating(true)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    // Run client-side validation
    const errors = validateForm(formData)
    setFormErrors(errors)
    
    if (Object.keys(errors).length === 0) {
      // Form is valid, continue with server action
      startTransition(async () => {
        try {
          const result = await setAddressesSinglePage(null, formData)
          if (result?.success) {
            setIsEditing(false)
            // Trigger a page refresh to get updated cart data
            window.location.reload()
          }
        } catch (error) {
          console.error('Error saving address:', error)
        }
      })
    }
    
    setIsValidating(false)
    setFormTouched(true)
  }
  
  // Handle field change
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formTouched) return
    
    const { name, value } = e.target
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const shipping_address = useMemo(() => {
    if (cart && cart.shipping_address) {
      return cart.shipping_address
    }

    // Handle customer shipping address with type assertion for compatibility
    if (customer && (customer as any).shipping_address) {
      return (customer as any).shipping_address
    }

    return null
  }, [cart, customer])

  // Local state for search address input
  const [searchAddress, setSearchAddress] = useState(
    shipping_address?.address_1 || ""
  )

  // Whether the user has selected an address from the autocomplete (or one already exists)
  const [addressSelected, setAddressSelected] = useState(
    Boolean(shipping_address?.address_1)
  )

  // Controlled values for autofilled fields
  const [autoFields, setAutoFields] = useState({
    address_1: shipping_address?.address_1 || "",
    city: shipping_address?.city || "",
    postal_code: shipping_address?.postal_code || "",
    province: shipping_address?.province || "",
    phone: shipping_address?.phone || "+91",
  })

  // Format phone number to ensure +91 prefix and max 10 digits
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, "")
    
    // If doesn't start with +91, add it
    if (!cleaned.startsWith("+91")) {
      // If starts with 91, add +
      if (cleaned.startsWith("91")) {
        cleaned = "+" + cleaned
      } else if (cleaned.startsWith("+")) {
        cleaned = "+91" + cleaned.substring(1)
      } else {
        // Just digits, add +91
        cleaned = "+91" + cleaned
      }
    }
    
    // Limit to +91 followed by max 10 digits
    const prefix = "+91"
    const digits = cleaned.substring(3).replace(/\D/g, "").substring(0, 10)
    return prefix + digits
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-8">
        <h2 className="flex flex-row font-display text-2xl text-luxury-charcoal gap-x-2 items-baseline">
          Shipping Address
          {!isOpen && !isEditing && <CheckCircleSolid className="text-luxury-gold" />}
        </h2>
        {!isOpen && !isEditing && cart?.shipping_address && (
          <button
            onClick={handleEdit}
            className="text-luxury-charcoal/70 hover:text-luxury-gold transition-colors duration-150 ease-in-out font-medium text-sm uppercase tracking-wider"
            data-testid="edit-address-button"
          >
            Edit
          </button>
        )}
      </div>
      {(isOpen || isEditing) ? (
        <form className="w-full" onSubmit={handleSubmit} noValidate>
          {/* Hidden field to indicate billing equals shipping */}
          <input type="hidden" name="same_as_billing" value="on" />
          <div className="grid grid-cols-1 gap-y-2">
            <div className="grid grid-cols-2 gap-x-2">
              <Input
                label="First name"
                name="shipping_address.first_name"
                autoComplete="given-name"
                defaultValue={shipping_address?.first_name || ""}
                required
                className="luxury-input"
                errors={formErrors}
                onChange={handleFieldChange}
              />
              <Input
                label="Last name"
                name="shipping_address.last_name"
                autoComplete="family-name"
                defaultValue={shipping_address?.last_name || ""}
                required
                className="luxury-input"
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
              className="luxury-input"
              errors={formErrors}
              onChange={handleFieldChange}
            />
            <div className="relative">
              <Input
                label="Phone (+91 XXXXXXXXXX)"
                name="shipping_address.phone"
                autoComplete="tel"
                type="tel"
                value={autoFields.phone ?? "+91"}
                required
                className="luxury-input"
                errors={formErrors}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value)
                  handleFieldChange({
                    ...e,
                    target: { ...e.target, value: formatted }
                  })
                  setAutoFields({ ...autoFields, phone: formatted })
                }}
              />
              {autoFields.phone && autoFields.phone.length > 3 && (
                <div className="text-xs text-luxury-charcoal/60 mt-1">
                  {autoFields.phone.length - 3}/10 digits
                </div>
              )}
            </div>

            <Input
              label="Company (optional)"
              name="shipping_address.company"
              autoComplete="organization"
              defaultValue={shipping_address?.company || ""}
              className="luxury-input"
              errors={formErrors}
              onChange={handleFieldChange}
            />

            {/* Search for address autocomplete */}
            <AddressAutocomplete
              label="Search for address"
              name="search_address"
              value={searchAddress}
              onChange={(e) => {
                setSearchAddress(e.target.value)
              }}
              onSelect={(details: any) => {
                setSearchAddress(details.address_1)

                setAutoFields((prev) => ({
                  ...prev,
                  address_1: details.address_1 || "",
                  city: details.city || "",
                  postal_code: details.postal_code || "",
                  province: details.province || "",
                }))

                // Reveal the rest of the address fields once a suggestion is chosen
                setAddressSelected(true)
              }}
            />
            {addressSelected && (
              <>
                <Input
                  label="Address"
                  name="shipping_address.address_1"
                  autoComplete="address-line1"
                  value={autoFields.address_1}
                  required
                  className="luxury-input"
                  errors={formErrors}
                  onChange={(e) => {
                    handleFieldChange(e)
                    setAutoFields({ ...autoFields, address_1: e.target.value })
                  }}
                />
                <Input
                  label="Apartment, suite, etc. (optional)"
                  name="shipping_address.address_2"
                  autoComplete="address-line2"
                  defaultValue={shipping_address?.address_2 || ""}
                  className="luxury-input"
                  errors={formErrors}
                  onChange={handleFieldChange}
                />
                <div className="grid grid-cols-2 gap-x-2">
                  <Input
                    label="City"
                    name="shipping_address.city"
                    autoComplete="address-level2"
                    value={autoFields.city}
                    required
                    className="luxury-input"
                    errors={formErrors}
                    onChange={(e) => {
                      handleFieldChange(e)
                      setAutoFields({ ...autoFields, city: e.target.value })
                    }}
                  />
                  <Input
                    label="Postal code"
                    name="shipping_address.postal_code"
                    autoComplete="postal-code"
                    value={autoFields.postal_code}
                    required
                    className="luxury-input"
                    errors={formErrors}
                    onChange={(e) => {
                      handleFieldChange(e)
                      setAutoFields({ ...autoFields, postal_code: e.target.value })
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                  <Input
                    label="State / Province"
                    name="shipping_address.province"
                    autoComplete="address-level1"
                    value={autoFields.province}
                    className="luxury-input"
                    errors={formErrors}
                    onChange={(e) => {
                      handleFieldChange(e)
                      setAutoFields({ ...autoFields, province: e.target.value })
                    }}
                  />
                  {/* Country is always India. Show disabled input and hidden field with ISO code */}
                  <Input
                    label="Country"
                    name="country_display"
                    value="India"
                    disabled
                    className="luxury-input text-gray-500 bg-gray-50 cursor-not-allowed"
                  />
                  <input
                    type="hidden"
                    name="shipping_address.country_code"
                    value="in"
                  />
                </div>
              </>
            )}
          </div>
          
          {/* Display validation error summary */}
          {formTouched && Object.keys(formErrors).length > 0 && (
            <div className="bg-red-50 text-red-800 p-4 mt-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Please correct the following errors:</h3>
              <ul className="list-disc pl-4 text-sm">
                {Object.entries(formErrors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-end mt-6">
            <div className="flex gap-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 border-none px-8 py-3 rounded-md font-medium tracking-wider uppercase transition-all duration-300"
                >
                  Cancel
                </button>
              )}
              <SubmitButton 
                className="bg-luxury-gold hover:bg-luxury-gold/90 text-white border-none px-8 py-3 rounded-md luxury-btn font-medium tracking-wider uppercase transition-all duration-300"
                variant="primary"
                data-testid="submit-address-button"
              >
                {isValidating ? "Saving..." : "Save Address"}
              </SubmitButton>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div
                    className="flex flex-col w-1/3"
                    data-testid="shipping-address-summary"
                  >
                    <p className="font-medium text-luxury-charcoal mb-2">
                      Shipping Address
                    </p>
                    <p className="text-luxury-charcoal/70">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </p>
                    <p className="text-luxury-charcoal/70">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </p>
                    <p className="text-luxury-charcoal/70">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </p>
                    <p className="text-luxury-charcoal/70">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </p>
                  </div>

                  <div
                    className="flex flex-col w-1/3 "
                    data-testid="shipping-contact-summary"
                  >
                    <p className="font-medium text-luxury-charcoal mb-2">
                      Contact
                    </p>
                    <p className="text-luxury-charcoal/70">
                      {cart.shipping_address.phone}
                    </p>
                    <p className="text-luxury-charcoal/70">
                      {cart.email}
                    </p>
                  </div>

                  <div
                    className="flex flex-col w-1/3"
                    data-testid="billing-address-summary"
                  >
                    <p className="font-medium text-luxury-charcoal mb-2">
                      Billing Address
                    </p>

                    {sameAsBilling ? (
                      <p className="text-luxury-charcoal/70">
                        Billing- and delivery address are the same.
                      </p>
                    ) : (
                      <>
                        <p className="text-luxury-charcoal/70">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </p>
                        <p className="text-luxury-charcoal/70">
                          {cart.billing_address?.address_1}{" "}
                          {cart.billing_address?.address_2}
                        </p>
                        <p className="text-luxury-charcoal/70">
                          {cart.billing_address?.postal_code},{" "}
                          {cart.billing_address?.city}
                        </p>
                        <p className="text-luxury-charcoal/70">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Addresses
