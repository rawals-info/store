"use client"

import { useActionState } from "react"
import { createTransferRequest } from "@lib/data/orders"
import { useEffect, useState } from "react"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div className="w-full bg-white border border-[var(--color-luxury-lightgold)]/30 rounded-md p-6 luxury-shadow-sm">
      {/* Header */}
      <div className="border-b border-[var(--color-luxury-lightgold)]/20 pb-4 mb-6">
        <h3 className="font-display text-xl text-[var(--color-luxury-charcoal)]">
          Order transfers
        </h3>
        <div className="h-0.5 w-16 gold-gradient mt-2"></div>
      </div>
      
      {/* Content */}
      <div className="mb-6">
        <p className="text-[var(--color-luxury-charcoal)]/70 mb-6">
          Can't find the order you are looking for? Connect an order to your account.
        </p>
        
        <form action={formAction} className="w-full">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-grow">
              <input 
                className="luxury-input w-full h-12" 
                name="order_id" 
                placeholder="Order ID" 
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-[var(--color-luxury-gold)] text-white px-8 py-3 rounded hover:bg-[var(--color-luxury-darkgold)] transition-colors w-full md:w-auto whitespace-nowrap"
              >
                Request transfer
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Error message */}
      {!state.success && state.error && (
        <div className="p-3 my-4 bg-[#f8d7da] border border-[#f5c6cb] text-[#721c24] rounded">
          <p>{state.error}</p>
        </div>
      )}
      
      {/* Success message */}
      {showSuccess && (
        <div className="p-4 bg-[var(--color-luxury-ivory)] border border-[var(--color-luxury-lightgold)]/30 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f0f9f0] border border-[#c3e6cb]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <p className="text-[var(--color-luxury-charcoal)] font-medium">
                  Transfer for order {state.order?.id} requested
                </p>
                <p className="text-[var(--color-luxury-charcoal)]/70 text-sm">
                  Transfer request email sent to {state.order?.email}
                </p>
              </div>
            </div>
            <button
              className="text-[var(--color-luxury-charcoal)]/50 hover:text-[var(--color-luxury-charcoal)]"
              onClick={() => setShowSuccess(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
