import { db } from "@/db/conn";
import { ordersTable } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { orderFormSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const result = orderFormSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid input", details: result.error.format() },
				{ status: 400 }
			);
		}

		const order = await db
			.insert(ordersTable)
			.values({
				quantity: result.data.quantity.toString(),
				series: result.data.series,
				side: result.data.side,
				ticker: result.data.ticker,
				type: result.data.type,
				userId: user.id,
				limitPrice: result.data.limitPrice?.toString()
			})
			.returning();

		return NextResponse.json(
			{ message: "Order created successfully", order },
			{ status: 201 }
		);
	} catch (err) {
		console.error("Order creation error:", err);

		if (err && typeof err === 'object' && err !== null && 'code' in err && (err as { code: string; constraint: string }).code === "23503" && (err as { code: string; constraint: string }).constraint === "instrument_fk") {
			return NextResponse.json(
				{
					error: "Invalid instrument",
					details: "The given ticker/series does not exist in instruments table",
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}


export async function GET(req: NextRequest) {
	try {
		const user = await currentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const url = new URL(req.url);
		const page = parseInt(url.searchParams.get("page") || "1");
		const limit = parseInt(url.searchParams.get("limit") || "10");

		if (page < 1 || limit < 1) {
			return NextResponse.json(
				{ success: false, message: "Invalid pagination parameters" },
				{ status: 400 }
			);
		}

		const offset = (page - 1) * limit;

		const countResult = await db
			.select({ count: count() })
			.from(ordersTable)
			.where(eq(ordersTable.userId, user.id));

		const total = Number(countResult[0]?.count ?? 0);

		const orders = await db
			.select()
			.from(ordersTable)
			.where(eq(ordersTable.userId, user.id))
			.limit(limit)
			.offset(offset);

		return NextResponse.json(
			{
				success: true,
				data: orders,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching user orders:", error);

		return NextResponse.json(
			{ success: false, message: "Failed to fetch orders." },
			{ status: 500 }
		);
	}
}