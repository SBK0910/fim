import { db } from "@/db/conn";
import { ordersTable } from "@/db/schema";
import { orderFormSchema } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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

        if (err && typeof err === 'object' && err !== null && 'code' in err && (err as { code: string; constraint: string }).code === "23503" && (err as { code: string; constraint: string }).constraint === "fk_orders_instruments") {
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
