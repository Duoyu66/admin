import { useMemo } from 'react';
import type { PaginationState } from '@/types';
import styles from './Pagination.module.less';

export interface PaginationProps {
  pagination: PaginationState;
  onChange: (page: number) => void;
}

function buildPageNumbers(current: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < totalPages - 2) pages.push('ellipsis');
  pages.push(totalPages);
  return pages;
}

/** 分页组件 */
export function Pagination({ pagination, onChange }: PaginationProps) {
  const { current, pageSize, total } = pagination;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);
  const pageNumbers = useMemo(() => buildPageNumbers(current, totalPages), [current, totalPages]);

  return (
    <nav className={styles.pagination} aria-label="分页导航">
      <span className={styles.info}>
        显示 {start}–{end}，共 {total} 条
      </span>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          disabled={current <= 1}
          onClick={() => onChange(current - 1)}
          aria-label="上一页"
        >
          ‹
        </button>
        {pageNumbers.map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`${styles.btn} ${page === current ? styles.active : ''}`}
              onClick={() => onChange(page)}
              aria-current={page === current ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
        <button
          type="button"
          className={styles.btn}
          disabled={current >= totalPages}
          onClick={() => onChange(current + 1)}
          aria-label="下一页"
        >
          ›
        </button>
      </div>
    </nav>
  );
}
