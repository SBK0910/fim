"use client"

import { columns } from "@/components/table/columns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function TableContent() {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["market", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      fetch(`/api/market?page=${pagination.pageIndex}&limit=${pagination.pageSize}`).then((res) => res.json()),
  })

  const tableData = useMemo(() => data?.data || [], [data?.data])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination,
    },
  })

  const skeletonRows = Array.from({ length: 5 })
  const router = useRouter()

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
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-primary/5 transition-all duration-200 border-b border-border/50 hover:border-primary/20"
                    onClick={() => {
                      const ticker = row.original?.ticker
                      const series = row.original?.series
                      if (ticker && series) {
                        router.push(`/instrument?ticker=${ticker}&series=${series}`)
                      }
                    }}
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
                    No bond instruments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4 px-2 py-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Rows:</span>
          <Select
            defaultValue={`${pagination.pageSize}`}
            onValueChange={(val) => {
              setPagination((prev) => ({ ...prev, pageSize: Number.parseInt(val, 10) }))
            }}
          >
            <SelectTrigger className="w-16 h-8">
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
            Page {pagination.pageIndex} of {data?.pagination?.totalPages || 1}
          </span>

          <Pagination className="w-fit">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => setPagination((prev) => ({ ...prev, pageIndex: 1 }))}
                  disabled={pagination.pageIndex === 1}
                >
                  {"<<"}
                </Button>
              </PaginationItem>

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                  disabled={pagination.pageIndex === 1}
                >
                  {"<"}
                </Button>
              </PaginationItem>

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                  disabled={pagination.pageIndex === (data?.pagination?.totalPages || 1)}
                >
                  {">"}
                </Button>
              </PaginationItem>

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => setPagination((prev) => ({ ...prev, pageIndex: data?.pagination?.totalPages || 1 }))}
                  disabled={pagination.pageIndex === (data?.pagination?.totalPages || 1)}
                >
                  {">>"}
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
