'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FileText } from "lucide-react"
import { OrdersProvider, useOrdersContext } from "@/components/providers/orders-provider"
import { DataTable } from "@/components/datatable/data-table"
import { useRouter } from "next/navigation"
import { orderColumns } from "@/components/columns/orders"

const queryClient = new QueryClient()

export default function OrdersPage() {
  const router = useRouter()

  return (
    <QueryClientProvider client={queryClient}>
      <OrdersProvider>
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
              columns={orderColumns}
              useDataHook={useOrdersContext}
              onRowClick={(row) => {
                const orderId = row.original?.orderId
                if (orderId) {
                  router.push(`/orders/${orderId}`)
                }
              }}
            />
          </div>
        </div>
      </OrdersProvider>
    </QueryClientProvider>
  )
}