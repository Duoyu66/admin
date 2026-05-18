import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Column, Line, Pie } from '@ant-design/plots';
import { Alert, Button, Empty, List, Spin, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ApartmentOutlined,
  ArrowRightOutlined,
  BellOutlined,
  FileTextOutlined,
  LoginOutlined,
  RightOutlined,
  SafetyOutlined,
  SoundOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { fetchPublishedNotice } from '@/api/notice';
import type { SysNotice } from '@/api/notice';
import type { RecentLoginLog, RecentNotice, RecentOperLog } from '@/api/dashboard';
import { getPalette } from '@/config/buildTheme';
import { appColors } from '@/config/theme';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/queries/useDashboard';
import { NoticeDetailModal } from '@/components/NoticeDetailModal/NoticeDetailModal';
import { useThemeStore } from '@/stores/themeStore';
import {
  buildColumnChartConfig,
  buildLineChartConfig,
  buildPieChartConfig,
  hasNumericChartData,
} from './dashboardCharts';
import styles from './Dashboard.module.less';

const NOTICE_TYPE = ['', '通知', '公告'];

interface PanelProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  chart?: boolean;
}

function Panel({ title, subtitle, extra, children, chart }: PanelProps) {
  return (
    <section className={styles.panel}>
      <header className={styles.panelHead}>
        <div>
          <h3 className={styles.panelTitle}>{title}</h3>
          {subtitle && <p className={styles.panelSub}>{subtitle}</p>}
        </div>
        {extra && <div className={styles.panelExtra}>{extra}</div>}
      </header>
      <div className={chart ? `${styles.panelBody} ${styles.panelBodyChart}` : styles.panelBody}>
        {children}
      </div>
    </section>
  );
}

function ChartEmpty({ description = '暂无数据' }: { description?: string }) {
  return (
    <div className={styles.chartEmpty}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
    </div>
  );
}

