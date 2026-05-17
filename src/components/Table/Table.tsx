import type { ReactNode } from 'react';
import type { TableColumn } from '@/types';
import styles from './Table.module.less';

export interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((record: T) => string);
  emptyText?: string;
}

function getRowKey<T extends Record<string, unknown>>(
  record: T,
  rowKey: keyof T | ((record: T) => string)
): string {
  if (typeof rowKey === 'function') return rowKey(record);
  return String(record[rowKey]);
}

function getCellValue<T extends Record<string, unknown>>(record: T, key: string): unknown {
  return record[key as keyof T];
}

/** 数据表格 */
export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  emptyText = '暂无数据',
}: TableProps<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} style={{ width: col.width }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr key={getRowKey(record, rowKey)}>
                {columns.map((col) => {
                  const value = getCellValue(record, String(col.key));
                  const content: ReactNode = col.render
                    ? col.render(value, record, index)
                    : (value as ReactNode);
                  return <td key={String(col.key)}>{content}</td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/** 状态徽章 */
export function StatusBadge({ status }: { status: 'active' | 'inactive' | 'pending' }) {
  const labels = { active: '正常', inactive: '停用', pending: '待审核' };
  return <span className={`${styles.badge} ${styles[status]}`}>{labels[status]}</span>;
}
