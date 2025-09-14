"use client";
import type { ColumnSchema } from "~/components/function/data-table/infinite/src/types";
import { FunctionSquare } from "lucide-react";
import * as React from "react";
import { cn } from "~/components/function/data-table/components/src/lib/utils";
import { formatCompactNumber, formatMilliseconds } from "~/components/function/data-table/components/src/lib/format";
import { Percentile, getPercentileColor } from "~/components/function/data-table/components/src/lib/request/percentile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/function/menu/popover";

interface PopoverPercentileProps {
  data?: ColumnSchema;
  percentiles?: Record<Percentile, number>;
  filterRows: number;
  className?: string;
}

export function PopoverPercentile({
  data,
  percentiles,
  filterRows,
  className,
}: PopoverPercentileProps) {
  const percentileArray = percentiles
    ? Object.entries(percentiles).map(([percentile, latency]) => [
        parseInt(percentile),
        latency,
      ])
    : [];

  if (data?.percentile && typeof data.percentile === 'number' && data?.latency && typeof data.latency === 'number') {
    percentileArray.push([data.percentile, data.latency]);
  }
  percentileArray.sort((a, b) => (a[0] ?? 0) - (b[0] ?? 0));

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "font-mono flex items-center gap-1 rounded-md ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        <FunctionSquare
          className={cn(
            "h-4 w-4",
            (() => {
              if (data?.percentile && typeof data.percentile === 'number') {
                return getPercentileColor(data.percentile).text;
              }
              return "text-muted-foreground";
            })()
          )}
        />
        {!data?.percentile || typeof data.percentile !== 'number' ? "N/A" : `P${Math.round(data.percentile)}`}
      </PopoverTrigger>
      <PopoverContent
        className="w-40 flex flex-col gap-2 p-2 text-xs"
        align="end"
      >
        <p>
          Calculated from filtered result of{" "}
          <span className="font-medium font-mono">
            {formatCompactNumber(filterRows)}
          </span>{" "}
          rows.
        </p>
        <div className="flex flex-col gap-0.5">
          {percentileArray.map(([key, value]) => {
            const isActive =
              data?.percentile &&
              typeof data.percentile === 'number' &&
              data.percentile === key &&
              value === data.latency;
            
            const borderClass = (() => {
              if (isActive && data?.percentile && typeof data.percentile === 'number') {
                return `border ${getPercentileColor(data.percentile).border}`;
              }
              return "";
            })();
              
            return (
              <div
                key={`${key}-${value}`}
                className={cn(
                  "flex items-center justify-between px-1 py-0.5 rounded-md",
                  borderClass
                )}
              >
                <div
                  className={cn(
                    "font-mono",
                    !isActive && "text-muted-foreground"
                  )}
                >{`P${Math.round(key ?? 0)}`}</div>
                <div className="font-mono">
                  {formatMilliseconds(Math.round(value ?? 0))}
                  <span className="text-muted-foreground">ms</span>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}