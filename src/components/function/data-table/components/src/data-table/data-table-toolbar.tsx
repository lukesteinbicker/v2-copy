"use client";

import { Kbd } from "~/components/function/data-table/components/src/custom/kbd";
import { useDataTable } from "./data-table-provider";
import { Button } from "~/components/function/input/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger, 
} from "~/components/function/menu/tooltip";
import { useHotKey } from "~/components/function/data-table/components/src/hooks/use-hot-key";
import { formatCompactNumber } from "~/components/function/data-table/components/src/lib/format";
import { useControls } from "~/components/function/data-table/components/src/providers/controls";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useMemo } from "react";
import { DataTableFilterControlsDrawer } from "./data-table-filter-controls-drawer";
import { DataTableResetButton } from "./data-table-reset-button";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableSavedViews } from "./data-table-saved-views";
import { DataTableGrouping } from "./data-table-grouping";

interface DataTableToolbarProps {
  renderActions?: () => React.ReactNode;
}

export function DataTableToolbar({ renderActions }: DataTableToolbarProps) {
  const { table, isLoading, columnFilters } = useDataTable();
  const { open, setOpen } = useControls();
  useHotKey(() => setOpen((prev) => !prev), "b");
  const filters = table.getState().columnFilters;

  const rows = useMemo(
    () => ({
      total: table.getCoreRowModel().rows.length,
      filtered: table.getFilteredRowModel().rows.length,
    }),
    [isLoading, columnFilters],
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setOpen((prev) => !prev)}
                className="hidden gap-2 sm:flex"
              >
                {open ? (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    <span className="hidden md:block">Hide Controls</span>
                  </>
                ) : (
                  <>
                    <PanelLeftOpen className="h-4 w-4" />
                    <span className="hidden md:block">Show Controls</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>
                Toggle controls with{" "}
                <Kbd className="ml-1 text-muted-foreground group-hover:text-accent-foreground">
                  <span className="mr-1">⌘</span>
                  <span>B</span>
                </Kbd>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="block sm:hidden">
          <DataTableFilterControlsDrawer />
        </div>
        <div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            <span className="font-mono font-medium">
              {formatCompactNumber(rows.filtered)}
            </span>{" "}
            of{" "}
            <span className="font-mono font-medium">
              {formatCompactNumber(rows.total)}
            </span>{" "}
            row(s) <span className="sr-only sm:not-sr-only">filtered</span>
          </p>
          <p className="block text-sm text-muted-foreground sm:hidden">
            <span className="font-mono font-medium">
              {formatCompactNumber(rows.filtered)}
            </span>{" "}
            row(s)
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DataTableGrouping />
        <DataTableSavedViews />
        {filters.length ? <DataTableResetButton /> : null}
        {renderActions?.()}
        <DataTableViewOptions />
      </div>
    </div>
  );
}
