import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Instrument } from "@/lib/types"
import Link from "next/link"

const columnHelper = createColumnHelper<Instrument>()

export const marketColumns = [
	columnHelper.accessor("ticker", {
		header: () => (
			<Button variant="ghost" className="px-3 py-6 text-sm font-medium">
				Ticker
			</Button>
		),
		cell: ({ row }) => <Link href={`/instrument/${row.original.ticker}/${row.original.series}`} className="px-3">{row.original.ticker}</Link>
	}),
	columnHelper.accessor("series", {
		header: () => (
			<Button variant="ghost" className="px-3 py-3 text-sm font-medium">
				Series
			</Button>
		),
		cell: (info) => <div className="px-3">{info.getValue()}</div>,
	}),
	columnHelper.accessor("type", {
		header: () => (
			<Button variant="ghost" className="px-3 py-3 text-sm font-medium">
				Bond Type
			</Button>
		),
		cell: (info) => <div className="px-3">{info.getValue() ?? "-"}</div>,
	}),
	columnHelper.accessor("maturityDate", {
		header: () => (
			<Button variant="ghost" className="px-3 py-3 text-sm font-medium">
				Maturity Date
			</Button>
		),
		cell: (info) => {
			const dateStr = info.getValue()
			if (!dateStr) return <span className="px-3">-</span>

			const date = new Date(dateStr)
			const formatted = new Intl.DateTimeFormat("en-GB", {
				day: "2-digit",
				month: "long",
				year: "numeric",
			}).format(date)

			return <span className="px-3">{formatted}</span>
		},
	}),
	columnHelper.accessor("couponRate", {
		header: () => (
			<Button
				variant="ghost"
				className="px-3 py-3 text-sm font-medium justify-end w-full"
			>
				Coupon Rate (%)
			</Button>
		),
		cell: (info) => (
			<div className="px-3 text-right">{info.getValue()?.toFixed(2) ?? "-"}</div>
		),
	}),
	columnHelper.accessor("lastTradePrice", {
		header: () => (
			<Button
				variant="ghost"
				className="px-3 py-3 text-sm font-medium justify-end w-full"
			>
				LTP
			</Button>
		),
		cell: (info) => (
			<div className="px-3 text-right">
				{info.getValue()?.toLocaleString() ?? "-"}
			</div>
		),
	}),
	columnHelper.accessor("percentChange", {
		header: () => (
			<Button
				variant="ghost"
				className="px-3 py-3 text-sm font-medium justify-end w-full"
			>
				Change (%)
			</Button>
		),
		cell: (info) => (
			<div className="px-3 py-1 text-right">{info.getValue()?.toFixed(2) ?? "-"}</div>
		),
	}),
]
