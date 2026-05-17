import { useNavigate } from 'react-router-dom';
import { Avatar, Breadcrumb, Button, Dropdown, Layout, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { useLayoutStore } from '@/stores/layoutStore';
import { HeaderToolbar } from '@/components/Header/HeaderToolbar';
import { NoticeBell } from '@/components/Header/NoticeBell';
import type { BreadcrumbItem } from '@/types';

const { Header: AntHeader } = Layout;

export interface HeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

/** 后台顶栏 */
export function Header({ breadcrumbs }: HeaderProps) {
  const { user, logout } = useAuth();
  const collapsed = useLayoutStore((s) => s.collapsed);
  const toggleCollapsed = useLayoutStore((s) => s.toggleCollapsed);
  const toggleSidebarOpen = useLayoutStore((s) => s.toggleSidebarOpen);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="admin-header">
      <Button
        type="text"
        className="admin-header-collapse-btn"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        aria-label={collapsed ? '展开侧栏' : '折叠侧栏'}
      />

      <button
        type="button"
        className="admin-header-menu-btn"
        onClick={toggleSidebarOpen}
        aria-label="打开菜单"
      >
        <MenuOutlined />
      </button>

      <Breadcrumb
        className="admin-header-breadcrumb"
        items={breadcrumbs.map((item, i) => ({
          title:
            item.path && i < breadcrumbs.length - 1 ? (
              <a
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path!);
                }}
              >
                {item.label}
              </a>
            ) : (
              item.label
            ),
        }))}
      />

      <div className="admin-header-actions">
        <HeaderToolbar />
        <NoticeBell />
      </div>

      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
        <button type="button" className="admin-header-user">
          <Avatar size={32} style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-inverse)', flexShrink: 0 }}>
            {user?.avatar ?? user?.nickname?.charAt(0) ?? 'A'}
          </Avatar>
          <div style={{ textAlign: 'left', minWidth: 0 }}>
            <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 120 }}>
              {user?.nickname}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis>
              {user?.roleName}
            </Typography.Text>
          </div>
        </button>
      </Dropdown>
    </AntHeader>
  );
}
