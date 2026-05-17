import { Form } from 'antd';
import type { ReactNode } from 'react';

export function FormStack({ children, ...props }: { children?: ReactNode; className?: string }) {
  return (
    <Form layout="vertical" requiredMark="optional" {...props}>
      {children}
    </Form>
  );
}
