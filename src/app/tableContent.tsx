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
import { useMemo } from "react";

export default function TableContent() {
    const { data, isLoading } = useQuery({
        queryKey: ['market'],
        queryFn: () => fetch(`/api/market`).then(res => res.json())
    });

    const tableData = useMemo(() => data?.data || [], [data?.data]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const skeletonRows = Array.from({ length: 5 });

    return (
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
    );
}