/** 工作台 */
export function Dashboard() {
  const { user, hasPermission } = useAuth();
  const colorMode = useThemeStore((s) => s.colorMode);
  const preset = useThemeStore((s) => s.preset);
  const palette = useMemo(() => getPalette(preset, colorMode), [preset, colorMode]);

  const { data: stats, isLoading, isError, refetch } = useDashboardStats();
  const [viewNotice, setViewNotice] = useState<SysNotice | null>(null);
  const [noticeLoading, setNoticeLoading] = useState(false);

  const openNotice = async (item: RecentNotice) => {
    setNoticeLoading(true);
    try {
      const detail = await fetchPublishedNotice(item.id);
      setViewNotice(detail);
    } catch {
      setViewNotice({
        id: item.id,
        title: item.title,
        content: '',
        noticeType: item.noticeType,
        status: 1,
        publishTime: item.publishTime,
      });
    } finally {
      setNoticeLoading(false);
    }
  };

  const kpis = stats
    ? [
        {
          title: '用户总数',
          value: stats.userTotal,
          sub: `启用 ${stats.userEnabled} · 停用 ${stats.userDisabled}`,
          icon: <TeamOutlined />,
          color: palette.primary,
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
          title: '已发布公告',
          value: stats.noticePublished,
          sub: `共 ${stats.noticeTotal} 条`,
          icon: <SoundOutlined />,
          color: appColors.warning,
        },
        {
          title: '今日操作',
          value: stats.operLogToday,
          sub: '操作日志',
          icon: <FileTextOutlined />,
          color: palette.primaryActive,
        },
        {
          title: '今日登录',
          value: stats.loginLogToday,
          sub: '登录记录',
          icon: <LoginOutlined />,
          color: '#9254de',
        },
      ]
    : [];

  const lineConfig = useMemo(
    () => buildLineChartConfig(stats?.userTrend ?? [], palette),
    [stats?.userTrend, palette]
  );
  const pieConfig = useMemo(
    () => buildPieChartConfig(stats?.userStatus ?? [], palette),
    [stats?.userStatus, palette]
  );
  const deptConfig = useMemo(
    () => buildColumnChartConfig(stats?.usersByDept ?? [], palette, 0),
    [stats?.usersByDept, palette]
  );
  const roleConfig = useMemo(
    () => buildColumnChartConfig(stats?.usersByRole ?? [], palette, 2),
    [stats?.usersByRole, palette]
  );

  const operColumns: ColumnsType<RecentOperLog> = [
    { title: '用户', dataIndex: 'username', width: 96, ellipsis: true },
    { title: '模块', dataIndex: 'module', width: 96, ellipsis: true },
    { title: '操作', dataIndex: 'operation', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 72,
      render: (s: number) => (
        <Tag color={s === 1 ? 'success' : 'error'} bordered={false}>
          {s === 1 ? '成功' : '失败'}
        </Tag>
      ),
    },
    { title: '时间', dataIndex: 'createdAt', width: 168 },
  ];

  const loginColumns: ColumnsType<RecentLoginLog> = [
    { title: '用户', dataIndex: 'username', width: 96 },
    { title: 'IP', dataIndex: 'ip', width: 128, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 72,
      render: (s: number) => (
        <Tag color={s === 1 ? 'success' : 'error'} bordered={false}>
          {s === 1 ? '成功' : '失败'}
        </Tag>
      ),
    },
    { title: '说明', dataIndex: 'msg', ellipsis: true },
    { title: '时间', dataIndex: 'createdAt', width: 168 },
  ];

  const quickLinks = [
    { to: '/users', icon: <TeamOutlined />, label: '用户管理', show: true },
    { to: '/roles', icon: <SafetyOutlined />, label: '角色管理', show: true },
    { to: '/depts', icon: <ApartmentOutlined />, label: '部门管理', show: true },
    { to: '/notices', icon: <BellOutlined />, label: '公告管理', show: hasPermission('sys:notice:list') },
    { to: '/logs', icon: <FileTextOutlined />, label: '日志管理', show: hasPermission('sys:log:oper') },
    { to: '/profile', icon: <UserOutlined />, label: '个人中心', show: true },
  ].filter((l) => l.show);

  return (
    <div className={styles.dashboard}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <Typography.Title level={3} className={styles.heroTitle}>
            工作台
          </Typography.Title>
          <p className={styles.heroDesc}>
            欢迎回来，{user?.nickname ?? '管理员'}
            {user?.roleName ? ` · ${user.roleName}` : ''}，以下是系统运行概览
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link to="/users">
            <Button type="primary" className={styles.heroBtn} icon={<TeamOutlined />}>
              用户管理
            </Button>
          </Link>
          {hasPermission('sys:notice:list') && (
            <Link to="/notices">
              <Button className={styles.heroBtn} icon={<BellOutlined />}>
                发布公告
              </Button>
            </Link>
          )}
        </div>
      </header>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="工作台数据加载失败"
          action={
            <Button size="small" onClick={() => refetch()}>
              重试
            </Button>
          }
        />
      )}

      <Spin spinning={isLoading || noticeLoading}>
        <div className={styles.sections}>
        <div className={styles.kpiGrid}>
          {kpis.map((item) => (
            <article
              key={item.title}
              className={styles.kpiCard}
              style={{ ['--kpi-accent' as string]: item.color }}
            >
              <div className={styles.kpiTop}>
                <span
                  className={styles.kpiIcon}
                  style={{ color: item.color, background: `${item.color}18` }}
                >
                  {item.icon}
                </span>
              </div>
              <span className={styles.kpiTitle}>{item.title}</span>
              <div className={styles.kpiValue}>{item.value}</div>
              <span className={styles.kpiSub}>{item.sub}</span>
            </article>
          ))}
        </div>

        <div className={styles.chartMainGrid}>
          <Panel title="近 7 日新增用户" subtitle="按注册日期统计" chart>
            {stats?.userTrend?.length ? (
              <Line {...lineConfig} />
            ) : (
              <ChartEmpty />
            )}
          </Panel>
          <Panel title="用户状态" subtitle="启用与停用占比" chart>
            {stats && stats.userTotal > 0 ? (
              <Pie {...pieConfig} />
            ) : (
              <ChartEmpty description="暂无用户" />
            )}
          </Panel>
        </div>

        <div className={styles.chartSubGrid}>
          <Panel title="部门用户分布" subtitle="各部门人数" chart>
            {hasNumericChartData(stats?.usersByDept) ? (
              <Column {...deptConfig} />
            ) : (
              <ChartEmpty />
            )}
          </Panel>
          <Panel title="角色用户分布" subtitle="各角色绑定人数" chart>
            {hasNumericChartData(stats?.usersByRole) ? (
              <Column {...roleConfig} />
            ) : (
              <ChartEmpty />
            )}
          </Panel>
        </div>

        <div className={styles.activityGrid}>
          <Panel
            title="最新公告"
            subtitle="点击阅读全文"
            extra={
              hasPermission('sys:notice:list') ? (
                <Link to="/notices">
                  全部 <ArrowRightOutlined />
                </Link>
              ) : undefined
            }
          >
            {(stats?.recentNotices?.length ?? 0) > 0 ? (
              <List
                className={styles.noticeList}
                dataSource={stats?.recentNotices}
                renderItem={(item) => (
                  <List.Item onClick={() => openNotice(item)}>
                    <List.Item.Meta
                      avatar={
                        <span
                          className={`${styles.noticeAvatar} ${
                            item.noticeType === 2 ? styles.announce : styles.notice
                          }`}
                        >
                          {item.noticeType === 2 ? <SoundOutlined /> : <BellOutlined />}
                        </span>
                      }
                      title={item.title}
                      description={item.publishTime}
                    />
                    <Tag bordered={false} color={item.noticeType === 2 ? 'success' : 'processing'}>
                      {NOTICE_TYPE[item.noticeType] ?? '通知'}
                    </Tag>
                  </List.Item>
                )}
              />
            ) : (
              <ChartEmpty description="暂无已发布公告" />
            )}
          </Panel>

          <Panel
            title="最近操作"
            subtitle="系统操作审计"
            extra={
              hasPermission('sys:log:oper') ? (
                <Link to="/logs">
                  全部 <ArrowRightOutlined />
                </Link>
              ) : undefined
            }
          >
            <div className={styles.tablePanel}>
              <Table<RecentOperLog>
                rowKey={(r, i) => `${r.createdAt}-${i}`}
                size="middle"
                columns={operColumns}
                dataSource={stats?.recentOperLogs ?? []}
                pagination={false}
                locale={{ emptyText: '暂无操作日志' }}
                scroll={{ x: 640 }}
              />
            </div>
          </Panel>
        </div>

        <Panel
          title="最近登录"
          subtitle="登录成功与失败记录"
          extra={
            hasPermission('sys:log:login') ? (
              <Link to="/logs">
                全部 <ArrowRightOutlined />
              </Link>
            ) : undefined
          }
        >
          <div className={styles.tablePanel}>
            <Table<RecentLoginLog>
              rowKey={(r, i) => `${r.createdAt}-${i}`}
              size="middle"
              columns={loginColumns}
              dataSource={stats?.recentLoginLogs ?? []}
              pagination={false}
              locale={{ emptyText: '暂无登录日志' }}
              scroll={{ x: 800 }}
            />
          </div>
        </Panel>

        <Panel title="快捷入口" subtitle="常用功能">
          <div className={styles.quickGrid}>
            {quickLinks.map((item) => (
              <Link key={item.to} to={item.to} className={styles.quickItem}>
                <span className={styles.quickIcon}>{item.icon}</span>
                <span className={styles.quickLabel}>{item.label}</span>
                <RightOutlined style={{ fontSize: 11, opacity: 0.45 }} />
              </Link>
            ))}
          </div>
        </Panel>
        </div>
      </Spin>

      <NoticeDetailModal
        open={!!viewNotice}
        notice={viewNotice}
        onClose={() => setViewNotice(null)}
      />
    </div>
  );
}
