import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPermission,
  deletePermission,
  fetchPermission,
  updatePermission,
  updatePermissionIcon,
} from '@/api/permission';
import { queryKeys } from '@/api/queryKeys';
import { usePermissionTreeQuery } from './useRoles';

export function usePermissionDetailQuery(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.permissions.detail(id!),
    queryFn: () => fetchPermission(id!),
    enabled: enabled && id != null,
  });
}

export function usePermissionsPage() {
  const treeQuery = usePermissionTreeQuery();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.permissions.tree() });
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.info });
  };

  const createMutation = useMutation({
    mutationFn: createPermission,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updatePermission>[1] }) =>
      updatePermission(id, data),
    onSuccess: (_, { id }) => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.detail(id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePermission,
    onSuccess: invalidate,
  });

  const updateIconMutation = useMutation({
    mutationFn: ({ id, icon }: { id: number; icon: string }) =>
      updatePermissionIcon(id, icon),
    onSuccess: invalidate,
  });

  return {
    treeQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    updateIconMutation,
  };
}
