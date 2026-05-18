import { useEffect } from 'react';
import { App, Button, Card, Form, Input, Typography } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { useProfileMutations } from '@/hooks/queries/useProfile';
import { PageHeader } from '@/components/common/PageHeader';

/** 个人中心 */
export function Profile() {
  const { message } = App.useApp();
  const { user, refresh } = useAuth();
  const { updateProfileMutation, updatePasswordMutation } = useProfileMutations();
  const [profileForm] = Form.useForm();
  const [pwdForm] = Form.useForm();

  useEffect(() => {
    profileForm.setFieldsValue({
      username: user?.username,
      nickname: user?.nickname ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    });
  }, [user, profileForm]);

  const saveProfile = async (values: {
    nickname: string;
    email: string;
    phone: string;
  }) => {
    await updateProfileMutation.mutateAsync(values);
    await refresh();
    message.success('资料已保存');
  };

  const savePassword = async (values: {
    oldPassword: string;
    newPassword: string;
    confirm: string;
  }) => {
    if (values.newPassword !== values.confirm) {
      message.error('两次密码不一致');
      return;
    }
    await updatePasswordMutation.mutateAsync({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
    pwdForm.resetFields();
    message.success('密码已修改');
  };

  return (
    <>
      <PageHeader title="个人中心" description="修改个人资料与登录密码" />

      <Card title="基本信息" style={{ marginBottom: 20, borderRadius: 12 }} variant="borderless">
        <Form
          form={profileForm}
          layout="vertical"
          style={{ maxWidth: 400 }}
          onFinish={saveProfile}
        >
          <Form.Item name="username" label="用户名">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '邮箱格式不正确' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updateProfileMutation.isPending}>
              保存资料
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="修改密码" variant="borderless" style={{ borderRadius: 12 }}>
        <Form
          form={pwdForm}
          layout="vertical"
          style={{ maxWidth: 400 }}
          onFinish={savePassword}
        >
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, val) {
                  if (!val || getFieldValue('newPassword') === val) return Promise.resolve();
                  return Promise.reject(new Error('两次密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updatePasswordMutation.isPending}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          修改成功后请使用新密码重新登录。
        </Typography.Text>
      </Card>
    </>
  );
}
