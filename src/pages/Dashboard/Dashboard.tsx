import { Link } from 'react-router-dom';
import { Column, Line, Pie } from '@ant-design/plots';
import { Button, Card, Col, Row, Spin, Typography } from 'antd';
import {
  ApartmentOutlined,
  KeyOutlined,
  SafetyOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/queries/useDashboard';
import { PageHeader } from '@/components/common/PageHeader';
import { appColors } from '@/config/theme';
import styles from './Dashboard.module.less';

const CHART_COLORS = [
  appColors.primary,
  appColors.success,
  appColors.warning,
  appColors.info,
  appColors.primaryActive,
  appColors.error,
];

const CHART_AXIS = {
  labelFill: appColors.textSecondary,
  lineStroke: appColors.border,
  gridStroke: appColors.borderSecondary,
  titleFill: appColors.textTertiary,
};

/** 工作台 — 数据概览与可视化 */
export function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();

  const kpis = stats
    ? [
        {
          title: '用户总数',
          value: stats.userTotal,
          sub: `启用 ${stats.userEnabled} · 停用 ${stats.userDisabled}`,
          icon: <TeamOutlined />,
          color: appColors.primary,
        },
        {
          title: '角色数量',
          value: stats.roleCount,
          sub: '系统角色',
          icon: <SafetyOutlined />,
          color: appColors.info,
        },
        {
          title: '部门数量',
          value: stats.deptCount,
          sub: '组织架构',
          icon: <ApartmentOutlined />,
          color: appColors.success,
        },
        {
          title: '权限节点',
          value: stats.permissionCount,
          sub: '目录 / 菜单 / 按钮',
          icon: <KeyOutlined />,
          color: appColors.warning,
        },
      ]
    : [];

  const lineConfig = {
    data: stats?.userTrend ?? [],
    xField: 'name',
    yField: 'value',
    smooth: true,
    height: 260,
    color: CHART_COLORS[0],
    point: { size: 4 },
    axis: {
      y: { title: false, ...CHART_AXIS },
      x: { title: false, ...CHART_AXIS },
    },
    tooltip: { title: (d: { name: string }) => d.name },
  };

  const pieStatusConfig = {
    data: stats?.userStatus ?? [],
    angleField: 'value',
    colorField: 'name',
    radius: 0.85,
    innerRadius: 0.62,
    height: 260,
    legend: { position: 'bottom' as const },
    color: [CHART_COLORS[1], CHART_COLORS[4]],
    label: {
      text: (d: { name: string; value: number }) => `${d.name} ${d.value}`,
      style: { fontSize: 12 },
    },
  };

  const columnDeptConfig = {
    data: stats?.usersByDept ?? [],
    xField: 'name',
    yField: 'value',
    height: 260,
    color: CHART_COLORS[0],
    label: { position: 'top' as const },
    axis: {
      x: { title: false, ...CHART_AXIS },
      y: { title: false, ...CHART_AXIS },
    },
  };

  const columnRoleConfig = {
    data: stats?.usersByRole ?? [],
    xField: 'name',
    yField: 'value',
    height: 260,
    color: CHART_COLORS[2],
    label: { position: 'top' as const },
    axis: {
      x: { title: false, ...CHART_AXIS },
      y: { title: false, ...CHART_AXIS },
    },
  };

  return (
    <>
      <PageHeader
        title="工作台"
        description={`欢迎回来，${user?.nickname ?? ''}${user?.roleName ? `（${user.roleName}）` : ''}`}
      />

      <Spin spinning={isLoading}>
        <Row gutter={[16, 16]} className={styles.kpiRow}>
          {kpis.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.title}>
              <Card bordered={false} className={styles.kpiCard}>
                <div className={styles.kpiInner}>
                  <div
                    className={styles.kpiIcon}
                    style={{ color: item.color, background: `${item.color}14` }}
                  >
                    {item.icon}
                  </div>
                  <div className={styles.kpiBody}>
                    <Typography.Text type="secondary" className={styles.kpiTitle}>
                      {item.title}
                    </Typography.Text>
                    <div className={styles.kpiValue}>{item.value}</div>
                    <Typography.Text type="secondary" className={styles.kpiSub}>
                      {item.sub}
                    </Typography.Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className={styles.chartRow}>
          <Col xs={24} lg={14}>
            <Card
              bordered={false}
              title="近 7 日新增用户"
              className={styles.chartCard}
              styles={{ body: { paddingTop: 8 } }}
            >
              <Line {...lineConfig} />
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Card
              bordered={false}
              title="用户状态分布"
              className={styles.chartCard}
              styles={{ body: { paddingTop: 8 } }}
            >
              <Pie {...pieStatusConfig} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.chartRow}>
          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              title="部门用户分布"
              className={styles.chartCard}
              styles={{ body: { paddingTop: 8 } }}
            >
              <Column {...columnDeptConfig} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              title="角色用户分布"
              className={styles.chartCard}
              styles={{ body: { paddingTop: 8 } }}
            >
              <Column {...columnRoleConfig} />
            </Card>
          </Col>
        </Row>

        <Card bordered={false} className={styles.quickCard}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            快捷入口
          </Typography.Title>
          <div className={styles.quickActions}>
            <Link to="/users">
              <Button icon={<TeamOutlined />}>用户管理</Button>
            </Link>
            <Link to="/roles">
              <Button icon={<SafetyOutlined />}>角色管理</Button>
            </Link>
            <Link to="/depts">
              <Button icon={<ApartmentOutlined />}>部门管理</Button>
            </Link>
            <Link to="/profile">
              <Button type="link" icon={<UserOutlined />}>
                个人中心
              </Button>
            </Link>
          </div>
        </Card>
      </Spin>
    </>
  );
}
