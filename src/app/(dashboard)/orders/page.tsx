'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FileText } from "lucide-react"
import { OrdersProvider, useOrdersContext } from "@/components/providers/orders-provider"
import { DataTable } from "@/components/datatable/data-table"
import { orderColumns } from "@/components/columns/orders"
import useCancelOrder from "@/hooks/cancel-order"
import { useState } from "react"

const queryClient = new QueryClient()

export default function OrdersPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrdersProvider>
        <OrdersContent />
      </OrdersProvider>
    </QueryClientProvider>
  )
}

// Separate component inside OrdersProvider
function OrdersContent() {
  const { pagination } = useOrdersContext()
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null)

  const cancelOrder = useCancelOrder(queryClient, pagination)

  const handleCancel = (orderId: string) => {
    setCancelingOrderId(orderId) // Start loading for this order
    cancelOrder.mutate(orderId, {
      onSettled: () => setCancelingOrderId(null), // Stop loading after mutation completes
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pt-28 md:pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 p-4 rounded-lg table-gradient">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
              <p className="text-sm text-muted-foreground">Your order history & current positions</p>
            </div>
          </div>
        </div>

        <DataTable
          columns={orderColumns(handleCancel, cancelingOrderId)}
          useDataHook={useOrdersContext}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}