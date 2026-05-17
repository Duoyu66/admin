import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDept,
  deleteDept,
  fetchDept,
  fetchDeptTree,
  updateDept,
} from '@/api/dept';
import { queryKeys } from '@/api/queryKeys';

export function useDeptTreeQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.depts.tree(),
    queryFn: fetchDeptTree,
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDeptDetailQuery(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.depts.detail(id!),
    queryFn: () => fetchDept(id!),
    enabled: enabled && id != null,
  });
}

export function useDeptMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.depts.tree() });

  const createMutation = useMutation({
    mutationFn: createDept,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateDept>[1] }) =>
      updateDept(id, data),
    onSuccess: (_, { id }) => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: queryKeys.depts.detail(id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDept,
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}
