import { Outlet, useLocation } from 'react-router-dom';
import styles from './PageTransition.module.less';

/** 子路由切换时的淡入上滑过渡 */
export function PageTransition() {
  const location = useLocation();

  return (
    <div className={styles.wrap}>
      <div key={location.pathname} className={styles.page}>
        <Outlet />
      </div>
    </div>
  );
}
