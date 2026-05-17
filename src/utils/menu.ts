import type { MenuVO } from '@/api/types';

const SYSTEM_PATHS = new Set(['/users', '/roles', '/permissions']);

/** 系统管理下的子菜单路径 */
export function isSystemPath(path: string): boolean {
  return SYSTEM_PATHS.has(path);
}

function sortMenus(items: MenuVO[]): MenuVO[] {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

/**
 * 规范化菜单树：保留目录分组，将散落的系统子菜单归入「系统管理」
 */
export function normalizeMenus(menus: MenuVO[]): MenuVO[] {
  const result: MenuVO[] = [];
  const systemOrphans: MenuVO[] = [];

  for (const item of sortMenus(menus)) {
    if (item.permType === 0) {
      const children = sortMenus(
        (item.children ?? []).filter((c) => c.permType === 1 && c.path)
      );
      if (children.length > 0) {
        result.push({ ...item, children });
      }
      continue;
    }

    if (item.permType === 1 && item.path) {
      if (isSystemPath(item.path)) {
        systemOrphans.push(item);
      } else {
        result.push(item);
      }
    }
  }

  if (systemOrphans.length > 0) {
    const existing = result.find((m) => m.permCode === 'system');
    if (existing) {
      const merged = new Map<number, MenuVO>();
      for (const c of [...(existing.children ?? []), ...systemOrphans]) {
        merged.set(c.id, c);
      }
      existing.children = sortMenus([...merged.values()]);
    } else {
      result.push({
        id: -1,
        parentId: 0,
        permCode: 'system',
        permName: '系统管理',
        permType: 0,
        icon: 'settings',
        sortOrder: 2,
        children: sortMenus(systemOrphans),
      });
    }
  }

  return sortMenus(result);
}

/** 目录下可点击的子菜单 */
export function getGroupChildren(group: MenuVO): MenuVO[] {
  return sortMenus((group.children ?? []).filter((c) => c.permType === 1 && c.path));
}

/** 子菜单中是否有当前路由 */
export function groupHasActivePath(group: MenuVO, pathname: string): boolean {
  return getGroupChildren(group).some(
    (c) => c.path === pathname || (c.path !== '/' && pathname.startsWith(`${c.path}/`))
  );
}
