import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  TreeSelect,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import {
  useAllRolesQuery,
  useUserDetailQuery,
  useUserMutations,
  useUsersQuery,
  USERS_PAGE_SIZE,
} from '@/hooks/queries/useUsers';
import { useDeptTreeQuery } from '@/hooks/queries/useDepartments';
import { deptsToTreeSelect } from '@/utils/dept-tree';
import { RoleCheckboxGroup } from '@/components/RoleCheckboxGroup';
import { PageHeader } from '@/components/common/PageHeader';
import type { SysUser } from '@/api/types';
import styles from './Users.module.less';

/** 用户管理 */
export function Users() {
  const { message, modal } = App.useApp();
  const { hasPermission } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [roleTargetId, setRoleTargetId] = useState<number | null>(null);
  const [roleIds, setRoleIds] = useState<number[]>([]);
  const [form] = Form.useForm();
  const formRoleIds = Form.useWatch('roleIds', form) ?? [];

  const { data, isFetching } = useUsersQuery(currentPage, keyword);
  const { data: roles = [] } = useAllRolesQuery();
  const { data: deptTree = [] } = useDeptTreeQuery();
  const deptTreeData = deptsToTreeSelect(deptTree);
  const { data: editingUser } = useUserDetailQuery(editingId, modalOpen && editingId != null);
  const { data: roleTarget } = useUserDetailQuery(
    roleTargetId,
    roleModalOpen && roleTargetId != null
  );

  const {
    createMutation,
    updateMutation,
    deleteMutation,
    resetPasswordMutation,
    assignRolesMutation,
  } = useUserMutations();

  const list = data?.records ?? [];
  const total = data?.total ?? 0;

  useEffect(() => {
    if (!editingUser || !modalOpen) return;
    form.setFieldsValue({
      nickname: editingUser.nickname,
      email: editingUser.email ?? '',
      phone: editingUser.phone ?? '',
      status: editingUser.status,
      deptId: editingUser.deptId,
      roleIds: editingUser.roleIds ?? [],
    });
  }, [editingUser, modalOpen, form]);

  useEffect(() => {
    if (roleTarget) setRoleIds(roleTarget.roleIds ?? []);
  }, [roleTarget]);

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ status: 1, roleIds: [], deptId: undefined });
    setModalOpen(true);
  };

  const openEdit = (id: number) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const openAssignRoles = (user: SysUser) => {
    setRoleTargetId(user.id);
    setRoleModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = { ...values, roleIds: values.roleIds ?? [] };
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
      message.success('用户已更新');
    } else {
      await createMutation.mutateAsync(payload);
      message.success('用户已创建');
    }
    setModalOpen(false);
  };

  const handleAssignRoles = async () => {
    if (!roleTargetId) return;
    await assignRolesMutation.mutateAsync({ id: roleTargetId, roleIds });
    message.success('角色已分配');
    setRoleModalOpen(false);
    setRoleTargetId(null);
  };

  const handleDelete = (id: number) => {
    modal.confirm({
      title: '确认删除该用户？',
      content: '删除后无法恢复',
      okType: 'danger',
      onOk: async () => {
        await deleteMutation.mutateAsync(id);
        message.success('已删除');
      },
    });
  };

  const handleResetPwd = async (id: number) => {
    await resetPasswordMutation.mutateAsync({ id, password: 'admin123' });
    message.success('密码已重置为 admin123');
  };

  const columns: ColumnsType<SysUser> = [
    { title: '用户名', dataIndex: 'username', width: 110 },
    { title: '昵称', dataIndex: 'nickname', width: 100 },
    { title: '部门', dataIndex: 'deptName', width: 110, render: (v) => v || '—' },
    { title: '邮箱', dataIndex: 'email', ellipsis: true },
    {
      title: '角色',
      dataIndex: 'roleNames',
      render: (_, r) => {
        const names = r.roleNames as string[] | undefined;
        if (!names?.length) return <span className={styles.noRole}>未分配</span>;
        return (
          <Space size={[4, 4]} wrap>
            {names.map((name) => (
              <Tag key={name}>{name}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '正常' : '停用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'actions',
      width: 280,
      fixed: 'right',
      render: (_, r) => (
        <Space size={4} wrap className="table-actions">
          {hasPermission('sys:user:edit') && (
            <>
              <Button type="link" size="small" onClick={() => openAssignRoles(r)}>
                分配角色
              </Button>
              <Button type="link" size="small" onClick={() => openEdit(r.id)}>
                编辑
              </Button>
            </>
          )}
          {hasPermission('sys:user:reset') && (
            <Button type="link" size="small" onClick={() => handleResetPwd(r.id)}>
              重置密码
            </Button>
          )}
          {hasPermission('sys:user:delete') && r.id !== 1 && (
            <Button type="link" size="small" danger onClick={() => handleDelete(r.id)}>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="用户管理" description="维护系统用户、分配角色与账号状态" />

      <div className="page-toolbar">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="搜索用户名、昵称、邮箱..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 280 }}
        />
        <span className="page-toolbar-spacer" />
        {hasPermission('sys:user:add') && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新增用户
          </Button>
        )}
      </div>

      <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ borderRadius: 12 }}>
        <Table<SysUser>
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={isFetching}
          scroll={{ x: 960 }}
          pagination={{
            current: currentPage,
            pageSize: USERS_PAGE_SIZE,
            total,
            showSizeChanger: false,
            showTotal: (t) => `共 ${t} 条`,
            onChange: setCurrentPage,
          }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑用户' : '新增用户'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText="保存"
        cancelText="取消"
        destroyOnHidden
        width={480}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          {!editingId && (
            <>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="password" label="初始密码">
                <Input.Password placeholder="默认 admin123" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机">
            <Input />
          </Form.Item>
          <Form.Item name="deptId" label="所属部门">
            <TreeSelect
              allowClear
              treeData={deptTreeData}
              treeDefaultExpandAll
              placeholder="选择部门"
            />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </Form.Item>
          <Form.Item name="roleIds" label="角色">
            <RoleCheckboxGroup
              roles={roles}
              value={formRoleIds}
              onChange={(ids) => form.setFieldValue('roleIds', ids)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={roleTarget ? `分配角色 — ${roleTarget.nickname}` : '分配角色'}
        open={roleModalOpen}
        onCancel={() => {
          setRoleModalOpen(false);
          setRoleTargetId(null);
        }}
        onOk={handleAssignRoles}
        confirmLoading={assignRolesMutation.isPending}
        okText="保存"
        cancelText="取消"
        destroyOnHidden
      >
        <Typography.Paragraph type="secondary" className={styles.roleHint}>
          用户 <Typography.Text strong>{roleTarget?.username}</Typography.Text>{' '}
          可拥有多个角色，权限为各角色权限的并集。
        </Typography.Paragraph>
        <RoleCheckboxGroup roles={roles} value={roleIds} onChange={setRoleIds} />
      </Modal>
    </>
  );
}
