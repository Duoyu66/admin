import { Spin } from 'antd';

export function Spinner({ tip = '加载中...' }: { tip?: string }) {
  return <Spin tip={tip} />;
}
