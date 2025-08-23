import { z } from "zod";

export const orderFormSchema = z.object({
	quantity: z.number().int().gte(1, "Quantity must be at least 1"),
	type: z.enum(["market", "limit"], { message: "Order type is required" }),
	side: z.enum(["buy", "sell"]),
	ticker: z.string().min(1, "Ticker is required"),
	series: z.string().min(1, "Series is required"),
	limitPrice: z.number().positive("Limit price must be positive").optional(),
});

export const instrumentSchema = z.object({
	ticker: z.string(),
	series: z.string(),
	type: z.enum(["Regular", "Zero-Coupon", "Floating", "Other"]).nullable(),
	couponRate: z.number().nullable(),
	faceValue: z.number().nullable(),
	lastTradePrice: z.number().nullable(),
	percentChange: z.number().nullable(),
	volume: z.number().nullable(),
	valueInCrores: z.number().nullable(),
	creditRating: z.string().nullable(),
	maturityDate: z.string().nullable(),
	open: z.number().nullable(),
	high: z.number().nullable(),
	low: z.number().nullable(),
	close: z.number().nullable(),
})

export const orderSchema = z.object({
	orderId: z.string(),
	userId: z.string(),
	ticker: z.string(),
	series: z.string(),
	type: z.enum(["market", "limit"]),
	side: z.enum(["buy", "sell"]),
	quantity: z.number().int().nonnegative(),
	limitPrice: z.number().nullable().optional(),
	status: z.enum(["pending", "completed", "cancelled"]),
	createdAt: z.string().transform((val) => new Date(val)),
	updatedAt: z.string().transform((val) => new Date(val)),
});

export const paginationSchema = z.object({
	page: z.number().int().gte(1),
	limit: z.number().int().gte(1),
	total: z.number().int().gte(0),
	totalPages: z.number().int().gte(0),
})

export const marketQuerySchema = z.object({
	data: z.array(instrumentSchema),
	pagination: paginationSchema
})

export const ordersQuerySchema = z.object({
	data: z.array(orderSchema),
	pagination: paginationSchema
})