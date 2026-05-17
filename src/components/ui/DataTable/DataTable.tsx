import { Card, Spin, Table } from 'antd';
import type { TableProps } from 'antd';

import styles from './DataTable.module.less';

export interface DataTableProps<T extends object> extends TableProps<T> {
  loading?: boolean;
  cardTitle?: string;
}

/** 带卡片容器的表格 */
export function DataTable<T extends object>({
  loading,
  cardTitle,
  ...tableProps
}: DataTableProps<T>) {
  return (
    <Card
      title={cardTitle}
      bordered={false}
      style={{ borderRadius: 12 }}
      styles={{ body: { padding: 0 } }}
    >
      <Spin spinning={!!loading}>
        <Table<T> className={styles.table} {...tableProps} />
      </Spin>
    </Card>
  );
}
