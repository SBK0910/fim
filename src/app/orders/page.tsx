import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/db/conn"
import { ordersTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function OrdersPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
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
    .orderBy(ordersTable.createdAt)

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track your trading activity and order history</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">No orders placed yet</p>
              <p className="text-sm text-muted-foreground">
                Your order history will appear here once you start trading
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Order History ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold">Side</th>
                      <th className="text-left p-4 font-semibold">Quantity</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Date Placed</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.id} className={`border-b ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                        <td className="p-4">
                          <Badge variant={order.side === "buy" ? "default" : "secondary"}>
                            {order.side.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 font-medium">{order.qty}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "default"
                                : order.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {order.createdAt?.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="p-4">
                          {order.status === "pending" && (
                            <Button variant="outline" size="sm">
                              Edit Order
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
