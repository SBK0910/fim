"use client"

import { DataTable } from "@/components/datatable/table"
import { createDataContext } from "@/components/providers/datacontext"
import { fetchMarket } from "@/lib/queries"
import { useRouter } from "next/navigation"
import { columns } from "./market-columns"

export default function MarketData() {
	const router = useRouter()

	const {
		DataContextProvider: MarketProvider,
		useDataContext: useMarket
	} = createDataContext({
		queryKey: 'markets',
		queryFn: fetchMarket
	})

	return (
		<MarketProvider>
			<DataTable
				columns={columns}
				useDataHook={useMarket}
				onRowClick={(row) => {
					const ticker = row.original?.ticker
					const series = row.original?.series
					if (ticker && series) {
						router.push(`/instrument/${ticker}/${series}`)
					}
				}}
			/>
		</MarketProvider>

	)
}