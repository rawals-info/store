import { Container } from "@medusajs/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper" className="fade-in">
      <div className="hidden small:block">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-2xl text-[var(--color-luxury-charcoal)] mb-2" data-testid="welcome-message" data-value={customer?.first_name}>
              Hello {customer?.first_name}
            </h1>
            <div className="h-0.5 w-24 gold-gradient"></div>
          </div>
          <span className="text-small-regular text-[var(--color-luxury-charcoal)]/70 bg-[var(--color-luxury-ivory)] px-4 py-2 rounded">
            Signed in as:{" "}
            <span
              className="font-semibold text-[var(--color-luxury-gold)]"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </span>
        </div>
        <div className="flex flex-col py-8 border-t border-[var(--color-luxury-lightgold)]/20">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="flex flex-wrap items-start gap-8 mb-8">
              <div className="account-stat-card flex-1">
                <h3 className="text-[var(--color-luxury-charcoal)]/70 text-sm uppercase tracking-wider mb-4">Profile</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="account-stat-value"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="uppercase text-sm text-[var(--color-luxury-charcoal)]/60">
                    Completed
                  </span>
                </div>
              </div>

              <div className="account-stat-card flex-1">
                <h3 className="text-[var(--color-luxury-charcoal)]/70 text-sm uppercase tracking-wider mb-4">Addresses</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="account-stat-value"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="uppercase text-sm text-[var(--color-luxury-charcoal)]/60">
                    Saved
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2 mb-6">
                <h2 className="font-display text-xl text-[var(--color-luxury-charcoal)]">Recent orders</h2>
              </div>
              <div className="flex flex-col gap-y-4" data-testid="orders-wrapper">
                {orders && orders.length > 0 ? (
                  <ul className="flex flex-col gap-y-4">
                    {orders.slice(0, 5).map((order) => {
                      return (
                        <li
                          key={order.id}
                          data-testid="order-wrapper"
                          data-value={order.id}
                        >
                          <LocalizedClientLink
                            href={`/account/orders/details/${order.id}`}
                          >
                            <div className="account-card hover:translate-y-[-2px] transition-all duration-300">
                              <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 p-6">
                                <span className="font-medium text-[var(--color-luxury-charcoal)]/70 text-xs uppercase tracking-wider">Date placed</span>
                                <span className="font-medium text-[var(--color-luxury-charcoal)]/70 text-xs uppercase tracking-wider">
                                  Order number
                                </span>
                                <span className="font-medium text-[var(--color-luxury-charcoal)]/70 text-xs uppercase tracking-wider">
                                  Total amount
                                </span>
                                <span className="text-[var(--color-luxury-charcoal)]" data-testid="order-created-date">
                                  {new Date(order.created_at).toDateString()}
                                </span>
                                <span className="text-[var(--color-luxury-charcoal)]"
                                  data-testid="order-id"
                                  data-value={order.display_id}
                                >
                                  #{order.display_id}
                                </span>
                                <span className="text-[var(--color-luxury-gold)] font-medium" data-testid="order-amount">
                                  {convertToLocale({
                                    amount: order.total,
                                    currency_code: order.currency_code,
                                  })}
                                </span>
                              </div>
                            </div>
                          </LocalizedClientLink>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <div className="account-card p-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-[var(--color-luxury-ivory)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-luxury-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                      </div>
                      <span className="text-[var(--color-luxury-charcoal)] mb-6" data-testid="no-orders-message">
                        No recent orders
                      </span>
                      <LocalizedClientLink href="/products">
                        <button className="luxury-btn px-8 py-3 tracking-wider">
                          START SHOPPING
                        </button>
                      </LocalizedClientLink>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
