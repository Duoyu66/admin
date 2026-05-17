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
  Tree,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import {
  usePermissionTreeQuery,
  useRoleDetailQuery,
  useRoleMutations,
  useRolesQuery,
  ROLES_PAGE_SIZE,
} from '@/hooks/queries/useRoles';
import { PageHeader } from '@/components/common/PageHeader';
import { permissionsToTreeData } from '@/utils/perm-tree';
import type { SysRole } from '@/api/types';

/** 角色管理 */
export function Roles() {
  const { message, modal } = App.useApp();
  const { hasPermission } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [permRoleId, setPermRoleId] = useState<number | null>(null);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [form] = Form.useForm();

  const { data, isFetching } = useRolesQuery(currentPage, keyword);
  const { data: editingRole } = useRoleDetailQuery(editingId, modalOpen && editingId != null);
  const { data: permRole } = useRoleDetailQuery(permRoleId, permModalOpen && permRoleId != null);
  const { data: permTree = [] } = usePermissionTreeQuery(permModalOpen);

  const {
    createMutation,
    updateMutation,
    deleteMutation,
    assignPermissionsMutation,
  } = useRoleMutations();

  const list = data?.records ?? [];
  const total = data?.total ?? 0;

  useEffect(() => {
    if (!editingRole || !modalOpen) return;
    form.setFieldsValue({
      roleCode: editingRole.roleCode,
      roleName: editingRole.roleName,
      description: editingRole.description ?? '',
      status: editingRole.status,
    });
  }, [editingRole, modalOpen, form]);

  useEffect(() => {
    if (permRole) setCheckedIds(permRole.permissionIds ?? []);
  }, [permRole]);

  const openPermModal = (roleId: number) => {
    setPermRoleId(roleId);
    setPermModalOpen(true);
  };

  const savePerms = async () => {
    if (!permRoleId) return;
    await assignPermissionsMutation.mutateAsync({
      id: permRoleId,
      permissionIds: checkedIds,
    });
    message.success('权限已保存');
    setPermModalOpen(false);
  };

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ status: 1 });
    setModalOpen(true);
  };

  const openEdit = (id: number) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: values });
      message.success('角色已更新');
    } else {
      await createMutation.mutateAsync(values);
      message.success('角色已创建');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    modal.confirm({
      title: '确认删除该角色？',
      okType: 'danger',
      onOk: async () => {
        await deleteMutation.mutateAsync(id);
        message.success('已删除');
      },
    });
  };

  const columns: ColumnsType<SysRole> = [
    { title: '角色编码', dataIndex: 'roleCode', width: 120 },
    { title: '角色名称', dataIndex: 'roleName', width: 140 },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 240,
      fixed: 'right',
      render: (_, r) => (
        <Space size={4} wrap className="table-actions">
          {hasPermission('sys:role:perm') && (
            <Button type="link" size="small" onClick={() => openPermModal(r.id)}>
              分配权限
            </Button>
          )}
          {hasPermission('sys:role:edit') && (
            <Button type="link" size="small" onClick={() => openEdit(r.id)}>
              编辑
            </Button>
          )}
          {hasPermission('sys:role:delete') && r.id > 3 && (
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
      <PageHeader title="角色管理" description="配置角色并分配菜单与接口权限" />

      <div className="page-toolbar">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="搜索角色..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 240 }}
        />
        <span className="page-toolbar-spacer" />
        {hasPermission('sys:role:add') && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新增角色
          </Button>
        )}
      </div>

      <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ borderRadius: 12 }}>
        <Table<SysRole>
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={isFetching}
          scroll={{ x: 800 }}
          pagination={{
            current: currentPage,
            pageSize: ROLES_PAGE_SIZE,
            total,
            showSizeChanger: false,
            showTotal: (t) => `共 ${t} 条`,
            onChange: setCurrentPage,
          }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑角色' : '新增角色'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText="保存"
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            name="roleCode"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input disabled={!!editingId} />
          </Form.Item>
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="分配权限"
        open={permModalOpen}
        onCancel={() => setPermModalOpen(false)}
        onOk={savePerms}
        confirmLoading={assignPermissionsMutation.isPending}
        okText="保存"
        cancelText="取消"
        width={560}
        destroyOnHidden
      >
        <div className="perm-tree-panel">
          <Tree
            checkable
            defaultExpandAll
            checkedKeys={checkedIds}
            onCheck={(keys) => {
              const next = Array.isArray(keys) ? keys : keys.checked;
              setCheckedIds(next.map(Number));
            }}
            treeData={permissionsToTreeData(permTree)}
          />
        </div>
      </Modal>
    </>
  );
}
