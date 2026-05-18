import { useMemo, useState } from 'react';
import { Button, Card, Result, Segmented, Space } from 'antd';
import { DisconnectOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import img404 from '@/img/404.png';
import styles from './demo-shared.module.less';
import exceptionStyles from './DemoException.module.less';

type ExceptionKey = '403' | '404' | '500' | 'offline';

const OPTIONS: { label: string; value: ExceptionKey }[] = [
  { label: '403', value: '403' },
  { label: '404', value: '404' },
  { label: '500', value: '500' },
  { label: '离线页面', value: 'offline' },
];

/** 缺省页演示 — Ant Design Result 异常页 */
export function DemoException() {
  const navigate = useNavigate();
  const [active, setActive] = useState<ExceptionKey>('403');

  const content = useMemo(() => {
    const extra = (
      <Space>
        <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate('/')}>
          返回首页
        </Button>
        <Button onClick={() => window.history.back()}>返回上一页</Button>
      </Space>
    );

    if (active === 'offline') {
      return (
        <Result
          icon={<DisconnectOutlined className={exceptionStyles.offlineIcon} />}
          title="网络连接失败"
          subTitle="请检查网络后重试，或稍后再访问本页面。"
          extra={extra}
        />
      );
    }

    if (active === '404') {
      return (
        <Result
          icon={<img src={img404} alt="" className={exceptionStyles.notFoundImg} />}
          title="404"
          subTitle="抱歉，您访问的页面不存在。"
          extra={extra}
        />
      );
    }

    return (
      <Result
        status={active}
        title={active}
        subTitle={
          active === '403' ? '抱歉，您无权访问此页面。' : '抱歉，服务器出错了。'
        }
        extra={extra}
      />
    );
  }, [active, navigate]);

  return (
    <>
      <PageHeader
        title="缺省页"
        description="403 / 404 / 500 与离线场景的 Result 缺省页展示"
      />

      <Card className={styles.section} bordered={false}>
        <Segmented
          className={exceptionStyles.segmented}
          options={OPTIONS}
          value={active}
          onChange={(v) => setActive(v as ExceptionKey)}
        />
        <div className={exceptionStyles.preview}>{content}</div>
      </Card>
    </>
  );
}
