import { request } from './request';
import type { PageResult, SysRole } from './types';

export function fetchRoles(current: number, size: number, keyword?: string) {
  const q = new URLSearchParams({ current: String(current), size: String(size) });
  if (keyword) q.set('keyword', keyword);
  return request<PageResult<SysRole>>(`/api/roles?${q}`);
}

export function fetchAllRoles() {
  return request<SysRole[]>('/api/roles/all');
}

export function fetchRole(id: number) {
  return request<SysRole>(`/api/roles/${id}`);
}

export function createRole(data: Record<string, unknown>) {
  return request<void>('/api/roles', { method: 'POST', body: JSON.stringify(data) });
}

export function updateRole(id: number, data: Record<string, unknown>) {
  return request<void>(`/api/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteRole(id: number) {
  return request<void>(`/api/roles/${id}`, { method: 'DELETE' });
}

export function assignRolePermissions(id: number, permissionIds: number[]) {
  return request<void>(`/api/roles/${id}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissionIds }),
  });
}
