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

export async function PUT(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { orderId, ...updateFields } = body;

        if (!orderId || typeof orderId !== "string") {
            return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
        }

        const result = orderFormSchema.safeParse(updateFields);
        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.format() },
                { status: 400 }
            );
        }

        const updatedOrder = await db
            .update(ordersTable)
            .set({
                ...updateFields,
            })
            .where(ordersTable.id.eq(orderId))
            .returning();

        if (!updatedOrder) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Order updated successfully", updatedOrder },
            { status: 200 }
        );
    } catch (err) {
        console.error("Order update error:", err);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}