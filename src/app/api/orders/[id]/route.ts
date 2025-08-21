import { db } from "@/db/conn"
import { ordersTable } from "@/db/schema"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"

interface Params {
  id: string
}

export async function DELETE(
	req: Request,
	context: { params: Promise<Params> }
) {
	const orderId = (await context.params).id

	try {
		const user = await currentUser()
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const result = await db
			.update(ordersTable)
			.set({ status: "cancelled" })
			.where(and(eq(ordersTable.orderId, orderId), eq(ordersTable.userId, user.id)))
			.returning()

		if (result.length === 0) {
			return NextResponse.json(
				{ error: `Order ${orderId} not found or not yours` },
				{ status: 404 }
			)
		}

		return NextResponse.json(
			{ message: `Order ${orderId} marked as cancelled successfully` },
			{ status: 200 }
		)
	} catch (err) {
		console.error("Cancel order error:", err)
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		)
	}
}