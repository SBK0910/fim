"use client";

import { columns } from "@/components/table/columns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TableContent() {
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['market', pagination.pageIndex, pagination.pageSize],
        queryFn: () => fetch(`/api/market?page=${pagination.pageIndex}&limit=${pagination.pageSize}`).then(res => res.json())
    });


    const tableData = useMemo(() => data?.data || [], [data?.data]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        state: {
            pagination
        }
    });

    const skeletonRows = Array.from({ length: 5 });

    return (
        <div className="flex flex-col items-center w-full">
            {/* Table */}
            <div className="w-full overflow-x-auto rounded-md border">
                <Table className="min-w-[1000px]">
                    <TableHeader className="sticky top-0 z-10">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {isLoading
                            ? skeletonRows.map((_, idx) => (
                                <TableRow key={idx}>
                                    {columns.map((col, cIdx) => (
                                        <TableCell key={cIdx}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : table.getRowModel().rows.length
                                ? table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                                : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center py-6">
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )
                        }
                    </TableBody>
                </Table>
            </div>
            {/* Pagination */}
            <div className="flex flex-row items-right mt-4 w-full gap-3">
                <Select defaultValue={`${pagination.pageSize}`} onValueChange={(val) => {
                    setPagination(prev => ({...prev, pageSize: parseInt(val,10)}))
                }}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
                <div className="mt-2 text-sm text-accent-foreground tracking-tight ml-auto">
                    Page {pagination.pageIndex} of {data?.pagination.totalPages}
                </div>
                <Pagination className="w-fit mx-0">
                    <PaginationContent className="justify-center">
                        <PaginationItem className="hidden sm:flex">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPagination(prev => ({ ...prev, pageIndex: 1 }))}
                                disabled={pagination.pageIndex === 1}
                            >
                                {"<<"}
                            </Button>
                        </PaginationItem>

                        <PaginationItem>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                                disabled={pagination.pageIndex === 1}
                            >
                                {"<"}
                            </Button>
                        </PaginationItem>

                        <PaginationItem>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                                disabled={pagination.pageIndex === data?.pagination.totalPages}
                            >
                                {">"}
                            </Button>
                        </PaginationItem>

                        <PaginationItem className="hidden sm:flex">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPagination(prev => ({ ...prev, pageIndex: data?.pagination.totalPages }))}
                                disabled={pagination.pageIndex === data?.pagination.totalPages}
                            >
                                {">>"}
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}