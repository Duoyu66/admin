import { useState, type ReactNode } from 'react';
import { App, Button, Card, Typography } from 'antd';
import { CopyOutlined, CodeOutlined } from '@ant-design/icons';
import { DemoCodeBlock } from './DemoCodeBlock';
import styles from './DemoExampleCard.module.less';

export interface DemoExampleCardProps {
  title: string;
  description?: string;
  code: string;
  extra?: ReactNode;
  children: ReactNode;
}

/** 演示卡片：示例区 + 可展开的使用代码 */
export function DemoExampleCard({
  title,
  description,
  code,
  extra,
  children,
}: DemoExampleCardProps) {
  const { message } = App.useApp();
  const [showCode, setShowCode] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      message.success('已复制代码');
    } catch {
      message.error('复制失败');
    }
  };

  return (
    <Card
      className={styles.card}
      bordered={false}
      title={
        <div className={styles.head}>
          <div>
            <Typography.Title level={5} className={styles.title}>
              {title}
            </Typography.Title>
            {description && (
              <Typography.Text type="secondary" className={styles.desc}>
                {description}
              </Typography.Text>
            )}
          </div>
          {extra && <div className={styles.extra}>{extra}</div>}
        </div>
      }
    >
      <div className={styles.demo}>{children}</div>
      <Button
        type="link"
        size="small"
        className={styles.codeToggle}
        icon={<CodeOutlined />}
        onClick={() => setShowCode((v) => !v)}
      >
        {showCode ? '收起代码' : '查看代码'}
      </Button>
      {showCode && (
        <>
          <DemoCodeBlock code={code} />
          <div className={styles.codeActions}>
            <Button type="text" size="small" icon={<CopyOutlined />} onClick={copyCode}>
              复制
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
