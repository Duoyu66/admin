import { Card as AntCard } from 'antd';
import type { CardProps } from 'antd';

export function Card(props: CardProps) {
  return <AntCard bordered={false} style={{ borderRadius: 12, ...props.style }} {...props} />;
}
