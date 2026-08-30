import React from "react"
import Link from "next/link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"
import { HelpCircle, ArrowRight, Sparkles } from "lucide-react"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  if (!customer) {
    return (
      <div className="w-full" data-testid="account-page">
        {children}
      </div>
    )
  }

  return (
    <div className="w-full font-jakarta" data-testid="account-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Dashboard Card */}
        <div className="bg-white rounded-3xl border border-amber-200/60 shadow-sm p-6 sm:p-10">
          <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] gap-8 items-start">
            <div className="border-b small:border-b-0 small:border-r border-slate-100 pb-6 small:pb-0 small:pr-6">
              <AccountNav customer={customer} />
            </div>
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>

        {/* VIP Help & Support Banner */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-amber-300 flex items-center justify-center flex-shrink-0 text-petha-amber">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-cormorant text-xl font-bold text-slate-900">
                Need Help with Your Sweet Delivery?
              </h4>
              <p className="text-xs text-slate-600">
                Our Agra customer support team is available 7 days a week for immediate tracking and assistance.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  )
}

export default AccountLayout
