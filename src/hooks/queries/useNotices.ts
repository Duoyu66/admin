import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createNotice,
  deleteNotice,
  fetchNotice,
  fetchNoticeInbox,
  fetchNotices,
  fetchUnreadCount,
  markAllNoticesRead,
  markNoticeRead,
  publishNotice,
  updateNotice,
} from '@/api/notice';
import { queryKeys } from '@/api/queryKeys';
import { getToken } from '@/api/request';
import { normalizeNoticeInboxList } from '@/utils/notice';

const PAGE_SIZE = 10;

export function useNoticeDetailQuery(id: number | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.notices.detail(id!),
    queryFn: () => fetchNotice(id!),
    enabled: enabled && id != null,
  });
}

export function useNoticesQuery(page: number, keyword: string, status?: number) {
  return useQuery({
    queryKey: queryKeys.notices.list(page, keyword, status),
    queryFn: () => fetchNotices(page, PAGE_SIZE, keyword, status),
    placeholderData: keepPreviousData,
  });
}

export function useNoticeInbox() {
  const queryClient = useQueryClient();
  const enabled = !!getToken();

  const inboxQuery = useQuery({
    queryKey: queryKeys.notices.inbox(),
    queryFn: async () => normalizeNoticeInboxList(await fetchNoticeInbox(30)),
    enabled,
    staleTime: 15 * 1000,
  });

  const unreadQuery = useQuery({
    queryKey: queryKeys.notices.unread(),
    queryFn: fetchUnreadCount,
    enabled,
    staleTime: 15 * 1000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notices.inbox() });
    queryClient.invalidateQueries({ queryKey: queryKeys.notices.unread() });
  };

  const markReadMutation = useMutation({
    mutationFn: markNoticeRead,
    onSuccess: invalidate,
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNoticesRead,
    onSuccess: invalidate,
  });

  const refetchInbox = () => {
    void inboxQuery.refetch();
    void unreadQuery.refetch();
  };

  return {
    inboxQuery,
    unreadQuery,
    markReadMutation,
    markAllReadMutation,
    invalidate,
    refetchInbox,
  };
}

export function useNoticeMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.notices.lists() });

  const invalidateInbox = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notices.inbox() });
    queryClient.invalidateQueries({ queryKey: queryKeys.notices.unread() });
  };

  const createMutation = useMutation({
    mutationFn: createNotice,
    onSuccess: (_data, variables) => {
      invalidateList();
      if ((variables as { status?: number }).status === 1) {
        invalidateInbox();
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateNotice>[1] }) =>
      updateNotice(id, data),
    onSuccess: () => {
      invalidateList();
      invalidateInbox();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: () => {
      invalidateList();
      invalidateInbox();
    },
  });

  const publishMutation = useMutation({
    mutationFn: publishNotice,
    onSuccess: () => {
      invalidateList();
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.inbox() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.unread() });
    },
  });

  return { createMutation, updateMutation, deleteMutation, publishMutation };
}

export { PAGE_SIZE as NOTICES_PAGE_SIZE };
