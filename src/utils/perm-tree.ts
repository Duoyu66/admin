import type { DataNode } from 'antd/es/tree';
import type { SysPermission } from '@/api/types';
import { stripEmptyChildren } from '@/utils/tree-data';

/** 权限树 → Ant Design Tree data */
export function permissionsToTreeData(nodes: SysPermission[]): DataNode[] {
  return stripEmptyChildren(nodes).map((node) => {
    const children = node.children?.length ? permissionsToTreeData(node.children) : undefined;
    return {
      key: node.id,
      title: node.permName,
      isLeaf: !children?.length,
      children,
    };
  });
}
