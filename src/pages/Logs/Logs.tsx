import { useState } from 'react';
import { Card, Input, Select, Table, Tabs, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { LOGS_PAGE_SIZE, useLoginLogsQuery, useOperLogsQuery } from '@/hooks/queries/useLogs';
import { PageHeader } from '@/components/common/PageHeader';
import type { SysLoginLog, SysOperLog } from '@/api/log';

/** 日志管理 */
export function Logs() {
  const { hasPermission } = useAuth();
  const [tab, setTab] = useState('oper');
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [operPage, setOperPage] = useState(1);
  const [loginPage, setLoginPage] = useState(1);

  const { data: operData, isFetching: operLoading } = useOperLogsQuery(
    operPage,
    keyword,
    statusFilter
  );
  const { data: loginData, isFetching: loginLoading } = useLoginLogsQuery(
    loginPage,
    keyword,
    statusFilter
  );

  const operColumns: ColumnsType<SysOperLog> = [
    { title: '用户', dataIndex: 'username', width: 100 },
    { title: '模块', dataIndex: 'module', width: 100 },
    { title: '操作', dataIndex: 'operation', width: 120, ellipsis: true },
    { title: '请求', dataIndex: 'requestMethod', width: 70 },
    { title: 'URI', dataIndex: 'requestUri', ellipsis: true },
    { title: 'IP', dataIndex: 'ip', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (s: number) => (
        <Tag color={s === 1 ? 'success' : 'error'}>{s === 1 ? '成功' : '失败'}</Tag>
      ),
    },
    { title: '耗时(ms)', dataIndex: 'costMs', width: 90 },
    { title: '时间', dataIndex: 'createdAt', width: 170 },
  ];

  const loginColumns: ColumnsType<SysLoginLog> = [
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: 'IP', dataIndex: 'ip', width: 130 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (s: number) => (
        <Tag color={s === 1 ? 'success' : 'error'}>{s === 1 ? '成功' : '失败'}</Tag>
      ),
    },
    { title: '说明', dataIndex: 'msg', ellipsis: true },
    { title: '时间', dataIndex: 'createdAt', width: 170 },
  ];

  const toolbar = (
    <div className="page-toolbar" style={{ marginBottom: 16 }}>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="搜索..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setOperPage(1);
          setLoginPage(1);
        }}
        style={{ width: 220 }}
      />
      <Select
        allowClear
        placeholder="状态"
        style={{ width: 120 }}
        value={statusFilter}
        onChange={(v) => {
          setStatusFilter(v);
          setOperPage(1);
          setLoginPage(1);
        }}
        options={[
          { label: '成功', value: 1 },
          { label: '失败', value: 0 },
        ]}
      />
    </div>
  );

  const tabItems = [];
  if (hasPermission('sys:log:oper')) {
    tabItems.push({
      key: 'oper',
      label: '操作日志',
      children: (
        <>
          {toolbar}
          <Card variant="borderless" styles={{ body: { padding: 0 } }} style={{ borderRadius: 12 }}>
            <Table<SysOperLog>
              rowKey="id"
              columns={operColumns}
              dataSource={operData?.records ?? []}
              loading={operLoading}
              scroll={{ x: 1100 }}
              pagination={{
                current: operPage,
                pageSize: LOGS_PAGE_SIZE,
                total: operData?.total ?? 0,
                showSizeChanger: false,
                showTotal: (t) => `共 ${t} 条`,
                onChange: setOperPage,
              }}
            />
          </Card>
        </>
      ),
    });
  }
  if (hasPermission('sys:log:login')) {
    tabItems.push({
      key: 'login',
      label: '登录日志',
      children: (
        <>
          {toolbar}
          <Card variant="borderless" styles={{ body: { padding: 0 } }} style={{ borderRadius: 12 }}>
            <Table<SysLoginLog>
              rowKey="id"
              columns={loginColumns}
              dataSource={loginData?.records ?? []}
              loading={loginLoading}
              scroll={{ x: 800 }}
              pagination={{
                current: loginPage,
                pageSize: LOGS_PAGE_SIZE,
                total: loginData?.total ?? 0,
                showSizeChanger: false,
                showTotal: (t) => `共 ${t} 条`,
                onChange: setLoginPage,
              }}
            />
          </Card>
        </>
      ),
    });
  }

  return (
    <>
      <PageHeader title="日志管理" description="查看系统操作记录与用户登录记录" />
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={tabItems}
        style={{ marginTop: 0 }}
      />
    </>
  );
}
