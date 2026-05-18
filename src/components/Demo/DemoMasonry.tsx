import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './DemoMasonry.module.less';

interface DemoMasonryProps {
  children: ReactNode;
  className?: string;
}

interface DemoMasonryItemProps {
  children: ReactNode;
  className?: string;
}

/** 实例演示 — CSS 多列瀑布流布局 */
export function DemoMasonry({ children, className }: DemoMasonryProps) {
  return <div className={cn(styles.masonry, className)}>{children}</div>;
}

/** 瀑布流单项，高度随内容自适应 */
export function DemoMasonryItem({ children, className }: DemoMasonryItemProps) {
  return <div className={cn(styles.item, className)}>{children}</div>;
}
