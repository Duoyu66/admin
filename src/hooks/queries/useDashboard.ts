import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/api/dashboard';
import { queryKeys } from '@/api/queryKeys';

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: fetchDashboardStats,
    staleTime: 60 * 1000,
  });
}
