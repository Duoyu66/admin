import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  assignUserRoles,
  createUser,
  deleteUser,
  fetchUser,
  fetchUsers,
  resetPassword,
  updateUser,
} from '@/api/user';
import { fetchAllRoles } from '@/api/role';
import { queryKeys } from '@/api/queryKeys';
import type { SysRole } from '@/api/types';

const PAGE_SIZE = 10;

export function useUsersQuery(page: number, keyword: string, deptId: number | null) {
  return useQuery({
    queryKey: queryKeys.users.list(page, keyword, deptId),
    queryFn: () => fetchUsers(page, PAGE_SIZE, keyword, deptId),
    placeholderData: keepPreviousData,
  });
}

export function useAllRolesQuery() {
  return useQuery<SysRole[]>({
    queryKey: queryKeys.roles.allRoles(),
    queryFn: fetchAllRoles,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUserDetailQuery(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => fetchUser(id!),
    enabled: enabled && id != null,
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: invalidateList,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateUser>[1] }) =>
      updateUser(id, data),
    onSuccess: (_, { id }) => {
      invalidateList();
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: invalidateList,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      resetPassword(id, password),
  });

  const assignRolesMutation = useMutation({
    mutationFn: ({ id, roleIds }: { id: number; roleIds: number[] }) =>
      assignUserRoles(id, roleIds),
    onSuccess: (_, { id }) => {
      invalidateList();
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    resetPasswordMutation,
    assignRolesMutation,
  };
}

export { PAGE_SIZE as USERS_PAGE_SIZE };
