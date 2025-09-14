'use client';

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export function useTableData<TData>(
  options: Omit<UseQueryOptions<TData, Error, TData, any[]>, 'queryKey'> & { queryKey: any[] }
): UseQueryResult<TData, Error> {
  return useQuery(options);
} 