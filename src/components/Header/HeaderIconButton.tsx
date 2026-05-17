import type { ReactNode } from 'react';
import { Tooltip } from 'antd';

interface HeaderIconButtonProps {
  title: string;
  ariaLabel: string;
  onClick?: () => void;
  children: ReactNode;
}

/** 顶栏图标按钮 — 与消息铃铛统一尺寸与字重 */
export function HeaderIconButton({ title, ariaLabel, onClick, children }: HeaderIconButtonProps) {
  return (
    <Tooltip title={title}>
      <button type="button" className="admin-header-icon-btn" aria-label={ariaLabel} onClick={onClick}>
        {children}
      </button>
    </Tooltip>
  );
}
