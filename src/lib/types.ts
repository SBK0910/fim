import z from "zod";
import { instrumentSchema, orderFormSchema, orderSchema, paginationSchema } from "./schema";

export type OrderForm = z.infer<typeof orderFormSchema>;
export type Instrument = z.infer<typeof instrumentSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Order = z.infer<typeof orderSchema>;