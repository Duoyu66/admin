import { Alert, Button, Card, Col, Progress, Row, Spin, Statistic, Table } from 'antd';
import { useCacheMonitorQuery } from '@/hooks/queries/useMonitor';
import { PageHeader } from '@/components/common/PageHeader';
import { formatBytes } from '@/utils/format';
import styles from './Monitor.module.less';

/** 缓存监控 */
export function MonitorCache() {
  const { data, isFetching, refetch } = useCacheMonitorQuery();

  return (
    <>
      <PageHeader title="缓存监控" description="JVM 内存区域与在线会话、WebSocket 连接统计" />
      <div className="page-toolbar" style={{ marginBottom: 16 }}>
        <Button onClick={() => refetch()}>刷新</Button>
      </div>

      <Spin spinning={isFetching && !data}>
        {data && (
          <>
            <Alert
              type="info"
              showIcon
              message={data.redisEnabled ? 'Redis 已启用' : 'Redis 未启用'}
              description={data.redisMessage}
              style={{ marginBottom: 16 }}
            />

            <Row gutter={[16, 16]} className={styles.metricRow}>
              <Col xs={24} sm={8}>
                <Card bordered={false} className={styles.statCard}>
                  <Statistic title="在线会话" value={data.onlineSessionCount} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card bordered={false} className={styles.statCard}>
                  <Statistic title="已强退令牌" value={data.tokenBlacklistCount} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card bordered={false} className={styles.statCard}>
                  <Statistic title="WebSocket 连接" value={data.websocketConnectionCount} />
                </Card>
              </Col>
            </Row>

            <Card bordered={false} className={styles.card} title="JVM 内存区域">
              <Table
                rowKey="name"
                size="small"
                pagination={false}
                dataSource={data.memoryRegions}
                columns={[
                  { title: '区域', dataIndex: 'name', width: 120 },
                  {
                    title: '已用',
                    dataIndex: 'usedBytes',
                    width: 120,
                    render: (v: number) => formatBytes(v),
                  },
                  {
                    title: '上限',
                    dataIndex: 'maxBytes',
                    width: 120,
                    render: (v: number) => formatBytes(v),
                  },
                  {
                    title: '使用率',
                    dataIndex: 'usagePercent',
                    render: (v: number) => (
                      <Progress percent={v} size="small" status={v > 85 ? 'exception' : 'normal'} />
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
