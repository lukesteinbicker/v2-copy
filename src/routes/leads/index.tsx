import { createFileRoute } from "@tanstack/react-router";
import { getQueryClient } from "~/components/function/data-table/components/src/providers/get-query-client";
import { dataOptions } from "~/components/leads/query-options";
import { Client } from "~/components/function/data-table/infinite/src/client";
import { columns } from "~/components/leads/columns";
import { filterFields as defaultFilterFields, sheetFields } from "~/components/leads/constants";
import { columnSchema, facetMetadataSchema, timelineChartSchema } from "~/components/leads/schema";
import type { ColumnSchema, FacetMetadataSchema, TimelineChartSchema } from "~/components/leads/schema";

export const Route = createFileRoute('/leads/')({
  component: LeadsPage,
  validateSearch: (search) => {
    // Simple search validation for TanStack Router
    return {
      status: search.status as string[] | undefined,
      callStatus: search.callStatus as string[] | undefined,
      companyId: search.companyId as string | undefined,
      visitorId: search.visitorId as string | undefined,
      claimedBy: search.claimedBy as string | undefined,
      outcome: search.outcome as string[] | undefined,
      responseTime: search.responseTime as number[] | undefined,
      callDuration: search.callDuration as number[] | undefined,
      claimAt: search.claimAt as Date[] | undefined,
      lastActivity: search.lastActivity as Date[] | undefined,
      sort: search.sort as { id: string; desc: boolean } | undefined,
      size: (search.size as number) || 40,
      start: (search.start as number) || 0,
      direction: (search.direction as "prev" | "next") || "next",
      cursor: (search.cursor as Date) || new Date(),
      live: (search.live as boolean) || false,
      id: search.id as string | undefined,
    };
  },
  beforeLoad: async ({ search }) => {
    // Get query client and prefetch data
    const queryClient = getQueryClient();
    await queryClient.prefetchInfiniteQuery(
      dataOptions(search, {} as ColumnSchema, {} as TimelineChartSchema, {} as FacetMetadataSchema, "/api/leads")
    );
    
    return { parsedSearch: search };
  },
});

function LeadsPage() {
  const { parsedSearch } = Route.useRouteContext();
  
  return (
    <Client 
      columns={columns} 
      defaultFilterFields={defaultFilterFields} 
      sheetFields={sheetFields}
      columnSchema={{} as ColumnSchema}
      baseChartSchema={{} as TimelineChartSchema}
      facetMetadataSchema={{} as FacetMetadataSchema}
    />
  );
}
