"use client";

import { Button } from "~/components/function/input/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/function/card/card";
import { useDataTableStore } from "./stores/createDataTableStore";
import { Badge } from "~/components/function/misc/badge"; 
import type { ColumnSchema } from "./data-table/types";

// Type-safe column keys from the schema
type ColumnKey = keyof ColumnSchema;

export function ExternalTableControls({ tableId = 'default' }: { tableId?: string }) {
  const {
    columnFilters,
    sorting,
    pagination,
    grouping,
    data,
    setColumnFilters,
    setSorting,
    setPagination,
    setGrouping,
    resetTable,
  } = useDataTableStore(tableId);

  // Type-safe filter function
  const addColumnFilter = (columnId: ColumnKey, value: any) => {
    setColumnFilters([
      ...columnFilters,
      { id: columnId, value }
    ]);
  };

  // Type-safe sorting function
  const addColumnSort = (columnId: ColumnKey, desc: boolean = false) => {
    setSorting([{ id: columnId, desc }]);
  };

  const addActiveFilter = () => {
    addColumnFilter("active", [true]);
  };

  const addRegionSort = () => {
    addColumnSort("regions", false);
  };

  const goToPage = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
  };

  const groupByRegion = () => {
    setGrouping(["regions"]);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>External Table Controls</CardTitle>
        <CardDescription>
          These controls demonstrate how external components can manipulate the DataTable state
          via Zustand store. These would typically be in a completely separate component tree.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={addActiveFilter} variant="outline" size="sm">
            Filter Active = true
          </Button>
          <Button onClick={addRegionSort} variant="outline" size="sm">
            Sort by Region
          </Button>
          <Button onClick={() => goToPage(2)} variant="outline" size="sm">
            Go to Page 3
          </Button>
          <Button onClick={groupByRegion} variant="outline" size="sm">
            Group by Region
          </Button>
          <Button onClick={resetTable} variant="destructive" size="sm">
            Reset All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong>Filters:</strong>
            <div className="mt-1 space-y-1">
              {columnFilters.length === 0 ? (
                <Badge variant="secondary">None</Badge>
              ) : (
                columnFilters.map((filter: any, i: number) => (
                  <Badge key={i} variant="outline">
                    {filter.id}: {Array.isArray(filter.value) ? filter.value.join(", ") : String(filter.value)}
                  </Badge>
                ))
              )}
            </div>
          </div>
          
          <div>
            <strong>Sorting:</strong>
            <div className="mt-1 space-y-1">
              {sorting.length === 0 ? (
                <Badge variant="secondary">None</Badge>
              ) : (
                sorting.map((sort: any, i: number) => (
                  <Badge key={i} variant="outline">
                    {sort.id} {sort.desc ? "↓" : "↑"}
                  </Badge>
                ))
              )}
            </div>
          </div>
          
          <div>
            <strong>Pagination:</strong>
            <div className="mt-1">
              <Badge variant="outline">
                Page {pagination.pageIndex + 1} (Size: {pagination.pageSize})
              </Badge>
            </div>
          </div>
          
          <div>
            <strong>Grouping:</strong>
            <div className="mt-1 space-y-1">
              {grouping.length === 0 ? (
                <Badge variant="secondary">None</Badge>
              ) : (
                grouping.map((group: string, i: number) => (
                  <Badge key={i} variant="outline">
                    {group}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Total rows: {data.length}
        </div>
      </CardContent>
    </Card>
  );
} 