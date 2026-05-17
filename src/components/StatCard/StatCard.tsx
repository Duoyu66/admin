import { MenuIcon } from '@/components/MenuIcon';
import type { StatCardData } from '@/types';
import styles from './StatCard.module.less';

export interface StatCardProps {
  data: StatCardData;
}

const trendMap = {
  up: styles.up,
  down: styles.down,
  neutral: styles.neutral,
};

/** 数据统计卡片 */
export function StatCard({ data }: StatCardProps) {
  const trendClass = data.trend ? trendMap[data.trend] : styles.neutral;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{data.title}</span>
        <span className={styles.iconWrap}>
          <MenuIcon name={data.icon} />
        </span>
      </div>
      <div className={styles.value}>{data.value}</div>
      {data.change && <p className={`${styles.change} ${trendClass}`}>{data.change}</p>}
    </article>
  );
}
