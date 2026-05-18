import type { NoticeInbox } from '@/api/notice';

/** 兼容后端 read 为 boolean / 0|1 的情况 */
export function isNoticeUnread(read: boolean | number | null | undefined): boolean {
  return read !== true && read !== 1;
}

export function normalizeNoticeInbox(item: NoticeInbox): NoticeInbox {
  return {
    ...item,
    read: !isNoticeUnread(item.read),
  };
}

export function normalizeNoticeInboxList(items: NoticeInbox[]): NoticeInbox[] {
  return items.map(normalizeNoticeInbox);
}
