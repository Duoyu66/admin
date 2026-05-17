import type { ReactNode } from 'react';

/** 菜单项 */
export interface MenuItem {
  key: string;
  label: string;
  icon: MenuIconName;
  path: string;
}

/** 菜单图标名称 */
export type MenuIconName =
  | 'dashboard'
  | 'users'
  | 'analytics'
  | 'content'
  | 'settings'
  | 'roles'
  | 'logs';

/** 菜单分组 */
export interface MenuGroup {
  key: string;
  title: string;
  items: MenuItem[];
}

/** 面包屑 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

/** 统计卡片 */
export interface StatCardData {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
}

/** 表格列定义 */
export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  render?: (value: unknown, record: T, index: number) => ReactNode;
}

/** 用户记录 */
export interface UserRecord extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  avatar?: string;
}

/** 操作日志 */
export interface OperationLog extends Record<string, unknown> {
  id: string;
  operator: string;
  action: string;
  module: string;
  time: string;
  status: 'success' | 'failed';
}

/** 分页 */
export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

/** 当前登录用户 */
export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

/** 通知项 */
export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

/** 表单字段 */
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}
