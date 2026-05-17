import type { MenuProps } from 'antd';
import type { MenuVO } from '@/api/types';
import { MenuIcon } from '@/components/MenuIcon';
import { getGroupChildren, normalizeMenus } from '@/utils/menu';

function menuItemIcon(name?: string | null) {
  return <MenuIcon name={name} />;
}

/** 将权限菜单树转为 Ant Design Menu items */
export function buildAntdMenuItems(menus: MenuVO[]): MenuProps['items'] {
  const navMenus = normalizeMenus(menus);
  const items: NonNullable<MenuProps['items']> = [];

  for (const item of navMenus) {
    if (item.permType === 0) {
      const children = getGroupChildren(item);
      if (children.length === 0) continue;
      items.push({
        key: `group-${item.id}`,
        icon: menuItemIcon(item.icon ?? 'settings'),
        label: item.permName,
        children: children.map((child) => ({
          key: child.path!,
          icon: menuItemIcon(child.icon),
          label: child.permName,
        })),
      });
      continue;
    }

    if (item.permType === 1 && item.path) {
      items.push({
        key: item.path,
        icon: menuItemIcon(item.icon),
        label: item.permName,
      });
    }
  }

  return items;
}

/** 根据当前路径计算应展开的子菜单 */
export function getOpenMenuKeys(pathname: string, menus: MenuVO[]): string[] {
  const navMenus = normalizeMenus(menus);
  const keys: string[] = [];

  for (const item of navMenus) {
    if (item.permType !== 0) continue;
    const children = getGroupChildren(item);
    const active = children.some(
      (c) =>
        c.path === pathname ||
        (c.path !== '/' && c.path && pathname.startsWith(`${c.path}/`))
    );
    if (active) keys.push(`group-${item.id}`);
  }

  return keys;
}
