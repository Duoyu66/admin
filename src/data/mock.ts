import type {
  CurrentUser,
  MenuGroup,
  OperationLog,
  StatCardData,
  UserRecord,
} from '@/types';

/** 侧边栏分组菜单 */
export const menuGroups: MenuGroup[] = [
  {
    key: 'overview',
    title: '概览',
    items: [{ key: 'dashboard', label: '工作台', icon: 'dashboard', path: '/' }],
  },
  {
    key: 'business',
    title: '业务管理',
    items: [
      { key: 'users', label: '用户管理', icon: 'users', path: '/users' },
      { key: 'analytics', label: '数据统计', icon: 'analytics', path: '/analytics' },
      { key: 'content', label: '内容管理', icon: 'content', path: '/content' },
    ],
  },
  {
    key: 'system',
    title: '系统',
    items: [
      { key: 'roles', label: '角色权限', icon: 'roles', path: '/roles' },
      { key: 'settings', label: '系统设置', icon: 'settings', path: '/settings' },
    ],
  },
];

/** 扁平菜单 — 用于面包屑匹配 */
export const flatMenuItems = menuGroups.flatMap((g) => g.items);

/** 当前管理员 */
export const currentUser: CurrentUser = {
  id: 'u-001',
  name: 'Admin',
  email: 'admin@system.local',
  avatar: 'A',
  role: '超级管理员',
};

/** 仪表盘统计 */
export const dashboardStats: StatCardData[] = [
  {
    id: 's1',
    title: '总用户数',
    value: '12,847',
    change: '较上月 +12.5%',
    trend: 'up',
    icon: 'users',
  },
  {
    id: 's2',
    title: '今日订单',
    value: '1,286',
    change: '较昨日 +8.2%',
    trend: 'up',
    icon: 'orders',
  },
  {
    id: 's3',
    title: '本月营收',
    value: '¥ 892K',
    change: '较上月 -2.1%',
    trend: 'down',
    icon: 'revenue',
  },
  {
    id: 's4',
    title: '系统可用率',
    value: '99.9%',
    change: '运行稳定',
    trend: 'neutral',
    icon: 'analytics',
  },
];

/** 操作日志 */
export const operationLogs: OperationLog[] = [
  {
    id: '1',
    operator: 'Admin',
    action: '新增用户',
    module: '用户管理',
    time: '2025-05-17 14:32',
    status: 'success',
  },
  {
    id: '2',
    operator: '张明',
    action: '导出报表',
    module: '数据统计',
    time: '2025-05-17 13:18',
    status: 'success',
  },
  {
    id: '3',
    operator: '李华',
    action: '修改角色权限',
    module: '角色权限',
    time: '2025-05-17 11:05',
    status: 'success',
  },
  {
    id: '4',
    operator: '系统',
    action: '自动备份',
    module: '系统设置',
    time: '2025-05-17 02:00',
    status: 'success',
  },
  {
    id: '5',
    operator: '陈伟',
    action: '批量删除内容',
    module: '内容管理',
    time: '2025-05-16 18:44',
    status: 'failed',
  },
];

/** 用户列表 */
export const mockUsers: UserRecord[] = [
  {
    id: '1',
    name: '张明',
    email: 'zhangming@example.com',
    role: '管理员',
    status: 'active',
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    name: '李华',
    email: 'lihua@example.com',
    role: '编辑',
    status: 'active',
    createdAt: '2025-02-20',
  },
  {
    id: '3',
    name: '王芳',
    email: 'wangfang@example.com',
    role: '访客',
    status: 'pending',
    createdAt: '2025-03-10',
  },
  {
    id: '4',
    name: '陈伟',
    email: 'chenwei@example.com',
    role: '编辑',
    status: 'inactive',
    createdAt: '2025-03-28',
  },
  {
    id: '5',
    name: '刘洋',
    email: 'liuyang@example.com',
    role: '管理员',
    status: 'active',
    createdAt: '2025-04-05',
  },
  {
    id: '6',
    name: '赵敏',
    email: 'zhaomin@example.com',
    role: '访客',
    status: 'active',
    createdAt: '2025-04-12',
  },
  {
    id: '7',
    name: '孙磊',
    email: 'sunlei@example.com',
    role: '编辑',
    status: 'active',
    createdAt: '2025-04-18',
  },
  {
    id: '8',
    name: '周婷',
    email: 'zhouting@example.com',
    role: '访客',
    status: 'inactive',
    createdAt: '2025-05-01',
  },
  {
    id: '9',
    name: '吴强',
    email: 'wuqiang@example.com',
    role: '编辑',
    status: 'pending',
    createdAt: '2025-05-08',
  },
  {
    id: '10',
    name: '郑洁',
    email: 'zhengjie@example.com',
    role: '管理员',
    status: 'active',
    createdAt: '2025-05-12',
  },
  {
    id: '11',
    name: '黄涛',
    email: 'huangtao@example.com',
    role: '访客',
    status: 'active',
    createdAt: '2025-05-14',
  },
  {
    id: '12',
    name: '林雪',
    email: 'linxue@example.com',
    role: '编辑',
    status: 'active',
    createdAt: '2025-05-16',
  },
];

export const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '访客', value: 'guest' },
];

export const statusLabels: Record<UserRecord['status'], string> = {
  active: '正常',
  inactive: '停用',
  pending: '待审核',
};

/** 路由 → 页面标题 */
export const routeTitles: Record<string, string> = {
  '/': '工作台',
  '/users': '用户管理',
  '/analytics': '数据统计',
  '/content': '内容管理',
  '/roles': '角色权限',
  '/settings': '系统设置',
};
