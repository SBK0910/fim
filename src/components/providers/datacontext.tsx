"use client";

import { CreateDataContextProps, DataContextType, Pagination } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

export function createDataContext<T>({queryKey, queryFn}: CreateDataContextProps<T>) {
    const DataContext = createContext<DataContextType<T> | undefined>(undefined);

    const DataContextProvider = ({ children }: { children: React.ReactNode; }) => {
        const [pagination, setPagination] = useState<Pagination>({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1,
        });

        const {data, isLoading, isError, error} = useQuery({
            queryKey: [queryKey, pagination.page, pagination.limit],
            queryFn: () => queryFn(pagination.page, pagination.limit),
        })

        return <DataContext.Provider value={
            {
                data: data?.data || [],
                pagination: data?.pagination || pagination,
                setPagination,
                isLoading,
                isError,
                error: error || null,
            }
        }>
            {children}
        </DataContext.Provider>;
    }

    function useDataContext(){
        const context = useContext(DataContext);
        if (!context) throw new Error("useDataContext must be used within a DataContextProvider");
        return context;
    }

    return { DataContextProvider, useDataContext };
}