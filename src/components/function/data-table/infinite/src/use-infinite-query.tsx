import { useQueryStates } from "nuqs";
import { useInfiniteQuery as useInfiniteTanstackQuery } from "@tanstack/react-query";
import { dataOptions } from "./query-options";
import { searchParamsParser } from "./search-params";

export function useInfiniteQuery<TColumnSchema, TBaseChartSchema, TFacetMetadataSchema>(
  columnSchema: TColumnSchema, 
  baseChartSchema: TBaseChartSchema, 
  facetMetadataSchema: TFacetMetadataSchema,
  apiEndpoint: string
) {
  const [search] = useQueryStates(searchParamsParser);
  const query = useInfiniteTanstackQuery(dataOptions(search, columnSchema, baseChartSchema, facetMetadataSchema, apiEndpoint));
  return query;
}
