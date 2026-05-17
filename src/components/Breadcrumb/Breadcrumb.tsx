import { Link } from 'react-router-dom';
import type { BreadcrumbItem } from '@/types';
import styles from './Breadcrumb.module.less';

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/** 面包屑导航 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="面包屑">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className={styles.item}>
            {index > 0 && <span className={styles.sep}>/</span>}
            {!isLast && item.path ? (
              <Link to={item.path} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
