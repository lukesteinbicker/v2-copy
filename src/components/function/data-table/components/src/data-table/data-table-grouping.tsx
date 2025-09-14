"use client";

import { Button } from "~/components/function/input/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/function/menu/select";
import { useDataTable } from "./data-table-provider";
// import { Group } from "lucide-react";
import * as React from "react";

export function DataTableGrouping() {
  const { table } = useDataTable();

  const columnOrder = table.getState().columnOrder;

  const sortedColumns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id)),
    [table, columnOrder],
  );

  const groupableColumns = sortedColumns.filter(
    (column) =>
      typeof column.accessorFn !== "undefined" &&
      column.columnDef.enableGrouping === true,
  );

  const grouping = table.getState().grouping;
  const currentGrouping = grouping.length > 0 ? grouping[0] : "";

  const handleGroupingChange = (columnId: string) => {
    if (columnId === "none") {
      table.setGrouping([]);
    } else {
      table.setGrouping([columnId]);
    }
  };



  return (
    <div className="flex items-center space-x-2">
      {/* <Group className="h-4 w-4 text-muted-foreground" /> */}
      <Select value={currentGrouping} onValueChange={handleGroupingChange}>
        <SelectTrigger className="h-8 w-[140px]">
          <SelectValue placeholder="Group by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No grouping</SelectItem>
          {groupableColumns.map((column) => (
            <SelectItem key={column.id} value={column.id}>
              {column.columnDef.meta?.label || column.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {grouping.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.setGrouping([])}
          className="h-8 px-2 lg:px-3"
        >
          Clear
        </Button>
      )}
    </div>
  );
} 