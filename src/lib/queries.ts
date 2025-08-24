import { marketQuerySchema, ordersQuerySchema } from "./schema";

export async function fetchMarket(page: number, limit: number, headers?: HeadersInit) {
    const res = await fetch(`http://localhost:3000/api/market?page=${page}&limit=${limit}`,{
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        }
    })
    if (!res.ok) {
        if (res.status === 400) {
            const data = await res.json();
            throw new Error(data.message || "Bad Request");
        }
    }
    const data = await res.json();
    const parsedData = marketQuerySchema.safeParse(data);
    if (!parsedData.success) {
        throw new Error("Server Error: Invalid response format");
    }
    return parsedData.data;
}

export async function fetchOrders(page: number, limit: number, headers?: HeadersInit) {
    const res = await fetch(`http://localhost:3000/api/orders?page=${page}&limit=${limit}`, {
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        }
    })
    if (!res.ok) {
        if (res.status === 400) {
            const data = await res.json();
            throw new Error(data.message || "Bad Request");
        }
        if (res.status === 401) {
            throw new Error("Unauthorized: Please log in to view your orders.");
        }
    }
    const data = await res.json();

    const parsedData = ordersQuerySchema.safeParse(data);
    if (!parsedData.success) {
        console.error(parsedData.error);
        throw new Error("Server Error: Invalid response format");
    }
    return parsedData.data;
}