import page from '@/styles/page.module.less';

export interface PlaceholderPageProps {
  title: string;
  description: string;
}

/** 占位页面 */
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <>
      <header className={page.pageHeader}>
        <h1 className={page.pageTitle}>{title}</h1>
        <p className={page.pageDesc}>{description}</p>
      </header>
      <section className={page.sectionCard}>
        <div className={page.sectionCardBody}>
          <p style={{ color: 'var(--text-secondary)' }}>该模块正在建设中，敬请期待。</p>
        </div>
      </section>
    </>
  );
}
