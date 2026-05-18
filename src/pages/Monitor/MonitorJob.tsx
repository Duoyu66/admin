import { Button, Card, Spin, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useJobMonitorQuery } from '@/hooks/queries/useMonitor';
import { PageHeader } from '@/components/common/PageHeader';
import type { JobMonitor } from '@/api/monitor';
import styles from './Monitor.module.less';

/** 定时任务监控 */
export function MonitorJob() {
  const { data = [], isFetching, refetch } = useJobMonitorQuery();

  const columns: ColumnsType<JobMonitor> = [
    { title: '任务编号', dataIndex: 'jobId', width: 200, ellipsis: true },
    { title: '任务名称', dataIndex: 'jobName', width: 160 },
    { title: '执行周期', dataIndex: 'cron', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s: string) => (
        <Tag color={s === '运行中' ? 'success' : 'default'}>{s}</Tag>
      ),
    },
    { title: '说明', dataIndex: 'description', ellipsis: true },
    { title: '上次执行', dataIndex: 'lastRunTime', width: 170 },
    { title: '下次执行', dataIndex: 'nextRunHint', width: 120 },
  ];

  return (
    <>
      <PageHeader title="定时任务" description="系统内置调度任务状态" />
      <div className="page-toolbar" style={{ marginBottom: 16 }}>
        <Button onClick={() => refetch()}>刷新</Button>
      </div>

      <Card variant="borderless" className={styles.card} styles={{ body: { padding: 0 } }}>
        <Spin spinning={isFetching}>
          <Table<JobMonitor>
            rowKey="jobId"
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ x: 960 }}
          />
        </Spin>
      </Card>
    </>
  );
}
