import { _LEVELS } from "~/components/function/data-table/components/src/constants/levels";
import { getLevelColor } from "~/components/function/data-table/components/src/lib/request/level";
import { cn } from "~/components/function/data-table/components/src/lib/utils";

export function DataTableColumnLevelIndicator({
  value,
  className,
}: {
  value: (typeof _LEVELS)[number];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn("h-2.5 w-2.5 rounded-[2px]", getLevelColor(value).bg)}
      />
    </div>
  );
}
