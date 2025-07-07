import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  // If no customer (login/register view), use a different layout
  if (!customer) {
    return (
      <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)] luxury-pattern" data-testid="account-page">
        {children}
      </div>
    )
  }

  // Regular account layout for logged in users
  return (
    <div className="flex-1 small:py-12 luxury-pattern" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col rounded-md luxury-shadow-md fade-in">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-12">
          <div className="px-4 sm:px-8">{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1 px-4 sm:px-8">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-[var(--color-luxury-lightgold)]/30 py-12 px-8 gap-8">
          <div>
            <h3 className="font-display text-xl text-[var(--color-luxury-charcoal)] mb-4">Got questions?</h3>
            <span className="text-[var(--color-luxury-charcoal)]/70">
              You can find frequently asked questions and answers on our
              customer service page.
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              <span className="text-[var(--color-luxury-gold)] hover:text-[var(--color-luxury-darkgold)]">Customer Service</span>
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
