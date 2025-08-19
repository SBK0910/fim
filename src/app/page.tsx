"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TableContent from "./tableContent";

const queryClient = new QueryClient()

export default function Home() {

	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-screen p-8 flex flex-col items-center">
				<h1 className="text-2xl font-semibold mb-6">Bond Instruments</h1>
				<TableContent />
			</div>
		</QueryClientProvider>
	);
}