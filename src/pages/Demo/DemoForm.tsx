import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Switch,
} from 'antd';
import { PageHeader } from '@/components/common/PageHeader';
import styles from './demo-shared.module.less';

/** 表单组件演示 */
export function DemoForm() {
  const [form] = Form.useForm();

  return (
    <>
      <PageHeader title="表单" description="Ant Design Form、Input、Select 等常用表单控件" />

      <Card title="基础表单" className={styles.section} bordered={false}>
        <Form form={form} layout="vertical" initialValues={{ status: 1, notify: true }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="type" label="类型">
                <Select
                  placeholder="请选择"
                  options={[
                    { label: '通知', value: 1 },
                    { label: '公告', value: 2 },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="amount" label="数量">
                <InputNumber min={0} max={9999} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="date" label="日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <Input.TextArea rows={3} placeholder="多行文本" showCount maxLength={200} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="status" label="状态">
                <Radio.Group>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>停用</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="notify" label="选项" valuePropName="checked">
                <Checkbox>接收邮件通知</Checkbox>
              </Form.Item>
              <Form.Item label="开关" valuePropName="checked" name="enabled">
                <Switch checkedChildren="开" unCheckedChildren="关" />
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.gap}>
            <Button type="primary">提交</Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </div>
        </Form>
      </Card>

      <Card title="水平布局" className={styles.section} bordered={false}>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="用户名">
            <Input placeholder="horizontal" />
          </Form.Item>
          <Form.Item label="密码">
            <Input.Password />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
