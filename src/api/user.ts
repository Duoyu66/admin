import { request } from './request';
import type { PageResult, SysUser } from './types';

export function fetchUsers(
  current: number,
  size: number,
  keyword?: string,
  deptId?: number | null
) {
  const q = new URLSearchParams({
    current: String(current),
    size: String(size),
  });
  if (keyword) q.set('keyword', keyword);
  if (deptId != null) q.set('deptId', String(deptId));
  return request<PageResult<SysUser>>(`/api/users?${q}`);
}

export function fetchUser(id: number) {
  return request<SysUser>(`/api/users/${id}`);
}

export function createUser(data: Record<string, unknown>) {
  return request<void>('/api/users', { method: 'POST', body: JSON.stringify(data) });
}

export function updateUser(id: number, data: Record<string, unknown>) {
  return request<void>(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteUser(id: number) {
  return request<void>(`/api/users/${id}`, { method: 'DELETE' });
}

export function resetPassword(id: number, password?: string) {
  return request<void>(`/api/users/${id}/reset-password`, {
    method: 'PUT',
    body: JSON.stringify({ password }),
  });
}

export function assignUserRoles(id: number, roleIds: number[]) {
  return request<void>(`/api/users/${id}/roles`, {
    method: 'PUT',
    body: JSON.stringify({ roleIds }),
  });
}
