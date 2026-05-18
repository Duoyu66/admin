import { useEffect, useMemo, useState } from 'react';
import {
  App,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  TreeSelect,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { IconPicker } from '@/components/IconPicker';
import { MenuIcon } from '@/components/MenuIcon';
import { PageHeader } from '@/components/common/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import {
  usePermissionDetailQuery,
  usePermissionsPage,
} from '@/hooks/queries/usePermissions';
import { resolveMenuIconName, type MenuIconKey } from '@/constants/menu-icons';
import { permsToParentTreeSelect } from '@/utils/perm-form-tree';
import { stripEmptyChildren, treeTableExpandable } from '@/utils/tree-data';
import type { SysPermission } from '@/api/types';
import styles from './Permissions.module.less';

const PERM_TYPE_OPTIONS = [
  { label: '目录', value: 0 },
  { label: '菜单', value: 1 },
  { label: '按钮', value: 2 },
];

const PERM_TYPE_LABELS = ['目录', '菜单', '按钮'];

/** 权限 / 菜单管理 */
export function Permissions() {
  const { message, modal } = App.useApp();
  const { hasPermission } = useAuth();
  const { treeQuery, createMutation, updateMutation, deleteMutation, updateIconMutation } =
    usePermissionsPage();

  const [formOpen, setFormOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [iconTarget, setIconTarget] = useState<SysPermission | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<MenuIconKey>('layout-dashboard');
  const [defaultParentId, setDefaultParentId] = useState(0);
  const [form] = Form.useForm();
  const permType = Form.useWatch('permType', form);

  const tree = treeQuery.data ?? [];
  const tableData = useMemo(() => stripEmptyChildren(tree), [tree]);
  const parentTreeData = useMemo(
    () => permsToParentTreeSelect(tree, editingId ?? undefined),
    [tree, editingId]
  );

  const { data: editingPerm } = usePermissionDetailQuery(
    editingId,
    formOpen && editingId != null
  );

  useEffect(() => {
    if (!editingPerm || !formOpen || !editingId) return;
    form.setFieldsValue({
      parentId: editingPerm.parentId,
      permCode: editingPerm.permCode,
      permName: editingPerm.permName,
      permType: editingPerm.permType,
      path: editingPerm.path ?? '',
      icon: resolveMenuIconName(editingPerm.icon),
      sortOrder: editingPerm.sortOrder ?? 0,
      status: editingPerm.status ?? 1,
    });
  }, [editingPerm, formOpen, editingId, form]);

  const openCreate = (parentId = 0, type = 1) => {
    setEditingId(null);
    setDefaultParentId(parentId);
    form.resetFields();
    form.setFieldsValue({
      parentId,
      permType: type,
      status: 1,
      sortOrder: 0,
      icon: 'layout-dashboard',
    });
    setFormOpen(true);
  };

  const openEdit = (record: SysPermission) => {
    setEditingId(record.id);
    setFormOpen(true);
  };

  const openIcon = (record: SysPermission) => {
    setIconTarget(record);
    setSelectedIcon(resolveMenuIconName(record.icon) as MenuIconKey);
    setIconOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      path: values.permType === 1 ? values.path : undefined,
      icon: values.permType !== 2 ? values.icon : undefined,
    };
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
      message.success('已更新');
    } else {
      await createMutation.mutateAsync(payload);
      message.success('已创建');
    }
    setFormOpen(false);
  };

  const handleDelete = (record: SysPermission) => {
    modal.confirm({
      title: `确认删除「${record.permName}」？`,
      content: '若有子节点或已被角色引用将无法删除',
      okType: 'danger',
      onOk: async () => {
        await deleteMutation.mutateAsync(record.id);
        message.success('已删除');
      },
    });
  };

  const handleSaveIcon = async () => {
    if (!iconTarget) return;
    await updateIconMutation.mutateAsync({ id: iconTarget.id, icon: selectedIcon });
    message.success('图标已更新');
    setIconOpen(false);
  };

  const columns: ColumnsType<SysPermission> = [
    {
      title: '名称',
      dataIndex: 'permName',
      width: 180,
      render: (name, record) => (
        <Space size={8}>
          {(record.permType === 0 || record.permType === 1) && (
            <MenuIcon name={record.icon} size={16} />
          )}
          <span>{name}</span>
        </Space>
      ),
    },
    { title: '权限标识', dataIndex: 'permCode', width: 160 },
    {
      title: '类型',
      dataIndex: 'permType',
      width: 80,
      render: (t: number) => <Tag>{PERM_TYPE_LABELS[t] ?? t}</Tag>,
    },
    { title: '路由', dataIndex: 'path', ellipsis: true },
    { title: '排序', dataIndex: 'sortOrder', width: 70 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (s: number) => (
        <Tag color={s === 1 ? 'success' : 'default'}>{s === 1 ? '启用' : '停用'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 280,
      render: (_, record) => (
        <Space size={4} wrap className="table-actions">
          {hasPermission('sys:perm:add') && record.permType !== 2 && (
            <Button
              type="link"
              size="small"
              onClick={() => openCreate(record.id, record.permType === 0 ? 1 : 2)}
            >
              {record.permType === 0 ? '加菜单' : '加按钮'}
            </Button>
          )}
          {hasPermission('sys:perm:edit') && (
            <>
              {(record.permType === 0 || record.permType === 1) && (
                <Button type="link" size="small" onClick={() => openIcon(record)}>
                  图标
                </Button>
              )}
              <Button type="link" size="small" onClick={() => openEdit(record)}>
                编辑
              </Button>
            </>
          )}
          {hasPermission('sys:perm:delete') && (
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
      <PageHeader
        title="权限配置"
        description="维护目录、菜单与按钮权限，侧栏与接口鉴权将同步生效"
      />

      <div className="page-toolbar">
        <span className="page-toolbar-spacer" />
        {hasPermission('sys:perm:add') && (
          <Space>
            <Button onClick={() => openCreate(0, 0)}>新增目录</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate(0, 1)}>
              新增菜单
            </Button>
          </Space>
        )}
      </div>

      <Card variant="borderless" styles={{ body: { padding: 0 } }} style={{ borderRadius: 12 }}>
        <Table<SysPermission>
          rowKey="id"
          className={styles.table}
          columns={columns}
          dataSource={tableData}
          loading={treeQuery.isFetching}
          pagination={false}
          defaultExpandAllRows
          expandable={treeTableExpandable}
        />
      </Card>

      <Modal
        title={editingId ? '编辑权限' : '新增权限'}
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText="保存"
        cancelText="取消"
        destroyOnHidden
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            name="parentId"
            label="上级节点"
            rules={[{ required: true, message: '请选择上级节点' }]}
            initialValue={defaultParentId}
          >
            <TreeSelect treeData={parentTreeData} treeDefaultExpandAll />
          </Form.Item>
          <Form.Item
            name="permType"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select options={PERM_TYPE_OPTIONS} disabled={!!editingId} />
          </Form.Item>
          <Form.Item
            name="permName"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="permCode"
            label="权限标识"
            rules={[{ required: true, message: '请输入权限标识' }]}
          >
            <Input disabled={!!editingId} placeholder="如 sys:user:list" />
          </Form.Item>
          {permType === 1 && (
            <Form.Item
              name="path"
              label="路由路径"
              rules={[{ required: true, message: '菜单必须填写路由' }]}
            >
              <Input placeholder="/users" />
            </Form.Item>
          )}
          {permType !== 2 && (
            <Form.Item name="icon" label="图标">
              <IconPicker
                value={(form.getFieldValue('icon') as MenuIconKey) || 'layout-dashboard'}
                onChange={(v) => form.setFieldValue('icon', v)}
              />
            </Form.Item>
          )}
          <Form.Item name="sortOrder" label="排序">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              options={[
                { label: '启用', value: 1 },
                { label: '停用', value: 0 },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={iconTarget ? `选择图标 — ${iconTarget.permName}` : ''}
        open={iconOpen}
        onCancel={() => setIconOpen(false)}
        onOk={handleSaveIcon}
        confirmLoading={updateIconMutation.isPending}
        okText="保存"
        cancelText="取消"
        width={520}
        destroyOnHidden
      >
        <IconPicker value={selectedIcon} onChange={setSelectedIcon} />
      </Modal>
    </>
  );
}
