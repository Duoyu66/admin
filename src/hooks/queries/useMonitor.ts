import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchCacheMonitor,
  fetchDataSourceMonitor,
  fetchJobMonitor,
  fetchOnlineUsers,
  fetchServerMonitor,
  forceLogoutUser,
} from '@/api/monitor';
import { queryKeys } from '@/api/queryKeys';

export function useOnlineUsersQuery(username: string, ip: string) {
  return useQuery({
    queryKey: queryKeys.monitor.online(username, ip),
    queryFn: () => fetchOnlineUsers(username || undefined, ip || undefined),
    refetchInterval: 10_000,
  });
}

export function useServerMonitorQuery() {
  return useQuery({
    queryKey: queryKeys.monitor.server(),
    queryFn: fetchServerMonitor,
    refetchInterval: 15_000,
  });
}

export function useDataSourceMonitorQuery() {
  return useQuery({
    queryKey: queryKeys.monitor.datasource(),
    queryFn: fetchDataSourceMonitor,
    refetchInterval: 15_000,
  });
}

export function useCacheMonitorQuery() {
  return useQuery({
    queryKey: queryKeys.monitor.cache(),
    queryFn: fetchCacheMonitor,
    refetchInterval: 15_000,
  });
}

export function useJobMonitorQuery() {
  return useQuery({
    queryKey: queryKeys.monitor.jobs(),
    queryFn: fetchJobMonitor,
    staleTime: 60_000,
  });
}

export function useForceLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: forceLogoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.monitor.all });
    },
  });
}
