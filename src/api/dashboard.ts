import { request } from './request';

export interface NameValue {
  name: string;
  value: number;
}

export interface DashboardStats {
  userTotal: number;
  userEnabled: number;
  userDisabled: number;
  roleCount: number;
  deptCount: number;
  permissionCount: number;
  userTrend: NameValue[];
  usersByDept: NameValue[];
  usersByRole: NameValue[];
  userStatus: NameValue[];
}

export function fetchDashboardStats() {
  return request<DashboardStats>('/api/dashboard/stats');
}
