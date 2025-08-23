import z from "zod";
import { instrumentSchema, orderFormSchema, orderSchema, paginationSchema } from "./schema";

export type OrderForm = z.infer<typeof orderFormSchema>;
export type Instrument = z.infer<typeof instrumentSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Order = z.infer<typeof orderSchema>;


export type CreateDataContextProps<T> = {
    queryKey: string,
    queryFn: (page: number, limit: number) => Promise<{data: T[], pagination: Pagination}>
}

export type DataContextType<T> = {
    data: T[];
    pagination: Pagination;
    setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}