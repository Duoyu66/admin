import { request } from './request';
import type { PageResult } from './types';

export interface SysOperLog {
  id: number;
  userId?: number;
  username?: string;
  module?: string;
  operation?: string;
  method?: string;
  requestUri?: string;
  requestMethod?: string;
  ip?: string;
  status: number;
  errorMsg?: string;
  costMs?: number;
  createdAt?: string;
}

export interface SysLoginLog {
  id: number;
  userId?: number;
  username: string;
  ip?: string;
  status: number;
  msg?: string;
  createdAt?: string;
}

export function fetchOperLogs(current: number, size: number, keyword?: string, status?: number) {
  const q = new URLSearchParams({ current: String(current), size: String(size) });
  if (keyword) q.set('keyword', keyword);
  if (status != null) q.set('status', String(status));
  return request<PageResult<SysOperLog>>(`/api/logs/oper?${q}`);
}

export function fetchLoginLogs(current: number, size: number, keyword?: string, status?: number) {
  const q = new URLSearchParams({ current: String(current), size: String(size) });
  if (keyword) q.set('keyword', keyword);
  if (status != null) q.set('status', String(status));
  return request<PageResult<SysLoginLog>>(`/api/logs/login?${q}`);
}
