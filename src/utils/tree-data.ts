/** 记录是否存在可展开的子节点 */
export function hasTreeChildren<T extends { children?: T[] | null }>(record: T): boolean {
  return Array.isArray(record.children) && record.children.length > 0;
}

/** 递归移除空的 children，避免树表/树组件出现无意义的展开按钮 */
export function stripEmptyChildren<T extends { children?: T[] | null }>(
  nodes: T[] | null | undefined
): T[] {
  if (!nodes?.length) return [];
  return nodes.map((node) => {
    const kids = node.children?.length ? stripEmptyChildren(node.children) : undefined;
    if (kids?.length) {
      return { ...node, children: kids };
    }
    const { children: _removed, ...rest } = node;
    return rest as T;
  });
}

/** Ant Design 树形 Table 通用 expandable 配置 */
export const treeTableExpandable = {
  rowExpandable: hasTreeChildren,
} as const;
