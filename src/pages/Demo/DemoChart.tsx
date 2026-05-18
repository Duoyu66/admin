import { Card } from 'antd';
import { Column, Line, Pie } from '@ant-design/plots';
import { PageHeader } from '@/components/common/PageHeader';
import { DemoMasonry, DemoMasonryItem } from '@/components/Demo/DemoMasonry';
import { appColors } from '@/config/theme';
import styles from './demo-shared.module.less';

const lineData = [
  { month: '1月', value: 32 },
  { month: '2月', value: 45 },
  { month: '3月', value: 38 },
  { month: '4月', value: 52 },
  { month: '5月', value: 48 },
  { month: '6月', value: 61 },
];

const pieData = [
  { type: '研发', value: 40 },
  { type: '运营', value: 25 },
  { type: '产品', value: 20 },
  { type: '其他', value: 15 },
];

const columnData = [
  { dept: '研发', count: 42 },
  { dept: '运营', count: 28 },
  { dept: '产品', count: 19 },
  { dept: '市场', count: 15 },
];

const axis = {
  labelFill: appColors.textSecondary,
  lineStroke: appColors.border,
};

/** 报表 / 图表演示 */
export function DemoChart() {
  return (
    <>
      <PageHeader title="报表" description="@ant-design/plots 折线、饼图、柱状图" />

      <DemoMasonry>
        <DemoMasonryItem>
          <Card title="折线图" className={styles.section} bordered={false}>
            <Line
              data={lineData}
              xField="month"
              yField="value"
              height={280}
              smooth
              color={appColors.primary}
              axis={{ y: { title: false, ...axis }, x: { title: false, ...axis } }}
            />
          </Card>
        </DemoMasonryItem>

        <DemoMasonryItem>
          <Card title="饼图" className={styles.section} bordered={false}>
            <Pie
              data={pieData}
              angleField="value"
              colorField="type"
              height={280}
              innerRadius={0.6}
              legend={{ position: 'bottom' }}
              color={[appColors.primary, appColors.info, appColors.warning, appColors.success]}
            />
          </Card>
        </DemoMasonryItem>

        <DemoMasonryItem>
          <Card title="柱状图" className={styles.section} bordered={false}>
            <Column
              data={columnData}
              xField="dept"
              yField="count"
              height={280}
              color={appColors.primary}
              label={{ position: 'top' }}
              axis={{ y: { title: false, ...axis }, x: { title: false, ...axis } }}
            />
          </Card>
        </DemoMasonryItem>
      </DemoMasonry>
    </>
  );
}
