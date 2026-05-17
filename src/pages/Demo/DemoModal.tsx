import { useState } from 'react';
import { App, Button, Card, Drawer, Form, Input, Modal, Space } from 'antd';
import { PageHeader } from '@/components/common/PageHeader';
import styles from './demo-shared.module.less';

/** 弹框组件演示 */
export function DemoModal() {
  const { message, modal } = App.useApp();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <PageHeader title="弹框" description="Modal、Drawer 等容器类弹层" />

      <Card title="对话框 Modal" className={styles.section} bordered={false}>
        <Space wrap className={styles.gap}>
          <Button type="primary" onClick={() => setOpen(true)}>
            打开 Modal
          </Button>
          <Button
            onClick={() =>
              modal.confirm({
                title: '确认操作',
                content: '确定要执行此操作吗？',
                onOk: () => message.success('已确认'),
              })
            }
          >
            Confirm
          </Button>
          <Button
            danger
            onClick={() =>
              modal.error({ title: '错误', content: '操作失败示例' })
            }
          >
            Error
          </Button>
        </Space>
        <Modal
          title="编辑信息"
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => {
            message.success('保存成功');
            setOpen(false);
          }}
          destroyOnHidden
        >
          <Form layout="vertical">
            <Form.Item label="标题" required>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="说明">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>

      <Card title="抽屉 Drawer" className={styles.section} bordered={false}>
        <Button onClick={() => setDrawerOpen(true)}>打开 Drawer</Button>
        <Drawer
          title="详情"
          width={420}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <p>抽屉适合展示详情、筛选或分步表单。</p>
        </Drawer>
      </Card>
    </>
  );
}
