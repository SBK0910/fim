import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { TrendingUp } from "lucide-react"
import { fetchMarket } from "@/lib/queries"
import MarketData from "./_components/market /market-data"
import getQueryClient from "@/components/getQueryClient"

export default async function Home() {
	const queryClient = getQueryClient()

	await queryClient.prefetchQuery({
		queryKey: ["markets", 1, 10],
		queryFn: () => fetchMarket(1, 10),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
				<div className="min-h-screen bg-background p-4 md:p-6 pt-28 md:pt-20">
					<div className="max-w-7xl mx-auto">
						<div className="flex items-center justify-between mb-6 p-4 rounded-lg table-gradient">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-primary/10 rounded-lg">
									<TrendingUp className="h-5 w-5 text-primary" />
								</div>
								<div>
									<h1 className="text-2xl font-semibold text-foreground">Bond Instruments</h1>
									<p className="text-sm text-muted-foreground">
										Real-time market data & analytics
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 rounded-full border border-green-200 dark:border-green-800">
								<div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
								<span className="text-xs font-medium text-green-700 dark:text-green-400">
									Live
								</span>
							</div>
						</div>
						<MarketData />
					</div>
				</div>
		</HydrationBoundary>
	)
}