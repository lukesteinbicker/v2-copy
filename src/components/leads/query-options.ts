import type { Percentile } from "~/components/function/data-table/components/src/lib/request/percentile";
import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query";
import SuperJSON from "superjson";
// Removed searchParamsSerializer import - using manual URLSearchParams conversion
import type { ColumnSchema, FacetMetadataSchema, TimelineChartSchema } from "./schema";

export type LogsMeta = {
  currentPercentiles: Record<Percentile, number>;
};

export type InfiniteQueryMeta<TBaseChartSchema, TFacetMetadataSchema, TMeta = Record<string, unknown>> = {
  totalRowCount: number;
  filterRowCount: number;
  chartData: TBaseChartSchema[];
  facets: Record<string, TFacetMetadataSchema>;
  metadata?: TMeta;
};

export type InfiniteQueryResponse<TData, TBaseChartSchema, TFacetMetadataSchema, TMeta = unknown> = {
  data: TData;
  meta: InfiniteQueryMeta<TBaseChartSchema, TFacetMetadataSchema, TMeta>;
  prevCursor: number | null;
  nextCursor: number | null;
};

export function dataOptions<TColumnSchema extends ColumnSchema, TBaseChartSchema extends TimelineChartSchema, TFacetMetadataSchema extends FacetMetadataSchema>(
  search: any, // Use any to be more flexible with TanStack Router search params
  columnSchema: TColumnSchema,
  timelineChartSchema: TBaseChartSchema,
  facetMetadataSchema: TFacetMetadataSchema,
  baseUrl: string,
) {
  return infiniteQueryOptions({
    queryKey: ["leads", search],
    queryFn: async ({ pageParam }) => {
      // Convert search params to URLSearchParams manually
      const searchParams = new URLSearchParams();
      
      // Add all search parameters
      Object.entries(search).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            searchParams.set(key, value.join(','));
          } else if (value instanceof Date) {
            searchParams.set(key, value.getTime().toString());
          } else {
            searchParams.set(key, String(value));
          }
        }
      });
      
      if (pageParam) {
        searchParams.set("cursor", pageParam.toString());
      }

      const response = await fetch(`${baseUrl}?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch leads data");
      }

      const data = await response.text();
      return SuperJSON.parse(data) as InfiniteQueryResponse<TColumnSchema[], TBaseChartSchema, TFacetMetadataSchema, LogsMeta>;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    initialPageParam: search.cursor ? (search.cursor instanceof Date ? search.cursor.getTime() : new Date().getTime()) : new Date().getTime(),
    placeholderData: keepPreviousData,
  });
}
