import { DataTableFilterField } from "~/components/function/data-table/components/src/data-table/types";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
  GroupingState,
} from "@tanstack/react-table";
import { createContext, useContext, useMemo } from "react";
import { ControlsProvider } from "~/components/function/data-table/components/src/providers/controls";
import { useDataTableStore } from "~/components/function/data-table/components/src/stores/createDataTableStore";

// REMINDER: read about how to move controlled state out of the useReactTable hook
// https://github.com/TanStack/table/discussions/4005#discussioncomment-7303569

interface DataTableStateContextType {
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  rowSelection: RowSelectionState;
  columnOrder: string[];
  columnVisibility: VisibilityState;
  pagination: PaginationState;
  grouping: GroupingState;
  enableColumnOrdering: boolean;
  // Store actions
  saveView: (name: string) => void;
  loadView: (name: string) => void;
  deleteView: (name: string) => void;
  resetTable: () => void;
  savedViews: Record<string, any>;
}

interface DataTableBaseContextType<TData = unknown, TValue = unknown> {
  table: Table<TData>;
  filterFields: DataTableFilterField<TData>[];
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  getFacetedUniqueValues?: (
    table: Table<TData>,
    columnId: string,
  ) => Map<string, number>;
  getFacetedMinMaxValues?: (
    table: Table<TData>,
    columnId: string,
  ) => undefined | [number, number];
}

interface DataTableContextType<TData = unknown, TValue = unknown>
  extends DataTableStateContextType,
    DataTableBaseContextType<TData, TValue> {}

export const DataTableContext = createContext<DataTableContextType<
  any,
  any
> | null>(null);

export function DataTableProvider<TData, TValue>({
  children,
  tableId = 'default',
  ...props
}: Partial<DataTableStateContextType> &
  DataTableBaseContextType<TData, TValue> & {
    children: React.ReactNode;
    tableId?: string;
  }) {
  // Get additional state from store that child components might need
  const {
    grouping,
    savedViews,
    saveView,
    loadView,
    deleteView,
    resetTable,
  } = useDataTableStore(tableId);

  const value = useMemo(
    () => ({
      ...props,
      // Store state
      grouping,
      savedViews,
      saveView,
      loadView,
      deleteView,
      resetTable,
      // Props with defaults
      columnFilters: props.columnFilters ?? [],
      sorting: props.sorting ?? [],
      rowSelection: props.rowSelection ?? {},
      columnOrder: props.columnOrder ?? [],
      columnVisibility: props.columnVisibility ?? {},
      pagination: props.pagination ?? { pageIndex: 0, pageSize: 10 },
      enableColumnOrdering: props.enableColumnOrdering ?? false,
    }),
    [
      props.columnFilters,
      props.sorting,
      props.rowSelection,
      props.columnOrder,
      props.columnVisibility,
      props.pagination,
      props.grouping,
      props.table,
      props.filterFields,
      props.columns,
      props.enableColumnOrdering,
      props.isLoading,
      props.getFacetedUniqueValues,
      props.getFacetedMinMaxValues,
      grouping,
      savedViews,
      saveView,
      loadView,
      deleteView,
      resetTable,
    ],
  );

  return (
    <DataTableContext.Provider value={value}>
      <ControlsProvider>{children}</ControlsProvider>
    </DataTableContext.Provider>
  );
}

export function useDataTable<TData, TValue>() {
  const context = useContext(DataTableContext);

  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }

  return context as DataTableContextType<TData, TValue>;
}
