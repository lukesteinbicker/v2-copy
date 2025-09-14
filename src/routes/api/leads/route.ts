import { createServerFileRoute } from '@tanstack/react-start/server'
import { calculateSpecificPercentile } from "~/components/function/data-table/components/src/lib/request/percentile";
import { addDays } from "date-fns";
import SuperJSON from "superjson";
import type { InfiniteQueryResponse, LogsMeta } from "~/components/function/data-table/infinite/src/query-options";
import type { ColumnSchema } from "~/components/leads/schema";
import { searchParamsCache } from "~/components/leads/search-params";
import {
  filterData,
  getFacetsFromData,
  groupChartData,
  percentileData,
  sliderFilterValues,
  sortData,
  splitData,
} from "./helpers";
import { db } from "~/lib/pg/connect";
import { METHODS } from "~/components/function/data-table/components/src/constants/method";
import { LEVELS } from "~/components/function/data-table/components/src/constants/levels";
import { REGIONS } from "~/components/function/data-table/components/src/constants/region";
import type { Percentile } from "~/components/function/data-table/components/src/lib/request/percentile";
import type { Leads } from "~/lib/db/schema";

// Create a mock data structure that matches the expected ColumnSchema
// This is temporary until we have real data in the leads table
interface MockLeadData {
  id: string;
  companyId: string;
  visitorId: string;
  status: "open" | "claimed" | "locked" | "closed";
  claimedBy: string | null;
  claimAt: Date | null;
  slackId: string | null;
  callId: string | null;
  callStatus: "not_started" | "in_progress" | "finished";
  notes: string | null;
  visitorName?: string;
  companyName?: string;
  lastActivity?: Date;
  responseTime?: number;
  callDuration?: number;
  outcome?: "sales_routed" | "scheduled" | "closed" | "missed";
}

function getTimingData(latency: number) {
  // Generate random percentages within the specified ranges
  const dns = Math.random() * (0.15 - 0.05) + 0.05; // 5% to 15%
  const connection = Math.random() * (0.3 - 0.1) + 0.1; // 10% to 30%
  const tls = Math.random() * (0.1 - 0.05) + 0.05; // 5% to 10%
  const transfer = Math.random() * (0.004 - 0) + 0.004; // 0% to 0.4%

  // Ensure the sum of dns, connection, tls, and transfer is subtracted from 100% for ttfb
  const remaining = 1 - (dns + connection + tls + transfer); // Calculate remaining for ttfb

  return {
    "timing.dns": Math.round(latency * dns),
    "timing.connection": Math.round(latency * connection),
    "timing.tls": Math.round(latency * tls),
    "timing.ttfb": Math.round(latency * remaining), // Use the remaining percentage for ttfb
    "timing.transfer": Math.round(latency * transfer),
  };
}

function mapLevel(level: string): (typeof LEVELS)[number] {
  switch (level.toLowerCase()) {
    case 'error':
      return 'error';
    case 'warn':
      return 'warning';
    default:
      return 'success';
  }
}

function mapMethod(method: string): (typeof METHODS)[number] {
  const upperMethod = method.toUpperCase();
  if (METHODS.includes(upperMethod as (typeof METHODS)[number])) {
    return upperMethod as (typeof METHODS)[number];
  }
  return 'GET';
}

function mapRegion(region: string): (typeof REGIONS)[number] {
  if (REGIONS.includes(region as (typeof REGIONS)[number])) {
    return region as (typeof REGIONS)[number];
  }
  return 'iad';
}

// Generate mock data for testing
function generateMockData(): MockLeadData[] {
  const data: MockLeadData[] = [];
  const now = new Date();
  
  const statuses = ['open', 'claimed', 'locked', 'closed'] as const;
  const callStatuses = ['not_started', 'in_progress', 'finished'] as const;
  const outcomes = ['sales_routed', 'scheduled', 'closed', 'missed'] as const;
  const companies = ['Acme Corp', 'Tech Solutions', 'Global Inc', 'StartupXYZ', 'Enterprise Ltd'];
  const visitors = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
  
  for (let i = 0; i < 100; i++) {
    const randomDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const callStatus = callStatuses[Math.floor(Math.random() * callStatuses.length)];
    const isClaimed = status === 'claimed' || status === 'locked';
    const hasOutcome = Math.random() > 0.3; // 70% chance of having an outcome
    
    data.push({
      id: `lead-${i.toString().padStart(3, '0')}`,
      companyId: `company-${Math.floor(Math.random() * 5)}`,
      visitorId: `visitor-${i}`,
      status,
      claimedBy: isClaimed ? `user-${Math.floor(Math.random() * 10)}` : null,
      claimAt: isClaimed ? new Date(randomDate.getTime() + Math.random() * 24 * 60 * 60 * 1000) : null,
      slackId: Math.random() > 0.5 ? `slack-${i}` : null,
      callId: callStatus !== 'not_started' ? `call-${i}` : null,
      callStatus,
      notes: Math.random() > 0.7 ? `Notes for lead ${i}` : null,
      visitorName: visitors[Math.floor(Math.random() * visitors.length)],
      companyName: companies[Math.floor(Math.random() * companies.length)],
      lastActivity: new Date(randomDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000),
      responseTime: Math.floor(Math.random() * 120) + 5, // 5-125 minutes
      callDuration: callStatus === 'finished' ? Math.floor(Math.random() * 60) + 5 : undefined, // 5-65 minutes
      outcome: hasOutcome ? outcomes[Math.floor(Math.random() * outcomes.length)] : undefined,
    });
  }
  
  return data.sort((a, b) => (b.lastActivity?.getTime() || 0) - (a.lastActivity?.getTime() || 0));
}

