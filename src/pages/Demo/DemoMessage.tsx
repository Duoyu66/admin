import { useCallback, useRef } from 'react';
import { App, Alert, Button, Input, Space } from 'antd';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoExampleCard } from '@/components/Demo/DemoExampleCard';
import { DemoMasonry, DemoMasonryItem } from '@/components/Demo/DemoMasonry';
import {
  CODE_ALERT,
  CODE_MESSAGE,
  CODE_MODAL_CONFIRM,
  CODE_NOTIFICATION,
  CODE_NOTIFICATION_ACTION,
} from './demoMessageCodes';
import styles from './demo-shared.module.less';

/** 消息提示演示 — 轻提示 / Alert / Notification / 可操作弹窗 + 使用代码 */
export function DemoMessage() {
  const { message, modal, notification } = App.useApp();

  const showLoading = useCallback(() => {
    const hide = message.loading('正在提交…', 0);
    window.setTimeout(hide, 1500);
  }, [message]);

  const openTaskNotice = useCallback(() => {
    const key = `notice-${Date.now()}`;
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

  const promptRef = useRef('');

  return (
    <>
      <PageHeader
        title="消息提示"
        description="Message、Alert、Notification、Modal 常用场景；每个示例可展开查看 React Hooks + TypeScript 代码"
      />

      <DemoMasonry>
        <DemoMasonryItem>
          <DemoExampleCard
            title="轻提示 Message"
            description="顶部轻量反馈，适合操作结果"
            code={CODE_MESSAGE}
          >
            <Space wrap className={styles.gap}>
              <Button onClick={() => message.success('操作成功')}>成功</Button>
              <Button onClick={() => message.error('操作失败，请重试')}>失败</Button>
              <Button onClick={() => message.warning('请先完善必填项')}>警告</Button>
              <Button onClick={() => message.info('数据已同步至云端')}>信息</Button>
              <Button onClick={showLoading}>加载中</Button>
            </Space>
          </DemoExampleCard>
        </DemoMasonryItem>

        <DemoMasonryItem>
          <DemoExampleCard
            title="页面内提示 Alert"
            description="嵌入页面内容区的静态提示"
            code={CODE_ALERT}
          >
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
                description="点击右侧关闭按钮可手动关闭。"
                type="info"
                showIcon
                closable
              />
              <Alert
                message="带操作按钮"
                description="适合页面内需要用户立即处理的场景。"
                type="error"
                showIcon
                action={
                  <Button size="small" danger onClick={() => message.success('已处理')}>
                    立即处理
                  </Button>
                }
              />
            </Space>
          </DemoExampleCard>
        </DemoMasonryItem>

        <DemoMasonryItem>
          <DemoExampleCard
            title="通知 Notification"
            description="右上角卡片式通知，可设置常驻"
            code={CODE_NOTIFICATION}
          >
            <Space wrap className={styles.gap}>
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
                  notification.warning({
                    message: '磁盘空间不足',
                    description: '剩余空间低于 10%，请及时清理。',
                    placement: 'topRight',
                  })
                }
              >
                警告通知
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
          </DemoExampleCard>
        </DemoMasonryItem>

        <DemoMasonryItem>
          <DemoExampleCard
            title="确认对话框"
            description="modal.confirm 二次确认"
            code={CODE_MODAL_CONFIRM}
          >
            <Space wrap className={styles.gap}>
              <Button
                type="primary"
                onClick={() =>
                  modal.confirm({
                    title: '确认删除',
                    content: '删除后数据不可恢复，是否继续？',
                    okText: '删除',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: () => message.success('已删除'),
                  })
                }
              >
                确认对话框
              </Button>
              <Button
                onClick={() =>
                  modal.warning({
                    title: '权限不足',
                    content: '当前账号无权执行此操作，请联系管理员。',
                    okText: '知道了',
                  })
                }
              >
                警告对话框
              </Button>
            </Space>
          </DemoExampleCard>
        </DemoMasonryItem>

        <DemoMasonryItem>
          <DemoExampleCard
            title="通知 + 操作按钮"
            description="notification.open 自定义 btn / actions"
            code={CODE_NOTIFICATION_ACTION}
          >
            <Space wrap className={styles.gap}>
              <Button type="primary" onClick={openTaskNotice}>
                通知 + 操作按钮
              </Button>
              <Button
                onClick={() =>
                  notification.open({
                    message: '版本更新',
                    description: '检测到新版本 v2.1.0，是否立即更新？',
                    placement: 'topRight',
                    actions: [
                      <Button key="later" size="small" onClick={() => notification.destroy()}>
                        稍后
                      </Button>,
                      <Button
                        key="update"
                        type="primary"
                        size="small"
                        onClick={() => {
                          notification.destroy();
                          message.loading('正在更新…', 1.2);
                        }}
                      >
                        立即更新
                      </Button>,
                    ],
                  })
                }
              >
                通知 + actions
              </Button>
              <Button
                onClick={() => {
                  promptRef.current = '';
                  modal.confirm({
                    title: '请输入备注',
                    content: (
                      <Input
                        placeholder="请输入"
                        onChange={(e) => {
                          promptRef.current = e.target.value;
                        }}
                      />
                    ),
                    onOk: () => {
                      if (!promptRef.current.trim()) {
                        message.warning('请输入内容');
                        return Promise.reject();
                      }
                      message.success(`已提交：${promptRef.current}`);
                    },
                  });
                }}
              >
                输入确认
              </Button>
            </Space>
          </DemoExampleCard>
        </DemoMasonryItem>
      </DemoMasonry>
    </>
  );
}
