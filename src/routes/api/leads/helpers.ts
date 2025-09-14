import { isArrayOfDates, isArrayOfNumbers } from "~/components/function/data-table/components/src/lib/is-array";
import {
  calculatePercentile,
  calculateSpecificPercentile,
} from "~/components/function/data-table/components/src/lib/request/percentile";
import {
  addDays,
  addMilliseconds,
  differenceInMinutes,
  isSameDay,
} from "date-fns";
import type {
  ColumnSchema,
  FacetMetadataSchema,
  TimelineChartSchema,
  LEAD_STATUSES,
  CALL_STATUSES,
} from "~/components/leads/schema";
import type { SearchParamsType } from "~/components/leads/search-params";

export const sliderFilterValues = [
  "responseTime",
  "callDuration",
] as const satisfies (keyof ColumnSchema)[];

export const filterValues = [
  "status",
  "callStatus",
  "companyId",
  "visitorId",
  "claimedBy",
  "outcome",
  ...sliderFilterValues,
] as const satisfies (keyof ColumnSchema)[];

export function filterData(
  data: ColumnSchema[],
  search: Partial<SearchParamsType>,
): ColumnSchema[] {
  const { start, size, sort, ...filters } = search;
  return data.filter((row) => {
    for (const key in filters) {
      const filter = filters[key as keyof typeof filters];
      if (filter === undefined || filter === null) continue;
      
      // Handle slider filters (responseTime, callDuration)
      if (
        (key === "responseTime" || key === "callDuration") &&
        isArrayOfNumbers(filter)
      ) {
        const value = row[key as keyof ColumnSchema] as number | undefined;
        if (value === undefined) return false;
        
        if (filter.length === 1 && value !== filter[0]) {
          return false;
        } else if (
          filter.length === 2 &&
          (value < (filter[0] ?? 0) || value > (filter[1] ?? 0))
        ) {
          return false;
        }
        return true;
      }
      
      // Handle array filters (status, callStatus, outcome)
      if ((key === "status" || key === "callStatus" || key === "outcome") && Array.isArray(filter)) {
        const value = row[key as keyof ColumnSchema] as string | undefined;
        if (value === undefined || !(filter as string[]).includes(value)) {
          return false;
        }
      }
      
      // Handle string filters (companyId, visitorId, claimedBy)
      if ((key === "companyId" || key === "visitorId" || key === "claimedBy") && typeof filter === "string") {
        if (row[key as keyof ColumnSchema] !== filter) {
          return false;
        }
      }
      
      // Handle date filters (claimAt, lastActivity)
      if ((key === "claimAt" || key === "lastActivity") && isArrayOfDates(filter)) {
        const value = row[key as keyof ColumnSchema] as Date | undefined;
        if (value === undefined) return false;
        
        if (filter.length === 1 && !isSameDay(value, filter[0] ?? new Date())) {
          return false;
        } else if (
          filter.length === 2 &&
          (value.getTime() < (filter[0]?.getTime() ?? 0) ||
            value.getTime() > (filter[1]?.getTime() ?? 0))
        ) {
          return false;
        }
      }
    }
    return true;
  });
}

export function sortData(data: ColumnSchema[], sort: SearchParamsType["sort"]) {
  if (!sort) return data;
  return data.sort((a, b) => {
    if (sort.desc) {
      // @ts-expect-error - What
      return a?.[sort.id] < b?.[sort.id] ? 1 : -1;
    } else {
      // @ts-expect-error - What
      return a?.[sort.id] > b?.[sort.id] ? 1 : -1;
    }
  });
}

export function percentileData(data: ColumnSchema[]): ColumnSchema[] {
  const responseTimes = data
    .map((row) => row.responseTime)
    .filter((time): time is number => time !== undefined);
  
  return data.map((row) => ({
    ...row,
    percentile: row.responseTime ? calculatePercentile(responseTimes, row.responseTime) : undefined,
  }));
}

export function splitData(data: ColumnSchema[], search: SearchParamsType) {
  const newData: ColumnSchema[] = [];
  const now = new Date();

  // TODO: write a helper function for this
  data.forEach((item) => {
    const activityDate = item.lastActivity ?? new Date();
    
    if (search.direction === "next") {
      if (
        activityDate.getTime() < search.cursor.getTime() &&
        newData.length < search.size
      ) {
        newData.push(item);
        // TODO: check how to deal with the cases that there are some items left with the same date
      } else if (
        activityDate.getTime() === newData[newData.length - 1]?.lastActivity?.getTime()
      ) {
        newData.push(item);
      }
    } else if (search.direction === "prev") {
      if (
        activityDate.getTime() > search.cursor.getTime() &&
        // REMINDER: we need to make sure that we don't get items that are in the future which we do with mockLive data                                                                                                 
        activityDate.getTime() < now.getTime()
      ) {
        newData.push(item);
      }
    }
  });

  return newData;
}

