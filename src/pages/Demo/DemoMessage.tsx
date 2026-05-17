import { App, Alert, Button, Card, Space } from 'antd';
import { PageHeader } from '@/components/common/PageHeader';
import styles from './demo-shared.module.less';

/** 消息提示演示 — 文字提示与可操作弹窗 */
export function DemoMessage() {
  const { message, modal, notification } = App.useApp();

  const showLoading = () => {
    const hide = message.loading('正在提交…', 0);
    setTimeout(hide, 1500);
  };

  return (
    <>
      <PageHeader
        title="消息提示"
        description="Message、Alert 轻量文字提示；Modal、Notification 带确认/操作的可交互弹窗"
      />

      <Card title="轻提示 Message" className={styles.section} bordered={false}>
        <Space wrap className={styles.gap}>
          <Button onClick={() => message.success('操作成功')}>成功</Button>
          <Button onClick={() => message.error('操作失败，请重试')}>失败</Button>
          <Button onClick={() => message.warning('请先完善必填项')}>警告</Button>
          <Button onClick={() => message.info('数据已同步至云端')}>信息</Button>
          <Button onClick={showLoading}>加载中</Button>
        </Space>
      </Card>

      <Card title="页面内提示 Alert" className={styles.section} bordered={false}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert message="成功提示" type="success" showIcon />
          <Alert message="警告提示" description="请检查表单后再次提交。" type="warning" showIcon />
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
      </Card>

      <Card title="通知 Notification（纯文字）" className={styles.section} bordered={false}>
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
      </Card>

      <Card title="可操作弹窗" className={styles.section} bordered={false}>
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
          <Button
            onClick={() => {
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
            }}
          >
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
        </Space>
      </Card>
    </>
  );
}
