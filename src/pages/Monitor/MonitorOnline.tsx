import { useState } from 'react';
import { App, Button, Input, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { useForceLogoutMutation, useOnlineUsersQuery } from '@/hooks/queries/useMonitor';
import { PageHeader } from '@/components/common/PageHeader';
import type { OnlineUser } from '@/api/monitor';

/** 在线用户监控 */
export function MonitorOnline() {
  const { message, modal } = App.useApp();
  const { hasPermission } = useAuth();
  const [username, setUsername] = useState('');
  const [ip, setIp] = useState('');
  const [search, setSearch] = useState({ username: '', ip: '' });

  const { data = [], isFetching, refetch } = useOnlineUsersQuery(search.username, search.ip);
  const kickMutation = useForceLogoutMutation();

  const handleKick = (record: OnlineUser) => {
    modal.confirm({
      title: `确认强退用户「${record.username}」？`,
      content: '该会话将立即失效，用户需重新登录。',
      okType: 'danger',
      okText: '强退',
      onOk: async () => {
        await kickMutation.mutateAsync(record.sessionId);
        message.success('已强退');
      },
    });
  };

  const columns: ColumnsType<OnlineUser> = [
    {
      title: '序号',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    { title: '会话编号', dataIndex: 'sessionId', width: 200, ellipsis: true },
    { title: '登录名称', dataIndex: 'username', width: 110 },
    { title: '部门', dataIndex: 'deptName', width: 120, ellipsis: true },
    { title: '主机', dataIndex: 'ip', width: 130 },
    { title: '登录地点', dataIndex: 'loginLocation', width: 90 },
    { title: '浏览器', dataIndex: 'browser', width: 90 },
    { title: '操作系统', dataIndex: 'os', width: 100 },
    {
      title: '状态',
      width: 80,
      render: () => <Tag color="success">在线</Tag>,
    },
    { title: '登录时间', dataIndex: 'loginTime', width: 170 },
    { title: '最后访问', dataIndex: 'lastAccessTime', width: 170 },
    {
      title: '操作',
      width: 90,
      fixed: 'right',
      render: (_, record) =>
        hasPermission('sys:monitor:kick') ? (
          <Button type="link" size="small" danger onClick={() => handleKick(record)}>
            强退
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader title="在线用户" description="当前有效登录会话，支持强退下线" />

      <div className="page-toolbar">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="登录名称"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: 160 }}
        />
        <Input
          allowClear
          placeholder="登录地址"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          style={{ width: 160 }}
        />
        <Space>
          <Button type="primary" onClick={() => setSearch({ username, ip })}>
            搜索
          </Button>
          <Button
            onClick={() => {
              setUsername('');
              setIp('');
              setSearch({ username: '', ip: '' });
            }}
          >
            重置
          </Button>
          <Button onClick={() => refetch()}>刷新</Button>
        </Space>
      </div>

      <Table<OnlineUser>
        rowKey="sessionId"
        columns={columns}
        dataSource={data}
        loading={isFetching}
        scroll={{ x: 1400 }}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
      />
    </>
  );
}
