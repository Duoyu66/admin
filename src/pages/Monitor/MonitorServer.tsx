import { Button, Card, Col, Descriptions, Progress, Row, Spin, Table } from 'antd';
import { useServerMonitorQuery } from '@/hooks/queries/useMonitor';
import { PageHeader } from '@/components/common/PageHeader';
import { formatBytes, formatDuration } from '@/utils/format';
import styles from './Monitor.module.less';

/** 服务 / 服务器监控 */
export function MonitorServer() {
  const { data, isFetching, refetch } = useServerMonitorQuery();

  return (
    <>
      <PageHeader
        title="服务监控"
        description="CPU、内存、JVM、磁盘等主机与运行时指标（每 15 秒自动刷新）"
      />
      <div className="page-toolbar" style={{ marginBottom: 16 }}>
        <Button onClick={() => refetch()}>刷新</Button>
      </div>

      <Spin spinning={isFetching && !data}>
        {data && (
          <>
            <Card variant="borderless" className={styles.card} title="服务器信息">
              <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} size="small">
                <Descriptions.Item label="主机名">{data.computerName}</Descriptions.Item>
                <Descriptions.Item label="服务器 IP">{data.serverIp}</Descriptions.Item>
                <Descriptions.Item label="操作系统">{data.osName}</Descriptions.Item>
                <Descriptions.Item label="系统架构">{data.osArch}</Descriptions.Item>
                <Descriptions.Item label="系统版本">{data.osVersion}</Descriptions.Item>
                <Descriptions.Item label="Java 版本">{data.javaVersion}</Descriptions.Item>
                <Descriptions.Item label="Java 路径" span={2}>
                  {data.javaHome}
                </Descriptions.Item>
                <Descriptions.Item label="项目路径" span={3}>
                  {data.projectPath}
                </Descriptions.Item>
                <Descriptions.Item label="JVM 运行时长">
                  {formatDuration(data.jvmUptimeMs)}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Row gutter={[16, 16]} className={styles.metricRow}>
              <Col xs={24} md={8}>
                <Card variant="borderless" className={styles.card} title={`CPU（${data.cpu.cores} 核）`}>
                  <Progress
                    type="dashboard"
                    percent={data.cpu.usagePercent}
                    format={(p) => `${p}%`}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card variant="borderless" className={styles.card} title="系统内存">
                  <Progress
                    type="dashboard"
                    percent={data.memory.usagePercent}
                    format={(p) => `${p}%`}
                  />
                  <div className={styles.metricSub}>
                    {formatBytes(data.memory.usedBytes)} / {formatBytes(data.memory.totalBytes)}
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card variant="borderless" className={styles.card} title="JVM 堆内存">
                  <Progress
                    type="dashboard"
                    percent={data.jvm.heapUsagePercent}
                    status={data.jvm.heapUsagePercent > 85 ? 'exception' : 'normal'}
                    format={(p) => `${p}%`}
                  />
                  <div className={styles.metricSub}>
                    {formatBytes(data.jvm.heapUsed)} / {formatBytes(data.jvm.heapMax)}
                  </div>
                </Card>
              </Col>
            </Row>

            <Card variant="borderless" className={styles.card} title="磁盘状态">
              <Table
                rowKey="mount"
                size="small"
                pagination={false}
                dataSource={data.disks}
                columns={[
                  { title: '盘符/挂载点', dataIndex: 'mount' },
                  { title: '文件系统', dataIndex: 'type', width: 100 },
                  {
                    title: '总容量',
                    dataIndex: 'totalBytes',
                    width: 110,
                    render: (v: number) => formatBytes(v),
                  },
                  {
                    title: '已用',
                    dataIndex: 'usedBytes',
                    width: 110,
                    render: (v: number) => formatBytes(v),
                  },
                  {
                    title: '使用率',
                    dataIndex: 'usagePercent',
                    width: 180,
                    render: (v: number) => (
                      <Progress percent={v} size="small" status={v > 90 ? 'exception' : 'normal'} />
                    ),
                  },
                ]}
              />
            </Card>
          </>
        )}
      </Spin>
    </>
  );
}
