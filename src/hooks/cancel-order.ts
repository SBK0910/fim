import { useMutation, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useCancelOrder(client: QueryClient, pagination: { pageIndex: number; pageSize: number }) {
	return useMutation({
		mutationFn: async (orderId: string) => {
			const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to cancel order");
			return res.json();
		},
		onSuccess: () => {
			client.invalidateQueries({
				queryKey: ["orders", pagination.pageIndex, pagination.pageSize],
			});
			toast.success("Order cancelled successfully!");
		},
		onError: (error) => {
			toast.error(error?.message || "Failed to cancel order");
		},
	});
}