'use client'

import {
	ColumnDef,
	getCoreRowModel,
	useReactTable,
	flexRender,
} from "@tanstack/react-table"
import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "../ui/skeleton"
import PaginationControls from "./pagination"
import { createDataContext, DataContextType } from "../providers/datacontext"


interface DataTableProps<T> {
	columns: ColumnDef<T, any>[] // eslint-disable-line
	queryFn: (page: number, limit: number, headers?: HeadersInit) => Promise<{ data: T[], pagination: { page: number, limit: number, total: number, totalPages: number } }>
	queryKey: string
}

function InnerTable<T>({ columns, useDataContext }: {
	columns: ColumnDef<T, any>[] // eslint-disable-line
	useDataContext: () => DataContextType<T>
}) {

	const { data, pagination, isLoading, isError, error } = useDataContext()

	const tableData = useMemo(() => data || [], [data])

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		state: {
			pagination: {
				pageIndex: pagination.page - 1,
				pageSize: pagination.limit,
			},
		},
	})

	const skeletonRows = Array.from({ length: 5 })

	return (
			<div className="flex flex-col w-full space-y-6">
				<div className="bg-card rounded-lg border shadow-sm card-shadow hover-lift">
					<div className="overflow-x-auto">
						<Table className="min-w-[1000px]">
							<TableHeader className="table-gradient border-b">
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id} className="font-semibold text-foreground/90 py-4">
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>

							<TableBody>
								{isLoading ? (
									skeletonRows.map((_, idx) => (
										<TableRow key={idx}>
											{columns.map((col, cIdx) => (
												<TableCell key={cIdx} className="py-4">
													<Skeleton className="h-5 w-full" />
												</TableCell>
											))}
										</TableRow>
									))
								) : isError ? (
									<TableRow>
										<TableCell colSpan={columns.length} className="text-center py-12 text-red-600">
											{error?.message || "Something went wrong."}
										</TableCell>
									</TableRow>
								) : table.getRowModel().rows.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											className="cursor-pointer hover:bg-primary/5 transition-all duration-200 border-b border-border/50 hover:border-primary/20"
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id} className="py-4">
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={columns.length} className="text-center py-12 text-muted-foreground">
											No records found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
				<PaginationControls useDataHook={useDataContext} />
			</div>
	)
}

export default function DataTable<T>({ columns, queryFn, queryKey }: DataTableProps<T>) {
	const { DataContextProvider, useDataContext } = useMemo(() => createDataContext<T>({ queryKey, queryFn }), [queryKey, queryFn])	
	return (
		<DataContextProvider>
			<InnerTable columns={columns} useDataContext={useDataContext} />
		</DataContextProvider>
	)
}