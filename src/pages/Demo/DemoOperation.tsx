import { App, Button, Card, Dropdown, Popconfirm, Space, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/common/PageHeader';
import styles from './demo-shared.module.less';

/** 操作类组件演示 */
export function DemoOperation() {
  const { message } = App.useApp();

  const menuItems: MenuProps['items'] = [
    { key: '1', label: '导出 Excel' },
    { key: '2', label: '导出 PDF' },
    { type: 'divider' },
    { key: '3', label: '打印', danger: true },
  ];

  return (
    <>
      <PageHeader title="操作" description="Button、Dropdown、Popconfirm、Tooltip" />

      <Card title="按钮 Button" className={styles.section} bordered={false}>
        <Space wrap className={styles.gap}>
          <Button type="primary" icon={<PlusOutlined />}>
            主要按钮
          </Button>
          <Button>默认按钮</Button>
          <Button type="dashed">虚线按钮</Button>
          <Button type="link">链接按钮</Button>
          <Button danger icon={<DeleteOutlined />}>
            危险
          </Button>
          <Button loading>加载中</Button>
          <Button disabled>禁用</Button>
        </Space>
      </Card>

      <Card title="下拉菜单 Dropdown" className={styles.section} bordered={false}>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Button icon={<MoreOutlined />}>更多操作</Button>
        </Dropdown>
      </Card>

      <Card title="气泡确认 Popconfirm" className={styles.section} bordered={false}>
        <Popconfirm
          title="确定删除该记录？"
          description="删除后不可恢复"
          onConfirm={() => message.success('已删除')}
        >
          <Button danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      </Card>

      <Card title="文字提示 Tooltip" className={styles.section} bordered={false}>
        <Space>
          <Tooltip title="编辑当前行">
            <Button icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="下载附件">
            <Button icon={<DownloadOutlined />} />
          </Tooltip>
        </Space>
      </Card>
    </>
  );
}
