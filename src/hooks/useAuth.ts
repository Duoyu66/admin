import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserInfo,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from '@/api/auth';
import type { RegisterParams } from '@/api/auth';
import { clearToken, getToken, setToken } from '@/api/request';
import { queryKeys } from '@/api/queryKeys';
import { useThemeStore } from '@/stores/themeStore';

export function useAuth() {
  const queryClient = useQueryClient();
  const hasToken = !!getToken();

  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: queryKeys.auth.info,
    queryFn: async () => {
      const result = await fetchUserInfo();
      useThemeStore.getState().hydrateFromPreferences(result.preferences);
      return result;
    },
    enabled: hasToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const applyAuthResult = (result: Awaited<ReturnType<typeof apiLogin>>) => {
    if (result.token) setToken(result.token);
    queryClient.setQueryData(queryKeys.auth.info, result);
    useThemeStore.getState().hydrateFromPreferences(result.preferences);
  };

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      apiLogin(username, password),
    onSuccess: applyAuthResult,
  });

  const registerMutation = useMutation({
    mutationFn: (params: RegisterParams) => apiRegister(params),
    onSuccess: applyAuthResult,
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSettled: () => {
      clearToken();
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
      queryClient.removeQueries({ queryKey: queryKeys.notices.all });
    },
  });

  const hasPermission = (code: string) => {
    const permissions = data?.permissions ?? [];
    const roles = data?.roles ?? [];
    return permissions.includes(code) || roles.includes('ADMIN');
  };

  return {
    user: data?.user ?? null,
    menus: data?.menus ?? [],
    permissions: data?.permissions ?? [],
    roles: data?.roles ?? [],
    loading: hasToken && (isLoading || isPending),
    login: (username: string, password: string) =>
      loginMutation.mutateAsync({ username, password }),
    register: (params: RegisterParams) => registerMutation.mutateAsync(params),
    logout: () => logoutMutation.mutateAsync(),
    refresh: () => refetch(),
    hasPermission,
  };
}
