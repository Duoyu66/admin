import { Route, Navigate } from 'react-router-dom';
import { APP_ROUTES } from '@/router/appRoutes';

/** 后台子路由节点（须作为 Fragment 直接挂在 <Route> 下，不能包一层组件） */
export const appChildRoutes = (
  <>
    {APP_ROUTES.map(({ path, Component }) =>
      path === '' ? (
        <Route key="index" index element={<Component />} />
      ) : (
        <Route key={path} path={path} element={<Component />} />
      ),
    )}
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);
