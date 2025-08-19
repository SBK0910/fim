// schema.ts
import { z } from "zod";

export const orderFormSchema = z.object({
    quantity: z.number().int().gte(1, "Quantity must be at least 1"),
    orderType: z.enum(["market", "limit"], {
        error: "Order type is required",
    }),
    order: z.enum(["sell","buy"]),
    ticker: z.string().min(1, "Ticker is required"),
    series: z.string().min(1, "Series is required"),
    limit: z.number().positive("Limit price must be positive"),
});