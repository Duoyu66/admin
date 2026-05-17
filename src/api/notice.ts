import { request } from './request';
import type { PageResult } from './types';

export interface SysNotice {
  id: number;
  title: string;
  content: string;
  noticeType: number;
  status: number;
  publishTime?: string;
  createdAt?: string;
}

export interface NoticeInbox {
  id: number;
  title: string;
  content: string;
  noticeType: number;
  publishTime?: string;
  read: boolean;
}

export function fetchNotices(current: number, size: number, keyword?: string, status?: number) {
  const q = new URLSearchParams({ current: String(current), size: String(size) });
  if (keyword) q.set('keyword', keyword);
  if (status != null) q.set('status', String(status));
  return request<PageResult<SysNotice>>(`/api/notices?${q}`);
}

export function fetchNotice(id: number) {
  return request<SysNotice>(`/api/notices/${id}`);
}

/** 查看已发布公告（任意登录用户） */
export function fetchPublishedNotice(id: number) {
  return request<SysNotice>(`/api/notices/published/${id}`);
}

export function createNotice(data: Record<string, unknown>) {
  return request<void>('/api/notices', { method: 'POST', body: JSON.stringify(data) });
}

export function updateNotice(id: number, data: Record<string, unknown>) {
  return request<void>(`/api/notices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteNotice(id: number) {
  return request<void>(`/api/notices/${id}`, { method: 'DELETE' });
}

export function publishNotice(id: number) {
  return request<void>(`/api/notices/${id}/publish`, { method: 'PUT' });
}

export function fetchNoticeInbox(limit = 20) {
  return request<NoticeInbox[]>(`/api/notices/inbox?limit=${limit}`);
}

export function fetchUnreadCount() {
  return request<{ count: number }>('/api/notices/unread-count');
}

export function markNoticeRead(id: number) {
  return request<void>(`/api/notices/${id}/read`, { method: 'POST' });
}

export function markAllNoticesRead() {
  return request<void>('/api/notices/read-all', { method: 'POST' });
}
