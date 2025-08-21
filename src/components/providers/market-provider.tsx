import { Instrument } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

type MarketProviderProps = {
  children: ReactNode;
};

type Pagination = {
  pageIndex: number;
  pageSize: number;
};

type MarketContextType = {
  data: Instrument[] | undefined;
  pagination: Pagination;
  totalPages: number;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: MarketProviderProps) {
  const [pagination, setPagination] = useState<Pagination>({ pageIndex: 1, pageSize: 10 });

  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ["market", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      fetch(`/api/market?page=${pagination.pageIndex}&limit=${pagination.pageSize}`).then((res) => res.json()),
  });

  // Extract the actual data and totalPages safely
  const data: Instrument[] | undefined = response?.data;
  const totalPages: number = response?.pagination?.totalPages || 1;

  return (
    <MarketContext.Provider
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
    </MarketContext.Provider>
  );
}

export function useMarketContext() {
  const context = useContext(MarketContext);
  if (!context) throw new Error("useTableContext must be used within a MarketProvider");
  return context;
}