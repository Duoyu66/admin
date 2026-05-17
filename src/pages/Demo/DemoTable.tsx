import { useState } from 'react';
import { Button, Card, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageHeader } from '@/components/common/PageHeader';
import styles from './demo-shared.module.less';

interface RowItem {
  id: number;
  name: string;
  status: number;
  dept: string;
}

const MOCK: RowItem[] = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  status: i % 3 === 0 ? 0 : 1,
  dept: ['研发', '运营', '产品'][i % 3],
}));

/** 表格组件演示 */
export function DemoTable() {
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const columns: ColumnsType<RowItem> = [
    { title: 'ID', dataIndex: 'id', width: 72 },
    { title: '姓名', dataIndex: 'name' },
    { title: '部门', dataIndex: 'dept', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (s: number) => (
        <Tag color={s === 1 ? 'success' : 'default'}>{s === 1 ? '正常' : '停用'}</Tag>
      ),
    },
    {
      title: '操作',
      width: 140,
      render: () => (
        <Space size={4}>
          <Button type="link" size="small">
            编辑
          </Button>
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="表格" description="Ant Design Table 分页、选择、固定列等" />

      <Card className={styles.section} bordered={false}>
        <div className={styles.gap} style={{ marginBottom: 16 }}>
          <Button type="primary">新增</Button>
          <Button disabled={selected.length === 0}>批量删除 ({selected.length})</Button>
        </div>

        <Table<RowItem>
          rowKey="id"
          columns={columns}
          dataSource={MOCK}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (keys) => setSelected(keys as number[]),
          }}
          scroll={{ x: 720 }}
          pagination={{
            current: page,
            pageSize: 10,
            total: MOCK.length,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: setPage,
          }}
        />
      </Card>
    </>
  );
}
