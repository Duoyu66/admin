import { App, Button, Card, Form, Input } from 'antd';
import { PageHeader } from '@/components/common/PageHeader';

/** 系统设置页面 */
export function Settings() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    siteName: string;
    siteDesc: string;
    adminEmail: string;
  }) => {
    void values;
    message.success('设置已保存');
  };

  return (
    <>
      <PageHeader title="系统设置" description="站点基础信息与偏好配置" />

      <Card title="基本设置" bordered={false} style={{ borderRadius: 12 }}>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 480 }}
          initialValues={{
            siteName: 'Admin 后台',
            siteDesc: '企业级后台管理系统',
            adminEmail: 'admin@claude.local',
          }}
          onFinish={handleSubmit}
        >
          <Form.Item name="siteName" label="站点名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="siteDesc" label="站点描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="adminEmail" label="管理员邮箱" rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
