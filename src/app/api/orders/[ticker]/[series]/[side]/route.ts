import { db } from "@/db/conn";
import { ordersTable } from "@/db/schema";
import { orderFormSchema } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest, { params }: { params: Promise<{ ticker: string; series: string; side: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const resolvedParams = await params;

        if (resolvedParams.side !== "buy" && resolvedParams.side !== "sell") {
            return NextResponse.json({ error: "Invalid side parameter" }, { status: 400 });
        }

        const body = await req.json();
        const result = orderFormSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: z.treeifyError(result.error) },
                { status: 400 }
            );
        }

        const order = await db
            .insert(ordersTable)
            .values({
                quantity: result.data.quantity,
                series: resolvedParams.series,
                side: resolvedParams.side,
                ticker: resolvedParams.ticker,
                type: result.data.type,
                userId: userId,
                limitPrice: result.data.limitPrice
            })
            .returning();
        
        return NextResponse.json(
            { message: "Order created successfully", order },
            { status: 201 }
        );

    }catch (err) {
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