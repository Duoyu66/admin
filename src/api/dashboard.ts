import { request } from './request';

export interface NameValue {
  name: string;
  value: number;
}

export interface RecentNotice {
  id: number;
  title: string;
  noticeType: number;
  publishTime?: string;
}

export interface RecentOperLog {
  username?: string;
  module?: string;
  operation?: string;
  status: number;
  createdAt?: string;
}

export interface RecentLoginLog {
  username: string;
  ip?: string;
  status: number;
  msg?: string;
  createdAt?: string;
}

export interface DashboardStats {
  userTotal: number;
  userEnabled: number;
  userDisabled: number;
  roleCount: number;
  deptCount: number;
  permissionCount: number;
  noticeTotal: number;
  noticePublished: number;
  operLogToday: number;
  loginLogToday: number;
  userTrend: NameValue[];
  usersByDept: NameValue[];
  usersByRole: NameValue[];
  userStatus: NameValue[];
  recentNotices: RecentNotice[];
  recentOperLogs: RecentOperLog[];
  recentLoginLogs: RecentLoginLog[];
}

export function fetchDashboardStats() {
  return request<DashboardStats>('/api/dashboard/stats');
}
