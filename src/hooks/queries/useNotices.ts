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

  const inboxQuery = useQuery({
    queryKey: queryKeys.notices.inbox(),
    queryFn: () => fetchNoticeInbox(30),
    staleTime: 30 * 1000,
  });

  const unreadQuery = useQuery({
    queryKey: queryKeys.notices.unread(),
    queryFn: fetchUnreadCount,
    staleTime: 30 * 1000,
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

  return { inboxQuery, unreadQuery, markReadMutation, markAllReadMutation, invalidate };
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
    onSuccess: (_data, { data }) => {
      invalidateList();
      if ((data as { status?: number }).status === 1) {
        invalidateInbox();
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: invalidateList,
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
