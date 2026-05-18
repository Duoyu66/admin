import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { App, Button, Card, Form, Input, Select, Space, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { useNoticeDetailQuery, useNoticeMutations } from '@/hooks/queries/useNotices';
import { RichTextEditor } from '@/components/RichTextEditor';
import { PageHeader } from '@/components/common/PageHeader';
import { isRichTextEmpty } from '@/utils/html';
import styles from './NoticeForm.module.less';

const TYPE_OPTIONS = [
  { label: '通知', value: 1 },
  { label: '公告', value: 2 },
];

const STATUS_OPTIONS = [
  { label: '草稿', value: 0 },
  { label: '立即发布', value: 1 },
];

/** 新增 / 编辑公告（独立页面） */
export function NoticeForm() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = useAuth();
  const [form] = Form.useForm();

  const isEdit = Boolean(id);
  const noticeId = id ? Number(id) : null;
  const canAccess = isEdit ? hasPermission('sys:notice:edit') : hasPermission('sys:notice:add');

  const { data: notice, isLoading } = useNoticeDetailQuery(noticeId, isEdit);
  const { createMutation, updateMutation } = useNoticeMutations();

  useEffect(() => {
    if (!isEdit) {
      form.setFieldsValue({ noticeType: 2, status: 0, content: '' });
      return;
    }
    if (!notice) return;
    form.setFieldsValue({
      title: notice.title,
      content: notice.content,
      noticeType: notice.noticeType,
      status: notice.status,
    });
  }, [isEdit, notice, form]);

  if (!canAccess) {
    return <Navigate to="/notices" replace />;
  }

  if (isEdit && (Number.isNaN(noticeId) || noticeId == null)) {
    return <Navigate to="/notices" replace />;
  }

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (isEdit && noticeId != null) {
      await updateMutation.mutateAsync({ id: noticeId, data: values });
      message.success('公告已更新');
    } else {
      await createMutation.mutateAsync(values);
      message.success('公告已创建');
    }
    navigate('/notices');
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className={styles.page}>
      <PageHeader
        title={isEdit ? '编辑公告' : '新增公告'}
        description={
          isEdit
            ? '修改公告内容，保存后按状态展示在消息中心'
            : '撰写公告内容，可选择保存草稿或立即发布'
        }
      />

      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        className={styles.back}
        onClick={() => navigate('/notices')}
      >
        返回列表
      </Button>

      <Spin spinning={isEdit && isLoading}>
        <Card variant="borderless" className={styles.card}>
          <Form form={form} layout="vertical" className={styles.form}>
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="请输入公告标题" maxLength={128} showCount />
            </Form.Item>

            <Form.Item
              name="content"
              label="内容"
              rules={[
                {
                  validator: (_, value) =>
                    isRichTextEmpty(value)
                      ? Promise.reject(new Error('请输入内容'))
                      : Promise.resolve(),
                },
              ]}
            >
              <RichTextEditor />
            </Form.Item>

            <div className={styles.metaRow}>
              <Form.Item
                name="noticeType"
                label="类型"
                rules={[{ required: true, message: '请选择类型' }]}
                className={styles.metaItem}
              >
                <Select options={TYPE_OPTIONS} />
              </Form.Item>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
                className={styles.metaItem}
              >
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </div>

            <Form.Item className={styles.actions}>
              <Space>
                <Button onClick={() => navigate('/notices')}>取消</Button>
                <Button type="primary" loading={saving} onClick={handleSubmit}>
                  保存
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}
