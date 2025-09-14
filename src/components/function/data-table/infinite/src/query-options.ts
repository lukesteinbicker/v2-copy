import type { Percentile } from "~/components/function/data-table/components/src/lib/request/percentile";
import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query";
import SuperJSON from "superjson";
// No default types - users must provide their own
import { searchParamsSerializer, type SearchParamsType } from "./search-params";

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

export const dataOptions = <TColumnSchema, TBaseChartSchema, TFacetMetadataSchema>(
  search: SearchParamsType,
  // These parameters are used for type inference in the generic types
  _columnSchema: TColumnSchema,
  _baseChartSchema: TBaseChartSchema,
  _facetMetadataSchema: TFacetMetadataSchema,
  apiEndpoint: string
) => {
  return infiniteQueryOptions({
    queryKey: [
      "data-table",
      searchParamsSerializer({ ...search, uuid: null, live: null }),
    ], // remove uuid/live as it would otherwise retrigger a fetch
    queryFn: async ({ pageParam }) => {
      const cursor = new Date(pageParam.cursor);
      const direction = pageParam.direction as "next" | "prev" | undefined;
      const serialize = searchParamsSerializer({
        ...search,
        cursor,
        direction,
        uuid: null,
        live: null,
      });
      const response = await fetch(`${apiEndpoint}${serialize}`);
      const json = await response.json();
      return SuperJSON.parse<InfiniteQueryResponse<TColumnSchema[], TBaseChartSchema, TFacetMetadataSchema, LogsMeta>>(
        json,
      );
    },
    initialPageParam: { cursor: new Date().getTime(), direction: "next" },
    getPreviousPageParam: (firstPage, _pages) => {
      if (!firstPage.prevCursor) return null;
      return { cursor: firstPage.prevCursor, direction: "prev" };
    },
    getNextPageParam: (lastPage, _pages) => {
      if (!lastPage.nextCursor) return null;
      return { cursor: lastPage.nextCursor, direction: "next" };
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
