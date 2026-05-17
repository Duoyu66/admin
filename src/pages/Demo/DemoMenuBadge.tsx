import { useMemo, useState, type ReactNode } from 'react';
import {
  App,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Menu,
  Radio,
  Row,
  Segmented,
  Typography,
} from 'antd';
import type { MenuProps } from 'antd';
import { PageHeader } from '@/components/common/PageHeader';
import styles from './demo-shared.module.less';
import badgeStyles from './DemoMenuBadge.module.less';

type BadgeMode = 'dot' | 'text' | 'color';

const COLOR_PRESETS = [
  { key: 'green', label: '绿色', value: '#52c41a' },
  { key: 'red', label: '红色', value: '#ff4d4f' },
  { key: 'blue', label: '蓝色', value: '#1677ff' },
  { key: 'lime', label: '青绿', value: '#a0d911' },
  { key: 'default', label: '默认', value: '#d9d9d9' },
] as const;

function MenuItemLabel({
  text,
  dot,
  count,
  color,
}: {
  text: string;
  dot?: boolean;
  count?: ReactNode;
  color?: string;
}) {
  return (
    <span className={badgeStyles.menuItemLabel}>
      <span className={badgeStyles.menuItemText}>{text}</span>
      {(dot || count != null) && (
        <Badge dot={dot} count={count} color={color} className={badgeStyles.menuBadge} />
      )}
    </span>
  );
}

/** 菜单徽标演示 — 点徽标 / 文本徽标 / 颜色配置 */
export function DemoMenuBadge() {
  const { message } = App.useApp();
  const [mode, setMode] = useState<BadgeMode>('text');
  const [badgeColor, setBadgeColor] = useState<string>(COLOR_PRESETS[0].value);
  const [badgeText, setBadgeText] = useState('10');
  const [selectedKey, setSelectedKey] = useState('text-badge');
  const [menuVersion, setMenuVersion] = useState(0);

  const previewItems: MenuProps['items'] = useMemo(() => {
    const dot = mode === 'dot';
    const count = mode === 'dot' ? undefined : mode === 'color' ? badgeText || 'Hot' : badgeText || '10';

    return [
      { key: 'breadcrumb', label: '面包屑导航' },
      { key: 'exception', label: '缺省页' },
      {
        key: 'badge-group',
        label: (
          <MenuItemLabel
            text="菜单徽标"
            dot={dot}
            count={dot ? undefined : count}
            color={badgeColor}
          />
        ),
        children: [
          {
            key: 'dot-badge',
            label: (
              <MenuItemLabel text="点徽标" dot={dot} count={dot ? undefined : count} color={badgeColor} />
            ),
          },
          {
            key: 'text-badge',
            label: (
              <MenuItemLabel
                text="文本徽标"
                dot={dot}
                count={dot ? undefined : count}
                color={badgeColor}
              />
            ),
          },
          {
            key: 'color-badge',
            label: (
              <MenuItemLabel
                text="徽标颜色"
                dot={dot}
                count={dot ? undefined : count}
                color={badgeColor}
              />
            ),
          },
        ],
      },
      { key: 'active-icon', label: '菜单激活图标' },
    ];
  }, [mode, badgeColor, badgeText, menuVersion]);

  const applyBadge = () => {
    setMenuVersion((v) => v + 1);
    message.success('徽标已更新');
  };

  return (
    <>
      <PageHeader
        title="菜单徽标"
        description="侧栏菜单上的点状徽标、数字/文字徽标及颜色配置（Ant Design Badge）"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={9}>
          <Card title="菜单预览" className={styles.section} bordered={false}>
            <Menu
              key={menuVersion}
              mode="inline"
              className={badgeStyles.previewMenu}
              selectedKeys={[selectedKey]}
              defaultOpenKeys={['badge-group']}
              items={previewItems}
              onClick={({ key }) => setSelectedKey(key)}
            />
          </Card>
        </Col>

        <Col xs={24} lg={15}>
          <Card title="徽标配置" className={styles.section} bordered={false}>
            <Form layout="vertical" className={badgeStyles.form}>
              <Form.Item label="类型">
                <Segmented
                  block
                  value={mode}
                  onChange={(v) => setMode(v as BadgeMode)}
                  options={[
                    { label: '点徽标', value: 'dot' },
                    { label: '文本徽标', value: 'text' },
                    { label: '徽标颜色', value: 'color' },
                  ]}
                />
              </Form.Item>

              {mode !== 'dot' && (
                <Form.Item label="徽标内容">
                  <Input
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder={mode === 'color' ? '如 Hot' : '如 10'}
                    maxLength={8}
                  />
                </Form.Item>
              )}

              <Form.Item label="颜色">
                <Radio.Group
                  className={badgeStyles.colorGroup}
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                >
                  {COLOR_PRESETS.map((preset) => (
                    <Radio key={preset.key} value={preset.value} className={badgeStyles.colorOption}>
                      <Badge
                        count={mode === 'dot' ? undefined : badgeText || '10'}
                        dot={mode === 'dot'}
                        color={preset.value}
                      />
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>

              <Typography.Paragraph type="secondary" className={badgeStyles.hint}>
                {mode === 'dot'
                  ? '点徽标用于提示未读或待处理，不展示具体数字。'
                  : '文本徽标可展示数字或短文案；徽标颜色模式适合 Hot、New 等标签。'}
              </Typography.Paragraph>

              <Button type="primary" onClick={applyBadge}>
                更新徽标
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
