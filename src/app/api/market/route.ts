import { db } from "@/db/conn";
import { instrumentsTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url)
		const page = parseInt(url.searchParams.get("page") || "1")
		const limit = parseInt(url.searchParams.get("limit") || "10");

		if (page < 1 || limit < 1) {
			return NextResponse.json(
				{ success: false, message: "Invalid pagination parameters" },
				{ status: 400 }
			);
		}

		const offset = (page - 1) * limit;

		const instruments = await db
			.select()
			.from(instrumentsTable)
			.limit(limit)
			.offset(offset);

		return NextResponse.json(
			{ success: true, data: instruments },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching instruments:", error);

		return NextResponse.json(
			{ success: false, message: "Failed to fetch instruments." },
			{ status: 500 }
		);
	}
}