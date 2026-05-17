import { request } from './request';
import type { SysDept } from './types';

export function fetchDeptTree() {
  return request<SysDept[]>('/api/depts/tree');
}

export function fetchDept(id: number) {
  return request<SysDept>(`/api/depts/${id}`);
}

export function createDept(data: Record<string, unknown>) {
  return request<void>('/api/depts', { method: 'POST', body: JSON.stringify(data) });
}

export function updateDept(id: number, data: Record<string, unknown>) {
  return request<void>(`/api/depts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteDept(id: number) {
  return request<void>(`/api/depts/${id}`, { method: 'DELETE' });
}
