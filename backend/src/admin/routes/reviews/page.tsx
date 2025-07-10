import React, { useMemo, useState } from "react"
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

const limit = 15

const ReviewsContent: React.FC = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  })

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({})

  const offset = useMemo(() => pagination.pageIndex * limit, [pagination])

  const { data, isLoading, refetch } = useQuery<{
    reviews: Review[]
    count: number
    limit: number
    offset: number
  }>({
    queryKey: ["reviews", offset, limit],
    queryFn: () =>
      sdk.client.fetch("/admin/reviews", {
        query: {
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          order: "-created_at",
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
