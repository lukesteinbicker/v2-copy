"use client";

import { DataTableFilterCommand } from "~/components/function/data-table/components/src/data-table/data-table-filter-command/index";
import { DataTableFilterControls } from "~/components/function/data-table/components/src/data-table/data-table-filter-controls";
import { DataTablePagination } from "~/components/function/data-table/components/src/data-table/data-table-pagination";
import { DataTableProvider } from "~/components/function/data-table/components/src/data-table/data-table-provider";
import { DataTableToolbar } from "~/components/function/data-table/components/src/data-table/data-table-toolbar";
import type { DataTableFilterField } from "~/components/function/data-table/components/src/data-table/types";
import { cn } from "~/components/function/data-table/components/src/lib/utils";
import type {
  ColumnDef,
  ColumnFiltersState,
  Table as TTable,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryStates } from "nuqs";
import * as React from "react";
import { searchParamsParser } from "./search-params";
import { useDataTableStore } from "~/components/function/data-table/components/src/stores/createDataTableStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/function/data-table/components/src/custom/table";
import { Button } from "~/components/function/input/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { flexRender } from "@tanstack/react-table";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultColumnFilters?: ColumnFiltersState;
  // TODO: add sortingColumnFilters
  filterFields?: DataTableFilterField<TData>[];
  tableId?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultColumnFilters = [],
  filterFields = [],
  tableId = 'default',
}: DataTableProps<TData, TValue>) {
  // Replace useState hooks with Zustand store access
  const {
    columnFilters,
    sorting,
    pagination,
    columnVisibility,
    columnOrder,
    grouping,
    enableColumnOrdering,
    setColumnFilters,
    setSorting,
    setPagination,
    setColumnVisibility,
    setColumnOrder,
    setGrouping,
    setData,
    setFilterFields,
  } = useDataTableStore(tableId);

  // Initialize store with props  
  React.useEffect(() => {
    setData(data);
    setFilterFields(filterFields);
  }, [data, filterFields, setData, setFilterFields]);

  // Initialize default filters (only on first mount)
  React.useEffect(() => {
    if (defaultColumnFilters.length > 0 && columnFilters.length === 0) {
      setColumnFilters(defaultColumnFilters);
    }
  }, []); // Empty deps - only run once

  const [_, setSearch] = useQueryStates(searchParamsParser);

  const table = useReactTable({
    data,
    columns,
    state: { 
      columnFilters, 
      sorting, 
      columnVisibility, 
      pagination,
      columnOrder,
      grouping, 
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnOrderChange: setColumnOrder,
    onGroupingChange: setGrouping,
    
    // Add grouping model
    getGroupedRowModel: getGroupedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    // Enable row expansion for grouped rows
    getExpandedRowModel: getExpandedRowModel(),
    // REMINDER: it doesn't support array of strings (WARNING: might not work for other types)
    getFacetedUniqueValues: (table: TTable<TData>, columnId: string) => () => {
      const facets = getFacetedUniqueValues<TData>()(table, columnId)();
      const customFacets = new Map();
      for (const [key, value] of facets as any) {
        if (Array.isArray(key)) {
          for (const k of key) {
            const prevValue = customFacets.get(k) || 0;
            customFacets.set(k, prevValue + value);
          }
        } else {
          const prevValue = customFacets.get(key) || 0;
          customFacets.set(key, prevValue + value);
        }
      }
      return customFacets;
    },
  });



  React.useEffect(() => {
    const columnFiltersWithNullable = filterFields.map((field) => {
      const filterValue = columnFilters.find(
        (filter: { id: string; value: unknown }) => filter.id === field.value,
      );
      if (!filterValue) return { id: field.value, value: null };
      return { id: field.value, value: filterValue.value };
    });

    const search = columnFiltersWithNullable.reduce(
      (prev, curr) => {
        prev[curr.id as string] = curr.value;
        return prev;
      },
      {} as Record<string, unknown>,
    );

    setSearch(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters]);

  return (
    <DataTableProvider
      tableId={tableId}
      table={table}
      columns={columns}
      filterFields={filterFields}
      columnFilters={columnFilters}
      sorting={sorting}
      pagination={pagination}
      columnOrder={columnOrder}
      columnVisibility={columnVisibility}
      grouping={grouping}
      enableColumnOrdering={enableColumnOrdering}
    >
      <div className="flex h-full w-full flex-col gap-3 sm:flex-row">
        <div
          className={cn(
            "hidden w-full p-1 sm:block sm:min-w-52 sm:max-w-52 sm:self-start md:min-w-64 md:max-w-64",
            "group-data-[expanded=false]/controls:hidden",
          )}
        >
          <DataTableFilterControls />
        </div>
        <div className="flex max-w-full flex-1 flex-col gap-4 overflow-hidden p-1">
          <DataTableFilterCommand searchParamsParser={searchParamsParser} />
          <DataTableToolbar />
          <Table>
            <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                >
                    {headerGroup.headers.map((header) => {
                    return (
                        <TableHead key={header.id}>
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                            )}
                        </TableHead>
                    );
                    })}
                </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                    const isGroupedRow = row.getIsGrouped();
                    
                    return (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                        isGroupedRow && [
                            "bg-muted/30 hover:bg-muted/40",
                            "dark:bg-muted/20 dark:hover:bg-muted/30",
                            "font-medium"
                        ]
                        )}
                    >
                        {row.getVisibleCells().map((cell, index) => {
                        if (isGroupedRow && index === 0) {
                            // First cell in grouped row - show expand/collapse button and group value
                            return (
                            <TableCell key={cell.id} className="py-3">
                                <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => row.toggleExpanded()}
                                >
                                    {row.getIsExpanded() ? (
                                    <ChevronDown className="h-4 w-4" />
                                    ) : (
                                    <ChevronRight className="h-4 w-4" />
                                    )}
                                </Button>
                                <span className="font-medium">
                                    {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                    )}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ({row.subRows.length} items)
                                </span>
                                </div>
                            </TableCell>
                            );
                        } else if (isGroupedRow && index > 0) {
                            // Other cells in grouped row - show empty
                            return <TableCell key={cell.id} />;
                        } else {
                            // Regular row cell - check if this column is being grouped
                            const isColumnGrouped = grouping.includes(cell.column.id);
                            
                            return (
                            <TableCell key={cell.id}>
                                {isColumnGrouped ? null : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                                )}
                            </TableCell>
                            );
                        }
                        })}
                    </TableRow>
                    );
                })
                ) : (
                <TableRow>
                    <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                    >
                    No results.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
          </Table>
          <DataTablePagination />
        </div>
      </div>
    </DataTableProvider>
  );
}
