"use client";

import * as React from "react";
import { DataTable } from "./data-table";
import { Skeleton } from "./skeleton";
import { ExternalTableControls } from "~/components/function/data-table/components/src/external-table-controls";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableFilterField } from "~/components/function/data-table/components/src/data-table/types";
import { useTableData } from "./hooks/useTableData";

interface ClientPageProps<TData> {
  columns: ColumnDef<TData>[];
  filterFields: DataTableFilterField<TData>[];
  defaultColumnFilters?: any[];
  apiEndpoint: string;
}

export function ClientPage<TData>({ 
  columns, 
  filterFields, 
  defaultColumnFilters = [],
  apiEndpoint
}: ClientPageProps<TData>) {
  // Create query options on the client side to avoid passing functions from server
  const queryOptions = React.useMemo(() => ({
    queryKey: ['tableData'],
    queryFn: async (): Promise<TData[]> => {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch table data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  }), [apiEndpoint]);

  const { data, isLoading, error } = useTableData(queryOptions);

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-destructive">Error loading data: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <>
      <ExternalTableControls />
      <DataTable
        columns={columns}
        data={data}
        filterFields={filterFields}
        defaultColumnFilters={defaultColumnFilters}
      />
    </>
  );
} 