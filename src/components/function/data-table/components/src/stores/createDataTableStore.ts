import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  GroupingState,
  Updater,
} from "@tanstack/react-table";
import type { DataTableFilterField } from "~/components/function/data-table/components/src/data-table/types";

interface SavedView {
  name: string;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  columnOrder: string[];
  grouping: GroupingState;
  pagination: PaginationState;
}

interface DataTableState {
  // Core data
  data: any[];
  filterFields: DataTableFilterField<any>[];
  
  // Table state
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  pagination: PaginationState;
  columnVisibility: VisibilityState;
  columnOrder: string[];
  grouping: GroupingState;
  savedViews: Record<string, SavedView>;
  enableColumnOrdering: boolean;
  
  // Actions
  setData: (data: any[]) => void;
  setFilterFields: (fields: DataTableFilterField<any>[]) => void;
  setColumnFilters: (updaterOrValue: Updater<ColumnFiltersState>) => void;
  setSorting: (updaterOrValue: Updater<SortingState>) => void;
  setPagination: (updaterOrValue: Updater<PaginationState>) => void;
  setColumnVisibility: (updaterOrValue: Updater<VisibilityState>) => void;
  setGrouping: (updaterOrValue: Updater<GroupingState>) => void;
  setColumnOrder: (updaterOrValue: Updater<string[]>) => void;
  setEnableColumnOrdering: (enabled: boolean) => void;
  
  // Saved views
  saveView: (name: string) => void;
  loadView: (name: string) => void;
  deleteView: (name: string) => void;
  
  // Reset
  resetTable: () => void;
}

export function createDataTableStore(tableId: string) {
  return create<DataTableState>()(
    persist(
      (set, get) => ({
        // Initial state
        data: [],
        filterFields: [],
        columnFilters: [],
        sorting: [],
        pagination: { pageIndex: 0, pageSize: 10 },
        columnVisibility: {},
        columnOrder: [],
        grouping: [],
        savedViews: {},
        enableColumnOrdering: true,
        
        // Actions
        setData: (data) => set({ data }),
        
        setFilterFields: (fields) => set({ filterFields: fields }),
        
        setColumnFilters: (updaterOrValue) => set((state) => ({
          columnFilters: typeof updaterOrValue === 'function' 
            ? updaterOrValue(state.columnFilters) 
            : updaterOrValue
        })),
        
        setSorting: (updaterOrValue) => set((state) => ({
          sorting: typeof updaterOrValue === 'function' 
            ? updaterOrValue(state.sorting) 
            : updaterOrValue
        })),
        
        setPagination: (updaterOrValue) => set((state) => ({
          pagination: typeof updaterOrValue === 'function' 
            ? updaterOrValue(state.pagination) 
            : updaterOrValue
        })),
        
        setColumnVisibility: (updaterOrValue) => set((state) => ({
          columnVisibility: typeof updaterOrValue === 'function' 
            ? updaterOrValue(state.columnVisibility) 
            : updaterOrValue
        })),
        
        setGrouping: (updaterOrValue) => set((state) => ({
          grouping: typeof updaterOrValue === 'function' 
            ? updaterOrValue(state.grouping) 
            : updaterOrValue
        })),
        
        setColumnOrder: (updaterOrValue) => set((state) => ({
          columnOrder: typeof updaterOrValue === 'function' 
            ? updaterOrValue(state.columnOrder) 
            : updaterOrValue
        })),
        
        setEnableColumnOrdering: (enabled) => set({ enableColumnOrdering: enabled }),
        
        saveView: (name) => set((state) => ({
          savedViews: {
            ...state.savedViews,
            [name]: {
              name,
              columnFilters: state.columnFilters,
              sorting: state.sorting,
              columnVisibility: state.columnVisibility,
              columnOrder: state.columnOrder,
              grouping: state.grouping,
              pagination: state.pagination,
            }
          }
        })),
        
        loadView: (name) => set((state) => {
          const view = state.savedViews[name];
          if (view) {
            return {
              columnFilters: view.columnFilters,
              sorting: view.sorting,
              columnVisibility: view.columnVisibility,
              columnOrder: view.columnOrder,
              grouping: view.grouping,
              pagination: view.pagination,
            };
          }
          return {};
        }),
        
        deleteView: (name) => set((state) => {
          const { [name]: deleted, ...rest } = state.savedViews;
          return { savedViews: rest };
        }),
        
        resetTable: () => set({
          columnFilters: [],
          sorting: [],
          pagination: { pageIndex: 0, pageSize: 10 },
          grouping: [],
        }),
      }),
      {
        name: `data-table-store-${tableId}`,
        partialize: (state) => ({
          columnVisibility: state.columnVisibility,
          savedViews: state.savedViews,
        }),
      }
    )
  );
}

// Store registry to manage multiple table stores
const storeRegistry = new Map();

export function useDataTableStore(tableId: string = 'default') {
  if (!storeRegistry.has(tableId)) {
    storeRegistry.set(tableId, createDataTableStore(tableId));
  }
  return storeRegistry.get(tableId)();
}

// Export type for external use
export type DataTableStore = ReturnType<typeof createDataTableStore>; 