import { request } from './request';
import type { SysPermission } from './types';

export function fetchPermissionTree() {
  return request<SysPermission[]>('/api/permissions/tree');
}

export function fetchPermission(id: number) {
  return request<SysPermission>(`/api/permissions/${id}`);
}

export function createPermission(data: Record<string, unknown>) {
  return request<void>('/api/permissions', { method: 'POST', body: JSON.stringify(data) });
}

export function updatePermission(id: number, data: Record<string, unknown>) {
  return request<void>(`/api/permissions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deletePermission(id: number) {
  return request<void>(`/api/permissions/${id}`, { method: 'DELETE' });
}

export function updatePermissionIcon(id: number, icon: string) {
  return request<void>(`/api/permissions/${id}/icon`, {
    method: 'PUT',
    body: JSON.stringify({ icon }),
  });
}
