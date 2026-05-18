import { Spin } from 'antd';

export function Spinner({ description = '加载中...' }: { description?: string }) {
  return <Spin description={description} />;
}
