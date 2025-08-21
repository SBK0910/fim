import { Order } from "@/lib/types"; // Define your Order type
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

type OrdersProviderProps = {
  children: ReactNode;
};

type Pagination = {
  pageIndex: number;
  pageSize: number;
};

type OrdersContextType = {
  data: Order[] | undefined;
  pagination: Pagination;
  totalPages: number;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: OrdersProviderProps) {
  const [pagination, setPagination] = useState<Pagination>({ pageIndex: 1, pageSize: 10 });

  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ["orders", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      fetch(`/api/orders?page=${pagination.pageIndex}&limit=${pagination.pageSize}`).then((res) => res.json()),
  });

  // Extract the actual data and totalPages safely
  const data: Order[] | undefined = response?.data;
  const totalPages: number = response?.pagination?.totalPages || 1;

  return (
    <OrdersContext.Provider
      value={{
        data,
        pagination,
        setPagination,
        totalPages,
        isLoading,
        isError,
        error: error || null,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrdersContext() {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrdersContext must be used within an OrdersProvider");
  return context;
}