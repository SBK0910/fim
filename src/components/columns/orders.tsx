import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Order } from "@/lib/types" // Define your Order type accordingly
import { Edit2, Loader2, Trash2 } from "lucide-react"

const columnHelper = createColumnHelper<Order>()

const titleCase = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export const orderColumns = (handleCancel: (orderId: string) => void, cancelingOrderId: string | null) => [
	columnHelper.accessor("ticker", {
		header: () => (
			<div className="px-3 py-3 text-sm font-medium">Ticker</div>
		),
		cell: (info) => <div className="px-3">{info.getValue()}</div>,
	}),
	columnHelper.accessor("series", {
		header: () => (
			<div className="px-3 py-3 text-sm font-medium">Series</div>
		),
		cell: (info) => <div className="px-3">{info.getValue()}</div>,
	}),
	columnHelper.accessor("side", {
		header: () => <div className="px-3 py-3 text-sm font-medium">Side</div>,
		cell: (info) => {
			const value = info.getValue()
			return <div className="px-3">{value ? titleCase(value) : "-"}</div>
		},
	}),
	columnHelper.accessor("quantity", {
		header: () => (
			<div className="px-3 py-3 text-sm font-medium text-right">Quantity</div>
		),
		cell: (info) => (
			<div className="px-3 text-right">{info.getValue()?.toLocaleString()}</div>
		),
	}),
	columnHelper.accessor("createdAt", {
		header: () => (
			<div className="px-3 py-3 text-sm font-medium">When</div>
		),
		cell: (info) => {
			const dateStr = info.getValue()
			if (!dateStr) return <span className="px-3">-</span>

			const date = new Date(dateStr)
			const formatted = new Intl.DateTimeFormat("en-GB", {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			}).format(date)

			return <span className="px-3">{formatted}</span>
		},
	}),
	columnHelper.accessor("status", {
		header: () => (
			<div className="px-3 py-3 text-sm font-medium">Status</div>
		),
		cell: (info) => {
			const status = info.getValue()
			if (!status) return "-"
			return <div className="px-3">{titleCase(info.getValue())}</div>
		},
	}),
	columnHelper.accessor("limitPrice", {
		header: () => (
			<div className="px-3 py-3 text-sm font-medium text-right">Price</div>
		),
		cell: (info) => {
			const price = info.getValue()
			return (
				<div className="px-3 text-right">
					{price !== null && price !== undefined ? price : "Market"}
				</div>
			)
		},
	}),
	columnHelper.display({
		id: "actions",
		header: () => <div className="px-3 py-3 text-sm font-medium">Actions</div>,
		cell: ({ row }) => {
			const orderId = row.original.orderId
			const status = row.original.status
			const isLoading = cancelingOrderId === orderId

			return (
				<div className="flex gap-2 px-3 items-center justify-center">
					{status === "pending" && !isLoading && (
						<>
							<Button
								size="sm"
								variant="destructive"
								onClick={() => handleCancel(orderId)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>

							{/* Edit button remains unaffected */}
							<Button
								size="sm"
								variant="secondary"
								onClick={() => console.log("Edit order", orderId)}
							>
								<Edit2 className="h-4 w-4" />
							</Button>
						</>
					)}
					{status === "pending" && isLoading && (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
						</>
					)}
				</div>
			)
		},
	}),
]