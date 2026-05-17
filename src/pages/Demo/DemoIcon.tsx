import { Card, Tooltip, Typography } from 'antd';
import { MENU_ICON_OPTIONS } from '@/constants/menu-icons';
import { MenuIcon } from '@/components/MenuIcon';
import { PageHeader } from '@/components/common/PageHeader';
import styles from './demo-shared.module.less';
import iconStyles from './DemoIcon.module.less';

/** 图标演示 — 侧栏使用的 Lucide 图标集 */
export function DemoIcon() {
  return (
    <>
      <PageHeader title="图标" description="菜单配置可选的 Lucide 图标（与侧栏一致）" />

      <Card className={styles.section} bordered={false}>
        <div className={iconStyles.grid}>
          {MENU_ICON_OPTIONS.map((opt) => (
            <Tooltip key={opt.value} title={opt.value}>
              <div className={iconStyles.item}>
                <MenuIcon name={opt.value} size={22} />
                <Typography.Text type="secondary" className={iconStyles.label}>
                  {opt.label}
                </Typography.Text>
              </div>
            </Tooltip>
          ))}
        </div>
      </Card>
    </>
  );
}
