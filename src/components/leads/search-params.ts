import {
  createParser,
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  parseAsTimestamp,
  type inferParserType,
} from "nuqs/server";
import {
  ARRAY_DELIMITER,
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
  SORT_DELIMITER,
} from "~/components/function/data-table/components/src/lib/delimiters";
import { LEAD_STATUSES, CALL_STATUSES } from "./schema";

export const parseAsSort = createParser({
  parse(queryValue) {
    const [id, desc] = queryValue.split(SORT_DELIMITER);
    if (!id && !desc) return null;
    return { id, desc: desc === "desc" };
  },
  serialize(value) {
    return `${value.id}.${value.desc ? "desc" : "asc"}`;
  },
});

export const searchParamsParser = {
  // LEAD FILTERS
  status: parseAsArrayOf(parseAsStringLiteral(LEAD_STATUSES), ARRAY_DELIMITER),
  callStatus: parseAsArrayOf(parseAsStringLiteral(CALL_STATUSES), ARRAY_DELIMITER),
  companyId: parseAsString,
  visitorId: parseAsString,
  claimedBy: parseAsString,
  outcome: parseAsArrayOf(parseAsStringLiteral(["sales_routed", "scheduled", "closed", "missed"]), ARRAY_DELIMITER),
  responseTime: parseAsArrayOf(parseAsInteger, SLIDER_DELIMITER),
  callDuration: parseAsArrayOf(parseAsInteger, SLIDER_DELIMITER),
  claimAt: parseAsArrayOf(parseAsTimestamp, RANGE_DELIMITER),
  lastActivity: parseAsArrayOf(parseAsTimestamp, RANGE_DELIMITER),
  // REQUIRED FOR SORTING & PAGINATION
  sort: parseAsSort,
  size: parseAsInteger.withDefault(40),
  start: parseAsInteger.withDefault(0),
  // REQUIRED FOR INFINITE SCROLLING (Live Mode and Load More)
  direction: parseAsStringLiteral(["prev", "next"]).withDefault("next"),
  cursor: parseAsTimestamp.withDefault(new Date()),
  live: parseAsBoolean.withDefault(false),
  // REQUIRED FOR SELECTION
  id: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParser);

export const searchParamsSerializer = createSerializer(searchParamsParser);

export type SearchParamsType = inferParserType<typeof searchParamsParser>;
