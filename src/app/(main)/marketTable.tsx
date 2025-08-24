"use client"

import DataTable from "@/components/datatable/table"
import { marketColumns } from "@/components/marketColumns"
import { fetchMarket } from "@/lib/queries"

export default function MarketTable() {
    return (
        <DataTable columns={marketColumns} queryFn={fetchMarket} queryKey="markets" />
    )
}