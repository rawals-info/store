"use client";

import AccountLayout from "@modules/account/templates/account-layout"
import { retrieveCustomer } from "@lib/data/customer"
import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"

export default function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const result = await retrieveCustomer()
        setCustomer(result)
      } catch (error) {
        // No customer logged in
        setCustomer(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [])

  if (loading) {
    return <div className="py-6 min-h-[calc(100vh-64px)] flex items-center justify-center">Loading...</div>
  }

  return (
    <AccountLayout customer={customer}>
      {customer ? dashboard : login}
    </AccountLayout>
  )
}