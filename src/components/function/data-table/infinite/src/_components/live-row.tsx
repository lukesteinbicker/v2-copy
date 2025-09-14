import { TableCell, TableRow } from "~/components/function/data-table/components/src/custom/table";
import { DataTableColumnLevelIndicator } from "~/components/function/data-table/components/src/data-table/data-table-column/data-table-column-level-indicator";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnSchema } from "~/components/function/data-table/infinite/src/types";

export function LiveRow({ columns }: { columns: ColumnDef<ColumnSchema>[] }) {
  return (
    <TableRow>
      <TableCell className="w-(--header-level-size) min-w-(--header-level-size) max-w-(--header-level-size) border-b border-l border-r border-t border-info border-r-info/50">
        <DataTableColumnLevelIndicator value="info" />
      </TableCell>
      <TableCell
        colSpan={columns.length - 1}
        className="border-b border-r border-t border-info font-medium text-info"
      >
        Live Mode
      </TableCell>
    </TableRow>
  );
}
