import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db/conn";
import { ordersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await db
    .select({
      id: ordersTable.orderId,
      side: ordersTable.side,
      qty: ordersTable.quantity,
      status: ordersTable.status,
      createdAt: ordersTable.createdAt,
    })
    .from(ordersTable)
    .where(eq(ordersTable.userId, userId))
    .orderBy(ordersTable.createdAt);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">No orders placed yet.</p>
      ) : (
        <table className="w-full text-sm border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Side</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Status</th>
              <th className="p-2">Placed</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-2">{order.side}</td>
                <td className="p-2">{order.qty}</td>
                <td className="p-2 capitalize">{order.status}</td>
                <td className="p-2 text-gray-500 text-xs">
                  {order.createdAt?.toLocaleDateString()}
                </td>
                <td className="p-2">
                  {order.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}