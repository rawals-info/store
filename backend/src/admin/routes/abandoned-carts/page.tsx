import React, { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  ShoppingCart,
  Envelope,
  ArrowPath,
  SquareTwoStack,
  CheckCircle,
  Clock,
  ShoppingBag,
  EllipsisHorizontal,
} from "@medusajs/icons"
import {
  createDataTableColumnHelper,
  createDataTableCommandHelper,
  DataTableRowSelectionState,
  DataTablePaginationState,
  Container,
  DataTable,
  useDataTable,
  Heading,
  Text,
  StatusBadge,
  Button,
  IconButton,
  Input,
  Select,
  Drawer,
  DropdownMenu,
  Tooltip,
} from "@medusajs/ui"
import { toast, Toaster } from "react-hot-toast"
import { sdk } from "../../lib/sdk"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

// TypeScript types for Abandoned Cart Data
export type AbandonedCartItem = {
  id: string
  title: string
  subtitle?: string | null
  thumbnail?: string | null
  quantity: number
  unit_price: number | string
  variant_title?: string | null
  product_id?: string | null
}

export type AbandonedCart = {
  id: string
  email?: string | null
  currency_code: string
  created_at: string
  updated_at: string
  completed_at?: string | null
  total: number
  item_count: number
  customer_name?: string | null
  is_notified: boolean
  notification_status: "notified" | "not_notified"
  last_notified_at?: string | null
  notification_count: number
  customer?: {
    id: string
    email?: string
    first_name?: string
    last_name?: string
    phone?: string
  }
  shipping_address?: {
    first_name?: string
    last_name?: string
    phone?: string
    address_1?: string
    address_2?: string
    city?: string
    province?: string
    postal_code?: string
    country_code?: string
  }
  items: AbandonedCartItem[]
  metadata?: Record<string, any>
}

export type Statistics = {
  total_abandoned_carts: number
  recoverable_carts: number
  notified_carts: number
  total_abandoned_value: number
  recoverable_value: number
}