export const ServerRoute = createServerFileRoute('/api/leads').methods({
  GET: async ({ request }) => {
    try {
      // Parse search parameters from URL
      const url = new URL(request.url);
      const searchParams = Object.fromEntries(url.searchParams.entries());
      const search = searchParamsCache.parse(searchParams);

      const _date =
        search.lastActivity?.length === 1
          ? [search.lastActivity[0] ?? new Date(), addDays(search.lastActivity[0] ?? new Date(), 1)]
          : search.lastActivity;

      // For now, we'll use mock data since the leads table doesn't have the required fields
      // In the future, you'll need to add these fields to the leads table or create a separate table
      const mockData: MockLeadData[] = generateMockData();

      // Apply date range filter if exists
      let filteredData = mockData;
      if (_date && _date.length === 2) {
        const startDate = _date[0];
        const endDate = _date[1];
        if (startDate && endDate) {
          filteredData = mockData.filter(item => {
            const itemDate = item.lastActivity ?? new Date();
            return itemDate >= startDate && itemDate < endDate;
          });
        }
      }

      // Apply other filters
      if (search.status) {
        filteredData = filteredData.filter(item => search.status!.includes(item.status));
      }
      if (search.callStatus) {
        filteredData = filteredData.filter(item => search.callStatus!.includes(item.callStatus));
      }
      if (search.companyId) {
        filteredData = filteredData.filter(item => item.companyId === search.companyId);
      }
      if (search.visitorId) {
        filteredData = filteredData.filter(item => item.visitorId === search.visitorId);
      }
      if (search.claimedBy) {
        filteredData = filteredData.filter(item => item.claimedBy === search.claimedBy);
      }

      // Transform data to match ColumnSchema
      const transformedData: ColumnSchema[] = filteredData.map((row) => ({
        id: row.id,
        companyId: row.companyId,
        visitorId: row.visitorId,
        status: row.status,
        claimedBy: row.claimedBy,
        claimAt: row.claimAt,
        slackId: row.slackId,
        callId: row.callId,
        callStatus: row.callStatus,
        notes: row.notes,
        visitorName: row.visitorName,
        companyName: row.companyName,
        lastActivity: row.lastActivity,
        responseTime: row.responseTime,
        callDuration: row.callDuration,
        outcome: row.outcome,
      }));

      // For now, we'll use the transformed data directly since we're working with leads
      // In the future, you can implement more complex filtering logic here
      const finalFilteredData = transformedData;
      const chartData = groupChartData(finalFilteredData, _date);
      const sortedData = sortData(finalFilteredData, search.sort);
      const facets = getFacetsFromData(finalFilteredData);
      const data = splitData(sortedData, search);

      // Calculate response time percentiles instead of latency
      const responseTimes = sortedData
        .map(({ responseTime }) => responseTime)
        .filter((time): time is number => time !== undefined);
      
      const currentPercentiles: Record<Percentile, number> = {
        50: calculateSpecificPercentile(responseTimes, 50) ?? 0,
        75: calculateSpecificPercentile(responseTimes, 75) ?? 0,
        90: calculateSpecificPercentile(responseTimes, 90) ?? 0,
        95: calculateSpecificPercentile(responseTimes, 95) ?? 0,
        99: calculateSpecificPercentile(responseTimes, 99) ?? 0,
      };

      const nextCursor =
        data.length > 0 ? data[data.length - 1]?.lastActivity?.getTime() ?? 0 : null;
      const prevCursor =
        data.length > 0 ? data[0]?.lastActivity?.getTime() ?? 0 : new Date().getTime();

      const chartDataWithMeta = chartData.map(item => ({
        ...item,
        currentPercentiles
      })) as unknown as LogsMeta[];

      return new Response(
        SuperJSON.stringify({
          data,
          meta: {
            totalRowCount: filteredData.length,
            filterRowCount: finalFilteredData.length,
            chartData: chartDataWithMeta,
            // REMINDER: we separate the slider for keeping the min/max facets of the slider fields
            facets: facets,
            metadata: { currentPercentiles },
          },
          prevCursor,
          nextCursor,
        } satisfies InfiniteQueryResponse<ColumnSchema[], LogsMeta, unknown, unknown>),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch table data' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
});
