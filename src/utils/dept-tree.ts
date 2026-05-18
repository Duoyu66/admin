import type { DataNode } from 'antd/es/tree';
import type { TreeSelectProps } from 'antd';
import type { SysDept } from '@/api/types';
import { stripEmptyChildren } from '@/utils/tree-data';

export function deptsToTreeSelect(nodes: SysDept[]): NonNullable<TreeSelectProps['treeData']> {
  return stripEmptyChildren(nodes).map((node) => ({
    value: node.id,
    title: node.deptName,
    children: node.children?.length ? deptsToTreeSelect(node.children) : undefined,
  }));
}

/** 部门树 → 带部门名称的 Tree（用于筛选侧栏） */
export function deptsToFilterTree(nodes: SysDept[]): DataNode[] {
  return stripEmptyChildren(nodes).map((dept) => {
    const children = dept.children?.length ? deptsToFilterTree(dept.children) : undefined;
    return {
      key: dept.id,
      title: dept.deptName,
      children,
    };
  });
}

/** 部门树 → Ant Design Tree data（节点标题由 titleRender 渲染） */
export function deptsToTreeData(nodes: SysDept[]): DataNode[] {
  return stripEmptyChildren(nodes).map((dept) => {
    const children = dept.children?.length ? deptsToTreeData(dept.children) : undefined;
    return {
      key: dept.id,
      isLeaf: !children?.length,
      children,
    };
  });
}

/** 部门 id → 节点映射，供 Tree titleRender 使用 */
export function buildDeptMap(nodes: SysDept[]): Map<number, SysDept> {
  const map = new Map<number, SysDept>();
  const walk = (list: SysDept[]) => {
    for (const dept of list) {
      map.set(dept.id, dept);
      if (dept.children?.length) walk(dept.children);
    }
  };
  walk(nodes);
  return map;
}
