import type { TreeSelectProps } from 'antd';
import type { SysPermission } from '@/api/types';

/** 权限树 → 上级节点选择（目录、菜单可作为父级） */
export function permsToParentTreeSelect(
  nodes: SysPermission[],
  excludeId?: number
): NonNullable<TreeSelectProps['treeData']> {
  const build = (list: SysPermission[]): NonNullable<TreeSelectProps['treeData']> =>
    list
      .filter((n) => n.id !== excludeId && n.permType !== 2)
      .map((node) => ({
        value: node.id,
        title: `${node.permName} (${node.permCode})`,
        children: node.children?.length ? build(node.children) : undefined,
      }));

  return [{ value: 0, title: '顶级' }, ...build(nodes)];
}
