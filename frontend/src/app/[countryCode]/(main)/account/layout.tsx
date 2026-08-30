import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"
import "./account.css"

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <div className="w-full py-4 sm:py-8 min-h-[calc(100vh-64px)]">
      <AccountLayout customer={customer}>
        {customer ? dashboard : login}
        <Toaster />
      </AccountLayout>
    </div>
  )
}