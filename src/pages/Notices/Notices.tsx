import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  App,
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import {
  NOTICES_PAGE_SIZE,
  useNoticeMutations,
  useNoticesQuery,
} from '@/hooks/queries/useNotices';
import { NoticeDetailModal } from '@/components/NoticeDetailModal/NoticeDetailModal';
import { PageHeader } from '@/components/common/PageHeader';
import type { SysNotice } from '@/api/notice';

const TYPE_OPTIONS = [
  { label: '通知', value: 1 },
  { label: '公告', value: 2 },
];

/** 公告管理 */
export function Notices() {
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [viewNotice, setViewNotice] = useState<SysNotice | null>(null);

  const { data, isFetching } = useNoticesQuery(page, keyword, statusFilter);
  const { deleteMutation, publishMutation } = useNoticeMutations();

  const list = data?.records ?? [];
  const total = data?.total ?? 0;

  const openView = (record: SysNotice) => {
    setViewNotice(record);
  };

  const handleDelete = (record: SysNotice) => {
    modal.confirm({
      title: `确认删除「${record.title}」？`,
      okType: 'danger',
      onOk: async () => {
        await deleteMutation.mutateAsync(record.id);
        message.success('已删除');
      },
    });
  };

  const handlePublish = async (id: number) => {
    await publishMutation.mutateAsync(id);
    message.success('已发布');
  };

  const columns: ColumnsType<SysNotice> = [
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      render: (title, record) => (
        <Button type="link" size="small" style={{ padding: 0 }} onClick={() => openView(record)}>
          {title}
        </Button>
      ),
    },
    {
      title: '类型',
      dataIndex: 'noticeType',
      width: 80,
      render: (t: number) => TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (s: number) => (
        <Tag color={s === 1 ? 'success' : 'default'}>{s === 1 ? '已发布' : '草稿'}</Tag>
      ),
    },
    { title: '发布时间', dataIndex: 'publishTime', width: 170 },
    { title: '创建时间', dataIndex: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'actions',
      width: 260,
      fixed: 'right',
      render: (_, record) => (
        <Space size={4} wrap className="table-actions">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => openView(record)}>
            查看
          </Button>
          {hasPermission('sys:notice:publish') && record.status !== 1 && (
            <Button type="link" size="small" onClick={() => handlePublish(record.id)}>
              发布
            </Button>
          )}
          {hasPermission('sys:notice:edit') && (
            <Button
              type="link"
              size="small"
              onClick={() => navigate(`/notices/${record.id}/edit`)}
            >
              编辑
            </Button>
          )}
          {hasPermission('sys:notice:delete') && (
            <Button type="link" size="small" danger onClick={() => handleDelete(record)}>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="公告管理" description="支持富文本编辑，用户可在消息中心查看完整公告" />

      <div className="page-toolbar">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="搜索标题、内容..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
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
            setPage(1);
          }}
          options={[
            { label: '草稿', value: 0 },
            { label: '已发布', value: 1 },
          ]}
        />
        <span className="page-toolbar-spacer" />
        {hasPermission('sys:notice:add') && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/notices/new')}>
            新增公告
          </Button>
        )}
      </div>

      <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ borderRadius: 12 }}>
        <Table<SysNotice>
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={isFetching}
          scroll={{ x: 960 }}
          pagination={{
            current: page,
            pageSize: NOTICES_PAGE_SIZE,
            total,
            showSizeChanger: false,
            showTotal: (t) => `共 ${t} 条`,
            onChange: setPage,
          }}
        />
      </Card>

      <NoticeDetailModal
        open={!!viewNotice}
        notice={viewNotice}
        onClose={() => setViewNotice(null)}
      />
    </>
  );
}
