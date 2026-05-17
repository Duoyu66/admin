import { Checkbox, Empty, Typography } from 'antd';
import type { SysRole } from '@/api/types';

export interface RoleCheckboxGroupProps {
  roles: SysRole[];
  value: number[];
  onChange: (roleIds: number[]) => void;
  disabled?: boolean;
}

/** 多选角色 — Ant Design Checkbox.Group */
export function RoleCheckboxGroup({ roles, value, onChange, disabled }: RoleCheckboxGroupProps) {
  if (roles.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可用角色" />;
  }

  return (
    <Checkbox.Group
      className="role-checkbox-group"
      disabled={disabled}
      value={value}
      onChange={(checked) => onChange(checked as number[])}
      options={roles.map((role) => ({
        value: role.id,
        label: (
          <span className="role-option-label">
            <Typography.Text>{role.roleName}</Typography.Text>
            <span className="role-option-code">{role.roleCode}</span>
          </span>
        ),
      }))}
    />
  );
}
