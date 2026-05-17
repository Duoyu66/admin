import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchLoginLogs, fetchOperLogs } from '@/api/log';
import { queryKeys } from '@/api/queryKeys';

const PAGE_SIZE = 10;

export function useOperLogsQuery(page: number, keyword: string, status?: number) {
  return useQuery({
    queryKey: queryKeys.logs.oper(page, keyword, status),
    queryFn: () => fetchOperLogs(page, PAGE_SIZE, keyword, status),
    placeholderData: keepPreviousData,
  });
}

export function useLoginLogsQuery(page: number, keyword: string, status?: number) {
  return useQuery({
    queryKey: queryKeys.logs.login(page, keyword, status),
    queryFn: () => fetchLoginLogs(page, PAGE_SIZE, keyword, status),
    placeholderData: keepPreviousData,
  });
}

export { PAGE_SIZE as LOGS_PAGE_SIZE };
