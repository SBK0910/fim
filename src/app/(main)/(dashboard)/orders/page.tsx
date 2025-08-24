import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { FileText } from "lucide-react"
import getQueryClient from "@/components/getQueryClient"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { fetchOrders } from "@/lib/queries"
import OrdersTable from "./ordersTable"

export default async function OrdersPage() {
	const { getToken } = await auth()
	const token = await getToken()

	if (!token) {
		return redirect('/login')
	}

	const queryClient = getQueryClient()

	await queryClient.prefetchQuery({
		queryKey: ["orders", 1, 10],
		queryFn: () => fetchOrders(1, 10, { Authorization: `Bearer ${token}` })
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="min-h-screen bg-background p-4 md:p-6 pt-28 md:pt-20">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between mb-6 p-4 rounded-lg table-gradient">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg">
								<FileText className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h1 className="text-2xl font-semibold text-foreground">Orders</h1>
								<p className="text-sm text-muted-foreground">
									Your order history & current positions
								</p>
							</div>
						</div>
					</div>
					<OrdersTable />
				</div>
			</div>
		</HydrationBoundary>
	)
}