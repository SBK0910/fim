"use client";

import { columns, Instrument } from "@/components/table/columns";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

const sampleData: Instrument[] = [
	{
		ticker: "101NFL26",
		series: "N1",
		type: "Regular",
		couponRate: 10.75,
		faceValue: 1000,
		lastTradePrice: 1010.5,
		percentChange: 0.5,
		volume: 1200,
		valueInCrores: 12.15,
		creditRating: "CRISIL A/Stable",
		maturityDate: "2026-06-13",
	},
	{
		ticker: "1075SCL34C",
		series: "N1",
		type: "Zero-Coupon",
		couponRate: null,
		faceValue: 1000,
		lastTradePrice: 900,
		percentChange: -0.2,
		volume: 500,
		valueInCrores: 4.5,
		creditRating: "CRISIL AA/Stable",
		maturityDate: "2034-09-25",
	},
	{
		ticker: "1102NFL26",
		series: "N8",
		type: "Floating",
		couponRate: 11.02,
		faceValue: 1000,
		lastTradePrice: 1021.25,
		percentChange: 0.0,
		volume: 750,
		valueInCrores: 7.65,
		creditRating: "CRISIL A/Stable",
		maturityDate: "2026-07-18",
	},
	{
		ticker: "11UCL26",
		series: "NC",
		type: "Other",
		couponRate: 11.0,
		faceValue: 1000,
		lastTradePrice: 1017,
		percentChange: 0.1,
		volume: 900,
		valueInCrores: 9.15,
		creditRating: "FITCH A/Stable",
		maturityDate: "2026-05-27",
	},
	{
		ticker: "1090NFL26",
		series: "NB",
		type: "Regular",
		couponRate: 10.9,
		faceValue: 1000,
		lastTradePrice: 1046.8,
		percentChange: 0.3,
		volume: 600,
		valueInCrores: 6.28,
		creditRating: "CRISIL A/Stable",
		maturityDate: "2026-06-13",
	},
];

export default function Home() {
	const table = useReactTable({
		data: sampleData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="min-h-screen p-8 flex flex-col items-center">
			<h1 className="text-2xl font-semibold mb-6">Bond Instruments</h1>

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
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center py-6">
									No results found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}