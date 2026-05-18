import { Card, Space } from 'antd';
import { PageHeader } from '@/components/common/PageHeader';

export interface PageShellProps {
  title: string;
  description?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

export function PageShell({ title, description, toolbar, children }: PageShellProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      {toolbar && (
        <div className="page-toolbar">
          <Space wrap>{toolbar}</Space>
        </div>
      )}
      <Card variant="borderless" style={{ borderRadius: 12 }}>
        {children}
      </Card>
    </>
  );
}
