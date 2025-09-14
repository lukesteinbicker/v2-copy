"use client";

import { DataTableColumnHeader } from "~/components/function/data-table/components/src/data-table/data-table-column-header";
import { Badge } from "~/components/function/misc/badge";
import { cn } from "~/components/function/data-table/components/src/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { ColumnSchema } from "./schema";

const statusColors = {
  open: "bg-blue-100 text-blue-800 border-blue-200",
  claimed: "bg-yellow-100 text-yellow-800 border-yellow-200",
  locked: "bg-orange-100 text-orange-800 border-orange-200",
  closed: "bg-green-100 text-green-800 border-green-200",
} as const;

const callStatusColors = {
  not_started: "bg-gray-100 text-gray-800 border-gray-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  finished: "bg-green-100 text-green-800 border-green-200",
} as const;

const outcomeColors = {
  sales_routed: "bg-green-100 text-green-800 border-green-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
  missed: "bg-red-100 text-red-800 border-red-200",
} as const;

export const columns: ColumnDef<ColumnSchema>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lead ID" />
    ),
    cell: ({ row }) => {
      const id = row.getValue<string>("id");
      return (
        <div className="font-mono text-sm">
          {id.slice(0, 8)}...
        </div>
      );
    },
    enableHiding: false,
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue<ColumnSchema["status"]>("status");
      return (
        <Badge 
          variant="outline" 
          className={cn(statusColors[status])}
        >
          {status}
        </Badge>
      );
    },
    filterFn: "arrSome",
    size: 100,
    minSize: 100,
  },
  {
    accessorKey: "callStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Call Status" />
    ),
    cell: ({ row }) => {
      const callStatus = row.getValue<ColumnSchema["callStatus"]>("callStatus");
      return (
        <Badge 
          variant="outline" 
          className={cn(callStatusColors[callStatus])}
        >
          {callStatus.replace("_", " ")}
        </Badge>
      );
    },
    filterFn: "arrSome",
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "visitorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visitor" />
    ),
    cell: ({ row }) => {
      const visitorName = row.getValue<string | undefined>("visitorName");
      return (
        <div className="font-medium">
          {visitorName || "Unknown"}
        </div>
      );
    },
    size: 150,
    minSize: 150,
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const companyName = row.getValue<string | undefined>("companyName");
      return (
        <div className="text-sm text-muted-foreground">
          {companyName || "Unknown"}
        </div>
      );
    },
    size: 150,
    minSize: 150,
  },
  {
    accessorKey: "claimedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Claimed By" />
    ),
    cell: ({ row }) => {
      const claimedBy = row.getValue<string | null>("claimedBy");
      return (
        <div className="text-sm">
          {claimedBy || "Unclaimed"}
        </div>
      );
    },
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "claimAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Claimed At" />
    ),
    cell: ({ row }) => {
      const claimAt = row.getValue<Date | null>("claimAt");
      return (
        <div className="text-sm text-muted-foreground">
          {claimAt ? format(claimAt, "MMM dd, yyyy HH:mm") : "Not claimed"}
        </div>
      );
    },
    size: 150,
    minSize: 150,
  },
  {
    accessorKey: "responseTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Response Time" />
    ),
    cell: ({ row }) => {
      const responseTime = row.getValue<number | undefined>("responseTime");
      return (
        <div className="text-sm font-mono">
          {responseTime ? `${responseTime}m` : "N/A"}
        </div>
      );
    },
    filterFn: "inNumberRange",
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "callDuration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Call Duration" />
    ),
    cell: ({ row }) => {
      const callDuration = row.getValue<number | undefined>("callDuration");
      return (
        <div className="text-sm font-mono">
          {callDuration ? `${callDuration}m` : "N/A"}
        </div>
      );
    },
    filterFn: "inNumberRange",
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "outcome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outcome" />
    ),
    cell: ({ row }) => {
      const outcome = row.getValue<ColumnSchema["outcome"]>("outcome");
      if (!outcome) return <div className="text-sm text-muted-foreground">N/A</div>;
      
      return (
        <Badge 
          variant="outline" 
          className={cn(outcomeColors[outcome])}
        >
          {outcome.replace("_", " ")}
        </Badge>
      );
    },
    filterFn: "arrSome",
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "lastActivity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Activity" />
    ),
    cell: ({ row }) => {
      const lastActivity = row.getValue<Date | undefined>("lastActivity");
      return (
        <div className="text-sm text-muted-foreground">
          {lastActivity ? format(lastActivity, "MMM dd, yyyy HH:mm") : "N/A"}
        </div>
      );
    },
    size: 150,
    minSize: 150,
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => {
      const notes = row.getValue<string | null>("notes");
      return (
        <div className="text-sm text-muted-foreground max-w-xs truncate">
          {notes || "No notes"}
        </div>
      );
    },
    size: 200,
    minSize: 200,
  },
];