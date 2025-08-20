// schema.ts
import { z } from "zod";

export const orderFormSchema = z.object({
    quantity: z.number().int().gte(1, "Quantity must be at least 1"),
    type: z.enum(["market", "limit"], { message: "Order type is required" }),
    side: z.enum(["buy", "sell"]),
    ticker: z.string().min(1, "Ticker is required"),
    series: z.string().min(1, "Series is required"),
    limitPrice: z.number().positive("Limit price must be positive").optional(),
});