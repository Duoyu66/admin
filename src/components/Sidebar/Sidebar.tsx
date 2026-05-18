import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { useLayoutStore } from '@/stores/layoutStore';
import { buildAntdMenuItems, getOpenMenuKeys } from '@/utils/antd-menu';
import logoImg from '@/img/logo-mg.png';
import styles from './Sidebar.module.less';

const { Sider } = Layout;

const SIDER_WIDTH = 240;
const SIDER_COLLAPSED_WIDTH = 72;

/** 动态侧边栏 — Ant Design Menu */
export function Sidebar() {
  const { menus } = useAuth();
  const collapsed = useLayoutStore((s) => s.collapsed);
  const sidebarOpen = useLayoutStore((s) => s.sidebarOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const items = useMemo(() => buildAntdMenuItems(menus), [menus]);
  const [openKeys, setOpenKeys] = useState<string[]>(() =>
    getOpenMenuKeys(location.pathname, menus)
  );

  useEffect(() => {
    setOpenKeys(getOpenMenuKeys(location.pathname, menus));
  }, [location.pathname, menus]);

  const selectedKey =
    location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '') || '/';

  return (
    <Sider
      className={`admin-sider ${styles.sider} ${sidebarOpen ? styles.siderOpen : ''}`}
      width={SIDER_WIDTH}
      collapsedWidth={SIDER_COLLAPSED_WIDTH}
      collapsed={collapsed}
      collapsible
      trigger={null}
    >
      <div className={`admin-sider-brand ${styles.brand}`}>
        <div className={styles.logoWrap}>
          <img
            src={logoImg}
            alt="木瓜后台"
            className={styles.logo}
            width={36}
            height={36}
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="admin-sider-brand-text">
          <div className="admin-sider-title">木瓜后台</div>
        </div>
      </div>

      <Menu
        className="admin-menu"
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        selectedKeys={[selectedKey]}
        {...(collapsed
          ? {}
          : {
              openKeys,
              onOpenChange: (keys) => setOpenKeys(keys as string[]),
            })}
        onClick={({ key }) => {
          if (key.startsWith('group-')) return;
          navigate(key);
        }}
      />
    </Sider>
  );
}
