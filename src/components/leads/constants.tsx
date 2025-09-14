"use client";

import { CopyToClipboardContainer } from "~/components/function/data-table/components/src/custom/copy-to-clipboard-container";
import type {
  DataTableFilterField,
  Option,
  SheetField,
} from "~/components/function/data-table/components/src/data-table/types";
import { cn } from "~/components/function/data-table/components/src/lib/utils";
import { format } from "date-fns";
import { Badge } from "~/components/function/misc/badge";
import { type ColumnSchema, LEAD_STATUSES, CALL_STATUSES } from "./schema";

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

export const filterFields: DataTableFilterField<ColumnSchema>[] = [
  {
    label: "Status",
    value: "status",
    type: "checkbox",
    defaultOpen: true,
    options: LEAD_STATUSES.map((status) => ({ label: status, value: status })),
    component: (props: Option) => {
      const value = props.value as (typeof LEAD_STATUSES)[number];
      return (
        <div className="flex w-full max-w-28 items-center justify-between gap-2 font-mono">
          <span className="capitalize text-foreground/70 group-hover:text-accent-foreground">
            {props.label}
          </span>
          <Badge 
            variant="outline" 
            className={cn(statusColors[value])}
          >
            {value}
          </Badge>
        </div>
      );
    },
  },
  {
    label: "Call Status",
    value: "callStatus",
    type: "checkbox",
    defaultOpen: true,
    options: CALL_STATUSES.map((status) => ({ 
      label: status.replace("_", " "), 
      value: status 
    })),
    component: (props: Option) => {
      const value = props.value as (typeof CALL_STATUSES)[number];
      return (
        <div className="flex w-full max-w-32 items-center justify-between gap-2 font-mono">
          <span className="capitalize text-foreground/70 group-hover:text-accent-foreground">
            {props.label}
          </span>
          <Badge 
            variant="outline" 
            className={cn(callStatusColors[value])}
          >
            {value.replace("_", " ")}
          </Badge>
        </div>
      );
    },
  },
  {
    label: "Company ID",
    value: "companyId",
    type: "input",
  },
  {
    label: "Visitor ID",
    value: "visitorId",
    type: "input",
  },
  {
    label: "Claimed By",
    value: "claimedBy",
    type: "input",
  },
  {
    label: "Response Time (minutes)",
    value: "responseTime",
    type: "slider",
    min: 0,
    max: 1440, // 24 hours
  },
  {
    label: "Call Duration (minutes)",
    value: "callDuration",
    type: "slider",
    min: 0,
    max: 180, // 3 hours
  },
  {
    label: "Claimed At",
    value: "claimAt",
    type: "timerange",
  },
  {
    label: "Last Activity",
    value: "lastActivity",
    type: "timerange",
  },
];

export const sheetFields: SheetField<ColumnSchema, any>[] = [
  {
    id: "id",
    label: "Lead ID",
    type: "readonly",
    component: (props) => (
      <CopyToClipboardContainer>
        {props.id}
      </CopyToClipboardContainer>
    ),
    skeletonClassName: "w-64",
  },
  {
    id: "status",
    label: "Status",
    type: "checkbox",
    component: (props) => (
      <Badge 
        variant="outline" 
        className={cn(statusColors[props.status])}
      >
        {props.status}
      </Badge>
    ),
    skeletonClassName: "w-20",
  },
  {
    id: "callStatus",
    label: "Call Status",
    type: "checkbox",
    component: (props) => (
      <Badge 
        variant="outline" 
        className={cn(callStatusColors[props.callStatus])}
      >
        {props.callStatus.replace("_", " ")}
      </Badge>
    ),
    skeletonClassName: "w-24",
  },
  {
    id: "visitorName",
    label: "Visitor Name",
    type: "readonly",
    component: (props) => props.visitorName || "Unknown",
    skeletonClassName: "w-32",
  },
  {
    id: "companyName",
    label: "Company Name",
    type: "readonly",
    component: (props) => props.companyName || "Unknown",
    skeletonClassName: "w-32",
  },
  {
    id: "claimedBy",
    label: "Claimed By",
    type: "readonly",
    component: (props) => props.claimedBy || "Unclaimed",
    skeletonClassName: "w-24",
  },
  {
    id: "claimAt",
    label: "Claimed At",
    type: "timerange",
    component: (props) => 
      props.claimAt ? format(props.claimAt, "MMM dd, yyyy HH:mm") : "Not claimed",
    skeletonClassName: "w-36",
  },
  {
    id: "responseTime",
    label: "Response Time",
    type: "slider",
    component: (props) => 
      props.responseTime ? `${props.responseTime} minutes` : "N/A",
    skeletonClassName: "w-20",
  },
  {
    id: "callDuration",
    label: "Call Duration",
    type: "slider",
    component: (props) => 
      props.callDuration ? `${props.callDuration} minutes` : "N/A",
    skeletonClassName: "w-20",
  },
  {
    id: "outcome",
    label: "Outcome",
    type: "checkbox",
    component: (props) => {
      if (!props.outcome) return "N/A";
      return (
        <Badge 
          variant="outline" 
          className={cn(outcomeColors[props.outcome])}
        >
          {props.outcome.replace("_", " ")}
        </Badge>
      );
    },
    skeletonClassName: "w-24",
  },
  {
    id: "lastActivity",
    label: "Last Activity",
    type: "timerange",
    component: (props) => 
      props.lastActivity ? format(props.lastActivity, "MMM dd, yyyy HH:mm") : "N/A",
    skeletonClassName: "w-36",
  },
  {
    id: "notes",
    label: "Notes",
    type: "readonly",
    component: (props) => (
      <CopyToClipboardContainer>
        {props.notes || "No notes"}
      </CopyToClipboardContainer>
    ),
    className: "flex-col items-start w-full gap-1",
  },
];