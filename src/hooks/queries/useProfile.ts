import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePassword, updateProfile } from '@/api/auth';
import { queryKeys } from '@/api/queryKeys';

export function useProfileMutations() {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.info });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
  });

  return { updateProfileMutation, updatePasswordMutation };
}
