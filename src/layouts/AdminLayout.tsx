import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { PageTransition } from '@/components/PageTransition';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { LockScreen } from '@/components/Header/LockScreen';
import { NoticeWebSocketBridge } from '@/components/NoticeWebSocketBridge/NoticeWebSocketBridge';
import { resolveRouteMeta } from '@/router/appRoutes';
import { useLayoutStore } from '@/stores/layoutStore';
import type { BreadcrumbItem } from '@/types';
import styles from './AdminLayout.module.less';

const { Content } = Layout;

function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: '首页', path: '/' }]; 
  const { group, title, parent } = resolveRouteMeta(pathname);

  if (group && pathname !== '/') {
    items.push({ label: group });
  }
  if (parent) {
    items.push(parent);
  }
  if (title && pathname !== '/') {
    items.push({ label: title });
  }
  return items;
}

/** 后台主布局 */
export function AdminLayout() {
  const location = useLocation();
  const sidebarOpen = useLayoutStore((s) => s.sidebarOpen);
  const setSidebarOpen = useLayoutStore((s) => s.setSidebarOpen);
  const breadcrumbs = useMemo(() => buildBreadcrumbs(location.pathname), [location.pathname]);

  return (
    <Layout className={styles.layout}>
      <LockScreen />
      <NoticeWebSocketBridge />
      <Sidebar />
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} aria-hidden />
      )}
      <Layout className={styles.main}>
        <Header breadcrumbs={breadcrumbs} />
        <Content className="admin-content">
          <PageTransition />
        </Content>
      </Layout>
    </Layout>
  );
}
