"use client"

import { DataTable } from "@/components/datatable/table"
import { createDataContext } from "@/components/providers/datacontext"
import { fetchOrders } from "@/lib/queries"
import { useRouter } from "next/navigation"
import { columns } from "./orders-columns"

export default function OrdersData() {
	const router = useRouter()

	const {
		DataContextProvider: OrdersProvider,
		useDataContext: useOrders
	} = createDataContext({
		queryKey: 'orders',
		queryFn: fetchOrders
	})

	return (
		<OrdersProvider>
			<DataTable
				columns={columns}
				useDataHook={useOrders}
				onRowClick={(row) => {
					const orderId = row.original?.orderId
					if (orderId) {
						router.push(`/orders/${orderId}`)
					}
				}}
			/>
		</OrdersProvider>
	)
}