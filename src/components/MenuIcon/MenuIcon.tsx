import { getMenuIcon } from '@/constants/menu-icons';
import styles from './MenuIcon.module.less';

export interface MenuIconProps {
  /** Lucide 图标名（kebab-case），兼容旧版 dashboard / users 等别名 */
  name?: string | null;
  className?: string;
  size?: number;
}

/** 菜单图标 — Lucide */
export function MenuIcon({ name, className = '', size = 18 }: MenuIconProps) {
  const Icon = getMenuIcon(name);

  return (
    <span className={`${styles.icon} ${className}`} aria-hidden>
      <Icon size={size} strokeWidth={1.75} />
    </span>
  );
}
