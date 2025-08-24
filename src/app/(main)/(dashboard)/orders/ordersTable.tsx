"use client"

import DataTable from "@/components/datatable/table"
import { ordersColumns } from "@/components/ordersColumns"
import { fetchOrders } from "@/lib/queries"

export default function OrdersTable() {
    return (
        <DataTable columns={ordersColumns} queryFn={fetchOrders} queryKey="orders" />
    )
}