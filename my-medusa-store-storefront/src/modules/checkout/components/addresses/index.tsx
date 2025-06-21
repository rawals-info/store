"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useToggleState } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useFormState } from "react-dom"
import Input from "@modules/common/components/input"
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

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  // Form state and validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)
  const [formTouched, setFormTouched] = useState(false)
  
  // Client-side validation function
  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {}
    
    // Required fields
    const requiredFields = [
      "shipping_address.first_name", 
      "shipping_address.last_name",
      "shipping_address.address_1", 
      "shipping_address.city",
      "shipping_address.country_code",
      "shipping_address.postal_code",
      "email"
    ]
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData.get(field)) {
        errors[field] = "This field is required"
      }
    })
    
    // Validate email format
    const email = formData.get("email") as string
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors["email"] = "Please enter a valid email address"
    }
    
    // Postal code format validation could be added here
    
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
      await setAddresses(null, formData)
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

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-8">
        <h2 className="flex flex-row font-display text-2xl text-luxury-charcoal gap-x-2 items-baseline">
          Shipping Address
          {!isOpen && <CheckCircleSolid className="text-luxury-gold" />}
        </h2>
        {!isOpen && cart?.shipping_address && (
          <button
            onClick={handleEdit}
            className="text-luxury-charcoal/70 hover:text-luxury-gold transition-colors duration-150 ease-in-out font-medium text-sm uppercase tracking-wider"
            data-testid="edit-address-button"
          >
            Edit
          </button>
        )}
      </div>
      {isOpen ? (
        <form className="w-full" onSubmit={handleSubmit} noValidate>
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
            <Input
              label="Company (optional)"
              name="shipping_address.company"
              autoComplete="organization"
              defaultValue={shipping_address?.company || ""}
              className="luxury-input"
              errors={formErrors}
              onChange={handleFieldChange}
            />
            <Input
              label="Address"
              name="shipping_address.address_1"
              autoComplete="address-line1"
              defaultValue={shipping_address?.address_1 || ""}
              required
              className="luxury-input"
              errors={formErrors}
              onChange={handleFieldChange}
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
                defaultValue={shipping_address?.city || ""}
                required
                className="luxury-input"
                errors={formErrors}
                onChange={handleFieldChange}
              />
              <Input
                label="Postal code"
                name="shipping_address.postal_code"
                autoComplete="postal-code"
                defaultValue={shipping_address?.postal_code || ""}
                required
                className="luxury-input"
                errors={formErrors}
                onChange={handleFieldChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-2">
              <Input
                label="State / Province"
                name="shipping_address.province"
                autoComplete="address-level1"
                defaultValue={shipping_address?.province || ""}
                className="luxury-input"
                errors={formErrors}
                onChange={handleFieldChange}
              />
              <Input
                label="Country"
                name="shipping_address.country_code"
                autoComplete="country"
                defaultValue={shipping_address?.country_code || (cart?.region?.countries && cart.region.countries[0]?.iso_2) || ""}
                required
                className="luxury-input"
                errors={formErrors}
                onChange={handleFieldChange}
              />
            </div>
            <Input
              label="Phone (optional)"
              name="shipping_address.phone"
              autoComplete="tel"
              defaultValue={shipping_address?.phone || ""}
              className="luxury-input"
              errors={formErrors}
              onChange={handleFieldChange}
            />
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
            <SubmitButton 
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-white border-none px-8 py-3 rounded-md luxury-btn font-medium tracking-wider uppercase transition-all duration-300"
              variant="primary"
              data-testid="submit-address-button"
            >
              {isValidating ? "Saving..." : "Save and continue"}
            </SubmitButton>
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
