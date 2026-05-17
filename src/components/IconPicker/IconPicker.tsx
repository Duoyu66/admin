import { useMemo, useState } from 'react';
import { Button, Empty, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MenuIcon } from '@/components/MenuIcon';
import { MENU_ICON_OPTIONS, type MenuIconKey } from '@/constants/menu-icons';

export interface IconPickerProps {
  value?: string | null;
  onChange: (icon: MenuIconKey) => void;
}

/** Lucide 图标选择器 */
export function IconPicker({ value, onChange }: IconPickerProps) {
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return MENU_ICON_OPTIONS;
    return MENU_ICON_OPTIONS.filter(
      (opt) => opt.label.includes(q) || opt.value.includes(q)
    );
  }, [keyword]);

  return (
    <div>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="搜索图标名称…"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      {filtered.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无匹配图标" />
      ) : (
        <div className="icon-picker-grid" role="listbox" aria-label="选择图标">
          {filtered.map((opt) => {
            const selected = value === opt.value;
            return (
              <Button
                key={opt.value}
                type={selected ? 'primary' : 'default'}
                className="icon-picker-item"
                title={opt.label}
                onClick={() => onChange(opt.value)}
              >
                <MenuIcon name={opt.value} size={20} />
                <span style={{ fontSize: 11 }}>{opt.label}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
