import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Spin,
  Tag,
  Tree,
  TreeSelect,
} from 'antd';
import type { DataNode } from 'antd/es/tree';
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import {
  useDeptDetailQuery,
  useDeptMutations,
  useDeptTreeQuery,
} from '@/hooks/queries/useDepartments';
import { PageHeader } from '@/components/common/PageHeader';
import { buildDeptMap, deptsToTreeData, deptsToTreeSelect } from '@/utils/dept-tree';
import type { SysDept } from '@/api/types';
import styles from './Departments.module.less';

/** 部门管理 — 树形展示与维护 */
export function Departments() {
  const { message, modal } = App.useApp();
  const { hasPermission } = useAuth();
  const { data: tree = [], isFetching } = useDeptTreeQuery();
  const { createMutation, updateMutation, deleteMutation } = useDeptMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [parentIdForCreate, setParentIdForCreate] = useState(0);
  const [form] = Form.useForm();

  const { data: editingDept } = useDeptDetailQuery(editingId, modalOpen && editingId != null);

  const deptMap = useMemo(() => buildDeptMap(tree), [tree]);
  const treeData = useMemo(() => deptsToTreeData(tree), [tree]);
  const parentTreeData = useMemo(() => deptsToTreeSelect(tree), [tree]);

  useEffect(() => {
    if (!editingDept || !modalOpen || !editingId) return;
    form.setFieldsValue({
      parentId: editingDept.parentId,
      deptName: editingDept.deptName,
      deptCode: editingDept.deptCode,
      leader: editingDept.leader ?? '',
      phone: editingDept.phone ?? '',
      sortOrder: editingDept.sortOrder ?? 0,
      status: editingDept.status,
    });
  }, [editingDept, modalOpen, editingId, form]);

  const openCreate = useCallback((parentId = 0) => {
    setEditingId(null);
    setParentIdForCreate(parentId);
    form.resetFields();
    form.setFieldsValue({ parentId, status: 1, sortOrder: 0 });
    setModalOpen(true);
  }, [form]);

  const openEdit = useCallback((id: number) => {
    setEditingId(id);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (record: SysDept) => {
      modal.confirm({
        title: `确认删除「${record.deptName}」？`,
        content: '删除后无法恢复',
        okType: 'danger',
        onOk: async () => {
          await deleteMutation.mutateAsync(record.id);
          message.success('已删除');
        },
      });
    },
    [deleteMutation, message, modal]
  );

  const titleRender = useCallback(
    (node: DataNode) => {
      const dept = deptMap.get(Number(node.key));
      if (!dept) return null;

      return (
        <div className={styles.row}>
          <span className={styles.name}>{dept.deptName}</span>
          <span className={styles.code}>{dept.deptCode}</span>
          {dept.leader && <span className={styles.meta}>负责人：{dept.leader}</span>}
          {dept.phone && <span className={styles.meta}>{dept.phone}</span>}
          <span className={styles.meta}>排序 {dept.sortOrder ?? 0}</span>
          <Tag color={dept.status === 1 ? 'success' : 'default'}>
            {dept.status === 1 ? '启用' : '停用'}
          </Tag>
          <Space
            size={4}
            wrap
            className={`${styles.actions} table-actions`}
            onClick={(e) => e.stopPropagation()}
          >
            {hasPermission('sys:dept:add') && (
              <Button type="link" size="small" onClick={() => openCreate(dept.id)}>
                新增子级
              </Button>
            )}
            {hasPermission('sys:dept:edit') && (
              <Button type="link" size="small" onClick={() => openEdit(dept.id)}>
                编辑
              </Button>
            )}
            {hasPermission('sys:dept:delete') && dept.id !== 1 && (
              <Button type="link" size="small" danger onClick={() => handleDelete(dept)}>
                删除
              </Button>
            )}
          </Space>
        </div>
      );
    },
    [deptMap, handleDelete, hasPermission, openCreate, openEdit]
  );

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: values });
      message.success('部门已更新');
    } else {
      await createMutation.mutateAsync(values);
      message.success('部门已创建');
    }
    setModalOpen(false);
  };

  return (
    <>
      <PageHeader
        title="部门管理"
        description="维护组织架构，支持多级部门与用户归属"
      />

      <div className="page-toolbar">
        <span className="page-toolbar-spacer" />
        {hasPermission('sys:dept:add') && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate(0)}>
            新增部门
          </Button>
        )}
      </div>

      <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ borderRadius: 12 }}>
        <Spin spinning={isFetching}>
          <div className={`dept-tree-panel ${styles.panel}`}>
            {treeData.length > 0 ? (
              <Tree
                blockNode
                defaultExpandAll
                treeData={treeData}
                titleRender={titleRender}
              />
            ) : (
              !isFetching && (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                  暂无部门数据
                </div>
              )
            )}
          </div>
        </Spin>
      </Card>

      <Modal
        title={editingId ? '编辑部门' : '新增部门'}
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
          <Form.Item
            name="parentId"
            label="上级部门"
            rules={[{ required: true, message: '请选择上级部门' }]}
            initialValue={parentIdForCreate}
          >
            <TreeSelect
              treeData={parentTreeData}
              treeDefaultExpandAll
              placeholder="选择上级部门"
              disabled={!!editingId && editingId === 1}
            />
          </Form.Item>
          <Form.Item
            name="deptName"
            label="部门名称"
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="deptCode"
            label="部门编码"
            rules={[{ required: true, message: '请输入部门编码' }]}
          >
            <Input disabled={!!editingId} placeholder="唯一标识，如 RD" />
          </Form.Item>
          <Form.Item name="leader" label="负责人">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="联系电话">
            <Input />
          </Form.Item>
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
    </>
  );
}
