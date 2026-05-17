import { Alert as AntAlert } from 'antd';
import type { AlertProps } from 'antd';

export function Alert(props: AlertProps) {
  return <AntAlert showIcon {...props} />;
}
