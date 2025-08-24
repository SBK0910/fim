'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "../ui/button"
import { Pagination, PaginationContent, PaginationItem } from "../ui/pagination"
import { DataContextType } from "@/components/providers/datacontext"

interface PaginationControlsProps<T> {
	useDataHook: () => DataContextType<T>
}

export default function PaginationControls<T>({ useDataHook }: PaginationControlsProps<T>) {
	const { pagination, setPagination } = useDataHook()
	return (
		<div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4 px-2 py-2">
			<div className="flex items-center gap-2 text-sm">
				<span className="text-muted-foreground">Rows:</span>
				<Select
					defaultValue={`${pagination.limit}`}
					onValueChange={(val) => {
						setPagination((prev) => ({ ...prev, pageSize: Number.parseInt(val, 10) }))
					}}
				>
					<SelectTrigger className="h-8">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="15">15</SelectItem>
						<SelectItem value="25">25</SelectItem>
						<SelectItem value="50">50</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-4">
				<span className="text-sm text-muted-foreground">
					Page {pagination.page} of {pagination.totalPages || 1}
				</span>

				<Pagination className="w-fit">
					<PaginationContent className="gap-1">
						<PaginationItem>
							<Button
								variant="outline"
								size="sm"
								className="h-8 w-8 p-0 bg-transparent"
								onClick={() => setPagination((prev) => ({ ...prev, page: 1 }))}
								disabled={pagination.page === 1}
							>
								{"<<"}
							</Button>
						</PaginationItem>

						<PaginationItem>
							<Button
								variant="outline"
								size="sm"
								className="h-8 w-8 p-0 bg-transparent"
								onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
								disabled={pagination.page === 1}
							>
								{"<"}
							</Button>
						</PaginationItem>

						<PaginationItem>
							<Button
								variant="outline"
								size="sm"
								className="h-8 w-8 p-0 bg-transparent"
								onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
								disabled={pagination.page === (pagination.totalPages || 1)}
							>
								{">"}
							</Button>
						</PaginationItem>

						<PaginationItem>
							<Button
								variant="outline"
								size="sm"
								className="h-8 w-8 p-0 bg-transparent"
								onClick={() => setPagination((prev) => ({ ...prev, page: pagination.totalPages || 1 }))}
								disabled={pagination.page === (pagination.totalPages || 1)}
							>
								{">>"}
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	)
}