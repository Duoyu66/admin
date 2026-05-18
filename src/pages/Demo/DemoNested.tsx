import { useState } from 'react';
import { Card, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { PageHeader } from '@/components/common/PageHeader';
import styles from './demo-shared.module.less';
import nestedStyles from './DemoNested.module.less';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'level1',
    label: '一级菜单',
    children: [
      {
        key: 'level2-a',
        label: '二级菜单 A',
        children: [
          {
            key: 'level3-a1',
            label: '三级菜单 A-1',
            children: [
              { key: 'level4-a1-1', label: '四级菜单 A-1-1' },
              { key: 'level4-a1-2', label: '四级菜单 A-1-2' },
            ],
          },
          { key: 'level3-a2', label: '三级菜单 A-2' },
        ],
      },
      {
        key: 'level2-b',
        label: '二级菜单 B',
        children: [{ key: 'level3-b1', label: '三级菜单 B-1' }],
      },
    ],
  },
  {
    key: 'other',
    label: '其他',
    children: [{ key: 'other-1', label: '子项' }],
  },
];

/** 四层菜单演示 */
export function DemoNested() {
  const [openKeys, setOpenKeys] = useState<string[]>(['level1', 'level2-a', 'level3-a1']);
  const [selected, setSelected] = useState('level4-a1-1');

  return (
    <>
      <PageHeader title="四层菜单" description="Ant Design Menu 多级展开（inline 模式）" />

      <Card className={styles.section} variant="borderless">
        <div className={nestedStyles.wrap}>
          <Menu
            className={nestedStyles.menu}
            mode="inline"
            items={items}
            openKeys={openKeys}
            selectedKeys={[selected]}
            onOpenChange={(keys) => setOpenKeys(keys as string[])}
            onClick={({ key }) => setSelected(key)}
            style={{ width: 280 }}
          />
          <div className={nestedStyles.content}>
            <p className={nestedStyles.tip}>当前选中：</p>
            <code className={nestedStyles.code}>{selected}</code>
            <p className={nestedStyles.desc}>
              后台侧栏菜单由权限树动态生成，最多支持目录 + 菜单两级；业务上更深层级可在此用 Menu
              组件演示交互效果。
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
