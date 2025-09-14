import {
  ARRAY_DELIMITER,
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
} from "~/components/function/data-table/components/src/lib/delimiters";
import { z } from "zod";
import type { Leads } from "~/lib/db/schema";

// Lead status enum matching the Kysely schema
export const LEAD_STATUSES = ["open", "claimed", "locked", "closed"] as const;
export const CALL_STATUSES = ["not_started", "in_progress", "finished"] as const;

// Schema for the leads table based on Kysely LeadsTable
export const leadSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  visitorId: z.string(),
  status: z.enum(LEAD_STATUSES),
  claimedBy: z.string().nullable(),
  claimAt: z.date().nullable(),
  slackId: z.string().nullable(),
  callId: z.string().nullable(),
  callStatus: z.enum(CALL_STATUSES),
  notes: z.string().nullable(),
});

// Extended schema for display purposes (includes computed fields)
export const columnSchema = z
  .object({
    // Core lead fields
    id: z.string(),
    companyId: z.string(),
    visitorId: z.string(),
    status: z.enum(LEAD_STATUSES),
    claimedBy: z.string().nullable(),
    claimAt: z.date().nullable(),
    slackId: z.string().nullable(),
    callId: z.string().nullable(),
    callStatus: z.enum(CALL_STATUSES),
    notes: z.string().nullable(),
    
    // Display/computed fields
    visitorName: z.string().optional(),
    companyName: z.string().optional(),
    lastActivity: z.date().optional(),
    responseTime: z.number().optional(), // in minutes
    callDuration: z.number().optional(), // in minutes
    outcome: z.enum(["sales_routed", "scheduled", "closed", "missed"]).optional(),
  });

export type ColumnSchema = z.infer<typeof columnSchema>;
export type LeadSchema = z.infer<typeof leadSchema>;

// Filter schema for leads
export const columnFilterSchema = z.object({
  status: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.enum(LEAD_STATUSES).array())
    .optional(),
  callStatus: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.enum(CALL_STATUSES).array())
    .optional(),
  companyId: z.string().optional(),
  visitorId: z.string().optional(),
  claimedBy: z.string().optional(),
  outcome: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.enum(["sales_routed", "scheduled", "closed", "missed"]).array())
    .optional(),
  responseTime: z
    .string()
    .transform((val) => val.split(SLIDER_DELIMITER))
    .pipe(z.coerce.number().array().max(2))
    .optional(),
  callDuration: z
    .string()
    .transform((val) => val.split(SLIDER_DELIMITER))
    .pipe(z.coerce.number().array().max(2))
    .optional(),
  claimAt: z
    .string()
    .transform((val) => val.split(RANGE_DELIMITER).map(Number))
    .pipe(z.coerce.date().array())
    .optional(),
  lastActivity: z
    .string()
    .transform((val) => val.split(RANGE_DELIMITER).map(Number))
    .pipe(z.coerce.date().array())
    .optional(),
});

export type ColumnFilterSchema = z.infer<typeof columnFilterSchema>;

export const facetMetadataSchema = z.object({
  rows: z.array(z.object({ value: z.any(), total: z.number() })),
  total: z.number(),
  min: z.number().optional(),
  max: z.number().optional(),
});

export type FacetMetadataSchema = z.infer<typeof facetMetadataSchema>;

export type BaseChartSchema = { timestamp: number; [key: string]: number };

export const timelineChartSchema = z.object({
  timestamp: z.number(), // UNIX
  ...LEAD_STATUSES.reduce(
    (acc, status) => ({
      ...acc,
      [status]: z.number().default(0),
    }),
    {} as Record<(typeof LEAD_STATUSES)[number], z.ZodNumber>
  ),
  // REMINDER: make sure to have the `timestamp` field in the object
}) satisfies z.ZodType<BaseChartSchema>;

export type TimelineChartSchema = z.infer<typeof timelineChartSchema>;
