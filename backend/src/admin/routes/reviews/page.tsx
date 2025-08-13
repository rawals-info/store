import React, { useEffect, useMemo, useState } from "react"
// import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import {
  createDataTableColumnHelper,
  createDataTableCommandHelper,
  DataTableRowSelectionState,
  Container,
  DataTable,
  useDataTable,
  Heading,
  StatusBadge,
  Toaster,
  DataTablePaginationState,
  Input,
  Select,
  Button,
  DropdownMenu,
  type CheckboxCheckedState,
} from "@medusajs/ui"
import { toast } from "react-hot-toast"
import { sdk } from "../../lib/sdk"
import { HttpTypes } from "@medusajs/framework/types"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

// Define the Review type according to your API response
type Review = {
  id: string
  title?: string
  content: string
  rating: number
  product_id: string
  customer_id?: string
  status: "pending" | "approved" | "rejected"
  created_at: Date
  updated_at: Date
  product?: HttpTypes.AdminProduct
  customer?: HttpTypes.AdminCustomer
}

const columnHelper = createDataTableColumnHelper<Review>()

// Add select column as first column
const columns = [
  columnHelper.select(),
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("title", {
    header: "Title",
  }),
  columnHelper.accessor("rating", {
    header: "Rating",
  }),
  columnHelper.accessor("content", {
    header: "Content",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const color =
        row.original.status === "approved"
          ? "green"
          : row.original.status === "rejected"
          ? "red"
          : "grey"

      return (
        <StatusBadge color={color}>
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </StatusBadge>
      )
    },
  }),
  columnHelper.accessor("product", {
    header: "Product",
    cell: ({ row }) => (
      <a href={`/app/products/${row.original.product_id}`}>{row.original.product?.title}</a>
    ),
  }),
]

const commandHelper = createDataTableCommandHelper()

// Hook to generate approve/reject commands
const useCommands = (refetch: () => void) => [
  commandHelper.command({
    label: "Approve",
    shortcut: "A",
    action: async (selection) => {
      const reviewsToApproveIds = Object.keys(selection)
      try {
        await sdk.client.fetch("/admin/reviews/status", {
          method: "POST",
          body: {
            ids: reviewsToApproveIds,
            status: "approved",
          },
        })
        toast.success("Reviews approved")
        refetch()
      } catch {
        toast.error("Failed to approve reviews")
      }
    },
  }),
  commandHelper.command({
    label: "Reject",
    shortcut: "R",
    action: async (selection) => {
      const reviewsToRejectIds = Object.keys(selection)
      try {
        await sdk.client.fetch("/admin/reviews/status", {
          method: "POST",
          body: {
            ids: reviewsToRejectIds,
            status: "rejected",
          },
        })
        toast.success("Reviews rejected")
        refetch()
      } catch {
        toast.error("Failed to reject reviews")
      }
    },
  }),
]

const DEFAULT_PAGE_SIZE = 50

const ReviewsContent: React.FC = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: DEFAULT_PAGE_SIZE,
    pageIndex: 0,
  })

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({})

  const [productInput, setProductInput] = useState("")
  const [product, setProduct] = useState("")
  const [productIds, setProductIds] = useState<string[]>([])
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "all">("all")

  useEffect(() => {
    const id = setTimeout(() => setProduct(productInput), 400)
    return () => clearTimeout(id)
  }, [productInput])

  // Reset pagination when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [product, productIds, status])

  const offset = useMemo(() => pagination.pageIndex * pagination.pageSize, [pagination])

  const { data, isLoading, refetch } = useQuery<{
    reviews: Review[]
    count: number
    limit: number
    offset: number
  }>({
    queryKey: ["reviews", offset, pagination.pageSize, product, productIds, status],
    queryFn: () => {
      const queryParams = {
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        order: "-created_at",
        ...(product ? { product } : {}),
        ...(productIds.length ? { product_ids: productIds } : {}),
        ...(status !== "all" ? { status } : {}),
      }
      console.log("Query params:", queryParams)
      return sdk.client.fetch("/admin/reviews", {
        query: queryParams,
      })
    },
  })

  // Load product options for dropdown
  const { data: productOptions } = useQuery<{ products: Array<{ id: string; title: string }> }>({
    queryKey: ["review-product-options"],
    queryFn: () =>
      sdk.client.fetch("/admin/products", {
        query: {
          limit: 200,
          fields: "id,title",
          order: "title",
        },
      }),
  })

  const commands = useCommands(refetch)

  const table = useDataTable({
    columns,
    data: data?.reviews || [],
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
  })

  return (
      <Container>
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
            <Heading>Reviews</Heading>
            <div className="flex w-full items-center gap-2 md:w-auto">
              <Input
                size="small"
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="Filter by product name"
                className="w-full md:w-72"
              />
              <Select
                size="small"
                value={status}
                onValueChange={(value) => setStatus(value as any)}
              >
                <Select.Trigger className="w-48">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="all">All statuses</Select.Item>
                  <Select.Item value="approved">Approved</Select.Item>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="rejected">Rejected</Select.Item>
                </Select.Content>
              </Select>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <Button size="small" variant="secondary">
                    {productIds.length ? `${productIds.length} products` : "All products"}
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="w-64">
                  <DropdownMenu.CheckboxItem
                    checked={productIds.length === 0}
                    onCheckedChange={(checked) => {
                      if (checked) setProductIds([])
                    }}
                  >
                    All products
                  </DropdownMenu.CheckboxItem>
                  <DropdownMenu.Separator />
                  {(productOptions?.products || []).map((p) => {
                    const checked = productIds.includes(p.id)
                    return (
                      <DropdownMenu.CheckboxItem
                        key={p.id}
                        checked={checked}
                        onCheckedChange={(isChecked: CheckboxCheckedState) => {
                          const shouldCheck = isChecked === true
                          setProductIds((prev) => {
                            if (shouldCheck && !prev.includes(p.id)) return [...prev, p.id]
                            if (!shouldCheck) return prev.filter((id) => id !== p.id)
                            return prev
                          })
                        }}
                      >
                        {p.title}
                      </DropdownMenu.CheckboxItem>
                    )
                  })}
                </DropdownMenu.Content>
              </DropdownMenu>
              <Select
                size="small"
                value={String(pagination.pageSize)}
                onValueChange={(value) =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: 0,
                    pageSize: parseInt(value, 10),
                  }))
                }
              >
                <Select.Trigger className="w-24">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="15">15</Select.Item>
                  <Select.Item value="50">50</Select.Item>
                  <Select.Item value="100">100</Select.Item>
                </Select.Content>
              </Select>
              {(product || status !== "all") && (
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => {
                    setProductInput("")
                    setProduct("")
                    setStatus("all")
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </DataTable.Toolbar>
          <DataTable.Table />
          <DataTable.Pagination />
          <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />
        </DataTable>
        <Toaster />
      </Container>
  )
}

const ReviewsPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReviewsContent />
    </QueryClientProvider>
  )
}

export const config = defineRouteConfig({
  label: "Reviews",
  icon: ChatBubbleLeftRight,
})

export default ReviewsPage
