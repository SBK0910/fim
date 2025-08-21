import { db } from "@/db/conn";
import { ordersTable } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

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
      .where(eq(ordersTable.userId,user.id));

    const total = Number(countResult[0]?.count ?? 0);

    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId,user.id))
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