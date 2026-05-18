/** 消息提示演示 — 各示例对应的使用代码（React Hooks + TypeScript） */

export const CODE_MESSAGE = `import { useCallback } from 'react';
import { App, Button, Space } from 'antd';

export function MessageDemo() {
  const { message } = App.useApp();

  const showLoading = useCallback(() => {
    const hide = message.loading('正在提交…', 0);
    window.setTimeout(hide, 1500);
  }, [message]);

  return (
    <Space wrap>
      <Button onClick={() => message.success('操作成功')}>成功</Button>
      <Button onClick={() => message.error('操作失败，请重试')}>失败</Button>
      <Button onClick={() => message.warning('请先完善必填项')}>警告</Button>
      <Button onClick={() => message.info('数据已同步至云端')}>信息</Button>
      <Button onClick={showLoading}>加载中</Button>
    </Space>
  );
}

// 根组件需包裹 <App>，或在布局里使用 App.useApp()`;

export const CODE_ALERT = `import { App, Alert, Button, Space } from 'antd';

export function AlertDemo() {
  const { message } = App.useApp();

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Alert message="成功提示" type="success" showIcon />
      <Alert
        message="警告提示"
        description="请检查表单后再次提交。"
        type="warning"
        showIcon
      />
      <Alert
        message="可关闭提示"
        type="info"
        showIcon
        closable
      />
      <Alert
        message="带操作按钮"
        type="error"
        showIcon
        action={
          <Button size="small" danger onClick={() => message.success('已处理')}>
            立即处理
          </Button>
        }
      />
    </Space>
  );
}`;

export const CODE_NOTIFICATION = `import { App, Button, Space } from 'antd';

export function NotificationDemo() {
  const { notification } = App.useApp();

  return (
    <Space wrap>
      <Button
        onClick={() =>
          notification.success({
            message: '保存成功',
            description: '您的修改已生效。',
            placement: 'topRight',
          })
        }
      >
        成功通知
      </Button>
      <Button
        onClick={() =>
          notification.info({
            message: '系统公告',
            description: '今晚 22:00–23:00 进行例行维护。',
            placement: 'topRight',
            duration: 0,
          })
        }
      >
        常驻通知
      </Button>
    </Space>
  );
}`;

export const CODE_MODAL_CONFIRM = `import { App, Button } from 'antd';

export function ConfirmDemo() {
  const { message, modal } = App.useApp();

  const handleDelete = () => {
    modal.confirm({
      title: '确认删除',
      content: '删除后数据不可恢复，是否继续？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => message.success('已删除'),
    });
  };

  return <Button type="primary" onClick={handleDelete}>确认对话框</Button>;
}`;

export const CODE_NOTIFICATION_ACTION = `import { useCallback, useRef } from 'react';
import { App, Button, Space } from 'antd';

export function NotificationActionDemo() {
  const { message, notification } = App.useApp();
  const keyRef = useRef<string>('');

  const openTaskNotice = useCallback(() => {
    const key = \`notice-\${Date.now()}\`;
    keyRef.current = key;

    notification.open({
      key,
      message: '待审批任务',
      description: '您有 3 条审批待处理，请及时查看。',
      placement: 'topRight',
      duration: 0,
      btn: (
        <Space>
          <Button
            size="small"
            onClick={() => {
              notification.destroy(key);
              message.info('已忽略');
            }}
          >
            忽略
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              notification.destroy(key);
              message.success('已跳转至审批列表');
            }}
          >
            去处理
          </Button>
        </Space>
      ),
    });
  }, [message, notification]);

  return <Button type="primary" onClick={openTaskNotice}>通知 + 操作按钮</Button>;
}`;
