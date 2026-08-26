"use client"

import { useParams, usePathname } from "next/navigation"
import { LayoutDashboard, User, MapPin, Package, LogOut, ChevronRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { handleSignout } from "@lib/data/client-actions"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode?: string }
  const safeCountryCode = countryCode ?? "in"

  const handleLogout = async () => {
    await handleSignout(safeCountryCode)
  }

  const NAV_ITEMS = [
    { href: "/account", label: "Overview", icon: LayoutDashboard, testId: "overview-link" },
    { href: "/account/profile", label: "Profile", icon: User, testId: "profile-link" },
    { href: "/account/addresses", label: "Addresses", icon: MapPin, testId: "addresses-link" },
    { href: "/account/orders", label: "Orders", icon: Package, testId: "orders-link" },
  ]

  return (
    <div className="font-jakarta">
      {/* Mobile Nav */}
      <div className="small:hidden mb-6" data-testid="mobile-account-nav">
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
            Taj Petha VIP Member
          </span>
          <h3 className="font-cormorant text-xl font-bold text-slate-900">
            Namaste, {customer?.first_name || "Sweet Lover"}! 🍬
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = route.endsWith(item.href)
            return (
              <LocalizedClientLink
                key={item.href}
                href={item.href}
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 hover:bg-amber-50 border-slate-200"
                }`}
                data-testid={item.testId}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </LocalizedClientLink>
            )
          })}
        </div>
      </div>

      {/* Desktop Sidebar Nav */}
      <div className="hidden small:block" data-testid="account-nav">
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
              VIP Member
            </span>
            <h3 className="font-cormorant text-2xl font-bold text-slate-900">
              {customer?.first_name ? `Namaste, ${customer.first_name}!` : "My Account"}
            </h3>
            <p className="text-[11px] text-slate-600 truncate mt-0.5">{customer?.email}</p>
          </div>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = route.endsWith(item.href)
              return (
                <LocalizedClientLink
                  key={item.href}
                  href={item.href}
                  className={`w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between group ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-amber-50/80 hover:text-slate-900"
                  }`}
                  data-testid={item.testId}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-petha-amber" : "text-slate-400 group-hover:text-petha-amber"}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100 text-petha-amber" : "text-slate-400"}`} />
                </LocalizedClientLink>
              )
            })}

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Log Out</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default AccountNav
