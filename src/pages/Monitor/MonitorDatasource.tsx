import { Button, Card, Col, Descriptions, Progress, Row, Spin, Statistic } from 'antd';
import { useDataSourceMonitorQuery } from '@/hooks/queries/useMonitor';
import { PageHeader } from '@/components/common/PageHeader';
import styles from './Monitor.module.less';

/** 数据源 / 连接池监控 */
export function MonitorDatasource() {
  const { data, isFetching, refetch } = useDataSourceMonitorQuery();

  const poolUsage =
    data && data.maxPoolSize > 0
      ? Math.round((data.activeConnections / data.maxPoolSize) * 10000) / 100
      : 0;

  return (
    <>
      <PageHeader title="数据监控" description="HikariCP 连接池与数据库信息" />
      <div className="page-toolbar" style={{ marginBottom: 16 }}>
        <Button onClick={() => refetch()}>刷新</Button>
      </div>

      <Spin spinning={isFetching && !data}>
        {data && (
          <>
            <Row gutter={[16, 16]} className={styles.metricRow}>
              <Col xs={12} sm={8} lg={4}>
                <Card bordered={false} className={styles.statCard}>
                  <Statistic title="活跃连接" value={data.activeConnections} />
                </Card>
              </Col>
              <Col xs={12} sm={8} lg={4}>
                <Card bordered={false} className={styles.statCard}>
                  <Statistic title="空闲连接" value={data.idleConnections} />
                </Card>
              </Col>
              <Col xs={12} sm={8} lg={4}>
                <Card bordered={false} className={styles.statCard}>
                  <Statistic title="总连接" value={data.totalConnections} />
                </Card>
              </Col>
              <Col xs={12} sm={8} lg={4}>
                <Card bordered={false} className={styles.statCard}>
                  <Statistic title="等待线程" value={data.threadsAwaitingConnection} />
                </Card>
              </Col>
              <Col xs={12} sm={8} lg={4}>
                <Card bordered={false} className={styles.statCard}>
                  <Statistic title="最大连接数" value={data.maxPoolSize} />
                </Card>
              </Col>
              <Col xs={12} sm={8} lg={4}>
                <Card bordered={false} className={styles.statCard}>
                  <Statistic title="最小空闲" value={data.minIdle} />
                </Card>
              </Col>
            </Row>

            <Card bordered={false} className={styles.card} title="连接池使用率">
              <Progress percent={poolUsage} status={poolUsage > 80 ? 'exception' : 'active'} />
            </Card>

            <Card bordered={false} className={styles.card} title="数据源详情">
              <Descriptions column={{ xs: 1, lg: 2 }} size="small">
                <Descriptions.Item label="连接池">{data.poolName}</Descriptions.Item>
                <Descriptions.Item label="驱动">{data.driverName}</Descriptions.Item>
                <Descriptions.Item label="数据库">{data.dbProduct}</Descriptions.Item>
                <Descriptions.Item label="版本">{data.dbVersion}</Descriptions.Item>
                <Descriptions.Item label="连接超时(ms)">
                  {data.connectionTimeoutMs}
                </Descriptions.Item>
                <Descriptions.Item label="JDBC URL" span={2}>
                  {data.jdbcUrl}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </>
        )}
      </Spin>
    </>
  );
}
