import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Bell,
  Bookmark,
  Building2,
  Calendar,
  Clock,
  Cog,
  Database,
  FileText,
  Folder,
  FolderTree,
  Globe,
  Home,
  KeyRound,
  LayoutDashboard,
  List,
  Lock,
  Mail,
  Menu,
  Package,
  PieChart,
  ScrollText,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingCart,
  UserCircle,
  UserPlus,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';

/** 菜单可选 Lucide 图标（kebab-case → 组件） */
export const MENU_ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  'layout-dashboard': LayoutDashboard,
  home: Home,
  users: Users,
  'user-plus': UserPlus,
  'user-circle': UserCircle,
  shield: Shield,
  'shield-check': ShieldCheck,
  'key-round': KeyRound,
  lock: Lock,
  settings: Settings,
  folder: Folder,
  'folder-tree': FolderTree,
  menu: Menu,
  list: List,
  'file-text': FileText,
  bell: Bell,
  mail: Mail,
  'bar-chart-3': BarChart3,
  'pie-chart': PieChart,
  package: Package,
  'shopping-cart': ShoppingCart,
  wallet: Wallet,
  'scroll-text': ScrollText,
  wrench: Wrench,
  database: Database,
  server: Server,
  globe: Globe,
  bookmark: Bookmark,
  'building-2': Building2,
  calendar: Calendar,
  clock: Clock,
  search: Search,
  cog: Cog,
};

/** 权限树 / 侧栏图标选择器选项 */
export const MENU_ICON_OPTIONS = [
  { value: 'activity', label: '监控' },
  { value: 'layout-dashboard', label: '工作台' },
  { value: 'home', label: '首页' },
  { value: 'users', label: '用户' },
  { value: 'user-plus', label: '新增用户' },
  { value: 'user-circle', label: '个人' },
  { value: 'shield', label: '角色' },
  { value: 'shield-check', label: '权限' },
  { value: 'key-round', label: '密钥' },
  { value: 'lock', label: '锁定' },
  { value: 'settings', label: '设置' },
  { value: 'cog', label: '齿轮' },
  { value: 'folder', label: '文件夹' },
  { value: 'folder-tree', label: '目录树' },
  { value: 'menu', label: '菜单' },
  { value: 'list', label: '列表' },
  { value: 'file-text', label: '文档' },
  { value: 'bell', label: '通知' },
  { value: 'mail', label: '邮件' },
  { value: 'bar-chart-3', label: '柱状图' },
  { value: 'pie-chart', label: '饼图' },
  { value: 'package', label: '包裹' },
  { value: 'shopping-cart', label: '订单' },
  { value: 'wallet', label: '钱包' },
  { value: 'scroll-text', label: '日志' },
  { value: 'wrench', label: '工具' },
  { value: 'database', label: '数据库' },
  { value: 'server', label: '服务' },
  { value: 'globe', label: '全球' },
  { value: 'bookmark', label: '书签' },
  { value: 'building-2', label: '部门' },
  { value: 'calendar', label: '日历' },
  { value: 'clock', label: '时钟' },
  { value: 'search', label: '搜索' },
] as const;

export type MenuIconKey = (typeof MENU_ICON_OPTIONS)[number]['value'];

/** 旧版自定义图标名 → Lucide kebab-case */
const LEGACY_ICON_ALIASES: Record<string, string> = {
  dashboard: 'layout-dashboard',
  users: 'users',
  roles: 'shield',
  settings: 'settings',
  analytics: 'bar-chart-3',
  content: 'file-text',
  logs: 'scroll-text',
  orders: 'shopping-cart',
  revenue: 'wallet',
  system: 'settings',
};

export function resolveMenuIconName(name?: string | null): string {
  if (!name) return 'layout-dashboard';
  const trimmed = name.trim();
  const alias = LEGACY_ICON_ALIASES[trimmed];
  const key = alias ?? trimmed;
  if (MENU_ICONS[key]) return key;
  return 'layout-dashboard';
}

export function getMenuIcon(name?: string | null): LucideIcon {
  return MENU_ICONS[resolveMenuIconName(name)] ?? LayoutDashboard;
}