// Utility: Format currency in INR or cart currency
function formatMoney(amount: number | string, currencyCode: string = "inr"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  const symbol = currencyCode.toLowerCase() === "inr" ? "₹" : `${currencyCode.toUpperCase()} `
  return `${symbol}${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Utility: Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 30) return `${diffInDays}d ago`
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

const columnHelper = createDataTableColumnHelper<AbandonedCart>()

const AbandonedCartsContent: React.FC = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: 50,
    pageIndex: 0,
  })

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({})

  // Filters state
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "notified" | "not_notified">("all")
  const [hasEmailFilter, setHasEmailFilter] = useState<"all" | "true" | "false">("all")
  const [hoursAgo, setHoursAgo] = useState<number>(1)

  // Selected Cart Drawer state
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSendingIndividual, setIsSendingIndividual] = useState(false)
  const [customDiscountCode, setCustomDiscountCode] = useState("")
  const [customSubject, setCustomSubject] = useState("")

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchInput), 400)
    return () => clearTimeout(id)
  }, [searchInput])

  // Reset pagination on filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [debouncedSearch, statusFilter, hasEmailFilter, hoursAgo])

  const offset = useMemo(() => pagination.pageIndex * pagination.pageSize, [pagination])

  // Fetch list of abandoned carts
  const { data, isLoading, refetch, isFetching } = useQuery<{
    abandoned_carts: AbandonedCart[]
    count: number
    statistics: Statistics
    limit: number
    offset: number
  }>({
    queryKey: [
      "admin-abandoned-carts",
      offset,
      pagination.pageSize,
      debouncedSearch,
      statusFilter,
      hasEmailFilter,
      hoursAgo,
    ],
    queryFn: () => {
      const queryParams: Record<string, any> = {
        offset,
        limit: pagination.pageSize,
        status: statusFilter,
        has_email: hasEmailFilter,
        hours_ago: hoursAgo,
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
      }
      return sdk.client.fetch("/admin/abandoned-carts", {
        query: queryParams,
      })
    },
  })

  // Fetch single cart details for Drawer
  const { data: drawerData, isLoading: isDrawerLoading } = useQuery<{
    abandoned_cart: AbandonedCart & {
      subtotal: number
      shipping_total: number
      recovery_url: string
      notification_history: any[]
    }
  }>({
    queryKey: ["admin-abandoned-cart-detail", selectedCartId],
    queryFn: () => sdk.client.fetch(`/admin/abandoned-carts/${selectedCartId}`),
    enabled: Boolean(selectedCartId && isDrawerOpen),
  })

  // Function to send recovery email
  const handleSendNotification = async (cartIds: string[], subject?: string, discount?: string) => {
    try {
      const response = await sdk.client.fetch<{
        success: boolean
        notified_count: number
        total_requested: number
        results: Array<{ cart_id: string; success: boolean; message?: string }>
      }>("/admin/abandoned-carts/notify", {
        method: "POST",
        body: {
          cart_ids: cartIds,
          ...(subject ? { custom_subject: subject } : {}),
          ...(discount ? { discount_code: discount } : {}),
        },
      })

      if (response.success || response.notified_count > 0) {
        toast.success(
          `Successfully sent ${response.notified_count} recovery email${response.notified_count > 1 ? "s" : ""}!`
        )
      } else {
        const errorMsg = response.results?.[0]?.message || "Could not send notification"
        toast.error(`Notification failed: ${errorMsg}`)
      }

      refetch()
    } catch (err: any) {
      toast.error(err.message || "Failed to trigger recovery notification")
    }
  }

  // Bulk Command helper
  const commandHelper = createDataTableCommandHelper()
  const commands = [
    commandHelper.command({
      label: "Send Recovery Email",
      shortcut: "S",
      action: async (selection) => {
        const selectedIds = Object.keys(selection)
        const cartsToSend = (data?.abandoned_carts || []).filter(
          (c) => selectedIds.includes(c.id) && Boolean(c.email)
        )

        if (cartsToSend.length === 0) {
          toast.error("None of the selected carts have a customer email address.")
          return
        }

        const idsToSend = cartsToSend.map((c) => c.id)
        toast.loading(`Sending recovery emails to ${idsToSend.length} customer(s)...`, {
          id: "bulk-notify",
        })
        try {
          await handleSendNotification(idsToSend)
          toast.dismiss("bulk-notify")
        } catch {
          toast.dismiss("bulk-notify")
        }
      },
    }),
  ]

  // Columns definition using native Medusa Admin typography & design tokens
  const columns = useMemo(
    () => [
      columnHelper.select(),
      columnHelper.accessor("id", {
        header: "Cart ID",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span
              className="text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer truncate"
              onClick={() => {
                setSelectedCartId(row.original.id)
                setIsDrawerOpen(true)
              }}
              title={row.original.id}
            >
              #{row.original.id.slice(0, 18)}...
            </span>
            <button
              type="button"
              title="Copy Cart ID"
              className="text-ui-fg-muted hover:text-ui-fg-base transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard.writeText(row.original.id)
                toast.success("Cart ID copied!")
              }}
            >
              <SquareTwoStack className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Customer",
        cell: ({ row }) => {
          const cart = row.original
          if (cart.email) {
            return (
              <div className="flex flex-col">
                {cart.customer_name && (
                  <span className="text-ui-fg-base font-medium text-sm">
                    {cart.customer_name}
                  </span>
                )}
                <span className={`text-xs ${cart.customer_name ? "text-ui-fg-subtle" : "text-ui-fg-base font-medium text-sm"}`}>
                  {cart.email}
                </span>
              </div>
            )
          }
          return <span className="text-ui-fg-muted text-sm">-</span>
        },
      }),
      columnHelper.accessor("items", {
        header: "Items",
        cell: ({ row }) => {
          const items = row.original.items || []
          const count = row.original.item_count || items.length
          const firstItem = items[0]
          const otherCount = items.length - 1

          return (
            <div className="flex items-center gap-2.5 max-w-xs">
              {firstItem?.thumbnail ? (
                <img
                  src={firstItem.thumbnail}
                  alt={firstItem.title}
                  className="h-8 w-8 rounded border border-ui-border-base object-cover flex-shrink-0"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded border border-ui-border-base bg-ui-bg-subtle flex-shrink-0">
                  <ShoppingBag className="h-3.5 w-3.5 text-ui-fg-muted" />
                </div>
              )}
              <div className="truncate text-xs">
                <span className="font-medium text-ui-fg-base truncate block">
                  {firstItem?.title || "Cart Item"}
                </span>
                <span className="text-ui-fg-subtle">
                  {count} {count === 1 ? "item" : "items"} {otherCount > 0 ? `(+${otherCount} more)` : ""}
                </span>
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor("total", {
        header: "Total",
        cell: ({ row }) => (
          <span className="font-medium text-ui-fg-base text-sm">
            {formatMoney(row.original.total, row.original.currency_code)}
          </span>
        ),
      }),
      columnHelper.accessor("updated_at", {
        header: "Abandoned",
        cell: ({ row }) => (
          <Tooltip content={`Last activity: ${new Date(row.original.updated_at).toLocaleString()}`}>
            <span className="text-xs text-ui-fg-subtle flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-ui-fg-muted" />
              {formatRelativeTime(row.original.updated_at)}
            </span>
          </Tooltip>
        ),
      }),
      columnHelper.accessor("notification_status", {
        header: "Status",
        cell: ({ row }) => {
          const isNotified = row.original.is_notified
          const count = row.original.notification_count

          if (isNotified) {
            return (
              <StatusBadge color="green">
                Notified {count > 1 ? `(${count}x)` : ""}
              </StatusBadge>
            )
          }

          if (!row.original.email) {
            return <StatusBadge color="grey">Unreachable</StatusBadge>
          }

          return <StatusBadge color="blue">Not Sent</StatusBadge>
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          const cart = row.original
          const hasEmail = Boolean(cart.email)

          return (
            <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <IconButton size="small" variant="transparent">
                    <EllipsisHorizontal />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    className="gap-x-2"
                    onClick={() => {
                      setSelectedCartId(cart.id)
                      setIsDrawerOpen(true)
                    }}
                  >
                    View details
                  </DropdownMenu.Item>
                  {hasEmail && (
                    <DropdownMenu.Item
                      className="gap-x-2"
                      onClick={async () => {
                        toast.loading(`Sending recovery email to ${cart.email}...`, {
                          id: `send-${cart.id}`,
                        })
                        await handleSendNotification([cart.id])
                        toast.dismiss(`send-${cart.id}`)
                      }}
                    >
                      <Envelope className="h-3.5 w-3.5" />
                      Send recovery email
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Item
                    className="gap-x-2"
                    onClick={() => {
                      navigator.clipboard.writeText(cart.id)
                      toast.success("Cart ID copied!")
                    }}
                  >
                    <SquareTwoStack className="h-3.5 w-3.5" />
                    Copy Cart ID
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
          )
        },
      }),
    ],
    []
  )

  const table = useDataTable({
    columns,
    data: data?.abandoned_carts || [],
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
    commands,
    getRowId: (row) => row.id,
    onRowClick: (_, row) => {
      const cartId = (row as any).original?.id || (row as any).id
      if (cartId) {
        setSelectedCartId(cartId)
        setIsDrawerOpen(true)
      }
    },
  })

  const stats = data?.statistics

  return (
    <div className="flex flex-col gap-y-4 pb-12">
      {/* CSS Override: Fixes touchpad & wheel scroll capturing by DataTable's overscroll-none div */}
      <style>{`
        .abandoned-carts-table [class*="overscroll-none"],
        .abandoned-carts-table [class*="overflow-auto"] {
          overscroll-behavior-y: auto !important;
          overflow-y: visible !important;
        }
      `}</style>

      {/* Top Header & Refresh */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Heading level="h1" className="text-xl font-semibold text-ui-fg-base">
            Abandoned Carts
          </Heading>
          <Text className="text-ui-fg-subtle text-sm">
            Monitor inactive customer checkouts and trigger recovery notifications.
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="small"
            variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <ArrowPath className={`h-3.5 w-3.5 mr-1 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards: Native Medusa Container styles seamlessly matching dark mode */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Container className="p-4 bg-ui-bg-base border border-ui-border-base rounded-lg">
          <Text className="text-xs font-medium text-ui-fg-muted uppercase tracking-wider">
            Total Abandoned Carts
          </Text>
          <Heading level="h2" className="mt-1 text-2xl font-semibold text-ui-fg-base">
            {stats ? stats.total_abandoned_carts : "—"}
          </Heading>
          <Text className="mt-1 text-xs text-ui-fg-muted">
            Inactive &gt; {hoursAgo} hour{hoursAgo > 1 ? "s" : ""}
          </Text>
        </Container>

        <Container className="p-4 bg-ui-bg-base border border-ui-border-base rounded-lg">
          <Text className="text-xs font-medium text-ui-fg-muted uppercase tracking-wider">
            Recoverable (With Email)
          </Text>
          <Heading level="h2" className="mt-1 text-2xl font-semibold text-ui-fg-base">
            {stats ? stats.recoverable_carts : "—"}
          </Heading>
          <Text className="mt-1 text-xs text-ui-fg-muted">
            Reachable via Brevo email
          </Text>
        </Container>

        <Container className="p-4 bg-ui-bg-base border border-ui-border-base rounded-lg">
          <Text className="text-xs font-medium text-ui-fg-muted uppercase tracking-wider">
            Recovery Emails Sent
          </Text>
          <Heading level="h2" className="mt-1 text-2xl font-semibold text-ui-fg-base">
            {stats ? stats.notified_carts : "—"}
          </Heading>
          <Text className="mt-1 text-xs text-ui-fg-muted">
            Notified at least once
          </Text>
        </Container>

        <Container className="p-4 bg-ui-bg-base border border-ui-border-base rounded-lg">
          <Text className="text-xs font-medium text-ui-fg-muted uppercase tracking-wider">
            Potential Revenue at Risk
          </Text>
          <Heading level="h2" className="mt-1 text-2xl font-semibold text-ui-fg-base">
            {stats ? formatMoney(stats.recoverable_value) : "—"}
          </Heading>
          <Text className="mt-1 text-xs text-ui-fg-muted">
            In carts with customer email
          </Text>
        </Container>
      </div>

      {/* Main Table Container with .abandoned-carts-table class to fix touchpad scrolling */}
      <Container className="abandoned-carts-table divide-y p-0 bg-ui-bg-base border border-ui-border-base rounded-lg">
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 p-4 md:flex-row md:items-center">
            <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
              {/* Search Input */}
              <Input
                size="small"
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by customer, email, cart ID..."
                className="w-full md:w-64"
              />

              {/* Notification Status Filter */}
              <Select
                size="small"
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val as any)}
              >
                <Select.Trigger className="w-36">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="all">All statuses</Select.Item>
                  <Select.Item value="not_notified">Not Sent</Select.Item>
                  <Select.Item value="notified">Notified</Select.Item>
                </Select.Content>
              </Select>

              {/* Email Availability Filter */}
              <Select
                size="small"
                value={hasEmailFilter}
                onValueChange={(val) => setHasEmailFilter(val as any)}
              >
                <Select.Trigger className="w-40">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="all">All Carts</Select.Item>
                  <Select.Item value="true">Has Email Only</Select.Item>
                  <Select.Item value="false">Anonymous Only</Select.Item>
                </Select.Content>
              </Select>

              {/* Inactivity Threshold Filter */}
              <Select
                size="small"
                value={String(hoursAgo)}
                onValueChange={(val) => setHoursAgo(parseInt(val, 10))}
              >
                <Select.Trigger className="w-40">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="1">&gt; 1 hour inactive</Select.Item>
                  <Select.Item value="6">&gt; 6 hours inactive</Select.Item>
                  <Select.Item value="24">&gt; 24 hours inactive</Select.Item>
                  <Select.Item value="72">&gt; 3 days inactive</Select.Item>
                  <Select.Item value="168">&gt; 7 days inactive</Select.Item>
                </Select.Content>
              </Select>

              {/* Clear filters button */}
              {(searchInput || statusFilter !== "all" || hasEmailFilter !== "all" || hoursAgo !== 1) && (
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => {
                    setSearchInput("")
                    setStatusFilter("all")
                    setHasEmailFilter("all")
                    setHoursAgo(1)
                  }}
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select
                size="small"
                value={String(pagination.pageSize)}
                onValueChange={(val) =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: 0,
                    pageSize: parseInt(val, 10),
                  }))
                }
              >
                <Select.Trigger className="w-24">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="15">15 rows</Select.Item>
                  <Select.Item value="50">50 rows</Select.Item>
                  <Select.Item value="100">100 rows</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </DataTable.Toolbar>

          <DataTable.Table />
          <DataTable.Pagination />
          <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />
        </DataTable>
      </Container>

      {/* Cart Details Drawer: Native Medusa styling & smooth scrolling */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content className="w-full sm:max-w-xl bg-ui-bg-base border-l border-ui-border-base text-ui-fg-base">
          {drawerData?.abandoned_cart ? (
            (() => {
              const c = drawerData.abandoned_cart
              const hasEmail = Boolean(c.email)

              return (
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <Drawer.Header className="border-b border-ui-border-base p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Drawer.Title className="text-lg font-semibold text-ui-fg-base">
                            Cart Details
                          </Drawer.Title>
                          <Drawer.Description className="font-mono text-xs text-ui-fg-muted mt-0.5">
                            {c.id}
                          </Drawer.Description>
                        </div>
                        {c.is_notified ? (
                          <StatusBadge color="green">
                            Notified ({c.notification_count}x)
                          </StatusBadge>
                        ) : hasEmail ? (
                          <StatusBadge color="blue">Ready to Notify</StatusBadge>
                        ) : (
                          <StatusBadge color="grey">Anonymous</StatusBadge>
                        )}
                      </div>
                    </Drawer.Header>

                    <Drawer.Body className="flex-1 overflow-y-auto max-h-[calc(100vh-140px)] space-y-6 p-6">
                      {/* Customer Details Section */}
                      <div className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4">
                        <Text className="text-xs font-medium text-ui-fg-muted uppercase tracking-wider mb-3">
                          Customer Information
                        </Text>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-ui-fg-muted text-xs block">Name</span>
                            <span className="font-medium text-ui-fg-base">
                              {c.customer_name || "Not provided"}
                            </span>
                          </div>
                          <div>
                            <span className="text-ui-fg-muted text-xs block">Email</span>
                            <span className="font-medium text-ui-fg-base">
                              {c.email || "No email on file"}
                            </span>
                          </div>
                          <div>
                            <span className="text-ui-fg-muted text-xs block">Phone</span>
                            <span className="font-medium text-ui-fg-base">
                              {c.shipping_address?.phone || c.customer?.phone || "Not provided"}
                            </span>
                          </div>
                          <div>
                            <span className="text-ui-fg-muted text-xs block">Shipping Location</span>
                            <span className="font-medium text-ui-fg-base">
                              {[
                                c.shipping_address?.city,
                                c.shipping_address?.province,
                                c.shipping_address?.country_code?.toUpperCase(),
                              ]
                                .filter(Boolean)
                                .join(", ") || "Not provided"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items in Cart */}
                      <div>
                        <Text className="text-xs font-medium text-ui-fg-muted uppercase tracking-wider mb-3">
                          Items in Cart ({c.items?.length || 0})
                        </Text>
                        <div className="space-y-2">
                          {(c.items || []).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between rounded-lg border border-ui-border-base bg-ui-bg-subtle p-3"
                            >
                              <div className="flex items-center gap-3">
                                {item.thumbnail ? (
                                  <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="h-10 w-10 rounded border border-ui-border-base object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 items-center justify-center rounded border border-ui-border-base bg-ui-bg-base flex-shrink-0">
                                    <ShoppingBag className="h-4 w-4 text-ui-fg-muted" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-sm text-ui-fg-base">{item.title}</p>
                                  {item.variant_title && (
                                    <p className="text-xs text-ui-fg-muted">{item.variant_title}</p>
                                  )}
                                  <p className="text-xs text-ui-fg-subtle mt-0.5">
                                    Qty: {item.quantity} &times; {formatMoney(item.unit_price, c.currency_code)}
                                  </p>
                                </div>
                              </div>
                              <span className="font-medium text-sm text-ui-fg-base">
                                {formatMoney(
                                  (typeof item.unit_price === "string"
                                    ? parseFloat(item.unit_price)
                                    : item.unit_price) * item.quantity,
                                  c.currency_code
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Totals Breakdown */}
                      <div className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-ui-fg-subtle">
                          <span>Subtotal</span>
                          <span className="text-ui-fg-base font-medium">{formatMoney(c.subtotal, c.currency_code)}</span>
                        </div>
                        {c.shipping_total > 0 && (
                          <div className="flex justify-between text-ui-fg-subtle">
                            <span>Estimated Shipping</span>
                            <span className="text-ui-fg-base font-medium">{formatMoney(c.shipping_total, c.currency_code)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-base text-ui-fg-base pt-2 border-t border-ui-border-base">
                          <span>Total Cart Value</span>
                          <span>{formatMoney(c.total, c.currency_code)}</span>
                        </div>
                      </div>

                      {/* 1-Click Recovery URL */}
                      <div className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4 space-y-2">
                        <Text className="text-xs font-medium text-ui-fg-muted uppercase tracking-wider">
                          1-Click Cart Recovery Link
                        </Text>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            size="small"
                            readOnly
                            value={c.recovery_url}
                            className="font-mono text-ui-fg-subtle select-all"
                          />
                          <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                              navigator.clipboard.writeText(c.recovery_url)
                              toast.success("Recovery link copied to clipboard!")
                            }}
                          >
                            <SquareTwoStack className="h-3.5 w-3.5 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <Text className="text-xs text-ui-fg-muted">
                          Share this link via WhatsApp, SMS, or DM to directly restore the customer's cart on the storefront.
                        </Text>
                      </div>

                      {/* Custom Recovery Email Options */}
                      {hasEmail && (
                        <div className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4 space-y-3">
                          <Text className="text-xs font-medium text-ui-fg-muted uppercase tracking-wider">
                            Send Custom Recovery Email
                          </Text>
                          <div>
                            <label className="text-xs text-ui-fg-subtle block mb-1">
                              Promotional Discount Code (Optional)
                            </label>
                            <Input
                              size="small"
                              placeholder="e.g. SWEET10 or PETHA5"
                              value={customDiscountCode}
                              onChange={(e) => setCustomDiscountCode(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-ui-fg-subtle block mb-1">
                              Custom Email Subject (Optional)
                            </label>
                            <Input
                              size="small"
                              placeholder="Default: Did you leave something sweet behind? 🍯"
                              value={customSubject}
                              onChange={(e) => setCustomSubject(e.target.value)}
                            />
                          </div>
                          <Button
                            size="base"
                            variant="primary"
                            className="w-full mt-2"
                            disabled={isSendingIndividual}
                            onClick={async () => {
                              setIsSendingIndividual(true)
                              toast.loading(`Sending recovery email to ${c.email}...`, { id: "drawer-notify" })
                              try {
                                await handleSendNotification(
                                  [c.id],
                                  customSubject || undefined,
                                  customDiscountCode || undefined
                                )
                                toast.dismiss("drawer-notify")
                                setCustomDiscountCode("")
                                setCustomSubject("")
                              } catch {
                                toast.dismiss("drawer-notify")
                              } finally {
                                setIsSendingIndividual(false)
                              }
                            }}
                          >
                            <Envelope className="h-4 w-4 mr-1.5" />
                            {isSendingIndividual ? "Sending Email..." : "Send Recovery Email Now"}
                          </Button>
                        </div>
                      )}

                      {/* Notification History Timeline */}
                      {c.notification_history && c.notification_history.length > 0 && (
                        <div className="space-y-2">
                          <Text className="text-xs font-medium text-ui-fg-muted uppercase tracking-wider">
                            Notification History
                          </Text>
                          <div className="space-y-2">
                            {c.notification_history.map((h: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2.5 rounded-lg border border-ui-border-base bg-ui-bg-subtle p-3 text-xs"
                              >
                                <CheckCircle className="h-4 w-4 text-ui-tag-green-icon mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-ui-fg-base">
                                    Sent to {h.recipient || c.email}
                                  </p>
                                  <p className="text-ui-fg-muted mt-0.5">
                                    {new Date(h.sent_at).toLocaleString()}
                                    {h.discount_code ? ` • Code: ${h.discount_code}` : ""}
                                    {h.automated ? " • (Automated Cron)" : " • (Admin Manual)"}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Drawer.Body>
                  </div>

                  <Drawer.Footer className="border-t border-ui-border-base p-4 bg-ui-bg-base">
                    <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
                      Close
                    </Button>
                  </Drawer.Footer>
                </div>
              )
            })()
          ) : (
            <div className="p-8 text-center text-ui-fg-muted">
              {isDrawerLoading ? "Loading cart details..." : "No cart selected"}
            </div>
          )}
        </Drawer.Content>
      </Drawer>

      <Toaster />
    </div>
  )
}

const AbandonedCartsPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AbandonedCartsContent />
    </QueryClientProvider>
  )
}

export const config = defineRouteConfig({
  label: "Abandoned Carts",
  icon: ShoppingCart,
})

export default AbandonedCartsPage

