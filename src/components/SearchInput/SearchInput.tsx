import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import styles from './SearchInput.module.less';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  wide?: boolean;
}

/** 搜索框 */
export function SearchInput({ wide, className = '', placeholder = '搜索...', ...rest }: SearchInputProps) {
  return (
    <div className={`${styles.wrap} ${wide ? styles.wide : ''} ${className}`}>
      <span className={styles.icon} aria-hidden>
        <Search size={16} strokeWidth={2} />
      </span>
      <input type="search" className={styles.field} placeholder={placeholder} {...rest} />
    </div>
  );
}