export function getFacetsFromData(data: ColumnSchema[]) {
  const valuesMap = data.reduce((prev, curr) => {
    Object.entries(curr).forEach(([key, value]) => {
      if (filterValues.includes(key as (typeof filterValues)[number])) {
        // REMINDER: because regions is an array with a single value we need to convert to string
        // TODO: we should make the region a single string instead of an array?!?
        const _value = Array.isArray(value) ? value.toString() : value;
        const total = prev.get(key)?.get(_value) || 0;
        if (prev.has(key) && _value) {
          prev.get(key)?.set(_value, total + 1);
        } else if (_value) {
          prev.set(key, new Map([[_value, 1]]));
        }
      }
    });
    return prev;
  }, new Map<string, Map<unknown, number>>());

  const facets = Object.fromEntries(
    Array.from(valuesMap.entries()).map(([key, valueMap]) => {
      let min: number | undefined;
      let max: number | undefined;
      const rows = Array.from(valueMap.entries()).map(([value, total]) => {
        if (typeof value === "number") {
          if (!min) min = value;
          else min = value < min ? value : min;
          if (!max) max = value;
          else max = value > max ? value : max;
        }
        return {
          value,
          total,
        };
      });
      const total = Array.from(valueMap.values()).reduce((a, b) => a + b, 0);
      return [key, { rows, total, min, max }];
    }),
  );

  return facets satisfies Record<string, FacetMetadataSchema>;
}

export function getPercentileFromData(data: ColumnSchema[]) {
  const responseTimes = data
    .map((row) => row.responseTime)
    .filter((time): time is number => time !== undefined);

  const p50 = calculateSpecificPercentile(responseTimes, 50);
  const p75 = calculateSpecificPercentile(responseTimes, 75);
  const p90 = calculateSpecificPercentile(responseTimes, 90);
  const p95 = calculateSpecificPercentile(responseTimes, 95);
  const p99 = calculateSpecificPercentile(responseTimes, 99);

  return { p50, p75, p90, p95, p99 };
}

export function groupChartData(
  data: ColumnSchema[],
  dates: Date[] | null,
): TimelineChartSchema[] {
  if (data?.length === 0 && !dates) return [];

  // If we only have one date, we need to add a day to it
  const _dates = dates?.length === 1 ? [dates[0] ?? new Date(), addDays(dates[0] ?? new Date(), 1)] : dates;

  const between =
    _dates || (data?.length ? [data[data.length - 1]?.lastActivity ?? new Date(), data[0]?.lastActivity ?? new Date()] : []);                                                                                                           

  if (!between.length) return [];
  const interval = evaluateInterval(between);

  const duration = Math.abs(
    (between[0]?.getTime() ?? 0) - (between[between.length - 1]?.getTime() ?? 0),
  );
  const steps = Math.floor(duration / interval);

  const timestamps: { date: Date }[] = [];

  for (let i = 0; i < steps; i++) {
    const newTimestamp = addMilliseconds(between[0] ?? new Date(), i * interval);
    timestamps.push({ date: newTimestamp });
  }

  return timestamps.map((timestamp) => {
    const filteredData = data.filter((row) => {
      const activityDate = row.lastActivity ?? new Date();
      const diff = activityDate.getTime() - timestamp.date.getTime();
      return diff < interval && diff >= 0;
    });

    return {
      timestamp: timestamp.date.getTime(),
      open: filteredData.filter((row) => row.status === "open").length,
      claimed: filteredData.filter((row) => row.status === "claimed").length,
      locked: filteredData.filter((row) => row.status === "locked").length,
      closed: filteredData.filter((row) => row.status === "closed").length,
    };
  });
}

export function evaluateInterval(dates: Date[] | null): number {
  if (!dates) return 0;
  if (dates.length < 1 || dates.length > 3) return 0;

  // Calculate the time difference in minutes
  const timeDiffInMinutes = Math.abs(differenceInMinutes(dates[0] ?? new Date(), dates[1] ?? new Date()));

  // Define thresholds and their respective intervals in milliseconds
  const intervals = [
    { threshold: 1, interval: 1000 }, // 1 second
    { threshold: 5, interval: 5000 }, // 5 seconds
    { threshold: 10, interval: 10000 }, // 10 seconds
    { threshold: 30, interval: 30000 }, // 30 seconds
    { threshold: 60, interval: 60000 }, // 1 minute
    { threshold: 120, interval: 120000 }, // 2 minutes
    { threshold: 240, interval: 240000 }, // 4 minutes
    { threshold: 480, interval: 480000 }, // 8 minutes
    { threshold: 1440, interval: 1440000 }, // 24 minutes
    { threshold: 2880, interval: 2880000 }, // 48 minutes
    { threshold: 5760, interval: 5760000 }, // 96 minutes
    { threshold: 11520, interval: 11520000 }, // 192 minutes
    { threshold: 23040, interval: 23040000 }, // 384 minutes
  ];

  // Iterate over the intervals and return the matching one
  for (const { threshold, interval } of intervals) {
    if (timeDiffInMinutes < threshold) {
      return interval;
    }
  }

  // Default to the largest interval if no match found
  return 46080000; // 768 minutes
}
