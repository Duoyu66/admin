import { Typography } from 'antd';

export interface PageHeaderProps {
  title: string;
  description?: string;
}

/** 页面标题区 */
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="page-header-block">
      <Typography.Title level={3} style={{ margin: 0, fontWeight: 600 }}>
        {title}
      </Typography.Title>
      {description && (
        <Typography.Text type="secondary" style={{ display: 'block' }}>
          {description}
        </Typography.Text>
      )}
    </div>
  );
}
