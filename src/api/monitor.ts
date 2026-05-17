import { request } from './request';

export interface OnlineUser {
  sessionId: string;
  userId: number;
  username: string;
  nickname?: string;
  deptName?: string;
  ip?: string;
  loginLocation?: string;
  browser?: string;
  os?: string;
  loginTime?: string;
  lastAccessTime?: string;
}

export interface ServerMonitor {
  computerName: string;
  osName: string;
  osArch: string;
  osVersion: string;
  serverIp: string;
  javaVersion: string;
  javaHome: string;
  projectPath: string;
  jvmUptimeMs: number;
  cpu: { cores: number; usagePercent: number };
  memory: { totalBytes: number; usedBytes: number; usagePercent: number };
  jvm: { heapUsed: number; heapMax: number; nonHeapUsed: number; heapUsagePercent: number };
  disks: Array<{
    mount: string;
    type: string;
    totalBytes: number;
    usedBytes: number;
    usagePercent: number;
  }>;
}

export interface DataSourceMonitor {
  poolName: string;
  dbProduct: string;
  dbVersion: string;
  jdbcUrl: string;
  driverName: string;
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  threadsAwaitingConnection: number;
  maxPoolSize: number;
  minIdle: number;
  connectionTimeoutMs: number;
}

export interface CacheMonitor {
  redisEnabled: boolean;
  redisMessage: string;
  onlineSessionCount: number;
  tokenBlacklistCount: number;
  websocketConnectionCount: number;
  memoryRegions: Array<{
    name: string;
    usedBytes: number;
    maxBytes: number;
    usagePercent: number;
  }>;
}

export interface JobMonitor {
  jobId: string;
  jobName: string;
  cron: string;
  status: string;
  description: string;
  lastRunTime: string;
  nextRunHint: string;
}

export function fetchOnlineUsers(username?: string, ip?: string) {
  const q = new URLSearchParams();
  if (username) q.set('username', username);
  if (ip) q.set('ip', ip);
  const suffix = q.toString() ? `?${q}` : '';
  return request<OnlineUser[]>(`/api/monitor/online${suffix}`);
}

export function forceLogoutUser(sessionId: string) {
  return request<void>(`/api/monitor/online/${sessionId}`, { method: 'DELETE' });
}

export function fetchServerMonitor() {
  return request<ServerMonitor>('/api/monitor/server');
}

export function fetchDataSourceMonitor() {
  return request<DataSourceMonitor>('/api/monitor/datasource');
}

export function fetchCacheMonitor() {
  return request<CacheMonitor>('/api/monitor/cache');
}

export function fetchJobMonitor() {
  return request<JobMonitor[]>('/api/monitor/jobs');
}
