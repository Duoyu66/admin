import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  assignRolePermissions,
  createRole,
  deleteRole,
  fetchRole,
  fetchRoles,
  updateRole,
} from '@/api/role';
import { fetchPermissionTree } from '@/api/permission';
import { queryKeys } from '@/api/queryKeys';

const PAGE_SIZE = 10;

export function useRolesQuery(page: number, keyword: string) {
  return useQuery({
    queryKey: queryKeys.roles.list(page, keyword),
    queryFn: () => fetchRoles(page, PAGE_SIZE, keyword),
    placeholderData: keepPreviousData,
  });
}

export function useRoleDetailQuery(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.roles.detail(id!),
    queryFn: () => fetchRole(id!),
    enabled: enabled && id != null,
  });
}

export function usePermissionTreeQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.permissions.tree(),
    queryFn: fetchPermissionTree,
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRoleMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: invalidateList,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateRole>[1] }) =>
      updateRole(id, data),
    onSuccess: (_, { id }) => {
      invalidateList();
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: invalidateList,
  });

  const assignPermissionsMutation = useMutation({
    mutationFn: ({ id, permissionIds }: { id: number; permissionIds: number[] }) =>
      assignRolePermissions(id, permissionIds),
    onSuccess: (_, { id }) => {
      invalidateList();
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(id) });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    assignPermissionsMutation,
  };
}

export { PAGE_SIZE as ROLES_PAGE_SIZE };
