import type { ComponentType } from 'react';
import { matchPath } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { Users } from '@/pages/Users/Users';
import { Roles } from '@/pages/Roles/Roles';
import { Permissions } from '@/pages/Permissions/Permissions';
import { Departments } from '@/pages/Departments/Departments';
import { Notices } from '@/pages/Notices/Notices';
import { NoticeForm } from '@/pages/Notices/NoticeForm';
import { Logs } from '@/pages/Logs/Logs';
import { MonitorOnline } from '@/pages/Monitor/MonitorOnline';
import { MonitorServer } from '@/pages/Monitor/MonitorServer';
import { MonitorDatasource } from '@/pages/Monitor/MonitorDatasource';
import { MonitorCache } from '@/pages/Monitor/MonitorCache';
import { MonitorJob } from '@/pages/Monitor/MonitorJob';
import { Profile } from '@/pages/Profile/Profile';
import { Settings } from '@/pages/Settings/Settings';
import { DemoForm } from '@/pages/Demo/DemoForm';
import { DemoTable } from '@/pages/Demo/DemoTable';
import { DemoModal } from '@/pages/Demo/DemoModal';
import { DemoMessage } from '@/pages/Demo/DemoMessage';
import { DemoOperation } from '@/pages/Demo/DemoOperation';
import { DemoChart } from '@/pages/Demo/DemoChart';
import { DemoIcon } from '@/pages/Demo/DemoIcon';
import { DemoNested } from '@/pages/Demo/DemoNested';
import { DemoException } from '@/pages/Demo/DemoException';
import { DemoMenuBadge } from '@/pages/Demo/DemoMenuBadge';

export interface AppRouteConfig {
  /** 相对父路由的路径；空字符串表示 index */
  path: string;
  Component: ComponentType;
  title: string;
  group?: string;
  breadcrumbParent?: { label: string; path: string };
}

/** 后台业务路由（新增页面只需在此追加一项） */
export const APP_ROUTES: AppRouteConfig[] = [
  { path: '', Component: Dashboard, title: '工作台' },
  { path: 'users', Component: Users, title: '用户管理', group: '系统管理' },
  { path: 'roles', Component: Roles, title: '角色管理', group: '系统管理' },
  { path: 'permissions', Component: Permissions, title: '权限配置', group: '系统管理' },
  { path: 'depts', Component: Departments, title: '部门管理', group: '系统管理' },
  { path: 'notices', Component: Notices, title: '公告管理', group: '系统管理' },
  { path: 'notices/new', Component: NoticeForm, title: '新增公告', group: '系统管理' },
  {
    path: 'notices/:id/edit',
    Component: NoticeForm,
    title: '编辑公告',
    group: '系统管理',
    breadcrumbParent: { label: '公告管理', path: '/notices' },
  },
  { path: 'logs', Component: Logs, title: '日志管理', group: '系统管理' },
  { path: 'monitor/online', Component: MonitorOnline, title: '在线用户', group: '系统监控' },
  { path: 'monitor/server', Component: MonitorServer, title: '服务监控', group: '系统监控' },
  { path: 'monitor/datasource', Component: MonitorDatasource, title: '数据监控', group: '系统监控' },
  { path: 'monitor/cache', Component: MonitorCache, title: '缓存监控', group: '系统监控' },
  { path: 'monitor/job', Component: MonitorJob, title: '定时任务', group: '系统监控' },
  { path: 'profile', Component: Profile, title: '个人中心' },
  { path: 'settings', Component: Settings, title: '系统设置', group: '系统管理' },
  { path: 'demo/form', Component: DemoForm, title: '表单', group: '实例演示' },
  { path: 'demo/table', Component: DemoTable, title: '表格', group: '实例演示' },
  { path: 'demo/modal', Component: DemoModal, title: '弹框', group: '实例演示' },
  { path: 'demo/message', Component: DemoMessage, title: '消息提示', group: '实例演示' },
  { path: 'demo/operation', Component: DemoOperation, title: '操作', group: '实例演示' },
  { path: 'demo/chart', Component: DemoChart, title: '报表', group: '实例演示' },
  { path: 'demo/icon', Component: DemoIcon, title: '图标', group: '实例演示' },
  { path: 'demo/nested', Component: DemoNested, title: '四层菜单', group: '实例演示' },
  { path: 'demo/exception', Component: DemoException, title: '缺省页', group: '实例演示' },
  { path: 'demo/badge', Component: DemoMenuBadge, title: '菜单徽标', group: '实例演示' },
];

function toAbsolutePath(relativePath: string): string {
  return relativePath === '' ? '/' : `/${relativePath}`;
}

function buildRouteTitleMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const route of APP_ROUTES) {
    if (route.path.includes(':')) continue;
    map[toAbsolutePath(route.path)] = route.title;
  }
  return map;
}

function buildRouteGroupMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const route of APP_ROUTES) {
    if (!route.group || route.path.includes(':')) continue;
    map[toAbsolutePath(route.path)] = route.group;
  }
  return map;
}

export const routeTitles = buildRouteTitleMap();
export const routeGroups = buildRouteGroupMap();

export function resolveRouteMeta(pathname: string): {
  group?: string;
  title?: string;
  parent?: { label: string; path: string };
} {
  if (routeTitles[pathname]) {
    return { group: routeGroups[pathname], title: routeTitles[pathname] };
  }

  for (const route of APP_ROUTES) {
    if (!route.path.includes(':')) continue;
    const matched = matchPath({ path: toAbsolutePath(route.path), end: true }, pathname);
    if (matched) {
      return {
        group: route.group,
        title: route.title,
        parent: route.breadcrumbParent,
      };
    }
  }

  return {};
}
